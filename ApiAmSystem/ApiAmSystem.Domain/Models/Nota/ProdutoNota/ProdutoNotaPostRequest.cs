using ApiAmSystem.Domain.Models.Produto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Nota.ProdutoNota
{
    public class ProdutoNotaPostRequest
    {
        public int IdProduto { get; set; }
        public int Quantidade { get; set; }
        public decimal Desconto { get; set; }
        public decimal PrecoUnit { get; set; }
        public decimal PrecoTotal { get; set; }
    }
}
