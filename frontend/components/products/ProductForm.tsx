"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import {
  Product,
  createProduct,
  updateProduct,
  type CreateProductDto,
} from "@/lib/services/product.service";

import { getCategories, type Category } from "@/lib/services/category.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
}

type ProductFormData = {
  name: string;
  description?: string;
  price?: number;
  quantity?: number;
  categoryId: number;
  file?: File;
};

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  const defaultValues = useMemo<ProductFormData>(
    () => ({
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price,
      quantity: product?.quantity,
      categoryId: product?.category.id ?? 0,
    }),
    [product],
  );

  const { register, handleSubmit, reset } = useForm<ProductFormData>({
    defaultValues,
  });

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  async function onSubmit(data: ProductFormData) {
    if (!data.categoryId) {
      toast.error("Selecione uma categoria.");
      return;
    }

    if (data.price === undefined || Number.isNaN(data.price)) {
      toast.error("Informe um preço.");
      return;
    }

    if (data.quantity === undefined || Number.isNaN(data.quantity)) {
      toast.error("Informe uma quantidade.");
      return;
    }

    if (data.price < 0) {
      toast.error("O preço não pode ser negativo.");
      return;
    }

    if (data.quantity < 0) {
      toast.error("A quantidade não pode ser negativa.");
      return;
    }

    const dto: CreateProductDto = {
      name: data.name,
      description: data.description,
      price: data.price,
      quantity: data.quantity,
      categoryId: data.categoryId,
      file: data.file,
    };

    try {
      if (product) {
        await updateProduct(product.id, dto);
        toast.success("Produto atualizado com sucesso!");
      } else {
        await createProduct(dto);
        toast.success("Produto cadastrado com sucesso!");
      }

      reset({
        name: "",
        description: "",
        price: undefined,
        quantity: undefined,
        categoryId: 0,
      });

      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao salvar produto.");
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

      <Input placeholder="Descrição" {...register("description")} />

      <Input
        type="number"
        placeholder="Preço"
        min={0}
        step="0.01"
        {...register("price", {
          valueAsNumber: true,
        })}
      />

      <Input
        type="number"
        placeholder="Quantidade"
        min={0}
        step="1"
        {...register("quantity", {
          valueAsNumber: true,
        })}
      />

      <select
        className="rounded-md border p-2"
        {...register("categoryId", {
          valueAsNumber: true,
        })}
      >
        <option value={0}>Selecione uma categoria</option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <Button type="submit">
        {product ? "Atualizar Produto" : "Salvar Produto"}
      </Button>
    </form>
  );
}
