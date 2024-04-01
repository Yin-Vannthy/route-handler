import { NextResponse } from "next/server";
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

export async function GET(request, { params: { slug } }) {
    try {
        if (isNaN(slug)) {
            return NextResponse.json({
                status: 400,
                message: `The given slug must be ID not Name`
            });
        }
        // Find customer by the given slug
        const customer = await prisma.customers.findUnique({
            where: { customer_id: +(slug) }
        });
        // If no customer found by the given slug return a message
        if (!customer) {
            return NextResponse.json({
                status: 404,
                message: `Customer with ID ${slug} not found.`
            });
        }

        return NextResponse.json({
            status: 200,
            message: `Get customer ID ${slug} successfully`,
            payload: customer
        });
    } catch (error) {
        console.error("Error Fetching customer : ", error);
        return NextResponse.error("Internal Server Error", 500);
    }
}

export async function PUT(request, { params: { slug } }) {
    try {
        if (isNaN(slug)) {
            return NextResponse.json({
                status: 400,
                message: `The given slug must be ID not Name`
            });
        }
        const data = await request.json();

        // Check if the customer exists
        const customer = await prisma.customers.findUnique({
            where: {
                customer_id: +(slug)
            }
        });

        if (!customer) {
            return NextResponse.json({
                status: 404,
                message: `Customer with ID ${slug} not found.`
            });
        }

        // Update the customer
        const updatedcustomer = await prisma.customers.update({
            where: {
                customer_id: +(slug)
            },
            data: {
                first_name: data.first_name,
                last_name: data.last_name,
                birth_date: data.birth_date,
                money_spent: data.money_spent
            }
        });

        // Return success response
        return NextResponse.json({
            status: 200,
            message: `Updated customer ${isNaN(slug) ? 'name' : 'ID'} ${slug} successfully`,
            payload: updatedcustomer
        });
    } catch (error) {
        console.error("Error Updating customer : ", error);
        return NextResponse.error("Internal Server Error", 500);
    }
}

export async function DELETE(request, { params: { slug } }) {
    try {
        if (isNaN(slug)) {
            return NextResponse.json({
                status: 400,
                message: `The given slug must be ID not Name`
            });
        }
        // Check if the customer exists
        const customer = await prisma.customers.findUnique({
            where: { customer_id: +(slug) }
        });

        if (!customer) {
            return NextResponse.json({
                status: 404,
                message: `Customer with ID ${slug} not found.`
            });
        }
        const deletedcustomer = await prisma.customers.delete({
            where: { customer_id: +(slug) }
        });

        return NextResponse.json({
            status: 200,
            message: `Deleted customer ID ${slug} successfully`,
        });
    } catch (error) {
        console.error("Error Deleting customer : ", error);
        return NextResponse.error("Internal Server Error", 500);
    }
}
