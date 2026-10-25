"use client";
import type { ComponentProps } from "react";
import Link from "next/link";
import { HeartHandshake } from "lucide-react";
import { NavMain, type NavigationItem } from "@/components/nav-main";
import { NavUser, type NavigationUser } from "@/components/nav-user";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";

type AppSidebarProps = ComponentProps<typeof Sidebar> & {
  brand: { name: string; description: string; href: string };
  items: NavigationItem[];
  user: NavigationUser;
  userLinks?: NavigationItem[];
};
export function AppSidebar({ brand, items, user, userLinks = [], ...props }: AppSidebarProps) {
  const { setOpenMobile } = useSidebar();
  return <Sidebar variant="inset" collapsible="icon" {...props}>
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg" render={<Link href={brand.href} />} onClick={() => setOpenMobile(false)}>
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
              <HeartHandshake />
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{brand.name}</span>
              <span className="truncate text-xs">{brand.description}</span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
    <SidebarContent>
      <NavMain label="Plataforma" items={items} />
    </SidebarContent>
    <SidebarFooter>
      <NavUser user={user} links={userLinks} />
    </SidebarFooter>
  </Sidebar>;
}
