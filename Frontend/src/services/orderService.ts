import type {Order, OrderRequest} from '../types';

const API_BASE_URL = 'https://localhost:5010/orders';

export const getOrders = async (): Promise<Order[]> => {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) {
            throw new Error(`Erro ao buscar pedidos: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falha ao carregar pedidos:", error);
        throw error; // Propaga o erro para quem chamou
    }
};

export const getOrderById = async (id: string): Promise<Order> => {
    try {
        const response = await fetch(`<span class="math-inline">\{API\_BASE\_URL\}/</span>{id}`);
        if (!response.ok) {
            throw new Error(`Erro ao buscar pedido por ID: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Falha ao carregar pedido com ID ${id}:`, error);
        throw error;
    }
};

export const createOrder = async (order: OrderRequest): Promise<Order> => {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(order),
        });
        if (!response.ok) {
            throw new Error(`Erro ao criar pedido: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Falha ao criar pedido:", error);
        throw error;
    }
};

//Função Atualizar o status do pedido
export const updateOrderStatus = async (id: string, newStatus: Order['status']): Promise<Order> => {
    try {
        const response = await fetch(`<span class="math-inline">\{API\_BASE\_URL\}/</span>{id}/status`, { // Assumindo o endpoint /orders/{id}/status
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: newStatus }), // Envia o novo status
        });

        if (!response.ok) {
            throw new Error(`Erro ao atualizar status do pedido ${id}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Falha ao atualizar status do pedido ${id}:`, error);
        throw error;
    }
};