using ApiAmSystem.Domain.Models.Parcela;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.CondicaoPagamento
{
    public class CondicaoPagamentoPostRequest
    {
        private string CondicaoPagamento;
        private decimal? Desconto;
        private decimal? Juros;
        private decimal? Multa;
        private bool Ativo;
        private IEnumerable<ParcelaModel> Parcelas;

        public CondicaoPagamentoPostRequest()
        {
            this.CondicaoPagamento = string.Empty;
            this.Desconto = 0;
            this.Juros = 0;
            this.Multa = 0;
            this.Ativo = true;
            this.Parcelas = new List<ParcelaModel>();
        }

        public CondicaoPagamentoPostRequest(string pCondicaoPagamento, decimal? pDesconto, decimal? pJuros, decimal? pMulta, bool pAtivo, IEnumerable<ParcelaModel> pParcelas)
        {
            this.CondicaoPagamento = pCondicaoPagamento;
            this.Desconto = pDesconto;
            this.Juros = pJuros;
            this.Multa = pMulta;
            this.Ativo = pAtivo;
            this.Parcelas = pParcelas;
        }

        public string condicaoPagamento
        {
            get { return this.CondicaoPagamento; }
            set { this.CondicaoPagamento = value; }
        }

        public decimal? desconto
        {
            get { return this.Desconto; }
            set { this.Desconto = value; }
        }

        public decimal? juros
        {
            get { return this.Juros; }
            set { this.Juros = value; }
        }

        public decimal? multa
        {
            get { return this.Multa; }
            set { this.Multa = value; }
        }

        public bool ativo
        {
            get { return this.Ativo; }
            set { this.Ativo = value; }
        }

        public IEnumerable<ParcelaModel> parcelas
        {
            get { return this.Parcelas; }
            set { this.Parcelas = value; }
        }
    }
}
