﻿using ApiAmSystem.Domain.Models.Categoria;
using ApiAmSystem.Domain.Models.Compra;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Interfaces
{
    public interface ICompraService
    {
        CompraModel GetCompra(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor);
        IEnumerable<CompraModel> GetCompras(bool pCanceladas);
        string PostCompra(CompraPostRequest compra);
        string VerificaExistenciaCompra(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor);
        string PutCancelarCompra(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor);
    }
}
