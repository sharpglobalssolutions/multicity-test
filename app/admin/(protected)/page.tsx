import { redirect } from "next/navigation";

/** Bare `/admin` isn't a page in its own right — it just sends signed-in
 * visitors on to the real landing spot, `/admin/dashboard`. */
export default function AdminIndexPage() {
  redirect("/admin/dashboard");
}
