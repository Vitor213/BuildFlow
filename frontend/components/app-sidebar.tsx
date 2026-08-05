"use client";

import * as React from "react";
import { useMemo } from "react";

import { getUserFromToken } from "@/lib/services/auth";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import {
  BadgeDollarSignIcon,
  Boxes,
  CircleHelpIcon,
  FolderTreeIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  Package2,
  PackageIcon,
  Settings2Icon,
  ShoppingCartIcon,
  TruckIcon,
  UsersIcon,
} from "lucide-react";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Produtos",
      url: "/products",
      icon: <PackageIcon />,
    },
    {
      title: "Categorias",
      url: "/categories",
      icon: <FolderTreeIcon />,
    },
    {
      title: "Clientes",
      url: "/customers",
      icon: <UsersIcon />,
    },
    {
      title: "Fornecedores",
      url: "/suppliers",
      icon: <TruckIcon />,
    },
    {
      title: "Compras",
      url: "/purchases",
      icon: <ShoppingCartIcon />,
    },
    {
      title: "Vendas",
      url: "/sales",
      icon: <BadgeDollarSignIcon />,
    },
  ],

  navSecondary: [
    {
      title: "Configurações",
      url: "#",
      icon: <Settings2Icon />,
    },
    {
      title: "Ajuda",
      url: "#",
      icon: <CircleHelpIcon />,
    },
    {
      title: "Sair",
      url: "#",
      icon: <LogOutIcon />,
    },
    {
      title: "Estoque",
      url: "/stock",
      icon: <Boxes />,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const decodedUser = useMemo(() => getUserFromToken(), []);

  const user = {
    name: decodedUser?.name ?? "Usuário",
    email: decodedUser?.email ?? "",
    avatar: "",
  };

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<a href="/dashboard" />}
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Package2 className="size-5" />
              <span className="text-base font-semibold">BuildFlow</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
