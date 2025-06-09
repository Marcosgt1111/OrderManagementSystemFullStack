using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using OrderManagementSystem.Models;
using OrderManagementSystem.Data;
using OrderManagementSystem.Services;
using Microsoft.AspNetCore.Http.Metadata;
using Microsoft.AspNetCore.Mvc;

namespace OrderManagementSystem.Routes;

public static class OrderRoute
{
    public static void MapRoutes(WebApplication app)
    {
        app.MapPost("/orders", async (Order order, OrderContext db, AzureServiceBusService serviceBus) =>
        {
            order.Id = Guid.NewGuid();
            order.DataCriacao = DateTime.UtcNow;
            order.Status = "Pendente";

            db.Orders.Add(order);
            await db.SaveChangesAsync();
            
            // Adicionando o Azure service bus
            await serviceBus.SendOrderCreatedMessage(order);

            return Results.Created($"/orders/{order.Id}", order);
        });

        app.MapGet("/orders", async (OrderContext db) =>
        {
            var orders = await db.Orders.ToListAsync();
            return Results.Ok(orders);
        });

        app.MapGet("/orders/{id}", async (Guid id, OrderContext db) =>
        {
            var order = await db.Orders.FindAsync(id);
            return order != null ? Results.Ok(order) : Results.NotFound();
        });

		app.MapPatch("/orders/{id}/status", async (Guid id, [FromBody] StatusUpdateRequest request, OrderContext db, AzureServiceBusService serviceBus) =>
            {
                var order = await db.Orders.FindAsync(id);
                if (order == null)
                {
                    return Results.NotFound();
                }

                // Validação básica do novo status (opcional, mas recomendado)
                var allowedStatuses = new[] { "Pendente", "Processando", "Finalizado" };
                if (!allowedStatuses.Contains(request.Status))
                {
                    return Results.BadRequest("Status inválido.");
                }

                order.Status = request.Status;
                await db.SaveChangesAsync();

                // Opcional: Envie uma mensagem para o Service Bus sobre a atualização de status
                // await serviceBus.SendMessageAsync(order);

                return Results.Ok(order);
            });
		}
		public class StatusUpdateRequest
    	{	
        	public required string Status { get; set; }
    	}
}