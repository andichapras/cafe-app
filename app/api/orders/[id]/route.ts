import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: {
      id: Number(id),
    },
    include: {
      items: {
        include: {
          menu: true,
        },
      },
    },
  });

  if (!order) {
    return Response.json({ message: "Order not found" }, { status: 404 });
  }

  return successResponse(order, "Order fetched successfully");
}
