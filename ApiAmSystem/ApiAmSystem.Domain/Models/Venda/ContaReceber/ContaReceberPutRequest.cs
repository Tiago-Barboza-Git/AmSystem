using ApiAmSystem.Domain.Models.Compra.ContaPagar;
using ApiAmSystem.Domain.Models.Compra.ProdutoCompra;
using ApiAmSystem.Domain.Models.Nota.ContaNota;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Venda.ContaReceber
{
    public class ContaReceberPutRequest: ContaNotaPutRequest
    {
        public int IdCliente { get; set; }
    }
}
