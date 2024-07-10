using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.FormaPagamento
{
    public class FormaPagamentoPutRequest
    {
        private int Id;
        private string FormaPagamento;
        private bool Ativo;

        public FormaPagamentoPutRequest()
        {
            this.Id = 0;
            this.FormaPagamento = string.Empty;
            this.Ativo = true;
        }

        public FormaPagamentoPutRequest(int pId, string pFormaPagamento, bool pAtivo)
        {
            this.Id = pId;
            this.FormaPagamento = pFormaPagamento;
            this.Ativo = pAtivo;
        }

        public int id
        {
            get { return this.Id; }
            set { this.Id = value; }
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
