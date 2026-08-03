"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  Supplier,
  CreateSupplierDto,
  createSupplier,
  updateSupplier,
} from "@/lib/services/supplier.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SupplierFormProps {
  supplier?: Supplier | null;
  onSuccess: () => void;
}

export function SupplierForm({ supplier, onSuccess }: SupplierFormProps) {
  const { register, handleSubmit, reset } = useForm<CreateSupplierDto>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cnpj: "",
    },
  });

  useEffect(() => {
    reset({
      name: supplier?.name ?? "",
      email: supplier?.email ?? "",
      phone: supplier?.phone ?? "",
      cnpj: supplier?.cnpj ?? "",
    });
  }, [supplier, reset]);

  async function onSubmit(data: CreateSupplierDto) {
    try {
      if (supplier) {
        await updateSupplier(supplier.id, data);
      } else {
        await createSupplier(data);
      }

      reset({
        name: "",
        email: "",
        phone: "",
        cnpj: "",
      });

      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar fornecedor.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 rounded-lg border p-6 md:grid-cols-2"
    >
      <Input placeholder="Nome" {...register("name", { required: true })} />

      <Input type="email" placeholder="E-mail" {...register("email")} />

      <Input placeholder="Telefone" {...register("phone")} />

      <Input placeholder="CNPJ" {...register("cnpj")} />

      <Button type="submit" className="md:col-span-2">
        {supplier ? "Atualizar Fornecedor" : "Salvar Fornecedor"}
      </Button>
    </form>
  );
}
