"use client";

import { Purchase } from "@/lib/services/purchase.service";

import { Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface PurchasesTableProps {
  purchases: Purchase[];
  loading: boolean;
  onDelete: (id: number) => void;
}

export function PurchasesTable({
  purchases,
  loading,
  onDelete,
}: PurchasesTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border p-6 text-center">
        Carregando compras...
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Fornecedor</TableHead>
            <TableHead>Itens</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Data</TableHead>
            <TableHead className="w-24 text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {purchases.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Nenhuma compra encontrada.
              </TableCell>
            </TableRow>
          ) : (
            purchases.map((purchase) => (
              <TableRow key={purchase.id}>
                <TableCell>{purchase.id}</TableCell>

                <TableCell>{purchase.supplier.name}</TableCell>

                <TableCell>{purchase.items.length}</TableCell>

                <TableCell>
                  {Number(purchase.total).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>

                <TableCell>
                  {new Date(purchase.createdAt).toLocaleDateString("pt-BR")}
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(purchase.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
