"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Boxes,
  FolderTree,
  Users,
  Truck,
  DollarSign,
  PackageX,
} from "lucide-react";

import { DashboardData } from "@/lib/services/dashboard.service";

interface Props {
  dashboard: DashboardData;
}

const cards = (dashboard: DashboardData) => [
  {
    title: "Produtos",
    value: dashboard.products,
    icon: Boxes,
  },
  {
    title: "Categorias",
    value: dashboard.categories,
    icon: FolderTree,
  },
  {
    title: "Clientes",
    value: dashboard.customers,
    icon: Users,
  },
  {
    title: "Fornecedores",
    value: dashboard.suppliers,
    icon: Truck,
  },
  {
    title: "Total de Vendas",
    value: `R$ ${dashboard.totalSales.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
    })}`,
    icon: DollarSign,
  },
  {
    title: "Estoque Baixo",
    value: dashboard.lowStock,
    icon: PackageX,
  },
];

export function SectionCards({ dashboard }: Props) {
  return (
    <div className="grid gap-4 px-4 md:grid-cols-2 xl:grid-cols-3">
      {cards(dashboard).map((card) => {
        const Icon = card.icon;

        return (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {card.title}
              </CardTitle>

              <Icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>

            <CardContent>
              <p className="text-3xl font-bold">{card.value}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
