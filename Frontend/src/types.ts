export interface Order {
    id: string;
    dataCriacao: string;
    status: 'Pendente' | 'Processando' | 'Finalizado';
    cliente: string;
    produto: string;
    quantidade: number;
    valorTotal: number;
}

export interface OrderRequest {
    cliente: string;
    produto: string;
    quantidade: number;
    valorTotal: number;
}