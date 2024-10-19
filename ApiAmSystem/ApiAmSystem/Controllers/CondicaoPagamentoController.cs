using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.CondicaoPagamento;
using ApiAmSystem.Domain.Models.FormaPagamento;
using Microsoft.AspNetCore.Mvc;

namespace ApiAmSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]

    public class CondicaoPagamentoController : ControllerBase
    {
        private readonly ICondicaoPagamentoService condicaoPagamentoService;
        public CondicaoPagamentoController(ICondicaoPagamentoService pCondicaoPagamento)
        {
            this.condicaoPagamentoService = pCondicaoPagamento;
        }

        [HttpGet]
        [Route("/GetCondicaoPagamento")]
        public IActionResult GetCondicaoPagamento(int pId)
        {
            CondicaoPagamentoModel result = condicaoPagamentoService.GetCondicaoPagamento(pId);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpGet]
        [Route("/GetCondicoesPagamentos")]
        public IActionResult GetCondicoesPagamentos(bool pAtivo)
        {
            IEnumerable<CondicaoPagamentoModel> result = condicaoPagamentoService.GetCondicoesPagamentos(pAtivo);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpPost]
        [Route("/PostCondicaoPagamento")]
        public IActionResult PostCondicaoPagamento(CondicaoPagamentoPostRequest pCondicaoPagamento)
        {
            string result = condicaoPagamentoService.PostCondicaoPagamento(pCondicaoPagamento);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpPut]
        [Route("/PutCondicaoPagamento")]
        public IActionResult PutCondicaoPagamento(CondicaoPagamentoPutRequest pCondicaoPagamento)
        {
            string result = condicaoPagamentoService.PutCondicaoPagamento(pCondicaoPagamento);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpDelete]
        [Route("/DeleteCondicaoPagamento")]
        public IActionResult DeleteCondicaoPagamento(int pId)
        {
            string result = condicaoPagamentoService.DeleteCondicaoPagamento(pId);
            if (result != null) return Ok(result);
            else return BadRequest();
        }
    }
}
