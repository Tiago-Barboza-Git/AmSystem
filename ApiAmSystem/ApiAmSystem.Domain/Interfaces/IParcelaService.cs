using ApiAmSystem.Domain.Models.Parcela;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Interfaces
{
    public interface IParcelaService
    {
        IEnumerable<ParcelaModel> GetParcelas(int pIdCondicaoPagamento);
    }
}
