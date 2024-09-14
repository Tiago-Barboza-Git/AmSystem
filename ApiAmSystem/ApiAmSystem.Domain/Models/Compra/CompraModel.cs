using ApiAmSystem.Domain.Models.CompraProdutos;
using ApiAmSystem.Domain.Models.CondicaoPagamento;
using ApiAmSystem.Domain.Models.ContaPagar;
using ApiAmSystem.Domain.Models.Fornecedor;
using ApiAmSystem.Domain.Models.Produto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Compra
{
    public class CompraModel: CompraModelPai
    {
        // Primeira Parte
        public DateTime DtEmissao { get; set; }
        public DateTime DtChegada { get; set; }

        // Segunda Parte
        public IEnumerable<ProdutoCompraModel> Produtos { get; set; }

        // Terceira Parte
        public string? TpFrete { get; set; }
        public decimal? Frete { get; set; }
        public decimal? Seguro { get; set; }
        public decimal? OutrasDesp { get; set; }
        public decimal TotalCusto { get; set; }
        public decimal TotalProdutos { get; set; }
        public decimal TotalCompra { get; set; }
        public DateTime? DtCancelamento { get; set; }
        public DateTime DtCadastro { get; set; }
        public int IdCondicaoPagamento { get; set; }
        public CondicaoPagamentoModel CondicaoPagamento { get; set; }
        public IEnumerable<ContaPagarModel> ContasPagar { get; set; }

        public CompraModel(): base()
        {
            this.DtEmissao = DateTime.Now;
            this.DtChegada = DateTime.Now;
            this.TpFrete = String.Empty;
            this.Frete = 0;
            this.Seguro = 0;
            this.OutrasDesp = 0;
            this.TotalCusto = 0;
            this.TotalProdutos = 0;
            this.TotalCompra = 0;
            this.DtCancelamento = null;
            this.DtCadastro = DateTime.Now;
            this.IdCondicaoPagamento = 0;
            this.CondicaoPagamento = new CondicaoPagamentoModel();
            this.ContasPagar = new List<ContaPagarModel>();
        }
    }
}
