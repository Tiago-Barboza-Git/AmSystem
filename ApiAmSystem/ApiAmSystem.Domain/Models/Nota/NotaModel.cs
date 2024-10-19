using ApiAmSystem.Domain.Models.Compra.ContaPagar;
using ApiAmSystem.Domain.Models.Compra.ProdutoCompra;
using ApiAmSystem.Domain.Models.CondicaoPagamento;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Nota
{
    public class NotaModel
    {
        public int NrNota { get; set; }
        public int NrModelo { get; set; }
        public int NrSerie { get; set; }
        public DateTime DtEmissao { get; set; }
        public decimal TotalProdutos { get; set; }
        public decimal TotalNota { get; set; }
        public int IdCondicaoPagamento { get; set; }
        public CondicaoPagamentoModel CondicaoPagamento { get; set; }
        public DateTime? DtCancelamento { get; set; }
        public DateTime DtCadastro { get; set; }
        public DateTime DtAlteracao { get; set; }
    }
}
