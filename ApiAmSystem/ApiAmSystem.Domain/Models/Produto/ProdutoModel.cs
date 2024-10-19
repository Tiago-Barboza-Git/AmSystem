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
        public int Id { get; set; }
        public string Produto { get; set; }
        public int? Quantidade { get; set; }
        public decimal? PrecoVenda { get; set; }
        public decimal? PrecoUltCompra { get; set; }
        public DateTime? DtUltCompra { get; set; }
        public decimal? CustoMedio { get; set; }
        public decimal Desconto { get; set; }
        public string? Observacao { get; set; }
        public bool Ativo { get; set; }
        public int? IdFornecedor { get; set; }
        public int IdUnidadeMedida { get; set; }
        public int IdCategoria { get; set; }
        public DateTime? DtCadastro { get; set; }
        public DateTime? DtAlteracao { get; set; }
        public UnidadeMedidaModel UnidadeMedida { get; set; }
        public CategoriaModel Categoria { get; set; }
        public FornecedorModel? Fornecedor { get; set; }

    }
}
