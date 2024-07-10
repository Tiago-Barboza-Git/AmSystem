using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models
{
    public class PaiPutRequest
    {
        private int Id;
        private bool Ativo;

        public PaiPutRequest()
        {
            this.Id = 0;
            this.Ativo = true;
        }
        public PaiPutRequest(int pId, bool pAtivo) 
        {
            this.Id = pId;
            this.Ativo = pAtivo;
        }

        public int id
        {
            get { return this.Id; }
            set { this.Id = value; }
        }

        public bool ativo
        {
            get { return this.Ativo; }
            set { this.Ativo = value; }
        }
    }
}
