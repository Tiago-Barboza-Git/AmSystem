using ApiAmSystem.Domain.Models.Compra;
using ApiAmSystem.Domain.Models.Venda;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Interfaces
{
    public interface IVendaService
    {
        VendaModel GetVenda(int pNrNota, int pNrModelo, int pNrSerie, int pIdCliente);
        IEnumerable<VendaModel> GetVendas(bool pCanceladas);
        bool PostVenda(VendaPostRequest venda);
        bool PutCancelarVenda(int pNrNota, int pNrModelo, int pNrSerie, int pIdCliente);
        //bool VerificaExistenciaCompra(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor);
    }
}
