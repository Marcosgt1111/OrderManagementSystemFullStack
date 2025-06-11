# Order Management System - Fullstack

Este é um sistema de gerenciamento de pedidos fullstack, composto por um backend em .NET (ASP.NET Core) e um frontend em ReactJs. O objetivo é demonstrar a comunicação entre as duas camadas e o gerenciamento de pedidos.

---

![foto1](https://raw.githubusercontent.com/Marcosgt1111/OrderManagementSystemFullStack/refs/heads/main/imagens/api_de_Orden_Get.png)


![foto2](https://raw.githubusercontent.com/Marcosgt1111/OrderManagementSystemFullStack/refs/heads/main/imagens/frontparte2.png)



## 🚀 Tecnologias Utilizadas

### Backend (ASP.NET Core)

* **Linguagem:** C#
* **Framework:** .NET [Versão do .NET, ex: 9.0] (ASP.NET Core Web API)
* **Mensageria:** Azure Service Bus (utilizado para processamento assíncrono de pedidos)
* **Outros: Entity Framework Core para ORM, Serilog para logging, etc.]

### Frontend React

* **Linguagem:** JavaScript / TypeScript
* **Framework/Biblioteca: React]
* **Gerenciador de Pacotes:** npm / Yarn
* **Outros:** [Liste outras bibliotecas ou tecnologias importantes, ex: Axios para requisições HTTP, Redux/Zustand para gerenciamento de estado, Material-UI/Tailwind CSS para UI, etc.]

---

## 📁 Estrutura do Projeto

O repositório está organizado em duas pastas principais:

* `backend/`: Contém todo o código-fonte do projeto ASP.NET Core Web API.
* `frontend/`: Contém todo o código-fonte do projeto do lado do cliente.

OrderManagementSystemFullStack/
├── backend/
│   ├── OrderManagementSystem.csproj
│   ├── appsettings.json
│   ├── Program.cs
│   ├── Routes/
│   ├── Workers/
│   └── ...
├── frontend/
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── ...
├── .gitignore
├── README.md


---

## ⚙️ Configuração (Setup)

Siga os passos abaixo para configurar e executar o projeto em sua máquina local.

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas:

