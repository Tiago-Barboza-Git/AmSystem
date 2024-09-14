using ApiAmSystem.Domain.Models.ContaPagar;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Interfaces
{
    public interface IContaPagarService
    {
        IEnumerable<ContaPagarModel> GetContasPagar(bool pAtivo);
        IEnumerable<ContaPagarModel> GetContasPagarByCompra(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor);
    }
}
