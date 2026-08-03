"use client";

import { useEffect, useState } from "react";

import { getStock, StockItem } from "@/lib/services/stock.service";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Card, CardContent } from "@/components/ui/card";

export default function StockPage() {
  const [stock, setStock] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadStock() {
    try {
      const data = await getStock();
      setStock(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStock();
  }, []);

  function getStatus(quantity: number) {
    if (quantity === 0) {
      return {
        text: "Esgotado",
        color: "text-red-500",
      };
    }

    if (quantity <= 5) {
      return {
        text: "Baixo",
        color: "text-yellow-500",
      };
    }

    return {
      text: "Normal",
      color: "text-green-500",
    };
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Estoque</h1>

        <p className="text-muted-foreground">
          Consulte rapidamente a situação do estoque.
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center">Carregando estoque...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {stock.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      Nenhum produto encontrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  stock.map((item) => {
                    const status = getStatus(item.quantity);

                    return (
                      <TableRow key={item.id}>
                        <TableCell>{item.name}</TableCell>

                        <TableCell>{item.category.name}</TableCell>

                        <TableCell>{item.quantity}</TableCell>

                        <TableCell className={status.color}>
                          {status.text}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
