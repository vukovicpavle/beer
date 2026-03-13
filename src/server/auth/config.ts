import { PrismaAdapter } from "@auth/prisma-adapter";
import { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";

import { verifyPassword } from "~/server/auth/password";
import { db } from "~/server/db";
import { isAdminEmail } from "~/server/services/admin";

const memberCredentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(72),
});

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      city?: string | null;
      id: string;
      role: "ADMIN" | "MEMBER";
    } & DefaultSession["user"];
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authConfig = {
  providers: [
    Credentials({
      id: "member-credentials",
      name: "Email and password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const parsed = memberCredentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user?.passwordHash) {
          return null;
        }

        if (!verifyPassword(parsed.data.password, user.passwordHash)) {
          return null;
        }

        if (user.role !== "ADMIN" && isAdminEmail(user.email)) {
          return db.user.update({
            where: { id: user.id },
            data: { role: "ADMIN" },
          });
        }

        return user;
      },
    }),
  ],
  adapter: PrismaAdapter(db),
  callbacks: {
    signIn: async ({ user }) => {
      const member = user as typeof user & { role?: "ADMIN" | "MEMBER" };

      if (user.email && isAdminEmail(user.email) && member.role !== "ADMIN") {
        await db.user.update({
          where: { id: user.id },
          data: { role: "ADMIN" },
        });

        member.role = "ADMIN";
      }

      return true;
    },
    session: ({ session, user }) => {
      const member = user as typeof user & {
        city?: string | null;
        role?: "ADMIN" | "MEMBER";
      };

      return {
        ...session,
        user: {
          city: member.city ?? null,
          ...session.user,
          id: user.id,
          role: member.role ?? "MEMBER",
        },
      };
    },
  },
} satisfies NextAuthConfig;
