import React, { useEffect, useState } from 'react';
import type {Order} from '../types';
import { getOrders, updateOrderStatus } from '../services/orderService';

interface OrderListProps {
    refreshTrigger: number;
    onViewDetails: (order: Order) => void;

}

const OrderList: React.FC<OrderListProps> = ({ refreshTrigger, onViewDetails }) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOrders();
                setOrders(data);
            } catch (err) {
                setError('Falha ao carregar pedidos. Verifique o console para mais detalhes.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [refreshTrigger]);

    // Função Manipulador para mudança de status
    const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
        try {
            // Chama a API para atualizar o status
            const updatedOrder = await updateOrderStatus(orderId, newStatus);
            // Atualiza o estado local para refletir a mudança imediatamente na UI
            setOrders(prevOrders =>
                prevOrders.map(order => (order.id === orderId ? updatedOrder : order))
            );
            // alert(`Status do pedido ${orderId.substring(0, 8)}... atualizado para ${newStatus}`);
        } catch (err) {
            console.error(`Erro ao atualizar status do pedido ${orderId}:`, err);
            setError(`Falha ao atualizar status do pedido ${orderId.substring(0, 8)}...`);
        }
    };

    if (loading) {
        return <div className="text-center text-gray-700">Carregando pedidos...</div>;
    }

    if (error) {
        return <div className="text-center text-red-600 font-bold">{error}</div>;
    }

    if (orders.length === 0) {
        return <div className="text-center text-gray-700">Nenhum pedido encontrado.</div>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Lista de Pedidos</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                    <thead>
                    <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">ID</th>
                        <th className="py-3 px-6 text-left">Cliente</th>
                        <th className="py-3 px-6 text-left">Produto</th>
                        <th className="py-3 px-6 text-left">Quantidade</th>
                        <th className="py-3 px-6 text-left">Valor Total</th>
                        <th className="py-3 px-6 text-left">Status</th>
                        <th className="py-3 px-6 text-left">Data Criação</th>
                        <th className="py-3 px-6 text-center">Ações</th>
                    </tr>
                    </thead>
                    <tbody className="text-gray-600 text-sm font-light">
                    {orders.map((order) => (
                        <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-left whitespace-nowrap">
                                <div className="text-xs text-gray-500">{order.id.substring(0, 8)}...</div>
                            </td>
                            <td className="py-3 px-6 text-left">{order.cliente}</td>
                            <td className="py-3 px-6 text-left">{order.produto}</td>
                            <td className="py-3 px-6 text-left">{order.quantidade}</td>
                            <td className="py-3 px-6 text-left">R$ {order.valorTotal.toFixed(2)}</td>
                            <td className="py-3 px-6 text-left">
                                {/* DROPDOWN DE STATUS */}
                                <select
                                    value={order.status}
                                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                                        handleStatusChange(order.id, e.target.value as Order['status'])
                                    }
                                    className={`py-1 px-3 rounded-full text-xs font-semibold border
                                        ${order.status === 'Pendente' ? 'bg-yellow-200 text-yellow-800 border-yellow-300' : ''}
                                        ${order.status === 'Processando' ? 'bg-blue-200 text-blue-800 border-blue-300' : ''}
                                        ${order.status === 'Finalizado' ? 'bg-green-200 text-green-800 border-green-300' : ''}
                                    `}
                                >
                                    <option value="Pendente">Pendente</option>
                                    <option value="Processando">Processando</option>
                                    <option value="Finalizado">Finalizado</option>
                                </select>
                            </td>
                            <td className="py-3 px-6 text-left">
                                {new Date(order.dataCriacao).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-6 text-center">
                                <button
                                    onClick={() => onViewDetails(order)}
                                    className="bg-indigo-500 text-white py-1 px-3 rounded text-xs hover:bg-indigo-600"
                                >
                                    Detalhes
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderList;