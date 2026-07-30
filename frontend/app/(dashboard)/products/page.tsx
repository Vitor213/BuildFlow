"use client";
import { deleteProduct } from "@/lib/services/product.service";
import { useEffect, useState } from "react";

import { Product, getProducts } from "@/lib/services/product.service";

import { ProductForm } from "@/components/products/ProductForm";
import { ProductsTable } from "@/components/products/ProductsTable";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
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
    loadProducts();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Produtos</h1>

        <p className="text-muted-foreground">
          Gerencie os produtos cadastrados.
        </p>
      </div>

      <ProductForm onSuccess={loadProducts} />

      <ProductsTable
        products={products}
        loading={loading}
        onDelete={handleDelete}
      />
    </div>
  );
}
