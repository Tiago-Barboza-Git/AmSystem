using ApiAmSystem.Domain.Models.Cliente;
using ApiAmSystem.Domain.Models.Fornecedor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Interfaces
{
    public interface IFornecedoresService
    {
        FornecedorModel GetFornecedor(int pId);
        IEnumerable<FornecedorModel> GetFornecedores(bool pAtivo);
        string PostFornecedor(FornecedorPostRequest pFornecedor);
        string PutFornecedor(FornecedorPutRequest pFornecedor);
        string DeleteFornecedor(int pId);
    }
}
