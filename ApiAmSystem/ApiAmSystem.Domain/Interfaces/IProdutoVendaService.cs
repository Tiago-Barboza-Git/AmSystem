using ApiAmSystem.Domain.Models.Compra.ProdutoCompra;
using ApiAmSystem.Domain.Models.Venda.ProdutoVenda;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Interfaces
{
    public interface IProdutoVendaService
    {
        IEnumerable<ProdutoVendaModel> GetProdutosVendaByVenda(int pNrNota, int pNrModelo, int pNrSerie, int pIdCliente);

    }
}
