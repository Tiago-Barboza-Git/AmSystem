using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.UnidadeMedida
{
    public class UnidadeMedidaPutRequest: PaiPutRequest
    {
        private string UnidadeMedida;
        private string? Simbolo;

        public UnidadeMedidaPutRequest() : base()
        {
            this.UnidadeMedida = string.Empty;
            this.Simbolo = string.Empty;
        }

        public UnidadeMedidaPutRequest(int pId, string pUnidadeMedida, string? pSimbolo, bool pAtivo) : base(pId, pAtivo)
        {
            this.UnidadeMedida = pUnidadeMedida;
            this.Simbolo = pSimbolo;
        }

        public string unidadeMedida
        {
            get { return this.UnidadeMedida; }
            set { this.UnidadeMedida = value; }
        }

        public string simbolo
        {
            get { return this.Simbolo; }
            set { this.Simbolo = value; }
        }
    }
}
