using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Pais
{
    public class PaisPutRequest
    {
        private int Id;
        private string Pais;
        private int DDI;
        private string Sigla;
        private bool Ativo;

        public PaisPutRequest() 
        {
            this.Id = 0;
            this.Pais = String.Empty;
            this.DDI = 0;
            this.Sigla = String.Empty;
            this.Ativo = false;
        }

        public PaisPutRequest(int pId, string pPais, int pDDI, string pSigla, bool pAtivo)
        {
            this.Id = pId;
            this.Pais = pPais;
            this.DDI = pDDI;
            this.Sigla = pSigla;
            this.Ativo = pAtivo;
        }

        public int id
        {
            get { return this.Id; }
            set { this.Id = value; }
        }

        public string pais
        {
            get { return this.Pais; }
            set { this.Pais = value; }
        }

        public int ddi
        {
            get { return this. DDI; }
            set { this. DDI = value; }
        }

        public string sigla
        {
            get { return this.Sigla; }
            set { this.Sigla = value; }
        }

        public bool ativo
        {
            get { return this.Ativo; }
            set { this.Ativo = value;}
        }
    }
}
