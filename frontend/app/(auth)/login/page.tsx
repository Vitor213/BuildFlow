"use client";

import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { login } from "@/lib/services/auth.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "Senha inválida"),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/dashboard");
    }
  }, [router]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  async function handleLogin(data: FormData) {
    try {
      setLoading(true);

      const response = await login(data);

      localStorage.setItem("token", response.access_token);

      toast.success("Login realizado com sucesso!");

      router.replace("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error("E-mail ou senha inválidos.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader>
          <CardTitle className="text-center text-3xl">BuildFlow</CardTitle>

          <p className="text-center text-muted-foreground">
            Faça login para continuar
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(handleLogin)} className="space-y-5">
            <div>
              <Input placeholder="E-mail" {...register("email")} />

              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="password"
                placeholder="Senha"
                {...register("password")}
              />

              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button className="w-full" disabled={loading} type="submit">
              {loading ? "Entrando..." : "Entrar"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              disabled={loading}
              onClick={() =>
                handleLogin({
                  email: "ronaldo@gmail.com",
                  password: "123456",
                })
              }
            >
              Entrar como Demonstração
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
