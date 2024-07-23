import prisma from "@/lib/prisma"

type Order = {
    id: string;
    status: string;
    orderItems?: OrderItem[];
    total?: number;
    tableNo: number;
    restaurantId: string;
    createdAt: Date;
    updatedAt: Date;
};

type OrderItem = {
    id: string;
    item: string;
    itemId: string | undefined;
    portion: string;
    price: number;
    quantity: number;
    order?: string;
};

type orderWithOrderItems = Order & { orderItems: OrderItem[] };

// Create a new order
async function createOrder(restaurantId: string, tableNo: number): Promise<Order> {
    const order = await prisma.order.create({
        data: {
            restaurantId,
            status: 'pending',
            total: 0,
            tableNo,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });

    return order;
}


async function updateOrderTotal(orderId: string,total: number): Promise<Order> {
    const order = await prisma.order.update({
        where: {
            id: orderId,
        },
        data: {
            total,
        },
    });

    return order;

}

// Add an order item to an existing order
async function addOrderItem(orderId: string, item: string, itemId: string, portion: string, price: number, quantity: number): Promise<OrderItem> {
    const orderItem = await prisma.orderItem.create({
        data: {
            item,
            itemId,
            portion,
            price,
            quantity,
            order: { connect: { id: orderId } },
        },
    });

    return {
        ...orderItem,
        item: item,
        order: orderId,
    };

}



// Update the status of an order
async function updateOrderStatus(orderId: string, status: string): Promise<Order> {
    const order = await prisma.order.update({
        where: {
            id: orderId,
        },
        data: {
            status,
        },
    });

    return order;
}


async function getAllOrdersByRestaurant(restaurantId: string): Promise<Order[]> {
    const orders = await prisma.order.findMany({
        where: {
            restaurantId,
        },
        include: {
            orderItems: true,
        },
        orderBy: {
            createdAt: 'desc'
        },
    });

    return orders;
}


async function getOrderById(orderId: string): Promise<Order | null> {

    const order = await prisma.order.findUnique({
        where: {
            id: orderId,
        },
        include: {
            orderItems: true,
        },
    });

    return order;

}

export { createOrder, addOrderItem, updateOrderStatus, updateOrderTotal, getAllOrdersByRestaurant,getOrderById };