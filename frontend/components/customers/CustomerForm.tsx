"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  Customer,
  CreateCustomerDto,
  createCustomer,
  updateCustomer,
} from "@/lib/services/customer.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CustomerFormProps {
  customer?: Customer | null;
  onSuccess: () => void;
}

export function CustomerForm({ customer, onSuccess }: CustomerFormProps) {
  const { register, handleSubmit, reset } = useForm<CreateCustomerDto>({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    reset({
      name: customer?.name ?? "",
      email: customer?.email ?? "",
      phone: customer?.phone ?? "",
    });
  }, [customer, reset]);

  async function onSubmit(data: CreateCustomerDto) {
    try {
      if (customer) {
        await updateCustomer(customer.id, data);
      } else {
        await createCustomer(data);
      }

      reset({
        name: "",
        email: "",
        phone: "",
      });

      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar cliente.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 rounded-lg border p-6 md:grid-cols-2"
    >
      <Input
        placeholder="Nome"
        {...register("name", {
          required: true,
        })}
      />

      <Input type="email" placeholder="E-mail" {...register("email")} />

      <Input placeholder="Telefone" {...register("phone")} />

      <Button type="submit" className="md:col-span-2">
        {customer ? "Atualizar Cliente" : "Salvar Cliente"}
      </Button>
    </form>
  );
}
