"use client";

import { Product } from "@/lib/services/product.service";

import { Pencil, RotateCcw, Trash2 } from "lucide-react";

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
  showDeleted: boolean;

  onDelete(id: number): void;
  onRestore(id: number): void;
  onEdit(product: Product): void;
}

export function ProductsTable({
  products,
  loading,
  showDeleted,
  onDelete,
  onRestore,
  onEdit,
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
            <TableHead className="text-center">Ações</TableHead>
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

                <TableCell>
                  <div className="flex justify-center gap-2">
                    {showDeleted ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onRestore(product.id)}
                      >
                        <RotateCcw className="h-4 w-4 text-green-600" />
                      </Button>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEdit(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDelete(product.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </>
                    )}
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
