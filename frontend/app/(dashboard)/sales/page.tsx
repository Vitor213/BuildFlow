"use client";

import { useEffect, useState } from "react";

import { Sale, getSales, deleteSale } from "@/lib/services/sale.service";

import { SaleForm } from "@/components/sales/SaleForm";
import { SalesTable } from "@/components/sales/SalesTable";

export default function SalesPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadSales() {
    try {
      const data = await getSales();
      setSales(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Deseja realmente excluir esta venda?")) {
      return;
    }

    try {
      await deleteSale(id);
      await loadSales();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir venda.");
    }
  }

  useEffect(() => {
    loadSales();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Vendas</h1>

        <p className="text-muted-foreground">Gerencie as vendas realizadas.</p>
      </div>

      <SaleForm onSuccess={loadSales} />

      <SalesTable sales={sales} loading={loading} onDelete={handleDelete} />
    </div>
  );
}
