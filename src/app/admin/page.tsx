import { redirect } from "next/navigation";

import { AdminWorkbench } from "~/components/admin-workbench";
import { auth } from "~/server/auth";
import { getAdminSnapshot, isAdminUser } from "~/server/services/admin";

const errorCopy: Record<string, string> = {
  "beer-delete": "Beer deletion failed because the submitted beer was invalid.",
  "beer-featured": "Beer spotlight update failed. Refresh and try again.",
  "beer-invalid":
    "Beer creation needs a valid brewery, style, ABV, and description.",
  "brewery-delete":
    "Brewery deletion failed because the submitted brewery was invalid.",
  "brewery-invalid":
    "Brewery creation needs complete location, description, and tag details.",
  "brewery-missing": "Choose an existing brewery before creating a beer.",
  "last-admin": "The final admin account cannot be deleted or demoted.",
  "review-delete":
    "Review deletion failed because the submitted review was invalid.",
  "review-invalid": "Review moderation request was incomplete.",
  "route-delete":
    "Route deletion failed because the submitted route was invalid.",
  "route-invalid":
    "Route creation needs valid route details and at least two brewery slugs.",
  "route-stops":
    "One or more route stop slugs do not match existing breweries.",
  "self-demote": "The current admin session cannot demote itself.",
  "user-delete":
    "User deletion failed because the submitted member was invalid.",
  "user-role":
    "Role update failed because the submitted member or role value was invalid.",
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await auth();

  if (!isAdminUser(session?.user)) {
    redirect("/club?error=admin-only");
  }

  const snapshot = await getAdminSnapshot();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const errorCode = resolvedSearchParams?.error;
  const errorMessage =
    typeof errorCode === "string" ? errorCopy[errorCode] : undefined;

  return (
    <main className="px-6 pt-6 pb-20 md:pt-10 md:pb-24">
      <AdminWorkbench errorMessage={errorMessage} snapshot={snapshot} />
    </main>
  );
}
