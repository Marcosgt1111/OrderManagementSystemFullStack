import React from 'react';
import type {Order} from '../types';

interface OrderDetailModalProps {
    order: Order | null; // O pedido a ser exibido, ou null se o modal não estiver visível
    onClose: () => void; // Função para fechar o modal
}

const OrderDetailModal: React.FC<OrderDetailModalProps> = ({ order, onClose }) => {
    if (!order) return null; // Não renderiza se não houver pedido

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md mx-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Detalhes do Pedido</h2>
                <div className="space-y-4 text-gray-700">
                    <p><strong>ID:</strong> {order.id}</p>
                    <p><strong>Data de Criação:</strong> {new Date(order.dataCriacao).toLocaleString()}</p>
                    <p><strong>Status:</strong>
                        <span className={`ml-2 py-1 px-3 rounded-full text-sm font-semibold
              ${order.status === 'Pendente' ? 'bg-yellow-200 text-yellow-800' : ''}
              ${order.status === 'Processando' ? 'bg-blue-200 text-blue-800' : ''}
              ${order.status === 'Finalizado' ? 'bg-green-200 text-green-800' : ''}
            `}>
              {order.status}
            </span>
                    </p>
                    <p><strong>Cliente:</strong> {order.cliente}</p>
                    <p><strong>Produto:</strong> {order.produto}</p>
                    <p><strong>Quantidade:</strong> {order.quantidade}</p>
                    <p><strong>Valor Total:</strong> R$ {order.valorTotal.toFixed(2)}</p>
                </div>
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    >
                        Fechar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;