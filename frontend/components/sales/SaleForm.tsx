"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { getProducts, Product } from "@/lib/services/product.service";
import { getCustomers, Customer } from "@/lib/services/customer.service";
import { createSale, SaleItem } from "@/lib/services/sale.service";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface SaleFormProps {
  onSuccess: () => void;
}

export function SaleForm({ onSuccess }: SaleFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [customerId, setCustomerId] = useState("");

  const [items, setItems] = useState<SaleItem[]>([
    {
      productId: 0,
      quantity: 1,
      price: 0,
    },
  ]);

  useEffect(() => {
    getCustomers().then(setCustomers);
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

  function updateItem(index: number, field: keyof SaleItem, value: number) {
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

    if (!customerId) {
      toast.error("Selecione um cliente.");
      return;
    }

    if (items.some((item) => item.productId === 0)) {
      toast.error("Selecione um produto.");
      return;
    }

    if (items.some((item) => item.quantity <= 0)) {
      toast.error("A quantidade deve ser maior que zero.");
      return;
    }

    if (items.some((item) => item.price < 0)) {
      toast.error("O preço não pode ser negativo.");
      return;
    }

    const stockError = items.find((item) => {
      const product = products.find((p) => p.id === item.productId);

      return product && item.quantity > product.quantity;
    });

    if (stockError) {
      const product = products.find((p) => p.id === stockError.productId);

      toast.error(`Estoque insuficiente para ${product?.name}.`);
      return;
    }

    try {
      await createSale({
        customerId: Number(customerId),
        items,
      });

      toast.success("Venda cadastrada com sucesso!");

      setCustomerId("");

      setItems([
        {
          productId: 0,
          quantity: 1,
          price: 0,
        },
      ]);

      onSuccess();
    } catch (error: any) {
      console.error(error);

      toast.error(error?.response?.data?.message ?? "Erro ao cadastrar venda.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-lg border p-6">
      <select
        className="w-full rounded-md border p-2"
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
      >
        <option value="">Selecione um cliente</option>

        {customers.map((customer) => (
          <option key={customer.id} value={customer.id}>
            {customer.name}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-6 gap-4 text-sm font-medium text-muted-foreground">
        <span>Produto</span>
        <span>Estoque</span>
        <span>Quantidade</span>
        <span>Preço</span>
        <span>Subtotal</span>
        <span></span>
      </div>

      {items.map((item, index) => {
        const selectedProduct = products.find((p) => p.id === item.productId);

        return (
          <div key={index} className="grid grid-cols-6 items-center gap-4">
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

            <div className="text-center font-medium">
              {selectedProduct?.quantity ?? "-"}
            </div>

            <Input
              type="number"
              min={1}
              max={selectedProduct?.quantity}
              step="1"
              value={item.quantity}
              onChange={(e) =>
                updateItem(
                  index,
                  "quantity",
                  Math.max(1, Number(e.target.value)),
                )
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
        );
      })}

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

      <Button type="submit">Salvar Venda</Button>
    </form>
  );
}
