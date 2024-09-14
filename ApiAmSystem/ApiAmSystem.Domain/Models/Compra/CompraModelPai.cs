using ApiAmSystem.Domain.Models.Fornecedor;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Compra
{
    public class CompraModelPai
    {
        public int NrNota { get; set; }
        public int NrModelo { get; set; }
        public int NrSerie { get; set; }
        public int IdFornecedor { get; set; }
        public FornecedorModel Fornecedor { get; set; }
        public CompraModelPai() 
        {
            this.NrNota = 0;
            this.NrModelo = 0;
            this.NrSerie = 0;
            this.IdFornecedor = 0;
            this.Fornecedor = new FornecedorModel();
        }
    }
}
