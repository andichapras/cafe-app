import { errorResponse, successResponse } from "@/lib/api-response";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
      where: {
        isDeleted: false,
      },
      orderBy: {
        createdDate: "desc",
      },
    });

    return successResponse(menus, "Menus fetched successfully");
  } catch (error) {
    console.error(error);
    return errorResponse("Failed to fetch menus", 500);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const menu = await prisma.menu.create({
      data: {
        name: body.name,
        price: body.price,
        supply: body.supply,
      },
    });

    return successResponse(menu, "Menu created successfully", 201);
  } catch (error) {
    console.error(error);
    return errorResponse("Failed to create menus", 500);
  }
}
