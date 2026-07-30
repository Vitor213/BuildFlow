"use client";

import { useEffect, useState } from "react";

import { createProduct } from "@/lib/services/product.service";
import { getCategories, type Category } from "@/lib/services/category.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductFormProps {
  onSuccess: () => void;
}

export function ProductForm({ onSuccess }: ProductFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [categoryId, setCategoryId] = useState("");

  useEffect(() => {
    getCategories().then(setCategories).catch(console.error);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await createProduct({
        name,
        description,
        price: Number(price),
        quantity: Number(quantity),
        categoryId: Number(categoryId),
      });

      onSuccess();

      setName("");
      setDescription("");
      setPrice("");
      setQuantity("");
      setCategoryId("");
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar produto.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="grid gap-4 rounded-lg border p-6 md:grid-cols-2"
    >
      <Input
        placeholder="Nome"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Input
        placeholder="Descrição"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <Input
        type="number"
        placeholder="Preço"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <Input
        type="number"
        placeholder="Quantidade"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <select
        className="rounded-md border p-2"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
      >
        <option value="">Selecione uma categoria</option>

        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>

      <Button type="submit">Salvar Produto</Button>
    </form>
  );
}
