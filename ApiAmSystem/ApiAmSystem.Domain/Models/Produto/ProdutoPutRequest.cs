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
    }
}
