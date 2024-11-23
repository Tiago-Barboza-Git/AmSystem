using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Venda;
using Microsoft.AspNetCore.Mvc;


namespace ApiAmSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class VendasController: ControllerBase
    {
        private readonly IVendaService vendaService;

        public VendasController(IVendaService pVendaService)
        {
            this.vendaService = pVendaService;
        }

        [HttpGet]
        [Route("GetVendas")]
        public IActionResult GetVendas(bool pCanceladas)
        {
            VendaRequest result = vendaService.GetVendas(pCanceladas);
            return Ok(result);
        }

        [HttpGet]
        [Route("GetVerificaExistenciaVenda")]
        public IActionResult VeterificaExistenciaVenda(int pNrNota, int pNrModelo, int pNrSerie, int pIdCliente)
        {
            bool result = vendaService.VerificaExistenciaVenda(pNrNota, pNrModelo, pNrSerie, pIdCliente);
            return Ok(result);
        }

        [HttpPost]
        [Route("PostVenda")]
        public IActionResult PostVenda(VendaPostRequest pVenda)
        {
            string result = vendaService.PostVenda(pVenda);
            if (result.Contains("sucesso"))
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpPut]
        [Route("PutCancelarVenda")]
        public IActionResult PutCancelarVenda(int pNrNota, int pNrModelo, int pNrSerie, int pIdCliente)
        {
            string result = vendaService.PutCancelarVenda(pNrNota, pNrModelo, pNrSerie, pIdCliente);
            if (result.Contains("sucesso"))
                return Ok(result);
            else
                return BadRequest(result);
        }
    }
}
