import { ButtonLink } from "@/components/ui/button-link";
export default function NotFound() {
  return <div className="flex min-h-svh flex-col items-center justify-center gap-4 p-6 text-center">
    <h1 className="text-2xl font-semibold">Página no disponible</h1>
    <p className="text-muted-foreground">La dirección no existe o la vista no está disponible para este rol.</p>
    <ButtonLink href="/workspace">Ir a la plataforma</ButtonLink>
  </div>;
}
