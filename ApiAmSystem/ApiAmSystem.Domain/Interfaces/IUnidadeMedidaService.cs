using ApiAmSystem.Domain.Models.UnidadeMedida;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Interfaces
{
    public interface IUnidadeMedidaService
    {
        IEnumerable<UnidadeMedidaModel> GetUnidadesMedidas(bool pAtivo);
        string PostUnidadeMedida(UnidadeMedidaPostRequest pUnidadeMedida);
        string PutUnidadeMedida(UnidadeMedidaPutRequest pUnidadeMedida);
        string DeleteUnidadeMedida(int pId);
    }
}
