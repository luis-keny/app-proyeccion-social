"use client";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronRightIcon } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuAction, SidebarMenuButton, SidebarMenuItem, SidebarMenuSub, SidebarMenuSubButton, SidebarMenuSubItem, useSidebar } from "@/components/ui/sidebar";

export type NavigationItem = { title: string; url: string; icon: ReactNode; isActive?: boolean; items?: { title: string; url: string; isActive?: boolean }[] };
export function NavMain({ items, label = "Plataforma" }: { items: NavigationItem[]; label?: string }) {
  const { setOpenMobile } = useSidebar();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});
  return <SidebarGroup>
    <SidebarGroupLabel>{label}</SidebarGroupLabel>
    <SidebarMenu>
      {items.map((item) => <Collapsible key={item.url} open={openGroups[item.url] ?? Boolean(item.isActive)} onOpenChange={(open) => setOpenGroups((current) => ({ ...current, [item.url]: open }))} render={<SidebarMenuItem />}>
        <SidebarMenuButton tooltip={item.title} isActive={item.isActive} render={<Link href={item.url} aria-current={item.isActive ? "page" : undefined} />} onClick={() => setOpenMobile(false)}>{item.icon}<span>{item.title}</span>
        </SidebarMenuButton>
        {item.items?.length ? <>
          <CollapsibleTrigger render={<SidebarMenuAction className="aria-expanded:rotate-90" />}>
            <ChevronRightIcon />
            <span className="sr-only">Alternar {item.title}</span>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((subItem) => <SidebarMenuSubItem key={subItem.url}>
                <SidebarMenuSubButton isActive={subItem.isActive} render={<Link href={subItem.url} aria-current={subItem.isActive ? "page" : undefined} />} onClick={() => setOpenMobile(false)}>
                  <span>{subItem.title}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>)}
            </SidebarMenuSub>
          </CollapsibleContent>
        </> : null}
      </Collapsible>)}
    </SidebarMenu>
  </SidebarGroup>;
}
