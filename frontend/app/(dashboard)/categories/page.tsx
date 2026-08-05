"use client";

import { useEffect, useState } from "react";

import {
  Category,
  getCategories,
  deleteCategory,
} from "@/lib/services/category.service";

import { CategoryForm } from "@/components/categories/CategoryForm";
import { CategoriesTable } from "@/components/categories/CategoriesTable";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);

  async function loadCategories() {
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Deseja realmente excluir esta categoria?")) {
      return;
    }

    try {
      await deleteCategory(id);

      toast.success("Categoria excluída com sucesso!");

      await loadCategories();
    } catch (error) {
      console.error(error);

      toast.error("Erro ao excluir categoria.");
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Categorias</h1>

        <p className="text-muted-foreground">
          Gerencie as categorias cadastradas.
        </p>
      </div>

      <CategoryForm
        category={editingCategory}
        onSuccess={() => {
          setEditingCategory(null);
          loadCategories();
        }}
      />

      <CategoriesTable
        categories={categories}
        loading={loading}
        onEdit={setEditingCategory}
        onDelete={handleDelete}
      />
    </div>
  );
}
