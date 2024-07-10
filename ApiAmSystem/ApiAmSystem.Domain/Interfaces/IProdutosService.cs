using ApiAmSystem.Domain.Models.Produto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Interfaces
{
    public interface IProdutosService
    {
        ProdutoModel GetProduto(int id);
        IEnumerable<ProdutoModel> GetProdutos(bool pAtivos);
        string PostProduto(ProdutoPostRequest pProduto);
        string PutProduto(ProdutoPutRequest pProduto);
        string DeleteProduto(int id);
    }
}
