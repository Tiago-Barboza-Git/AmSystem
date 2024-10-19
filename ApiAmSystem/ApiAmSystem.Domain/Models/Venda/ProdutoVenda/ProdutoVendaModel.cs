using ApiAmSystem.Domain.Models.Cliente;
using ApiAmSystem.Domain.Models.Nota.ProdutoNota;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Venda.ProdutoVenda
{
    public class ProdutoVendaModel: ProdutoNotaModel
    {
        public int IdCliente { get; set; }
        public ClienteModel Cliente { get; set; }
    }
}
