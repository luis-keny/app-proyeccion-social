import { ButtonLink } from "@/components/ui/button-link";
export default function WorkspaceNotFound() {
  return <div className="flex flex-col items-start gap-4 rounded-xl border p-6">
    <p>La dirección no existe o esta vista no está disponible para el rol seleccionado.</p>
    <ButtonLink href="/workspace">Ir al inicio</ButtonLink>
  </div>;
}
