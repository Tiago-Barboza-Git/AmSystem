using ApiAmSystem.Domain.Models.FormaPagamento;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Parcela
{
    public class ParcelaModel
    {
        private int Id;
        private int NumParcela;
        private int Dias;
        private decimal Porcentagem;
        private int? IdCondPagamento;
        private int IdFormaPagamento;
        private FormaPagamentoModel FormaPagamento;

        public ParcelaModel()
        {
            this.Id = 0;
            this.NumParcela = 0;
            this.Dias = 0;
            this.Porcentagem = 0;
            this.IdCondPagamento = 0;
            this.IdFormaPagamento = 0;
            this.FormaPagamento = new FormaPagamentoModel();
        }

        public ParcelaModel(int pId, int pNumParcela, int pDias, decimal pPorcentagem, int pIdCondPagamento, int pIdFormaPagamento, FormaPagamentoModel pFormaPagamento)
        {
            this.Id = pId;
            this.NumParcela = pNumParcela;
            this.Dias = pDias;
            this.Porcentagem = pPorcentagem;
            this.IdCondPagamento = pIdCondPagamento;
            this.IdFormaPagamento = pIdFormaPagamento;
            this.FormaPagamento = pFormaPagamento;
        }

        public int id
        {
            get { return this.Id; }
            set { this.Id = value; }
        }

        public int numParcela
        {
            get { return this.NumParcela; }
            set { this.NumParcela = value; }
        }

        public int dias
        {
            get { return this.Dias; }
            set { this.Dias = value; }
        }

        public decimal porcentagem
        {
            get { return this.Porcentagem; }
            set { this.Porcentagem = value; }
        }

        public int? idCondPagamento
        {
            get { return this.IdCondPagamento; }
            set { this.IdCondPagamento = value; }
        }

        public int idFormaPagamento
        {
            get { return this.IdFormaPagamento; }
            set { this.IdFormaPagamento = value; }
        }

        public FormaPagamentoModel formaPagamento
        {
            get { return this.FormaPagamento; }
            set { this.FormaPagamento = value; }
        }
    }
}
