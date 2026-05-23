import { successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const menu = await prisma.menu.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!menu) {
    return Response.json({ message: "Menu not found" }, { status: 404 });
  }

  return Response.json(menu);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const body = await req.json();

    const { id } = await params;

    const menu = await prisma.menu.update({
      where: {
        id: Number(id),
      },
      data: {
        name: body.name,
        price: body.price,
        supply: body.supply,
      },
    });

    return successResponse(menu, "Menu updated successfully");
  } catch (error) {
    console.error(error);
    return Response.json({ message: "Failed to update menu" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const menu = await prisma.menu.update({
    where: {
      id: Number(id),
    },
    data: {
      isDeleted: true,
    },
  });

  return successResponse(null, "Menu deleted successfully");
}
