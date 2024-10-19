using ApiAmSystem.Domain.Models.FormaPagamento;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Nota.ContaNota
{
    public class ContaNotaModel
    {
        public int NrNota { get; set; }
        public int NrModelo { get; set; }
        public int NrSerie { get; set; }
        public int IdFormaPagamento { get; set; }
        public FormaPagamentoModel FormaPagamento { get; set; }
        public int NumParcela { get; set; }
        public decimal ValorParcela { get; set; }
        public DateTime DtEmissao { get; set; }
        public DateTime DtVencimento { get; set; }
        public DateTime? DtPagamento { get; set; }
        public decimal Juros { get; set; }
        public decimal Multa { get; set; }
        public decimal Desconto { get; set; }
        public string Observacao { get; set; }
        public bool Cancelada { get; set; }
        public decimal ValorPago { get; set; }
        public DateTime DtCadastro { get; set; }
        public DateTime DtAlteracao { get; set; }
    }
}
