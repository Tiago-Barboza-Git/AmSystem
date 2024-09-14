using ApiAmSystem.Domain.Models.Compra;
using ApiAmSystem.Domain.Models.Produto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.CompraProdutos
{
    public class ProdutoCompraModel : CompraModelPai
    {
        public int IdProduto { get; set; }
        public int Quantidade { get; set; }
        public decimal PrecoUnit { get; set; }
        public decimal PrecoTotal { get; set; }
        public decimal CustoProd { get; set; }
        public decimal CustoUnit { get; set; }
        public decimal Rateio { get; set; }
        public ProdutoModel Produto { get; set; }
        public ProdutoCompraModel() : base()
        {
            this.IdProduto = 0;
            this.Quantidade = 0;
            this.PrecoUnit = 0;
            this.PrecoTotal = 0;
            this.CustoProd = 0;
            this.CustoUnit = 0;
            this.Rateio = 0;
            this.Produto = new ProdutoModel();
        }
    }
}
