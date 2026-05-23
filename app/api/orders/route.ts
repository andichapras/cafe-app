import { OrderItemRequest } from "@/types/order";
import { prisma } from "@/lib/prisma";
import { successResponse } from "@/lib/api-response";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const menuIds = body.items.map((item: OrderItemRequest) => item.menuId);

    const menus = await prisma.menu.findMany({
      where: {
        id: {
          in: menuIds,
        },
      },
    });

    let totalPrice = 0;

    const orderItems = body.items.map((item: OrderItemRequest) => {
      const menu = menus.find((m) => m.id === item.menuId);

      const price = menu?.price ?? 0;

      totalPrice += price * item.qty;

      return {
        menuId: item.menuId,
        qty: item.qty,
        price,
      };
    });

    const order = await prisma.order.create({
      data: {
        name: body.name,
        totalPrice,
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    return successResponse(order, "Order created successfully", 201);
  } catch (error) {
    console.error(error);
    return Response.json(
      { message: "Failed to create order" },
      { status: 500 },
    );
  }
}
