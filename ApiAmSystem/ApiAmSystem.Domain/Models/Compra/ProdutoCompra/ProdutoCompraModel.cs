using ApiAmSystem.Domain.Models.Compra;
using ApiAmSystem.Domain.Models.Fornecedor;
using ApiAmSystem.Domain.Models.Nota.ProdutoNota;
using ApiAmSystem.Domain.Models.Produto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Compra.ProdutoCompra
{
    public class ProdutoCompraModel : ProdutoNotaModel
    {
        public int IdFornecedor { get; set; }
        public decimal CustoProd { get; set; }
        public decimal CustoUnit { get; set; }
        public decimal Rateio { get; set; }
        public FornecedorModel Fornecedor { get; set; }
    }
}
