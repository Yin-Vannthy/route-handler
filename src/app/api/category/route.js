import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const categories = await prisma.categories.findMany({
            orderBy: {
                category_id: 'asc'
            }
        });
        if (categories.length == 0) {
            return NextResponse.json({
                status: 404,
                message: "No Categories Found"
            });
        }
        return NextResponse.json({
            status: 200,
            message: "Get all categories successfully",
            payload: categories
        });
    } catch (error) {
        console.error("Error Fetching Categories : ", error);
        return NextResponse.error("Internal Server Error", 500)
    }
}

export async function POST(request) {
    try {
        const data = await request.json();

        const categoriesCount = await prisma.categories.createMany({
            data: data
        });

        return NextResponse.json({
            status: 201,
            message: "New categoies are created successfully",
            payload: categoriesCount
        });
    } catch (error) {
        console.error("Error Create New Category : ", error);
        return NextResponse.error("Internal Server Error", 500);
    }
}