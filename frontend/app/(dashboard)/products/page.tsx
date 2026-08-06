"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Product,
  getProducts,
  deleteProduct,
  restoreProduct,
} from "@/lib/services/product.service";

import { ProductForm } from "@/components/products/ProductForm";
import { ProductsTable } from "@/components/products/ProductsTable";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [search, setSearch] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);

  async function loadProducts(searchValue = search, deleted = showDeleted) {
    try {
      setLoading(true);
      console.log("showDeleted =", deleted);
      const data = await getProducts({
        search: searchValue,
        showDeleted: deleted,
      });

      setProducts(data);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar produtos.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Deseja realmente excluir este produto?")) return;

    try {
      await deleteProduct(id);

      toast.success("Produto excluído com sucesso.");

      loadProducts();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao excluir produto.");
    }
  }

  async function handleRestore(id: number) {
    try {
      await restoreProduct(id);

      toast.success("Produto restaurado.");

      loadProducts();
    } catch (error) {
      console.error(error);
      toast.error("Erro ao restaurar produto.");
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadProducts(search, showDeleted);
    }, 300);

    return () => clearTimeout(timeout);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, showDeleted]);

  useEffect(() => {
    loadProducts();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Produtos</h1>

        <p className="text-muted-foreground">
          Gerencie os produtos cadastrados.
        </p>
      </div>

      <Input
        placeholder="Pesquisar produto..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex items-center gap-2">
        <Checkbox
          checked={showDeleted}
          onCheckedChange={(value) => setShowDeleted(Boolean(value))}
        />

        <span className="text-sm">Mostrar produtos excluídos</span>
      </div>

      {!showDeleted && (
        <ProductForm
          product={editingProduct}
          onSuccess={() => {
            setEditingProduct(null);
            loadProducts();
          }}
        />
      )}

      <ProductsTable
        products={products}
        loading={loading}
        showDeleted={showDeleted}
        onDelete={handleDelete}
        onRestore={handleRestore}
        onEdit={setEditingProduct}
      />
    </div>
  );
}