* **.NET SDK:** Versão [Ex: 9.0 ou superior]. Baixe em [dotnet.microsoft.com](https://dotnet.microsoft.com/download).
* **Node.js & npm/Yarn:** Versão LTS recomendada. Baixe em [nodejs.org](https://nodejs.org/en/download/).
* **Git:** Para clonar o repositório.
* **Um editor de código:** Visual Studio Code, Visual Studio, JetBrains Rider, etc.

### 1. Clonar o Repositório

Primeiro, clone o repositório para sua máquina local:

```bash
git clone [https://github.com/Marcosgt1111/OrderManagementSystemFullStack.git](https://github.com/Marcosgt1111/OrderManagementSystemFullStack.git)
cd OrderManagementSystemFullStack
2. Configuração do Backend
Navegue até a pasta do backend:

Bash

cd backend
Configurações do appsettings.json:
O backend utiliza o Azure Service Bus para processamento de mensagens. Você precisará configurar a string de conexão.

Abra o arquivo appsettings.json (ou appsettings.Development.json se você estiver usando este para configurações locais) no diretório backend/.
Localize a seção AzureServiceBus e preencha a ConnectionString com sua chave de acesso.
JSON

{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*",
  "AzureServiceBus": {
    "ConnectionString": "YOUR_AZURE_SERVICE_BUS_CONNECTION_STRING_HERE" // <-- SUBSTITUA ESTA LINHA
  }
}
ATENÇÃO: Nunca commite segredos ou chaves de produção diretamente no repositório. Para ambientes de produção, use variáveis de ambiente ou serviços de gerenciamento de segredos (Azure Key Vault, etc.). Para desenvolvimento, você pode usar User Secrets ou appsettings.Development.json ignorado pelo .gitignore.
Restaurar dependências e compilar:

Bash

dotnet restore
dotnet build
3. Configuração do Frontend
Navegue até a pasta do frontend:

Bash

cd ../frontend # Ou use o caminho completo se preferir
Instalar dependências:

Bash

npm install # Ou yarn install se preferir Yarn
Configurar Variáveis de Ambiente do Frontend (se aplicável):
Se o seu frontend precisa saber a URL do backend (por exemplo, http://localhost:5010), você pode precisar criar um arquivo de ambiente (como .env para React/Vite/Next.js) ou configurar no código.

Exemplo para React com Vite/Create React App:
Crie um arquivo .env na raiz da pasta frontend/ e adicione:

VITE_API_URL=http://localhost:5010 # Para Vite
# ou
REACT_APP_API_URL=http://localhost:5010 # Para Create React App
A porta 5010 deve ser a porta em que seu backend ASP.NET Core está configurado para rodar.

▶️ Execução do Projeto
Para executar o sistema completo, você precisará iniciar o backend e o frontend separadamente.

1. Iniciar o Backend
Abra um terminal e navegue até a pasta backend/.
Execute o comando para iniciar a API:
Bash

dotnet run
O backend será iniciado, geralmente na porta 5010 (HTTP) ou 7010 (HTTPS) por padrão (verifique o console para a URL exata).
2. Iniciar o Frontend
Abra outro terminal (mantenha o terminal do backend rodando) e navegue até a pasta frontend/.

Execute o comando para iniciar a aplicação frontend:

Bash

npm start # Para Create React App
# ou
npm run dev # Para Vite/Next.js
# ou
ng serve # Para Angular
# ou
npm run serve # Para Vue.js
O frontend será iniciado, geralmente na porta 3000, 5173, etc. (verifique o console para a URL exata).

Abra seu navegador e acesse a URL do frontend (ex: http://localhost:3000).

🛠️ Detalhes Técnicos e Fluxo de Trabalho
Backend (ASP.NET Core)
API RESTful: O backend expõe endpoints RESTful para gerenciar pedidos (criar, ler, atualizar, excluir).
Comunicação com Azure Service Bus: O OrderProcessingWorker.cs é um serviço de background que consome mensagens de uma fila do Azure Service Bus. Quando um pedido é criado/atualizado, uma mensagem é enviada para essa fila para processamento assíncrono, garantindo que operações demoradas não bloqueiem a resposta da API.
Atributo [FromBody]: Utilizado em endpoints da API para indicar que os dados do corpo da requisição HTTP devem ser desserializados para um objeto C#. (Este foi o erro CS0246 resolvido).
Logging (ILogger): Utiliza o sistema de logging do .NET Core para registrar informações, avisos e erros. O aviso CA2017 foi corrigido para garantir que as mensagens de log correspondam aos parâmetros fornecidos.
Frontend React
Requisições HTTP: Faz requisições para os endpoints da API do backend para interagir com os dados dos pedidos.
Componentização React reutilizáveis", "usa rotas para navegação entre páginas", "gerenciamento de estado com Context API/Redux/Zustand"].
Tratamento de Erros: Exibe mensagens de erro amigáveis ao usuário em caso de falha na comunicação com o backend (como o ERR_CONNECTION_REFUSED que foi resolvido).
Fluxo de um Pedido
O usuário interage com o frontend para [criar/editar/visualizar] um pedido.
O frontend envia uma requisição HTTP para o backend.
O backend recebe a requisição, processa-a (validação, persistência, etc.).
Para operações que exigem processamento assíncrono (ex: notificação, validação complexa), o backend envia uma mensagem para uma fila no Azure Service Bus.
O OrderProcessingWorker no backend consome essa mensagem da fila e realiza as ações necessárias em segundo plano.
O backend retorna uma resposta ao frontend.
O frontend atualiza a interface do usuário com base na resposta.
🤝 Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues para reportar bugs, sugerir melhorias ou enviar Pull Requests.

**Lembre-se de substituir os seguintes placeholders:**

* `[Nome da Tecnologia do Frontend, ex: React, Angular, Vue.js]`
* `[Versão do .NET, ex: 9.0]`
* `[Liste outras bibliotecas ou tecnologias importantes, ex: Entity Framework Core para ORM, Serilog para logging, etc.]`
* `[Nome da Tecnologia, ex: React]`
* `[Liste outras bibliotecas ou tecnologias importantes, ex: Axios para requisições HTTP, Redux/Zustand para gerenciamento de estado, Material-UI/Tailwind CSS para UI, etc.]`
* `YOUR_AZURE_SERVICE_BUS_CONNECTION_STRING_HERE` (no `appsettings.json` exemplo)
* `http://localhost:5010` (no `.env` exemplo, se a porta do seu backend for diferente)
* Comandos `npm start`, `npm run dev`, `ng serve`, `npm run serve` (ajuste para o seu frontend específico)
* `[Descreva brevemente como o frontend está estruturado...]`
* `[Nome da Licença, ex: MIT License]`

Este `README.md` oferece um guia completo para qualquer pessoa que queira entender
