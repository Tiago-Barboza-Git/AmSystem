using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.UnidadeMedida;
using ApiAmSystem.Services;
using Microsoft.AspNetCore.Mvc;

namespace ApiAmSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UnidadeMedidaController: ControllerBase
    {
        private readonly IUnidadeMedidaService unidadeMedidaService;
        public UnidadeMedidaController(IUnidadeMedidaService pUnidadeMedidaService)
        {
            this.unidadeMedidaService = pUnidadeMedidaService;
        }

        [HttpGet]
        [Route("/GetUnidadesMedidas")]
        public IActionResult GetUnidadeMedidas(bool pAtivo)
        {
            IEnumerable<UnidadeMedidaModel> result = unidadeMedidaService.GetUnidadesMedidas(pAtivo);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpPost]
        [Route("/PostUnidadeMedida")]
        public IActionResult PostUnidadeMedida(UnidadeMedidaPostRequest pUnidadeMedida)
        {
            string result = unidadeMedidaService.PostUnidadeMedida(pUnidadeMedida);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpPut]
        [Route("/PutUnidadeMedida")]
        public IActionResult PutUnidadeMedida(UnidadeMedidaPutRequest pUnidadeMedida)
        {
            string result = unidadeMedidaService.PutUnidadeMedida(pUnidadeMedida);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpDelete]
        [Route("/DeleteUnidadeMedida")]
        public IActionResult DeleteUnidadeMedida(int pId)
        {
            string result = unidadeMedidaService.DeleteUnidadeMedida(pId);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }
    }
}
