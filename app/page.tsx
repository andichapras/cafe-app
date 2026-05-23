"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

interface Menu {
  id: number;
  name: string;
  price: number;
  supply: number;
}

export default function HomePage() {
  const router = useRouter();

  const [menus, setMenus] = useState<Menu[]>([]);
  const [customerName, setCustomerName] = useState("");

  const [qtyMap, setQtyMap] = useState<Record<number, number>>({});

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const response = await fetch("/api/menu");

        const result = await response.json();

        setMenus(result.data ?? []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchMenus();
  }, []);

  function updateQty(menuId: number, value: number) {
    setQtyMap((prev) => ({
      ...prev,
      [menuId]: value,
    }));
  }

  const totalPrice = useMemo(() => {
    return menus.reduce((total, menu) => {
      const qty = qtyMap[menu.id] || 0;

      return total + menu.price * qty;
    }, 0);
  }, [menus, qtyMap]);

  async function submitOrder() {
    const items = Object.entries(qtyMap)
      .filter(([_, qty]) => qty > 0)
      .map(([menuId, qty]) => ({
        menuId: Number(menuId),
        qty,
      }));

    if (!customerName) {
      alert("Customer name is required");
      return;
    }

    if (items.length === 0) {
      alert("Please select at least 1 menu");
      return;
    }

    const response = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: customerName,
        items,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error);
      return;
    }

    router.push(`/orders/${result.data.id}`);
  }

  return (
    <main
      style={{
        padding: "24px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>Cafe Order App</h1>

      <h2>Menu List</h2>

      <table
        border={1}
        cellPadding={10}
        style={{
          width: "100%",
          marginBottom: "24px",
        }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Menu Name</th>
            <th>Price</th>
            <th>Supply</th>
            <th>Qty</th>
          </tr>
        </thead>

        <tbody>
          {menus.map((menu) => (
            <tr key={menu.id}>
              <td>{menu.id}</td>

              <td>{menu.name}</td>

              <td>
                Rp
                {menu.price.toLocaleString("id-ID")}
              </td>

              <td>{menu.supply}</td>

              <td>
                <input
                  type="number"
                  min={0}
                  max={menu.supply}
                  value={qtyMap[menu.id] || 0}
                  onChange={(e) => updateQty(menu.id, Number(e.target.value))}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Create Order</h2>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <label>Customer Name</label>

        <input
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Input customer name"
        />

        <div>
          Total Price:
          <strong>
            {" "}
            Rp
            {totalPrice.toLocaleString("id-ID")}
          </strong>
        </div>

        <button onClick={submitOrder}>Submit Order</button>
      </div>
    </main>
  );
}
