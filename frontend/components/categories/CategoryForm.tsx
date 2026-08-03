"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
  Category,
  CreateCategoryDto,
  createCategory,
  updateCategory,
} from "@/lib/services/category.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CategoryFormProps {
  category?: Category | null;
  onSuccess: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const { register, handleSubmit, reset } = useForm<CreateCategoryDto>({
    defaultValues: {
      name: "",
    },
  });

  useEffect(() => {
    reset({
      name: category?.name ?? "",
    });
  }, [category, reset]);

  async function onSubmit(data: CreateCategoryDto) {
    try {
      if (category) {
        await updateCategory(category.id, data);
      } else {
        await createCategory(data);
      }

      reset({
        name: "",
      });

      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar categoria.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border p-6">
      <div className="space-y-4">
        <Input
          placeholder="Nome da categoria"
          {...register("name", {
            required: true,
          })}
        />

        <Button type="submit">
          {category ? "Atualizar Categoria" : "Salvar Categoria"}
        </Button>
      </div>
    </form>
  );
}
