"use client";

import { useEffect, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";

export function ReportDrawer({ title, onClose, children }: {
  title: string; onClose: () => void; children: (close: () => void) => ReactNode;
}) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setOpen(true));
    return () => cancelAnimationFrame(frame);
  }, []);
  return <Drawer open={open} onOpenChange={setOpen} swipeDirection="right" onOpenChangeComplete={(next) => { if (!next) onClose(); }}>
    <DrawerContent className="data-[swipe-axis=x]:[--drawer-content-width:100%] data-[swipe-axis=x]:sm:[--drawer-content-width:36rem]">
      <DrawerHeader>
        <div className="flex items-center justify-between gap-2">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerClose render={<Button variant="ghost" size="icon" aria-label="Cerrar panel" />}><X /></DrawerClose>
        </div>
        <DrawerDescription>Datos de ejemplo · Cambios en memoria hasta recargar.</DrawerDescription>
      </DrawerHeader>
      {children(() => setOpen(false))}
    </DrawerContent>
  </Drawer>;
}
