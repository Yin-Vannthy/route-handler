import { NextResponse } from "next/server";

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function GET() {
    try {
        const products = await prisma.products.findMany({
            orderBy: {
                product_id: 'asc'
            }
        });

        // IF there are no product found return a message
        if (products.length == 0) {
            return NextResponse.json({
                status: 404,
                message: "No Products Found"
            });
        }

        return NextResponse.json({
            status: 200,
            message: "Get all products successfully.",
            payload: products
        })

    } catch (error) {
        console.error("Error Fethcing All Products : ", error);
        return NextResponse.error("Internal Server Error", 500);
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        const categoryId = await prisma.categories.findUnique({
            where: {
                category_id: +(data.category_id)
            }
        });

        if (!categoryId) {
            return NextResponse.json({
                status: 404,
                message: `Category with Id ${data.category_id} not found.`
            });
        }

        const newProduct = await prisma.products.create({
            data: {
                category_id: data.category_id,
                product_name: data.product_name,
                price: data.price
            }
        });

        return NextResponse.json({
            status: 200,
            message: "A new product created successfully.",
            payload: newProduct
        });

    } catch (error) {
        console.error("Error Create New Product : ", error);
        return NextResponse.error("Internal Server Error", 500);
    }
}
