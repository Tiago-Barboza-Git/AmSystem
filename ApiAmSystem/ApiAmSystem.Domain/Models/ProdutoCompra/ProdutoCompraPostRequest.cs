using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.ProdutoCompra
{
    public class ProdutoCompraPostRequest
    {
        public int IdProduto { get; set; }
        public int Quantidade { get; set; }
        public decimal PrecoUnit { get; set; }
        public decimal PrecoTotal { get; set; }
        public decimal CustoProd { get; set; }
        public decimal CustoUnit { get; set; }
        public decimal Rateio { get; set; }
        public ProdutoCompraPostRequest()
        {
            this.IdProduto = 0;
            this.Quantidade = 0;
            this.PrecoUnit = 0;
            this.PrecoTotal = 0;
            this.CustoProd = 0;
            this.CustoUnit = 0;
            this.Rateio = 0;
        }
    }
}
