using ApiAmSystem.Domain.Models.Cidade;
using ApiAmSystem.Domain.Models.Cliente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Interfaces
{
    public interface IClientesService
    {
        ClienteModel GetCliente(int pId);
        IEnumerable<ClienteModel> GetClientes(bool pAtivo);
        string PostCliente(ClientePostRequest pCliente);
        string PutCliente(ClientePutRequest pCliente);
        string DeleteCliente(int pId);
    }
}
