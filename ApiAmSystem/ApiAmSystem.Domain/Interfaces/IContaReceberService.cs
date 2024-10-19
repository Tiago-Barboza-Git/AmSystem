using ApiAmSystem.Domain.Models.Compra.ContaPagar;
using ApiAmSystem.Domain.Models.Venda.ContaReceber;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Interfaces
{
    public interface IContaReceberService
    {
        IEnumerable<ContaReceberModel> GetContasReceber(bool pAtivo);
        IEnumerable<ContaReceberModel> GetContasReceberByVenda(int pNrNota, int pNrModelo, int pNrSerie, int pIdCliente);
        //bool PutContaReceber(ContaPagarPutRequest pContaPagar);
    }
}
