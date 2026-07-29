"use client";

import { useEffect, useState } from "react";

import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";

import data from "./data.json";

import {
  getDashboard,
  type DashboardData,
} from "@/lib/services/dashboard.service";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    getDashboard()
      .then((result) => {
        if (mounted) {
          setDashboard(result);
        }
      })
      .catch((err) => {
        console.error(err);
        if (mounted) {
          setError("Não foi possível carregar o dashboard.");
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return <div className="p-6">Carregando dashboard...</div>;
  }

  if (error || !dashboard) {
    return (
      <div className="p-6 text-red-500">
        {error ?? "Erro ao carregar o dashboard."}
      </div>
    );
  }

  return (
    <>
      <SectionCards dashboard={dashboard} />

      <div className="px-4 lg:px-6">
        <ChartAreaInteractive />
      </div>

      <DataTable data={data} />
    </>
  );
}
