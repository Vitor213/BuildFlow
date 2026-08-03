"use client";

import { useEffect, useState } from "react";

import {
  Product,
  getProducts,
  deleteProduct,
} from "@/lib/services/product.service";

import { ProductForm } from "@/components/products/ProductForm";
import { ProductsTable } from "@/components/products/ProductsTable";
import { Input } from "@/components/ui/input";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState("");

  async function loadProducts(searchValue = search) {
    try {
      const data = await getProducts({
        search: searchValue,
      });

      setProducts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Deseja realmente excluir este produto?")) {
      return;
    }

    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir produto.");
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      loadProducts(search);
    }, 300);

    return () => clearTimeout(timeout);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

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

      <ProductForm
        product={editingProduct}
        onSuccess={() => {
          setEditingProduct(null);
          loadProducts();
        }}
      />

      <ProductsTable
        products={products}
        loading={loading}
        onDelete={handleDelete}
        onEdit={setEditingProduct}
      />
    </div>
  );
}
