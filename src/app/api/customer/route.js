import { NextResponse } from "next/server";

const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function GET() {
    try {
        const customer = await prisma.customers.findMany({
            orderBy: {
                customer_id: 'asc'
            }
        });

        if (customer.length == 0) {
            return NextResponse.json({
                status: 404,
                message: `No cutomer found`,
                payload: customer
            });
        }

        return NextResponse.json({
            status: 200,
            message: `Get all customer successfully`,
            payload: customer
        });
    } catch (error) {
        console.error("Error Fetching customer : ", error);
        return NextResponse.error("Internal Server Error", 500);
    }
}

export async function POST(request) {
    try {
        const data = await request.json();
        const newCustomer = await prisma.customers.create({
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                birth_date: data.birth_date,
                money_spent: data.money_spent
            }
        })

        return NextResponse.json({
            status: 200,
            message: `A new customer is created successfully`,
            payload: newCustomer
        });
    } catch (error) {
        console.error("Error Creating New Customer : ", error);
        return NextResponse.error("Internal Server Error", 500);
    }
}

