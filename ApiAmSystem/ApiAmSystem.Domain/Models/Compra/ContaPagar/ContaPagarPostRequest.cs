using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Compra.ContaPagar
{
    public class ContaPagarPostRequest
    {
        public int IdFormaPagamento { get; set; }
        public int NumParcela { get; set; }
        public decimal ValorParcela { get; set; }
        public DateTime DtVencimento { get; set; }
    }
}
