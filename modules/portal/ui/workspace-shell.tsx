"use client";
import type { ReactNode } from "react";
import Link from "next/link";
import { useParams, usePathname, useRouter } from "next/navigation";
import { HeartHandshake, Info } from "lucide-react";
import { AppSidebar } from "@/components/app-sidebar";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { LabeledSelect } from "@/components/ui/labeled-select";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ROLE_LABELS, getInitialPath, getViewPath, isRoleSlug, navigation, type RoleSlug } from "../navigation";

const roleOptions = (Object.keys(ROLE_LABELS) as RoleSlug[]).map((value) => ({ value, label: ROLE_LABELS[value] }));
export function WorkspaceShell({ children }: { children: ReactNode }) {
  const params = useParams<{ role?: string }>();
  const pathname = usePathname();
  const router = useRouter();
  const role = params.role && isRoleSlug(params.role) ? params.role : "estudiante";
  const activityPath = getViewPath(role, "activities");
  const activityDetail = pathname.startsWith(`${activityPath}/`) && pathname.slice(activityPath.length + 1).split("/").length === 1;
  const currentView = navigation.find((item) => (getViewPath(role, item.id) === pathname || (activityDetail && item.id === "activities")) && item.roles.includes(role));
  const items = navigation.filter((item) => item.roles.includes(role)).map((item) => ({ title: item.label, url: getViewPath(role, item.id), icon: <item.icon />, isActive: currentView?.id === item.id }));
  const user = { name: role === "administrador" ? "Coordinación PS" : "Daniela Rojas", detail: ROLE_LABELS[role], initials: role === "administrador" ? "AD" : "DR" };
  return <SidebarProvider>
    <AppSidebar brand={{ name: "Proyección Social", description: "Universidad Peruana Unión", href: getInitialPath(role) }} items={items} user={user} userLinks={items.filter((item) => item.url === getInitialPath(role) || item.url === getViewPath(role, "activities"))} />
    <SidebarInset className="min-w-0">
      <header className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-3 border-b px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden sm:block">
                <BreadcrumbLink render={<Link href={getInitialPath(role)} />}>{ROLE_LABELS[role]}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden sm:block" />
              <BreadcrumbItem>
                {activityDetail ? <BreadcrumbLink render={<Link href={activityPath} />}>Actividades</BreadcrumbLink> : <BreadcrumbPage>{currentView?.label ?? "Página no disponible"}</BreadcrumbPage>}
              </BreadcrumbItem>
              {activityDetail && <><BreadcrumbSeparator /><BreadcrumbItem><BreadcrumbPage>Detalle</BreadcrumbPage></BreadcrumbItem></>}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden text-xs text-muted-foreground sm:inline">Revisar como</span>
          <LabeledSelect label="Rol para revisión visual" value={role} options={roleOptions} onValueChange={(nextRole) => router.push(getInitialPath(nextRole))} />
        </div>
      </header>
      <div className="flex items-start gap-2 border-b bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
        <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        <p>Etapa visual · Datos de ejemplo sin persistencia. El selector de rol permite revisar las vistas.</p>
      </div>
      <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{activityDetail ? "Detalle de actividad" : currentView?.title ?? "Página no disponible"}</h1>{currentView && <p className="text-sm text-muted-foreground">{activityDetail ? "Revisa la programación, el punto de encuentro y las condiciones de horas." : currentView.description}</p>}</div>
          <Badge variant="secondary">{ROLE_LABELS[role]}</Badge>
        </div>
        <div className="min-w-0 flex-1">{children}</div>
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t pt-4 text-xs text-muted-foreground">
          <span>Universidad Peruana Unión · Proyección Social</span>
          <span className="flex items-center gap-2">Servir también es aprender <HeartHandshake className="size-4" aria-hidden="true" />
          </span>
        </footer>
      </div>
    </SidebarInset>
  </SidebarProvider>;
}
