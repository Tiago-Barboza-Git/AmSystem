using ApiAmSystem.Domain.Models.Produto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Nota.ProdutoNota
{
    public class ProdutoNotaModel
    {
        public int NrNota { get; set; }
        public int NrModelo { get; set; }
        public int NrSerie { get; set; }
        public int IdProduto { get; set; }
        public int Quantidade { get; set; }
        public decimal PrecoUnit { get; set; }
        public decimal Desconto { get; set; }
        public decimal PrecoTotal { get; set; }
        public ProdutoModel Produto { get; set; }
    }
}
