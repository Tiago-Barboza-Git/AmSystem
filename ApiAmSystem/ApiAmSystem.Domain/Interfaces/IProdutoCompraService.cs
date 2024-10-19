using ApiAmSystem.Domain.Models.Compra.ProdutoCompra;
using Microsoft.Data.SqlClient;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Interfaces
{
    public interface IProdutoCompraService
    {
        IEnumerable<ProdutoCompraModel> GetProdutosCompraByCompra(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor);
    }
}
