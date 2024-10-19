using ApiAmSystem.Domain.Models.Cliente;
using ApiAmSystem.Domain.Models.Nota.ContaNota;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Venda.ContaReceber
{
    public class ContaReceberModel : ContaNotaModel
    {
        public int IdCliente { get; set; }
        public ClienteModel Cliente { get; set; }

    }
}
