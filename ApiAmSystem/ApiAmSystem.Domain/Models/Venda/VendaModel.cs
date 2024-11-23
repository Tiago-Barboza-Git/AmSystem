using ApiAmSystem.Domain.Models.Cliente;
using ApiAmSystem.Domain.Models.Funcionario;
using ApiAmSystem.Domain.Models.Nota;
using ApiAmSystem.Domain.Models.Venda.ContaReceber;
using ApiAmSystem.Domain.Models.Venda.ProdutoVenda;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Venda
{
    public class VendaModel : NotaModel
    {
        public int IdCliente { get; set; }
        public ClienteModel Cliente { get; set; }
        public IEnumerable<ProdutoVendaModel> Produtos { get; set; }
        public IEnumerable<ContaReceberModel> ContasReceber { get; set; }
    }

    public class VendaRequest
    {
        public List<VendaModel> Vendas { get; set; }
        public int NextIdent { get; set; }
    }
}
