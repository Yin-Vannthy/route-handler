import { NextResponse } from "next/server";

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function GET(request, { params: { slug } }) {
    try {
        if (isNaN(slug)) {
            return NextResponse.json({
                status: 400,
                message: `Param must be ID not text`,
            });
        }
        const order = await prisma.orders.findUnique({
            where: {
                order_id: +(slug)
            }
        });
        if (!order) {
            return NextResponse.json({
                status: 404,
                message: `Order ID ${slug} was not found.`,
                payload: order
            });
        }

        return NextResponse.json({
            status: 200,
            message: `Get order by ID ${slug} successfully.`,
            payload: {
                ...order,
                order_total: parseFloat(order.order_total)
            }
        });
    } catch (error) {
        console.error("Error Fetching Order : ", error);
        return NextResponse.error("Internal Server Error", 500);
    }
}

export async function PUT(request, { params: { slug } }) {
    try {
        // If the given slug is not number
        if (isNaN(slug)) {
            return NextResponse.json({
                status: 400,
                message: `Param must be ID not text`,
            });
        }

        const data = await request.json();
        // Find order by id
        const order = await prisma.orders.findUnique({
            where: {
                order_id: +(slug)
            }
        });

        if (!order) {
            return NextResponse.json({
                status: 404,
                message: `Order with ID ${slug} was not found.`
            })
        }
        // Find product by id
        const product = await prisma.products.findUnique({
            where: {
                product_id: +(data.product_id)
            }
        });

        if (!product) {
            return NextResponse.json({
                status: 404,
                message: `Product with ID ${data.product_id} was not found.`
            })
        }
        // Find customer by id
        const cusotmer = await prisma.customers.findUnique({
            where: {
                customer_id: +(data.customer_id)
            }
        });

        if (!cusotmer) {
            return NextResponse.json({
                status: 404,
                message: `Customer with ID ${data.customer_id} was not found.`
            })
        }

        // Update order by all the given data
        const price = product.price;
        const order_total = price * data.order_qty;

        const updatedOrder = await prisma.orders.update({
            where: {
                order_id: +(slug)
            },
            data: {
                customer_id: data.customer_id,
                product_id: data.product_id,
                order_total: order_total,
                order_qty: data.order_qty,
                order_date: new Date()
            }
        });

        return NextResponse.json({
            status: 200,
            message: "A new order was updated successfully.",
            payload: {
                ...updatedOrder,
                order_total: parseFloat(order_total)
            }
        });
    } catch (error) {
        console.error("Error Updating Order : ", error);
        return NextResponse.error("Internal Server Error", 500);
    }
}

export async function DELETE(request, { params: { slug } }) {
    try {
        if (isNaN(slug)) {
            return NextResponse.json({
                status: 400,
                message: `Param must be ID not text`,
            });
        }
        const order = await prisma.orders.findUnique({
            where: {
                order_id: +(slug)
            }
        });
        if (!order) {
            return NextResponse.json({
                status: 404,
                message: `Order ID ${slug} was not found.`,
            });
        }

        const deletedOrder = await prisma.orders.delete({
            where: {
                order_id: +(slug)
            }
        })
        return NextResponse.json({
            status: 200,
            message: `Delete order by ID ${slug} successfully.`
        });
    } catch (error) {
        console.error("Error Deleting Order : ", error);
        return NextResponse.error("Internal Server Error", 500);
    }
}