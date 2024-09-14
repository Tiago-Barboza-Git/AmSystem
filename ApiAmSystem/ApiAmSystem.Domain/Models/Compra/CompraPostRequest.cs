using ApiAmSystem.Domain.Models.CompraProdutos;
using ApiAmSystem.Domain.Models.CondicaoPagamento;
using ApiAmSystem.Domain.Models.ProdutoCompra;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Compra
{
    public class CompraPostRequest
    {
        public int NrNota { get; set; }
        public int NrModelo { get; set; }
        public int NrSerie { get; set; }
        public int IdFornecedor { get; set; }
        public DateTime DtEmissao { get; set; }
        public DateTime DtChegada { get; set; }
        public IEnumerable<ProdutoCompraPostRequest> Produtos { get; set; }
        public string TpFrete { get; set; }
        public decimal Frete { get; set; }
        public decimal Seguro { get; set; }
        public decimal OutrasDesp { get; set; }
        public decimal TotalCusto { get; set; }
        public decimal TotalProdutos { get; set; }
        public decimal TotalCompra { get; set; }
        public int IdCondicaoPagamento { get; set; }
        public CompraPostRequest()
        {
            this.NrNota = 0;
            this.NrModelo = 0;
            this.NrSerie = 0;
            this.IdFornecedor = 0;
            this.DtEmissao = DateTime.Now;
            this.DtChegada = DateTime.Now;
            this.Produtos = new List<ProdutoCompraPostRequest>();
            this.TpFrete = String.Empty;
            this.Frete = 0;
            this.Seguro = 0;
            this.OutrasDesp = 0;
            this.TotalCusto = 0;
            this.TotalProdutos = 0;
            this.TotalCompra = 0;
            this.IdCondicaoPagamento = 0;
        }
    }
}
