import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(request, { params: { slug } }) {
    try {
        if (isNaN(slug)) {
            return NextResponse.json({
                status: 400,
                message: `Param must be ID not text`,
            });
        }
        const orders = await prisma.orders.findMany({
            where: {
                customer_id: +(slug)
            },
            orderBy: {
                order_id: 'asc'
            }
        })
        if (orders.length == 0) {
            return NextResponse.json({
                status: 404,
                message: `Customer ID ${slug} was not found.`,
                payload: orders
            });
        }

        const convertOrderTotal = orders.map(order => ({
            ...order,
            order_total: parseFloat(order.order_total)
        }))

        return NextResponse.json({
            status: 200,
            message: `Get order by customer ID ${slug} successfully.`,
            payload: convertOrderTotal
        });
    } catch (error) {
        console.error("Error Fetching All Orders By Cusotmer ID : ", error);
        return NextResponse.error("Internal Server Error", 500);
    }
}

