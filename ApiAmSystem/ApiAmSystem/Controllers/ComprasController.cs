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
        public IEnumerable<CompraModel> GetCompras(bool pCanceladas)
        {
            IEnumerable<CompraModel> result = compraService.GetCompras(pCanceladas);
            return result;
        }

        [HttpPost] 
        [Route("PostCompra")]
        public string PostCompra(CompraPostRequest compra)
        {
            string result = compraService.PostCompra(compra);
            if (result.Contains("sucesso"))
                return "Compra adicionada com sucesso";
            else
                throw new Exception("Erro ao adicionar compra");
        }

        [HttpGet]
        [Route("GetVerificaExistenciaCompra")]
        public IActionResult VerificaExistenciaCompra(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor)
        {
            try
            {
                bool result = compraService.VerificaExistenciaCompra(pNrNota, pNrModelo, pNrSerie, pIdFornecedor);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao verificar a existência da compra");
            }
        }

        [HttpPut]
        [Route("PutCancelarCompra")]
        public IActionResult PutCancelarCompra(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor)
        {
            try
            {
                string result = compraService.PutCancelarCompra(pNrNota, pNrModelo, pNrSerie, pIdFornecedor);
                if (result.Contains("sucesso"))
                    return Ok("Compra cancelada com sucesso");
                else
                    return BadRequest("Compra já possui parcelas pagas, com isso não é possível realizar o cancelamento!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Erro ao cancelar compra: {ex.Message}");
            }
        }

    }
}
