using ApiAmSystem.Domain.Models.Categoria;
using ApiAmSystem.Domain.Models.Fornecedor;
using ApiAmSystem.Domain.Models.UnidadeMedida;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Produto
{
    public class ProdutoModel
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
        private DateTime? DtCadastro { get; set; }
        private DateTime? DtAlteracao { get; set; }
        private UnidadeMedidaModel UnidadeMedida { get; set; }
        private CategoriaModel Categoria { get; set; }
        private FornecedorModel? Fornecedor { get; set; }

        public ProdutoModel()
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
            this.IdFornecedor = 0;
            this.DtCadastro = null;
            this.DtAlteracao = null;
        }

        public ProdutoModel(int pId, string pProduto, int? pQuantidade, decimal? pPrecoVenda, decimal? pPrecoUltCompra, DateTime? pDtUltCompra, decimal? pCustoMedio, 
            string? pObservacao, bool pAtivo, int pIdUnidadeMedida, int pIdCategoria, int? pIdFornecedor, DateTime? pDtCadastro, DateTime? pDtAlteracao)
        {
            this.Id = pId;
            this.Produto = pProduto;
            this.Quantidade = pQuantidade;
            this.PrecoVenda = pPrecoVenda;
            this.CustoMedio = pCustoMedio;
            this.PrecoUltCompra = pPrecoUltCompra;
            this.DtUltCompra =  pDtUltCompra;
            this.Observacao = pObservacao;
            this.Ativo = pAtivo;
            this.IdUnidadeMedida = pIdUnidadeMedida;
            this.IdCategoria = pIdCategoria;
            this.IdFornecedor = pIdFornecedor;
            this.DtCadastro = pDtCadastro;
            this.DtAlteracao = pDtAlteracao;
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
            get { return this.PrecoUltCompra;}
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

        public DateTime? dtCadastro
        {
            get { return this.DtCadastro; }
            set { this.DtCadastro = value; }
        }

        public DateTime? dtAlteracao
        {
            get { return this.DtAlteracao; }
            set { this.DtAlteracao = value;}
        }

        public UnidadeMedidaModel unidadeMedida
        {
            get { return this.UnidadeMedida; }
            set { this.UnidadeMedida = value; }
        }

        public CategoriaModel categoria
        {
            get { return this.Categoria; }
            set { this.Categoria = value; }
        }
        public FornecedorModel fornecedor
        {
            get { return Fornecedor; }
            set { Fornecedor = value; }
        }

    }
}
