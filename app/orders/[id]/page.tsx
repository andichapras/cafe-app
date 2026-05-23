"use client";

import { useEffect, useState } from "react";

interface Receipt {
  id: number;
  name: string;
  totalPrice: number;
  createdDate: string;

  items: {
    id: number;
    qty: number;
    price: number;

    menu: {
      id: number;
      name: string;
    };
  }[];
}

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function OrderReceiptPage({ params }: PageProps) {
  const [receipt, setReceipt] = useState<Receipt | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReceipt() {
      const { id } = await params;

      try {
        const response = await fetch(`/api/orders/${id}`);

        const result = await response.json();

        if (!response.ok) {
          alert(result.error);
          return;
        }

        setReceipt(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadReceipt();
  }, [params]);

  if (loading) {
    return <main style={{ padding: 24 }}>Loading...</main>;
  }

  if (!receipt) {
    return <main style={{ padding: 24 }}>Order not found</main>;
  }

  return (
    <main
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "24px",
      }}
    >
      <h1>Receipt</h1>

      <p>
        <strong>Order ID:</strong> {receipt.id}
      </p>

      <p>
        <strong>Customer:</strong> {receipt.name}
      </p>

      <p>
        <strong>Order Date:</strong>{" "}
        {new Date(receipt.createdDate).toLocaleString()}
      </p>

      <hr />

      <table
        border={1}
        cellPadding={10}
        style={{
          width: "100%",
          marginTop: "16px",
        }}
      >
        <thead>
          <tr>
            <th>Menu</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>

        <tbody>
          {receipt.items.map((item) => (
            <tr key={item.id}>
              <td>{item.menu.name}</td>

              <td>{item.qty}</td>

              <td>
                Rp
                {item.price.toLocaleString("id-ID")}
              </td>

              <td>
                Rp
                {(item.price * item.qty).toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2
        style={{
          marginTop: "24px",
        }}
      >
        Total Price: Rp
        {receipt.totalPrice.toLocaleString("id-ID")}
      </h2>
    </main>
  );
}
