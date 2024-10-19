using ApiAmSystem.Domain.Models.Parcela;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.CondicaoPagamento
{
    public class CondicaoPagamentoModel
    {
        private int Id;
        private string CondicaoPagamento;
        private decimal Desconto;
        private decimal Juros;
        private decimal Multa;
        private bool Ativo;
        private DateTime DtCadastro;
        private DateTime DtAlteracao;
        private IEnumerable<ParcelaModel> Parcelas;

        public CondicaoPagamentoModel()
        {
            this.Id = 0;
            this.CondicaoPagamento = string.Empty;
            this.Desconto = 0;
            this.Juros = 0;
            this.Multa = 0;
            this.Ativo = true;
            this.DtCadastro = DateTime.Now;
            this.DtAlteracao = DateTime.Now;
            this.Parcelas = new List<ParcelaModel>();
        }

        public CondicaoPagamentoModel(int pId, string pCondicaoPagamento, decimal pDesconto, decimal pJuros, decimal pMulta, bool pAtivo, DateTime pDtCadastro, DateTime pDtAlteracao, IEnumerable<ParcelaModel> pParcelas)
        {
            this.Id = pId;
            this.CondicaoPagamento = pCondicaoPagamento;
            this.Desconto = pDesconto;
            this.Juros = pJuros;
            this.Multa = pMulta;
            this.Ativo = pAtivo;
            this.DtCadastro = pDtCadastro;
            this.DtAlteracao = pDtAlteracao;
            this.Parcelas = pParcelas;
        }

        public int id
        {
            get { return this.Id; }
            set { this.Id = value; }
        }

        public string condicaoPagamento
        {
            get { return this.CondicaoPagamento; }
            set { this.CondicaoPagamento = value; }
        }

        public decimal desconto
        {
            get { return this.Desconto; }
            set { this.Desconto = value; }
        }

        public decimal juros
        {
            get { return this.Juros; }
            set { this.Juros = value; }
        }

        public decimal multa
        {
            get { return this.Multa; }
            set { this.Multa = value; }
        }

        public bool ativo
        {
            get { return this.Ativo; }
            set { this.Ativo = value; }
        }

        public DateTime dtCadastro
        {
            get { return this.DtCadastro; }
            set { this.DtCadastro = value; }
        }

        public DateTime dtAlteracao
        {
            get { return this.DtAlteracao; }
            set { this.DtAlteracao = value; }
        }

        public IEnumerable<ParcelaModel> parcelas
        {
            get { return this.Parcelas;}
            set { this.Parcelas = value;}
        }
    }

    public class CondicaoPagamentoRef
    {
        public int Id { get; set; }
        public string CondicaoPagamento { get; set; }
    }
}
