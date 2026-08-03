"use client";

import { useEffect, useState } from "react";

import {
  Purchase,
  getPurchases,
  deletePurchase,
} from "@/lib/services/purchase.service";

import { PurchaseForm } from "@/components/purchases/PurchaseForm";
import { PurchasesTable } from "@/components/purchases/PurchasesTable";

export default function PurchasesPage() {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadPurchases() {
    try {
      const data = await getPurchases();
      setPurchases(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Deseja excluir esta compra?")) {
      return;
    }

    try {
      await deletePurchase(id);
      await loadPurchases();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir compra.");
    }
  }

  useEffect(() => {
    loadPurchases();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Compras</h1>

        <p className="text-muted-foreground">Gerencie as compras realizadas.</p>
      </div>

      <PurchaseForm onSuccess={loadPurchases} />

      <PurchasesTable
        purchases={purchases}
        loading={loading}
        onDelete={handleDelete}
      />
    </div>
  );
}
