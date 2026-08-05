"use client";

import { useEffect, useState } from "react";

import {
  Customer,
  getCustomers,
  deleteCustomer,
} from "@/lib/services/customer.service";

import { CustomerForm } from "@/components/customers/CustomerForm";
import { CustomersTable } from "@/components/customers/CustomersTable";
import { toast } from "sonner";

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  async function loadCustomers() {
    try {
      const data = await getCustomers();
      setCustomers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Deseja realmente excluir este cliente?")) {
      return;
    }

    try {
      await deleteCustomer(id);

      toast.success("Cliente excluído com sucesso!");

      await loadCustomers();
    } catch (error) {
      console.error(error);

      toast.error("Erro ao excluir cliente.");
    }
  }

  useEffect(() => {
    loadCustomers();
  }, []);

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Clientes</h1>

        <p className="text-muted-foreground">
          Gerencie os clientes cadastrados.
        </p>
      </div>

      <CustomerForm
        customer={editingCustomer}
        onSuccess={() => {
          setEditingCustomer(null);
          loadCustomers();
        }}
      />

      <CustomersTable
        customers={customers}
        loading={loading}
        onEdit={setEditingCustomer}
        onDelete={handleDelete}
      />
    </div>
  );
}
