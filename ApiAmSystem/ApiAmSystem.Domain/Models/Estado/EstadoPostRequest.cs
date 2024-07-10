using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Estado
{
    public class EstadoPostRequest
    {
        private string Estado;
        private string UF;
        private bool Ativo;
        public int IdPais;

        public EstadoPostRequest()
        {
            Estado = String.Empty;
            UF = String.Empty;
            Ativo = true;
            IdPais = 0;
        }
        public EstadoPostRequest(string pEstado, string pUf, bool pAtivo, int pIdPais)
        {
            Estado = pEstado;
            UF = pUf;
            Ativo = pAtivo;
            IdPais = pIdPais;
        }

        public string estado
        {
            get { return Estado; }
            set { Estado = value; }
        }

        public string uf
        {
            get { return UF; }
            set { UF = value; }
        }

        public bool ativo
        {
            get { return Ativo; }
            set { Ativo = value; }
        }

        public int idPais
        {
            get { return IdPais; }
            set { IdPais = value; }
        }
    }
}
