using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.FormaPagamento;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;

namespace ApiAmSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FormasPagamentosController: ControllerBase
    {
        private readonly IFormasPagamentosService formasPagamentosService;
        public FormasPagamentosController(IFormasPagamentosService pFormasPagamentos)
        {
            this.formasPagamentosService = pFormasPagamentos;
        }

        [HttpGet]
        [Route("/GetFormaPagamento")]
        public IActionResult GetFormaPagamento(int pId)
        {
            FormaPagamentoModel result = formasPagamentosService.GetFormaPagamento(pId);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpGet]
        [Route("/GetFormasPagamentos")]
        public IActionResult GetFormasPagamentos(bool pAtivo)
        {
            IEnumerable<FormaPagamentoModel> result = formasPagamentosService.GetFormasPagamentos(pAtivo);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpPost]
        [Route("/PostFormaPagamento")]
        public IActionResult PostFormaPagamento(FormaPagamentoPostRequest pFormaPagamento)
        {
            string result = formasPagamentosService.PostFormaPagamento(pFormaPagamento);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpPut]
        [Route("/PutFormaPagamento")]
        public IActionResult PutFormaPagamento(FormaPagamentoPutRequest pFormaPagamento)
        {
            string result = formasPagamentosService.PutFormaPagamento(pFormaPagamento);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpDelete]
        [Route("/DeleteFormaPagamento")]
        public IActionResult DeleteFormaPagamento(int pId)
        {
            string result = formasPagamentosService.DeleteFormaPagamento(pId);
            if (result != null) return Ok(result);
            else return BadRequest();
        }
    }
}
