using ApiAmSystem.Domain.Models.Compra;
using ApiAmSystem.Domain.Models.FormaPagamento;
using ApiAmSystem.Domain.Models.Fornecedor;
using Microsoft.Data.SqlClient.DataClassification;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.ContaPagar
{
    public class ContaPagarModel : CompraModelPai
    {
        public int IdFormaPagamento { get; set; }
        public int NumParcela { get; set; }
        public decimal ValorParcela { get; set; }
        public DateTime DtEmissao { get; set; }
        public DateTime DtVencimento { get; set; }
        public DateTime? DtPagamento { get; set; }
        public decimal Juros { get; set; }
        public decimal Multa { get; set; }
        public decimal Desconto { get; set; }
        public decimal ValorPago { get; set; }
        public bool Ativo { get; set; }
        public DateTime DtCadastro { get; set; }
        public DateTime DtAlteracao { get; set; }
        public FormaPagamentoModel FormaPagamento { get; set; }

        public ContaPagarModel(): base()
        {
            this.IdFormaPagamento = 0;
            this.NumParcela = 0;
            this.ValorParcela = 0;
            this.DtEmissao = DateTime.Now;
            this.DtVencimento = DateTime.Now;
            this.DtPagamento = DateTime.Now;
            this.Juros = 0;
            this.Multa = 0;
            this.Desconto = 0;
            this.ValorPago = 0;
            this.Ativo = true;
            this.DtCadastro = DateTime.Now;
            this.DtAlteracao = DateTime.Now;
            this.FormaPagamento = new FormaPagamentoModel();
        }
    }
}
