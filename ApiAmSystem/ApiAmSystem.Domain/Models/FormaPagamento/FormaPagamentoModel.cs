using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.FormaPagamento
{
    public class FormaPagamentoModel
    {
        private int Id;
        private string FormaPagamento;
        private bool Ativo;
        private DateTime DtCadastro;
        private DateTime DtAlteracao;

        public FormaPagamentoModel()
        {
            this.Id = 0;
            this.FormaPagamento = string.Empty;
            this.Ativo = true;
            this.DtCadastro = DateTime.Now;
            this.DtAlteracao = DateTime.Now;
        }

        public FormaPagamentoModel(int pId, string pFormaPagamento, bool pAtivo, DateTime pDtCadastro, DateTime pDtAlteracao)
        {
            this.Id = pId;
            this.FormaPagamento = pFormaPagamento;
            this.Ativo = pAtivo;
            this.DtCadastro = pDtCadastro;
            this.DtAlteracao = pDtAlteracao;
        }

        public int id
        {
            get { return this.Id; }
            set { this.Id = value; }
        }

        public string formaPagamento
        {
            get { return this.FormaPagamento; }
            set { this.FormaPagamento = value;}
        }

        public bool ativo
        {
            get { return this.Ativo; }
            set { this.Ativo = value;}
        }

        public DateTime dtCadastro
        {
            get { return this.DtCadastro; }
            set { this.DtCadastro = value;}
        }

        public DateTime dtAlteracao
        {
            get { return this.DtAlteracao; }
            set { this.DtAlteracao = value; }
        }
    }
}
