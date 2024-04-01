import { NextResponse } from "next/server";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function GET(request, { params: { id } }) {
    try {

        // Find all products associated with the category ID
        const products = await prisma.products.findMany({
            where: {
                category_id: +(id)
            }
        });

        // If there are no products found by the given category id
        if (products.length == 0) {
            return NextResponse.json({
                status: 404,
                message: `No products found by the category ID ${id}`
            })
        };

        // Return the list of products associated with the category
        return NextResponse.json({
            status: 200,
            message: `Get all products by category ${id} successfully`,
            payload: products
        });
    } catch (error) {
        console.error("Error Fetching Products: ", error);
        return NextResponse.error("Internal Server Error", 500);
    }
}
