using Azure.Messaging.ServiceBus;
using Microsoft.EntityFrameworkCore;
using OrderManagementSystem.Data;
using OrderManagementSystem.Models;
using System.Text.Json;
using Microsoft.Extensions.Hosting; // Para BackgroundService
using Microsoft.Extensions.Logging; // Para ILogger
using Microsoft.Extensions.DependencyInjection; // Para IServiceScopeFactory

namespace OrderManagementSystem.Workers;

public class OrderProcessingWorker : BackgroundService
{
    private readonly ILogger<OrderProcessingWorker> _logger;
    private readonly ServiceBusProcessor _processor;
    private readonly IServiceScopeFactory _scopeFactory;

    public OrderProcessingWorker(
        IConfiguration configuration,
        ILogger<OrderProcessingWorker> logger,
        IServiceScopeFactory scopeFactory)
    {
        _logger = logger;
        _scopeFactory = scopeFactory;

        string connectionString = configuration.GetConnectionString("AzureServiceBusConnection")
                                  ?? throw new ArgumentNullException("AzureServiceBusConnection não encontrado nas ConnectionStrings.");
        string queueName = configuration["ServiceBus:QueueName"]
                           ?? throw new ArgumentNullException("ServiceBus:QueueName não encontrado na seção ServiceBus.");

        var client = new ServiceBusClient(connectionString);
        _processor = client.CreateProcessor(queueName, new ServiceBusProcessorOptions());

        _processor.ProcessMessageAsync += ProcessMessagesAsync;
        _processor.ProcessErrorAsync += ProcessErrorAsync;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("OrderProcessingWorker iniciado.");

        // Inicia o processador de mensagens
        await _processor.StartProcessingAsync(stoppingToken);

        // Mantém o worker rodando enquanto a aplicação não é desligada
        // Se o token de cancelamento for ativado, esta linha vai disparar uma OperationCanceledException
        try
        {
            await Task.Delay(Timeout.Infinite, stoppingToken);
        }
        catch (OperationCanceledException)
        {
            _logger.LogInformation("OrderProcessingWorker recebeu solicitação de parada.");
        }
        finally
        {
            await _processor.StopProcessingAsync();
            _logger.LogInformation("OrderProcessingWorker finalizado.");
        }
    }

    private async Task ProcessMessagesAsync(ProcessMessageEventArgs args)
    {
        string messageBody = args.Message.Body.ToString();
        _logger.LogInformation($"[Worker] Mensagem recebida: {messageBody}");

        Order? order = null;
        try
        {
            order = JsonSerializer.Deserialize<Order>(messageBody);
        }
        catch (JsonException ex)
        {
            _logger.LogError($"[Worker] Erro ao desserializar mensagem: {ex.Message}. Mensagem original: {messageBody}");
            // Se a mensagem não puder ser desserializada, complete-a para evitar reprocessamento infinito.
            // Em um cenário real, você pode querer enviá-la para uma fila de dead-letter.
            await args.CompleteMessageAsync(args.Message);
            return;
        }

        if (order == null)
        {
            // Passa o corpo da mensagem como argumento para o placeholder {messageBody}
            _logger.LogWarning("[Worker] Pedido desserializado é nulo. Mensagem original: {messageBody}", args.Message.Body);
            await args.CompleteMessageAsync(args.Message);
            return;
        }

        // Usamos IServiceScopeFactory para criar um escopo para o DbContext
        // Isso é necessário porque DbContext é Scoped e o worker é Singleton.
        using (var scope = _scopeFactory.CreateScope())
        {
            var dbContext = scope.ServiceProvider.GetRequiredService<OrderContext>();

            _logger.LogInformation($"[Worker] Processando pedido {order.Id} (Status atual: {order.Status}).");

            try
            {
                // Buscar o pedido mais recente do DB
                var existingOrder = await dbContext.Orders.FindAsync(order.Id);

                if (existingOrder != null)
                {
                    // 1. Atualizar status para "Processando"
                    existingOrder.Status = "Processando";
                    await dbContext.SaveChangesAsync();
                    _logger.LogInformation($"[Worker] Pedido {order.Id} atualizado para 'Processando'.");

                    // 2. Simular processamento (esperar 5 segundos)
                    await Task.Delay(TimeSpan.FromSeconds(5));

                    // 3. Atualizar status para "Finalizado"
                    existingOrder.Status = "Finalizado";
                    await dbContext.SaveChangesAsync();
                    _logger.LogInformation($"[Worker] Pedido {order.Id} atualizado para 'Finalizado'.");
                }
                else
                {
                    _logger.LogWarning($"[Worker] Pedido {order.Id} não encontrado no banco de dados para atualização.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"[Worker] Erro ao processar ou atualizar pedido {order.Id}.");
                // Nack a mensagem (abandonar) para que ela retorne à fila,
                // ou envie para dead-letter queue após várias tentativas.
                await args.AbandonMessageAsync(args.Message);
                return; // Retorna para não completar a mensagem
            }
        }

        // Marcar a mensagem como completa para removê-la da fila
        await args.CompleteMessageAsync(args.Message);
    }

    private Task ProcessErrorAsync(ProcessErrorEventArgs args)
    {
        _logger.LogError(args.Exception, $"[Worker] Erro no processamento de mensagem: Origem: {args.FullyQualifiedNamespace}, Entidade: {args.EntityPath}");
        return Task.CompletedTask;
    }

    public override async Task StopAsync(CancellationToken stoppingToken)
    {
        // O StopProcessingAsync() já é chamado no bloco finally de ExecuteAsync,
        // mas ter uma chamada explícita aqui para robustez não faz mal.
        if (_processor.IsProcessing)
        {
             await _processor.StopProcessingAsync();
        }
        _logger.LogInformation("OrderProcessingWorker parando via StopAsync.");
        await base.StopAsync(stoppingToken);
    }
}