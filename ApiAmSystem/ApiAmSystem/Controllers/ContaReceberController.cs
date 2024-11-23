using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Compra.ContaPagar;
using ApiAmSystem.Domain.Models.Venda.ContaReceber;
using Microsoft.AspNetCore.Mvc;

namespace ApiAmSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ContaReceberController: ControllerBase
    {
        private readonly IContaReceberService contaReceberService;
        public ContaReceberController(IContaReceberService contaReceberService)
        {
            this.contaReceberService = contaReceberService;
        }

        [HttpGet]
        [Route("/GetContasReceber")]
        public IActionResult GetContasReceber(bool pAtivo)
        {
            IEnumerable<ContaReceberModel> result = contaReceberService.GetContasReceber(pAtivo);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpPut]
        [Route("/PutContaReceber")]
        public IActionResult q(ContaReceberPutRequest pContaReceber)
        {
            string result = contaReceberService.PutContaReceber(pContaReceber);
            if (result.Contains("sucesso"))
                return Ok(result);
            else
                return BadRequest(result);
        }
    }
}
