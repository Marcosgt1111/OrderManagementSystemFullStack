using Azure.Messaging.ServiceBus;
using Microsoft.Extensions.Configuration;
using System.Text.Json;
using OrderManagementSystem.Models;

namespace OrderManagementSystem.Services;

public class AzureServiceBusService
{
    private readonly ServiceBusSender _sender;
    private readonly string _queueName;

    public AzureServiceBusService(IConfiguration configuration)
    {
        string connectionString = configuration.GetConnectionString("AzureServiceBusConnection")
                                  ?? throw new ArgumentNullException("AzureServiceBusConnection não encontrado nas ConnectionStrings.");
        _queueName = configuration["ServiceBus:QueueName"]
                     ?? throw new ArgumentNullException("ServiceBus:QueueName não encontrado na seção ServiceBus.");

        var client = new ServiceBusClient(connectionString);
        _sender = client.CreateSender(_queueName);
    }

    public async Task SendOrderCreatedMessage(Order order)
    {
        string messageBody = JsonSerializer.Serialize(order);
        var message = new ServiceBusMessage(messageBody);

        message.ApplicationProperties.Add("MessageType", "OrderCreated");
        message.ApplicationProperties.Add("OrderId", order.Id.ToString());

        await _sender.SendMessageAsync(message);

        Console.WriteLine($"[ServiceBus] Pedido {order.Id} enviado para a fila {_queueName}.");
    }
}