using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Compra;
using Microsoft.AspNetCore.Mvc;

namespace ApiAmSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ComprasController: ControllerBase
    {
        private readonly ICompraService compraService;
        public ComprasController(ICompraService pCompraService)
        {
            this.compraService = pCompraService;
        }

        [HttpGet]
        [Route("GetCompra")]
        public CompraModel GetCompra(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor)
        {
            CompraModel result = compraService.GetCompra(pNrNota, pNrModelo, pNrSerie, pIdFornecedor);
            return result;
        }

        [HttpGet]
        [Route("GetCompras")]
        public IEnumerable<CompraModel> GetCompras()
        {
            IEnumerable<CompraModel> result = compraService.GetCompras();
            return result;
        }

        [HttpPost] 
        [Route("PostCompra")]
        public string PostCompra(CompraPostRequest compra)
        {
            string result = compraService.PostCompra(compra);
            if (result == "Sucesso")
                return "Compra adicionada com sucesso";
            else
                throw new Exception("Erro ao adicionar compra");
        }

        [HttpGet]
        [Route("GetVerificaExistenciaCompra")]
        public bool VerificaExistenciaCompra(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor)
        {
            bool result = compraService.VerificaExistenciaCompra(pNrNota, pNrModelo, pNrSerie, pIdFornecedor);
            return result;
        }

    }
}
