using ApiAmSystem.Domain.Models.Fornecedor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Produto
{
    public class ProdutoPutRequest
    {
        private int Id { get; set; }
        private string Produto { get; set; }
        private int? Quantidade { get; set; }
        private decimal? PrecoVenda { get; set; }
        private decimal? PrecoUltCompra { get; set; }
        private DateTime? DtUltCompra { get; set; }
        private decimal? CustoMedio { get; set; }
        private string? Observacao { get; set; }
        private bool Ativo { get; set; }
        private int? IdFornecedor { get; set; }
        private int IdUnidadeMedida { get; set; }
        private int IdCategoria { get; set; }

        public ProdutoPutRequest()
        {
            this.Id = 0;
            this.Produto = string.Empty;
            this.Quantidade = 0;
            this.PrecoVenda = 0;
            this.CustoMedio = 0;
            this.PrecoUltCompra = 0;
            this.DtUltCompra = null;
            this.Observacao = string.Empty;
            this.Ativo = true;
            this.IdUnidadeMedida = 0;
            this.IdCategoria = 0;
            this.IdFornecedor = null;
        }

        public ProdutoPutRequest(int pId, string pProduto, int? pQuantidade, decimal? pPrecoVenda, decimal? pPrecoUltCompra, DateTime? pDtUltCompra, decimal? pCustoMedio,
            string? pObservacao, bool pAtivo, int pIdUnidadeMedida, int pIdCategoria, int? pIdFornecedor)
        {
            this.Id = pId;
            this.Produto = pProduto;
            this.Quantidade = pQuantidade;
            this.PrecoVenda = pPrecoVenda;
            this.CustoMedio = pCustoMedio;
            this.PrecoUltCompra = pPrecoUltCompra;
            this.DtUltCompra = pDtUltCompra;
            this.Observacao = pObservacao;
            this.Ativo = pAtivo;
            this.IdUnidadeMedida = pIdUnidadeMedida;
            this.IdCategoria = pIdCategoria;
            this.IdFornecedor = pIdFornecedor;
        }

        public int id
        {
            get { return this.Id; }
            set { this.Id = value; }
        }

        public string produto
        {
            get { return this.Produto; }
            set { this.Produto = value; }
        }

        public int? quantidade
        {
            get { return this.Quantidade; }
            set { this.Quantidade = value; }
        }

        public decimal? precoVenda
        {
            get { return this.PrecoVenda; }
            set { this.PrecoVenda = value; }
        }


        public decimal? precoUltCompra
        {
            get { return this.PrecoUltCompra; }
            set { this.PrecoUltCompra = value; }
        }

        public DateTime? dtUltCompra
        {
            get { return this.DtUltCompra; }
            set { this.DtUltCompra = value; }
        }

        public decimal? custoMedio
        {
            get { return this.CustoMedio; }
            set { this.CustoMedio = value; }
        }

        public string? observacao
        {
            get { return this.Observacao; }
            set { this.Observacao = value; }
        }

        public bool ativo
        {
            get { return this.Ativo; }
            set { this.Ativo = value; }
        }

        public int idUnidadeMedida
        {
            get { return this.IdUnidadeMedida; }
            set { this.IdUnidadeMedida = value; }
        }

        public int idCategoria
        {
            get { return this.IdCategoria; }
            set { this.IdCategoria = value; }
        }

        public int? idFornecedor
        {
            get { return this.IdFornecedor; }
            set { this.IdFornecedor = value; }
        }
    }
}
