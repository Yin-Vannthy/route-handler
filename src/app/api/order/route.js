
import { NextResponse } from "next/server";

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function GET() {
    try {
        const orders = await prisma.orders.findMany({
            orderBy: {
                order_id: 'asc'
            }
        });

        if (orders.length == 0) {
            return NextResponse.json({
                status: 404,
                message: "No order was found.",
                payload: orders
            })
        }
        const convertOrderTotal = orders.map(order => ({
            ...order,
            order_total: parseFloat(order.order_total)
        }))
        return NextResponse.json({
            status: 200,
            message: "Get all orders successfully.",
            payload: convertOrderTotal
        });
    } catch (error) {
        console.error("Error Fetching All Orders : ", error);
        return NextResponse.error("Internal Server Error", 500);
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
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

        const price = product.price;
        const order_total = price * data.order_qty;

        const newOrder = await prisma.orders.create({
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
            message: "A new order was created successfully.",
            payload: {
                ...newOrder,
                order_total: parseFloat(order_total)
            }
        });
    } catch (error) {
        console.error("Error Creating Orders : ", error);
        return NextResponse.error("Internal Server Error", 500);
    }
}

