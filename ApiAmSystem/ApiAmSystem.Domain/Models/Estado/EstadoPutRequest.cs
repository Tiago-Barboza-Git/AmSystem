using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Estado
{
    public class EstadoPutRequest
    {
        private int Id;
        private string Estado;
        private string UF;
        private bool Ativo;
        private int IdPais;

        public EstadoPutRequest()
        {
            this.Id = 0;
            this.Estado = String.Empty;
            this.UF = String.Empty;
            this.Ativo = true;
            this.IdPais = 0;
        }
        public EstadoPutRequest(int pId, string pEstado, string pUf, bool pAtivo, int pIdPais)
        {
            this.Id = pId;
            this.Estado = pEstado;
            this.UF = pUf;
            this.Ativo = pAtivo;
            this.IdPais = pIdPais;
        }

        public int id
        {
            get { return this.Id; }
            set { this.Id = value; }
        }

        public string estado
        {
            get { return this.Estado; }
            set { this.Estado = value; }
        }

        public string uf
        {
            get { return this.UF; }
            set { this.UF = value; }
        }

        public bool ativo
        {
            get { return this.Ativo; }
            set { this.Ativo = value; }
        }

        public int idPais
        {
            get { return this.IdPais; }
            set { this.IdPais = value; }
        }
    }
}
