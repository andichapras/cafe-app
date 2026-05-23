"use client";

import { useEffect, useState } from "react";

interface Menu {
  id: number;
  name: string;
  price: number;
  supply: number;
}

export default function AdminPage() {
  const [menus, setMenus] = useState<Menu[]>([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [supply, setSupply] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);

  const [editName, setEditName] = useState("");

  const [editPrice, setEditPrice] = useState("");

  const [editSupply, setEditSupply] = useState("");

  async function loadMenus() {
    const response = await fetch("/api/menu");
    const result = await response.json();

    if (response.ok) {
      setMenus(result.data);
    }
  }

  useEffect(() => {
    const loadMenus = async () => {
      const response = await fetch("/api/menu");
      const result = await response.json();

      if (response.ok) {
        setMenus(result.data);
      }
    };
    loadMenus();
  }, []);

  async function createMenu() {
    const response = await fetch("/api/menu", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        price: Number(price),
        supply: Number(supply),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error);
      return;
    }

    alert(result.message);

    setName("");
    setPrice("");
    setSupply("");

    loadMenus();
  }

  function openEditModal(menu: Menu) {
    setSelectedMenu(menu);

    setEditName(menu.name);
    setEditPrice(String(menu.price));
    setEditSupply(String(menu.supply));

    setIsEditOpen(true);
  }

  async function deleteMenu(id: number) {
    const confirmed = confirm("Delete this menu?");

    if (!confirmed) {
      return;
    }

    const response = await fetch(`/api/menu/${id}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error);
      return;
    }

    alert(result.message);

    loadMenus();
  }

  async function saveEditMenu() {
    if (!selectedMenu) {
      return;
    }

    const response = await fetch(`/api/menu/${selectedMenu.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: editName,
        price: Number(editPrice),
        supply: Number(editSupply),
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      alert(result.error);
      return;
    }

    alert(result.message);

    setIsEditOpen(false);

    loadMenus();
  }

  return (
    <>
      <main
        style={{
          maxWidth: "1000px",
          margin: "0 auto",
          padding: "24px",
        }}
      >
        <h1>Admin Menu Management</h1>

        <hr />

        <h2>Add Menu</h2>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "24px",
          }}
        >
          <input
            placeholder="Menu Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Price"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <input
            placeholder="Supply"
            type="number"
            value={supply}
            onChange={(e) => setSupply(e.target.value)}
          />

          <button onClick={createMenu}>Add</button>
        </div>

        <h2>Menu List</h2>

        <table
          border={1}
          cellPadding={10}
          style={{
            width: "100%",
          }}
        >
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Supply</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {menus.map((menu) => (
              <tr key={menu.id}>
                <td>{menu.name}</td>

                <td>
                  Rp
                  {menu.price.toLocaleString("id-ID")}
                </td>

                <td>{menu.supply}</td>

                <td>
                  <button onClick={() => openEditModal(menu)}>Edit</button>

                  <button
                    onClick={() => deleteMenu(menu.id)}
                    style={{
                      marginLeft: "8px",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      {isEditOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              background: "white",
              padding: "24px",
              borderRadius: "8px",
              width: "400px",
            }}
          >
            <h2>Edit Menu</h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Menu Name"
              />

              <input
                type="number"
                value={editPrice}
                onChange={(e) => setEditPrice(e.target.value)}
                placeholder="Price"
              />

              <input
                type="number"
                value={editSupply}
                onChange={(e) => setEditSupply(e.target.value)}
                placeholder="Supply"
              />

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                }}
              >
                <button onClick={saveEditMenu}>Save</button>

                <button onClick={() => setIsEditOpen(false)}>Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
