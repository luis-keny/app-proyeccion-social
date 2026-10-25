"use client";
import Link from "next/link";
import { ChevronsUpDownIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import type { NavigationItem } from "./nav-main";

export type NavigationUser = { name: string; detail: string; initials: string; avatar?: string };
function UserIdentity({ user }: { user: NavigationUser }) {
  return <>
    <Avatar>{user.avatar && <AvatarImage src={user.avatar} alt={user.name} />}<AvatarFallback>{user.initials}</AvatarFallback>
    </Avatar>
    <div className="grid flex-1 text-left text-sm leading-tight">
      <span className="truncate font-medium">{user.name}</span>
      <span className="truncate text-xs">{user.detail}</span>
    </div>
  </>;
}
export function NavUser({ user, links = [] }: { user: NavigationUser; links?: NavigationItem[] }) {
  const { isMobile, setOpenMobile } = useSidebar();
  return <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger render={<SidebarMenuButton size="lg" className="aria-expanded:bg-muted" />} aria-label={`Abrir menú de ${user.name}`}>
          <UserIdentity user={user} />
          <ChevronsUpDownIcon className="ml-auto size-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-56 rounded-lg" side={isMobile ? "top" : "right"} align="end" sideOffset={4}>
          <DropdownMenuGroup>
            <DropdownMenuLabel>Mi espacio · {user.detail}</DropdownMenuLabel>
          </DropdownMenuGroup>
          {links.length > 0 && <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>{links.map((link) => <DropdownMenuItem key={link.url} render={<Link href={link.url} />} onClick={() => setOpenMobile(false)}>{link.icon}{link.title}</DropdownMenuItem>)}</DropdownMenuGroup>
          </>}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>;
}
