using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Compra.ContaPagar;
using Microsoft.AspNetCore.Mvc;

namespace ApiAmSystem.Controllers
{
    [ApiController]
    [Route("[controler]")]
    public class ContaPagarController: ControllerBase
    {
        private readonly IContaPagarService contaPagarService;
        public ContaPagarController(IContaPagarService contaPagarService)
        {
            this.contaPagarService = contaPagarService;
        }

        [HttpGet]
        [Route("/GetContasPagar")]
        public IActionResult GetContasPagar(bool pAtivo)
        {
            IEnumerable<ContaPagarModel> result = contaPagarService.GetContasPagar(pAtivo);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpPut]
        [Route("/PutContaPagar")]
        public IActionResult PutContaPagar(ContaPagarPutRequest pContaPagar)
        {
            string result = contaPagarService.PutContaPagar(pContaPagar);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest();
        }
    }
}
