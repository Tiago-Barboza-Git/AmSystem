using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Cidade
{
    public class CidadePutRequest: PaiPutRequest
    {
        private string Cidade;
        private int DDD;
        private int IdEstado;

        public CidadePutRequest(): base()
        {
            this.Cidade = String.Empty;
            this.DDD = 0;
            this.IdEstado = 0;
        }

        public CidadePutRequest(int pId, string pCidade, int pDDD, bool pAtivo, int pIdEstado): base(pId, pAtivo)
        {
            this.Cidade = pCidade;
            this.DDD = pDDD;
            this.IdEstado= pIdEstado;
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

        public int idEstado
        {
            get { return this.IdEstado; }
            set { this.IdEstado = value;}
        }
    }
}
