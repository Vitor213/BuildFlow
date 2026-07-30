"use client";

import { Product } from "@/lib/services/product.service";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface ProductsTableProps {
  products: Product[];
  loading: boolean;
  onDelete: (id: number) => void;
}

export function ProductsTable({
  products,
  loading,
  onDelete,
}: ProductsTableProps) {
  if (loading) {
    return (
      <div className="rounded-lg border p-6 text-center">
        Carregando produtos...
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Qtd.</TableHead>
            <TableHead>Preço</TableHead>
            <TableHead className="w-32 text-center">Ações</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                Nenhum produto encontrado.
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.id}</TableCell>

                <TableCell>{product.name}</TableCell>

                <TableCell>{product.category.name}</TableCell>

                <TableCell>{product.quantity}</TableCell>

                <TableCell>
                  {Number(product.price).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    <Button variant="ghost" size="icon" title="Editar">
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      title="Excluir"
                      onClick={() => onDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
