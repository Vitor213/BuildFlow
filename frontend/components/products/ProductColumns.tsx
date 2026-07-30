"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/lib/services/product.service";

export const productColumns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Produto",
  },
  {
    accessorKey: "category.name",
    header: "Categoria",
  },
  {
    accessorKey: "quantity",
    header: "Estoque",
  },
  {
    accessorKey: "price",
    header: "Preço",
    cell: ({ row }) =>
      Number(row.original.price).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
      }),
  },
  {
    id: "actions",
    header: "Ações",
    cell: () => (
      <div className="flex gap-2">
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>

        <Button variant="ghost" size="icon">
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    ),
  },
];
