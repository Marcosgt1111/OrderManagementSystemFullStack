Sistema de Gestão de Pedidos
Este projeto implementa um sistema simples de gestão de pedidos (Order Management System) com um backend em C# (.NET) e um frontend em React com TailwindCSS. Ele permite criar, listar, visualizar e atualizar o status de pedidos. Além disso, utiliza o Azure Service Bus para simular o processamento assíncrono de pedidos.

🛠 Tecnologias Utilizadas
Backend: C# (.NET 9), Entity Framework Core, PostgreSQL, Azure Service Bus
Frontend: React, TypeScript, TailwindCSS
Mensageria: Azure Service Bus
Banco de Dados: PostgreSQL
✨ Funcionalidades
Backend (API em C#)
POST /orders: Cria um novo pedido, persiste no PostgreSQL e envia uma mensagem para o Azure Service Bus.
GET /orders: Lista todos os pedidos existentes.
GET /orders/{id}: Obtém os detalhes de um pedido específico.
PATCH /orders/{id}/status: Atualiza o status de um pedido para 'Pendente', 'Processando' ou 'Finalizado'.
Worker de Processamento: Um BackgroundService em C# que consome mensagens do Azure Service Bus, atualiza o status do pedido para 'Processando' e, após 5 segundos, para 'Finalizado'.
Frontend (React + TailwindCSS)
Listagem de Pedidos: Exibe todos os pedidos em uma tabela formatada com TailwindCSS.
Criação de Pedidos: Formulário para adicionar novos pedidos, com atualização automática da lista após a criação.
Visualização de Detalhes: Botão "Detalhes" que exibe um modal/seção com informações completas do pedido.
Atualização de Status: Dropdown na própria tabela para alterar o status de um pedido ('Pendente', 'Processando', 'Finalizado').
🚀 Setup e Execução
Siga os passos abaixo para configurar e executar o projeto em sua máquina local.

Pré-requisitos
Antes de começar, certifique-se de ter instalado:

.NET SDK (7 ou superior)
Node.js e npm (versão LTS recomendada)
PostgreSQL
Azure Account e Azure Service Bus Namespace (para a mensageria)
1. Configuração do Banco de Dados (PostgreSQL)
   Crie um novo banco de dados PostgreSQL para o projeto (ex: ordermanagementsystem_db).

No seu projeto backend (OrderManagementSystem), localize o arquivo appsettings.json.

Atualize a string de conexão no appsettings.json para apontar para o seu banco de dados PostgreSQL:

JSON

{
"ConnectionStrings": {
"DefaultConnection": "Host=localhost;Port=5432;Database=ordermanagementsystem_db;Username=seu_usuario;Password=sua_senha"
},
// ...
}
Navegue até a pasta OrderManagementSystem no terminal e execute as migrações do Entity Framework para criar o schema do banco de dados:

Bash

dotnet ef database update
2. Configuração do Azure Service Bus
   No Portal do Azure, crie um novo Namespace do Service Bus (Tier Standard ou Premium).

Dentro do Namespace, crie uma fila (Queue) com o nome orderprocessingqueue.

Vá para "Shared access policies" (Políticas de acesso compartilhado) do seu Namespace ou da fila orderprocessingqueue e gere uma Shared Access Policy com permissões de "Listen", "Send" e "Manage".

Copie a Connection String da chave primária dessa política.

No arquivo appsettings.json do seu backend, adicione a Connection String do Azure Service Bus:

JSON

{
"ConnectionStrings": {
"DefaultConnection": "Host=localhost;Port=5432;Database=ordermanagementsystem_db;Username=seu_usuario;Password=sua_senha",
"AzureServiceBusConnection": "Endpoint=sb://your-namespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SEU_SHARED_ACCESS_KEY"
},
"AzureServiceBus": {
"QueueName": "orderprocessingqueue" // Certifique-se de que o nome da fila está correto
},
// ...
}
3. Execução do Backend
   Navegue até a pasta raiz do projeto backend (OrderManagementSystem) no terminal:

Bash

cd OrderManagementSystem
Execute o projeto:

Bash

dotnet run
O backend será iniciado e estará ouvindo em https://localhost:5010 (ou outra porta configurada). Você pode testar os endpoints via Swagger UI em https://localhost:5010/swagger.

4. Execução do Frontend
   Em um novo terminal, navegue até a pasta do frontend (frontend):

Bash

cd frontend
Instale as dependências do Node.js:

Bash

npm install
Inicie o servidor de desenvolvimento do React:

Bash

npm run dev
O frontend será iniciado e estará acessível em http://localhost:5173.

5. Interagindo com a Aplicação
   Abra seu navegador e acesse http://localhost:5173.
   Você verá o formulário para criar novos pedidos e a lista de pedidos.
   Crie um novo pedido e observe a lista ser atualizada.
   Altere o status de um pedido usando o dropdown na coluna "Status".
   Clique em "Detalhes" para ver as informações completas de um pedido em um modal.
   Acompanhe o console do backend para ver as mensagens sendo enviadas e processadas pelo worker.
   ⚙️ Detalhes Técnicos
   Backend (C#)
   Estrutura de Projeto: O projeto segue uma estrutura modular, com pastas para Models, Data (DbContext e Migrações), Routes (definição dos endpoints) e Services (lógica de negócio e integração com Service Bus).
   Entity Framework Core: Utilizado para mapeamento objeto-relacional (ORM) e interação com o PostgreSQL. As migrações (dotnet ef migrations add InitialCreate) são usadas para gerenciar o schema do banco de dados.
   Azure Service Bus Integration:
   AzureServiceBusService.cs: Classe responsável por encapsular a lógica de envio de mensagens para a fila do Azure Service Bus.
   OrderProcessingWorker.cs: Um BackgroundService que implementa a lógica de consumo das mensagens da fila. Ele simula um processamento assíncrono atrasando a atualização do status do pedido.
   CORS (Cross-Origin Resource Sharing): Configurado no Program.cs para permitir que o frontend (http://localhost:5173) acesse a API do backend (https://localhost:5010).
   Frontend (React)
   Componentização: A interface é dividida em componentes reutilizáveis como App.tsx, OrderList.tsx, OrderForm.tsx e OrderDetailModal.tsx.
   Gerenciamento de Estado: useState e useEffect do React são utilizados para gerenciar o estado da aplicação e os efeitos colaterais (como buscar dados da API).
   Comunicação com a API: O arquivo src/services/orderService.ts contém as funções para interagir com a API do backend (GET, POST, PATCH).
   TailwindCSS: Utilizado para a estilização dos componentes, permitindo um desenvolvimento rápido de UI com classes utilitárias.
   Typescript: O projeto é desenvolvido em TypeScript para tipagem estática e melhor desenvolvimento.