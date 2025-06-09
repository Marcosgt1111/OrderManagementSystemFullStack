using System.ComponentModel.DataAnnotations;

namespace OrderManagementSystem.Models
{
    public class Order
    {
        public Guid Id { get; set; }
        public DateTime DataCriacao { get; set; }
        public string Status { get; set; } = "Pendente"; // Já tem um padrão!

        public string Cliente { get; set; } = string.Empty; // Inicializa com string vazia
        public string Produto { get; set; } = string.Empty; // Inicializa com string vazia
        public int Quantidade { get; set; }
        public decimal ValorTotal { get; set; }
    }
}
