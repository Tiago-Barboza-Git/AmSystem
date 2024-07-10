using ApiAmSystem.Domain.Models.CondicaoPagamento;
using ApiAmSystem.Domain.Models.FormaPagamento;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Interfaces
{
    public interface ICondicaoPagamentoService
    {
        CondicaoPagamentoModel GetCondicaoPagamento(int pId);
        IEnumerable<CondicaoPagamentoModel> GetCondicoesPagamentos(bool pAtivo);
        string PostCondicaoPagamento(CondicaoPagamentoPostRequest pCondicaoPagamento);
        string PutCondicaoPagamento(CondicaoPagamentoPutRequest pCondicaoPagamento);
        string DeleteCondicaoPagamento(int pId);
    }
}
