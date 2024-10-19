using ApiAmSystem.Domain.Models.Compra.ContaPagar;
using ApiAmSystem.Domain.Models.Compra.ProdutoCompra;
using ApiAmSystem.Domain.Models.CondicaoPagamento;
using ApiAmSystem.Domain.Models.Nota;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Compra
{
    public class CompraPostRequest: NotaPostRequest
    {
       
        public int IdFornecedor { get; set; }
        public DateTime DtChegada { get; set; }
        public IEnumerable<ProdutoCompraPostRequest> Produtos { get; set; }
        public string TpFrete { get; set; }
        public decimal Frete { get; set; }
        public decimal Seguro { get; set; }
        public decimal OutrasDesp { get; set; }
        public decimal TotalCusto { get; set; }
        public IEnumerable<ContaPagarPostRequest> ContasPagar { get; set; }
    }
}
