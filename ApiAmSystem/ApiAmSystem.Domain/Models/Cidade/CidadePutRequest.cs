using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Cidade
{
    public class CidadePutRequest
    {
        private int Id;
        private string Cidade;
        private int DDD;
        private bool Ativo;
        private int IdEstado;

        public CidadePutRequest()
        {
            this.Id = 0;
            this.Cidade = String.Empty;
            this.DDD = 0;
            this.Ativo = true;
            this.IdEstado = 0;
        }

        public CidadePutRequest(int pId, string pCidade, int pDDD, bool pAtivo, int pIdEstado)
        {
            this.Id = pId;
            this.Cidade = pCidade;
            this.DDD = pDDD;
            this.Ativo = pAtivo;
            this.IdEstado= pIdEstado;
        }

        public int id
        {
            get { return this.Id; }
            set { this.Id = value; }
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
            set { this.Ativo = value;}
        }

        public int idEstado
        {
            get { return this.IdEstado; }
            set { this.IdEstado = value;}
        }
    }
}
