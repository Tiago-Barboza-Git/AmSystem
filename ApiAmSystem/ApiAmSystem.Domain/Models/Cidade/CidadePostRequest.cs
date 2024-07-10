using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Cidade
{
    public class CidadePostRequest
    {
        private string Cidade;
        private int DDD;
        private bool Ativo;
        private int IdEstado;

        public CidadePostRequest()
        {
            Cidade = String.Empty;
            DDD = 0;
            Ativo = true;
            IdEstado = 0;
        }

        public CidadePostRequest(string pCidade, int pDDD, bool pAtivo, int pIdEstado)
        {
            this.Cidade = pCidade;
            this.DDD = pDDD;
            this.Ativo = pAtivo;
            this.IdEstado = pIdEstado;
        }

        public string cidade
        {
            get { return this.Cidade; }
            set { this.Cidade = value; }
        }

        public int ddd
        {
            get { return this.DDD; }
            set { this.DDD = value; }
        }

        public bool ativo
        {
            get { return this.Ativo; }
            set { this.Ativo = value; }
        }

        public int idEstado
        {
            get { return this.IdEstado; }
            set { this.IdEstado = value; }
        }
    }
}
