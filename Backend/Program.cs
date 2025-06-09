using OrderManagementSystem.Data;
using OrderManagementSystem.Routes;
using OrderManagementSystem.Services;
using OrderManagementSystem.Workers;
using Microsoft.AspNetCore.Builder; // Certifique-se de que este using está presente
using Microsoft.Extensions.DependencyInjection; // Certifique-se de que este using está presente

var builder = WebApplication.CreateBuilder(args); // ESTA LINHA DEVE VIR PRIMEIRO!

// Adicione a configuração CORS AQUI (DEPOIS de 'var builder = WebApplication.CreateBuilder(args);')
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
        {
            policy.WithOrigins("http://localhost:5173", "https://localhost:5173") // O endereço do seu frontend React
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddScoped<OrderContext>();
builder.Services.AddSingleton<AzureServiceBusService>();
builder.Services.AddHostedService<OrderProcessingWorker>();

var app = builder.Build();

// Configure o pipeline de requisições HTTP.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwaggerUI(options =>
        options.SwaggerEndpoint("/openapi/v1.json", "OrderManagementSystem"));
}

// Habilite o uso de CORS AQUI (depois de app.Build() e antes de UseHttpsRedirection ou MapRoutes)
app.UseCors(); // Isso usa a política padrão que você definiu acima

app.UseHttpsRedirection();
OrderRoute.MapRoutes(app);

app.Run();
