using ApiAmSystem.Domain.Models.CompraProdutos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Interfaces
{
    public interface IProdutoCompraService
    {
        IEnumerable<ProdutoCompraModel> GetProdutosCompra(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor);
    }
}
