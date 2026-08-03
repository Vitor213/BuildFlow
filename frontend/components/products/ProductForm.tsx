"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

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

export function ProductForm({ product, onSuccess }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  const defaultValues = useMemo<CreateProductDto>(
    () => ({
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? 0,
      quantity: product?.quantity ?? 0,
      categoryId: product?.category.id ?? 0,
    }),
    [product],
  );

  const { register, handleSubmit, reset } = useForm<CreateProductDto>({
    defaultValues,
  });

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  async function onSubmit(data: CreateProductDto) {
    try {
      if (product) {
        await updateProduct(product.id, data);
      } else {
        await createProduct(data);
      }

      reset({
        name: "",
        description: "",
        price: 0,
        quantity: 0,
        categoryId: 0,
      });

      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Erro ao salvar produto.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="grid gap-4 rounded-lg border p-6 md:grid-cols-2"
    >
      <Input placeholder="Nome" {...register("name", { required: true })} />

      <Input placeholder="Descrição" {...register("description")} />

      <Input
        type="number"
        placeholder="Preço"
        {...register("price", { valueAsNumber: true })}
      />

      <Input
        type="number"
        placeholder="Quantidade"
        {...register("quantity", { valueAsNumber: true })}
      />

      <select
        className="rounded-md border p-2"
        {...register("categoryId", { valueAsNumber: true })}
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
