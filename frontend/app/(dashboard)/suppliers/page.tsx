"use client";

import { useEffect, useState } from "react";

import {
  Supplier,
  getSuppliers,
  deleteSupplier,
} from "@/lib/services/supplier.service";

import { SupplierForm } from "@/components/suppliers/SupplierForm";
import { SuppliersTable } from "@/components/suppliers/SuppliersTable";
import { toast } from "sonner";

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingSupplier, setEditingSupplier] = useState<Supplier | null>(null);

  async function loadSuppliers() {
    try {
      const data = await getSuppliers();
      setSuppliers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Deseja realmente excluir este fornecedor?")) {
      return;
    }

    try {
      await deleteSupplier(id);

      toast.success("Fornecedor excluído com sucesso!");

      await loadSuppliers();
    } catch (error) {
      console.error(error);

      toast.error("Erro ao excluir fornecedor.");
    }
  }

  useEffect(() => {
    loadSuppliers();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Fornecedores</h1>

        <p className="text-muted-foreground">
          Gerencie os fornecedores cadastrados.
        </p>
      </div>

      <SupplierForm
        supplier={editingSupplier}
        onSuccess={() => {
          setEditingSupplier(null);
          loadSuppliers();
        }}
      />

      <SuppliersTable
        suppliers={suppliers}
        loading={loading}
        onEdit={setEditingSupplier}
        onDelete={handleDelete}
      />
    </div>
  );
}
