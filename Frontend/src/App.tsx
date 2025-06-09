import { useState } from 'react';
import './index.css';
import OrderList from './components/OrderList';
import OrderForm from './components/OrderForm';
import OrderDetailModal from './components/OrderDetailModal';
import type {Order} from './types';
// Importe a interface Order

function App() {
    const [refreshOrders, setRefreshOrders] = useState(0);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null); // Estado para o pedido selecionado

    const handleOrderCreated = () => {
        setRefreshOrders(prev => prev + 1);
    };

    const handleViewDetails = (order: Order) => {
        setSelectedOrder(order); // Define o pedido selecionado para exibir no modal
    };

    const handleCloseModal = () => {
        setSelectedOrder(null); // Limpa o pedido selecionado para fechar o modal
    };

    return (
        <div className="min-h-screen bg-gray-100 p-4">
            <header className="text-center py-6">
                <h1 className="text-4xl font-bold text-gray-800">Sistema de Gestão de Pedidos</h1>
            </header>

            <main className="container mx-auto mt-8">
                <OrderForm onOrderCreated={handleOrderCreated} />
                <OrderList refreshTrigger={refreshOrders} onViewDetails={handleViewDetails} /> {/* Passe a nova prop */}
            </main>

            {/* Renderiza o modal se houver um pedido selecionado */}
            <OrderDetailModal order={selectedOrder} onClose={handleCloseModal} />
        </div>
    );
}

export default App;