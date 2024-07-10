using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.FormaPagamento
{
    public class FormaPagamentoPostRequest
    {
        private string FormaPagamento;
        private bool Ativo;

        public FormaPagamentoPostRequest()
        {
            this.FormaPagamento = string.Empty;
            this.Ativo = true;
        }

        public FormaPagamentoPostRequest(string pFormaPagamento, bool pAtivo)
        {
            this.FormaPagamento = pFormaPagamento;
            this.Ativo = pAtivo;
        }

        public string formaPagamento
        {
            get { return this.FormaPagamento; }
            set { this.FormaPagamento = value; }
        }

        public bool ativo
        {
            get { return this.Ativo; }
            set { this.Ativo = value; }
        }
    }
}
