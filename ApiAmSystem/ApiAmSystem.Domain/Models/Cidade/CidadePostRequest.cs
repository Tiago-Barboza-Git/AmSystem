using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Cidade
{
    public class CidadePostRequest: PaiPostRequest
    {
        private string Cidade;
        private int DDD;
        private int IdEstado;

        public CidadePostRequest(): base()
        {
            Cidade = String.Empty;
            DDD = 0;
            IdEstado = 0;
        }

        public CidadePostRequest(string pCidade, int pDDD, bool pAtivo, int pIdEstado): base(pAtivo)
        {
            this.Cidade = pCidade;
            this.DDD = pDDD;
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

        public int idEstado
        {
            get { return this.IdEstado; }
            set { this.IdEstado = value; }
        }
    }
}
