using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.UnidadeMedida
{
    public class UnidadeMedidaPostRequest: PaiPostRequest
    {
        private string UnidadeMedida;
        private string? Simbolo;

        public UnidadeMedidaPostRequest(): base()
        {
            this.UnidadeMedida = string.Empty;
            this.Simbolo = string.Empty;
        }

        public UnidadeMedidaPostRequest(string pUnidadeMedida, string? pSimbolo, bool pAtivo): base(pAtivo)
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
