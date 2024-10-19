using ApiAmSystem.Domain.Models.Compra.ContaPagar;
using ApiAmSystem.Domain.Models.Compra.ProdutoCompra;
using ApiAmSystem.Domain.Models.Nota;
using ApiAmSystem.Domain.Models.Venda.ContaReceber;
using ApiAmSystem.Domain.Models.Venda.ProdutoVenda;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Venda
{
    public class VendaPostRequest: NotaPostRequest
    {
        public int IdCliente { get; set; }
        public IEnumerable<ProdutoVendaPostRequest> Produtos { get; set; }
        public IEnumerable<ContaReceberPostRequest> ContasReceber { get; set; }
    }
}
