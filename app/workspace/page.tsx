import { redirect } from "next/navigation";
import { getInitialPath } from "@/modules/portal/navigation";
export default function Page() { redirect(getInitialPath("estudiante")); }
