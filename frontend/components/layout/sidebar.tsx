"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Users,
  Truck,
  ShoppingCart,
  BadgeDollarSign,
} from "lucide-react";

const menu = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Produtos",
    href: "/products",
    icon: Package,
  },
  {
    title: "Categorias",
    href: "/categories",
    icon: FolderTree,
  },
  {
    title: "Clientes",
    href: "/customers",
    icon: Users,
  },
  {
    title: "Fornecedores",
    href: "/suppliers",
    icon: Truck,
  },
  {
    title: "Compras",
    href: "/purchases",
    icon: ShoppingCart,
  },
  {
    title: "Vendas",
    href: "/sales",
    icon: BadgeDollarSign,
  },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 text-white h-screen p-6">
      <h1 className="text-2xl font-bold mb-8">BuildFlow</h1>

      <nav className="space-y-2">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-4 py-3 hover:bg-slate-800 transition"
            >
              <Icon size={20} />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
