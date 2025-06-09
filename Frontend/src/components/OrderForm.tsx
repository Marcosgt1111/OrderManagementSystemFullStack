import React, { useState } from 'react';
import type {OrderRequest} from '../types';
import { createOrder } from '../services/orderService';

interface OrderFormProps {
    onOrderCreated: () => void; // Callback para quando um pedido é criado com sucesso
}

const OrderForm: React.FC<OrderFormProps> = ({ onOrderCreated }) => {
    const [orderData, setOrderData] = useState<OrderRequest>({
        cliente: '',
        produto: '',
        quantidade: 1, // Valor inicial
        valorTotal: 0, // Valor inicial
    });
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setOrderData((prev) => ({
            ...prev,
            [name]: name === 'quantidade' || name === 'valorTotal' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Validação básica
        if (!orderData.cliente || !orderData.produto || orderData.quantidade <= 0 || orderData.valorTotal <= 0) {
            setError('Por favor, preencha todos os campos corretamente.');
            setLoading(false);
            return;
        }

        try {
            const newOrder = await createOrder(orderData); // Chama a API para criar o pedido
            setSuccess(`Pedido "${newOrder.id.substring(0, 8)}..." criado com sucesso! Status: ${newOrder.status}.`);
            setOrderData({ cliente: '', produto: '', quantidade: 1, valorTotal: 0 }); // Limpa o formulário
            onOrderCreated(); // Chama o callback para o OrderList recarregar
        } catch (err) {
            console.error("Erro ao criar pedido:", err);
            setError('Falha ao criar pedido. Verifique o console para mais detalhes.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Criar Novo Pedido</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="cliente" className="block text-sm font-medium text-gray-700">Cliente:</label>
                    <input
                        type="text"
                        id="cliente"
                        name="cliente"
                        value={orderData.cliente}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="produto" className="block text-sm font-medium text-gray-700">Produto:</label>
                    <input
                        type="text"
                        id="produto"
                        name="produto"
                        value={orderData.produto}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="quantidade" className="block text-sm font-medium text-gray-700">Quantidade:</label>
                    <input
                        type="number"
                        id="quantidade"
                        name="quantidade"
                        value={orderData.quantidade}
                        onChange={handleChange}
                        min="1"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="valorTotal" className="block text-sm font-medium text-gray-700">Valor Total (R$):</label>
                    <input
                        type="number"
                        id="valorTotal"
                        name="valorTotal"
                        value={orderData.valorTotal}
                        onChange={handleChange}
                        step="0.01"
                        min="0"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                >
                    {loading ? 'Criando...' : 'Criar Pedido'}
                </button>

                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                {success && <p className="text-green-600 text-sm mt-2">{success}</p>}
            </form>
        </div>
    );
};

export default OrderForm;