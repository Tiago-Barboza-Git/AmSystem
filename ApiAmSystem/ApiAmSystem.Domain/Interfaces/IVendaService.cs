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
        VendaRequest GetVendas(bool pCanceladas);
        bool VerificaExistenciaVenda(int pNrNota, int pNrModelo, int pNrSerie, int pIdCliente);
        string PostVenda(VendaPostRequest venda);
        string PutCancelarVenda(int pNrNota, int pNrModelo, int pNrSerie, int pIdCliente);
    }
}
