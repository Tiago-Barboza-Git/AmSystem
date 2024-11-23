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

    public class ContaPagarAvulsaPostRequest
    {
        public int NrNota { get; set; }
        public int NrModelo { get; set; }
        public int NrSerie { get; set; }
        public int IdFornecedor { get; set; }
        public int NumParcela { get; set; }
        public decimal ValorParcela { get; set; }
        public int IdFormaPagamento { get; set; }
        public decimal Juros { get; set; }
        public decimal Desconto { get; set; }
        public decimal Multa { get; set; }
        public decimal ValorPago { get; set; }
        public DateTime DtEmissao { get; set; }
        public DateTime DtVencimento { get; set; }
        public DateTime DtPagamento { get; set; }
        public string Observacao { get; set; }
    }
}
