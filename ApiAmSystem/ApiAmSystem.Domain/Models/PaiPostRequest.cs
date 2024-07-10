using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models
{
    public class PaiPostRequest
    {
        private bool Ativo { get; set; }

        public PaiPostRequest()
        {
            this.Ativo = true;
        }

        public PaiPostRequest(bool pAtivo)
        {
            this.Ativo = pAtivo;  
        }

        public bool ativo
        {
            get { return this.Ativo; }
            set { this.Ativo = value; }
        }
    }
}
