using ApiAmSystem.Domain.Models.Nota.ProdutoNota;
using ApiAmSystem.Domain.Models.Produto;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Compra.ProdutoCompra
{
    public class ProdutoCompraPostRequest: ProdutoNotaPostRequest
    {
        public decimal CustoProd { get; set; }
        public decimal CustoUnit { get; set; }
        public decimal Rateio { get; set; }
        public decimal Desconto { get; set; }
    }
}
