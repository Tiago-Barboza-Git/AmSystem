using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Nota
{
    public class NotaPostRequest
    {
        public int NrNota { get; set; }
        public int NrModelo { get; set; }
        public int NrSerie { get; set; }
        public DateTime DtEmissao { get; set; }
        public decimal TotalProdutos { get; set; }
        public decimal TotalNota { get; set; }
        public int IdCondicaoPagamento { get; set; }
    }
}
