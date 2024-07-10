using ApiAmSystem.Domain.Models.Cidade;
using ApiAmSystem.Domain.Models.FormaPagamento;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Interfaces
{
    public interface IFormasPagamentosService
    {
        FormaPagamentoModel GetFormaPagamento(int pId);
        IEnumerable<FormaPagamentoModel> GetFormasPagamentos(bool pAtivo);
        string PostFormaPagamento(FormaPagamentoPostRequest pFormaPagamento);
        string PutFormaPagamento(FormaPagamentoPutRequest pFormaPagamento);
        string DeleteFormaPagamento(int pId);
    }
}
