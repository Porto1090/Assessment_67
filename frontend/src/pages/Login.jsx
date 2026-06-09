import Button from "@/components/Button";

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col p-6">
      <h1 className="text-3xl font-bold">Página de Login</h1>
      <Button className="w-full mt-4">
        Iniciar sesión
      </Button>
      <Button className="w-full mt-4">
        Crear nuevo usuario
      </Button>
    </div>
  );
}
