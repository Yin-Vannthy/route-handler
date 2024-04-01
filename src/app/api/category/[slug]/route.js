import { NextResponse } from "next/server";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function GET(request, { params: { slug } }) {
    try {
        const category = await prisma.categories.findUnique({
            where: isNaN(slug) ? { category_name: slug } : { category_id: +(slug) }
        });

        if (!category) {
            return NextResponse.json({
                status: 404,
                message: `Category with ${isNaN(slug) ? 'name' : 'ID'} ${slug} not found.`
            });
        }

        return NextResponse.json({
            status: 200,
            message: `Get category ${isNaN(slug) ? 'name' : 'ID'} ${slug} successfully`,
            payload: category
        });
    } catch (error) {
        console.error("Error Fetching Category : ", error);
        return NextResponse.error("Internal Server Error");
    }
}

export async function PUT(request, { params: { slug } }) {
    try {
        const data = await request.json();

        // Check if the category exists
        const categoryId = await prisma.categories.findUnique({
            where: isNaN(slug) ? { category_name: slug } : { category_id: +(slug) }
        });

        if (!categoryId) {
            return NextResponse.json({
                status: 404,
                message: `Category with ${isNaN(slug) ? 'name' : 'ID'} ${slug} not found.`
            });
        }
        const category = await prisma.categories.update({
            where: isNaN(slug) ? { category_name: slug } : { category_id: +(slug) },
            data: { category_name: data.category_name }
        });

        if (!category) {
            return NextResponse.json({
                status: 404,
                message: `Category with ${isNaN(slug) ? 'name' : 'ID'} ${slug} not found.`
            });
        }

        return NextResponse.json({
            status: 200,
            message: `Update category ${isNaN(slug) ? 'name' : 'ID'} ${slug} successfully`,
            payload: category
        });
    } catch (error) {
        console.error("Error Updating Category : ", error);
        return NextResponse.error("Internal Server Error");
    }
}


