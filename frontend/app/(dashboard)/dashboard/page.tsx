"use client";

import { useEffect, useState } from "react";

import { getDashboard, DashboardData } from "@/lib/services/dashboard.service";

import { SectionCards } from "@/components/section-cards";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);

  useEffect(() => {
    getDashboard().then(setDashboard).catch(console.error);
  }, []);

  if (!dashboard) {
    return <div className="p-6">Carregando...</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <SectionCards dashboard={dashboard} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Estoque Baixo</CardTitle>
          </CardHeader>

          <CardContent>
            {dashboard.lowStock.length === 0 ? (
              <p className="text-muted-foreground">
                Nenhum produto com estoque baixo.
              </p>
            ) : (
              <div className="space-y-3">
                {dashboard.lowStock.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <span>{product.name}</span>

                    <span className="font-semibold text-red-500">
                      {product.quantity} un.
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Últimas Vendas</CardTitle>
          </CardHeader>

          <CardContent>
            {dashboard.recentSales.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma venda encontrada.</p>
            ) : (
              <div className="space-y-3">
                {dashboard.recentSales.map((sale) => (
                  <div
                    key={sale.id}
                    className="flex items-center justify-between border-b pb-2"
                  >
                    <div>
                      <p className="font-medium">{sale.customer.name}</p>

                      <p className="text-sm text-muted-foreground">
                        {new Date(sale.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>

                    <span className="font-semibold">
                      {Number(sale.total).toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
