import { NextResponse } from "next/server";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function GET(request, { params: { slug } }) {
    try {
        // Find product by the given slug
        const product = await prisma.products.findUnique({
            where: isNaN(slug) ? { product_name: slug } : { product_id: +(slug) }
        });
        // If no product found by the given slug return a message
        if (!product) {
            return NextResponse.json({
                status: 404,
                message: `Product with ${isNaN(slug) ? 'name' : 'ID'} ${slug} not found.`
            });
        }

        return NextResponse.json({
            status: 200,
            message: `Get product ${isNaN(slug) ? 'name' : 'ID'} ${slug} successfully`,
            payload: product
        });
    } catch (error) {
        console.error("Error Fetching product : ", error);
        return NextResponse.error("Internal Server Error", 500);
    }
}

export async function PUT(request, { params: { slug } }) {
    try {
        const data = await request.json();

        // Check if the product exists
        const product = await prisma.products.findUnique({
            where: isNaN(slug) ? { product_name: slug } : { product_id: +(slug) }
        });

        if (!product) {
            return NextResponse.json({
                status: 404,
                message: `Product with ${isNaN(slug) ? 'name' : 'ID'} ${slug} not found.`
            });
        }

        // Update the product
        const updatedProduct = await prisma.products.update({
            where: isNaN(slug) ? { product_name: slug } : { product_id: +(slug) },
            data: {
                product_id: +(data.product_id),
                product_name: data.product_name,
                price: data.price
            }
        });

        // Return success response
        return NextResponse.json({
            status: 200,
            message: `Updated product ${isNaN(slug) ? 'name' : 'ID'} ${slug} successfully`,
            payload: updatedProduct
        });
    } catch (error) {
        console.error("Error Updating product : ", error);
        return NextResponse.error("Internal Server Error", 500);
    }
}

export async function DELETE(request, { params: { slug } }) {
    try {

        // Check if the product exists
        const product = await prisma.products.findUnique({
            where: isNaN(slug) ? { product_name: slug } : { product_id: +(slug) }
        });

        if (!product) {
            return NextResponse.json({
                status: 404,
                message: `Product with ${isNaN(slug) ? 'name' : 'ID'} ${slug} not found.`
            });
        }
        const deletedProduct = await prisma.products.delete({
            where: isNaN(slug) ? { product_name: slug } : { product_id: +(slug) }
        });

        return NextResponse.json({
            status: 200,
            message: `Delete product ${isNaN(slug) ? 'name' : 'ID'} ${slug} successfully`,
        });
    } catch (error) {
        console.error("Error Deleting product : ", error);
        return NextResponse.error("Internal Server Error", 500);
    }
}
