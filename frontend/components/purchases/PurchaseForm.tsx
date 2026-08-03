"use client";

import { useEffect, useMemo, useState } from "react";

import { getProducts, Product } from "@/lib/services/product.service";
import { getSuppliers, Supplier } from "@/lib/services/supplier.service";

import { createPurchase, PurchaseItem } from "@/lib/services/purchase.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PurchaseFormProps {
  onSuccess: () => void;
}

export function PurchaseForm({ onSuccess }: PurchaseFormProps) {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [supplierId, setSupplierId] = useState("");

  const [items, setItems] = useState<PurchaseItem[]>([
    {
      productId: 0,
      quantity: 1,
      price: 0,
    },
  ]);

  useEffect(() => {
    getSuppliers().then(setSuppliers);
    getProducts().then(setProducts);
  }, []);

  function addItem() {
    setItems((old) => [
      ...old,
      {
        productId: 0,
        quantity: 1,
        price: 0,
      },
    ]);
  }

  function removeItem(index: number) {
    if (items.length === 1) return;

    setItems((old) => old.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof PurchaseItem, value: number) {
    const copy = [...items];

    copy[index] = {
      ...copy[index],
      [field]: value,
    };

    setItems(copy);
  }

  const total = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  }, [items]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      await createPurchase({
        supplierId: Number(supplierId),
        items,
      });

      setSupplierId("");

      setItems([
        {
          productId: 0,
          quantity: 1,
          price: 0,
        },
      ]);

      onSuccess();
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar compra.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border p-6">
      <select
        className="w-full rounded-md border p-2"
        value={supplierId}
        onChange={(e) => setSupplierId(e.target.value)}
      >
        <option value="">Selecione um fornecedor</option>

        {suppliers.map((supplier) => (
          <option key={supplier.id} value={supplier.id}>
            {supplier.name}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-5 gap-4 text-sm font-medium text-muted-foreground">
        <span>Produto</span>
        <span>Quantidade</span>
        <span>Preço Unitário</span>
        <span>Subtotal</span>
        <span></span>
      </div>

      {items.map((item, index) => (
        <div key={index} className="grid grid-cols-5 gap-4 items-center">
          <select
            className="rounded-md border p-2"
            value={item.productId}
            onChange={(e) => {
              const productId = Number(e.target.value);

              const product = products.find((p) => p.id === productId);

              const copy = [...items];

              copy[index] = {
                ...copy[index],
                productId,
                price: product ? Number(product.price) : 0,
              };

              setItems(copy);
            }}
          >
            <option value={0}>Selecione...</option>

            {products.map((product) => (
              <option key={product.id} value={product.id}>
                {product.name}
              </option>
            ))}
          </select>

          <Input
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) =>
              updateItem(index, "quantity", Math.max(1, Number(e.target.value)))
            }
          />

          <Input
            type="number"
            min={0}
            step="0.01"
            value={item.price}
            onChange={(e) =>
              updateItem(index, "price", Math.max(0, Number(e.target.value)))
            }
          />

          <div className="font-medium">
            {(item.quantity * item.price).toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>

          <Button
            type="button"
            variant="destructive"
            disabled={items.length === 1}
            onClick={() => removeItem(index)}
          >
            Remover
          </Button>
        </div>
      ))}

      <Button type="button" variant="secondary" onClick={addItem}>
        Adicionar Produto
      </Button>

      <div className="text-right text-xl font-bold">
        Total:{" "}
        {total.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </div>

      <Button type="submit">Salvar Compra</Button>
    </form>
  );
}
