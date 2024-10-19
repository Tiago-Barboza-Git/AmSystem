using ApiAmSystem.Domain.Models.Compra;
using ApiAmSystem.Domain.Models.CondicaoPagamento;
using ApiAmSystem.Domain.Models.FormaPagamento;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Compra.ContaPagar
{
    public class ContaPagarPutRequest
    {
        public int NrNota { get; set; }
        public int NrModelo { get; set; }
        public int NrSerie { get; set; }
        public int IdFornecedor { get; set; }
        public int IdFormaPagamento { get; set; }
        public int NumParcela { get; set; }
        public decimal ValorParcela { get; set; }
        public DateTime? DtPagamento { get; set; }
        public decimal Juros { get; set; }
        public decimal Multa { get; set; }
        public decimal Desconto { get; set; }
        public decimal ValorPago { get; set; }
        public string Observacao { get; set; }

        public ContaPagarPutRequest() : base()
        {
            IdFormaPagamento = 0;
            NumParcela = 0;
            ValorParcela = 0;
            DtPagamento = DateTime.Now;
            Juros = 0;
            Multa = 0;
            Desconto = 0;
            ValorPago = 0;
        }
    }
}
