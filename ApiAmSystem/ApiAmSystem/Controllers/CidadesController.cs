using ApiAmSystem.Domain.Models.Cidade;
using ApiAmSystem.Interfaces;
using ApiAmSystem.Services;
using Microsoft.AspNetCore.Mvc;

namespace ApiAmSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CidadesController: ControllerBase
    {
        private readonly ICidadesService cidadesService;
        public CidadesController(ICidadesService pICidadesService)
        {
            this.cidadesService = pICidadesService;
        }

        [HttpGet]
        [Route("/GetCidade")]
        public IActionResult GetCidade(int pId)
        {
            CidadeModel result = cidadesService.GetCidade(pId);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpGet]
        [Route("/GetCidades")]
        public IActionResult GetCidades(bool pAtivo)
        {
            IEnumerable<CidadeModel> result = cidadesService.GetCidades(pAtivo);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpPost]
        [Route("/PostCidade")]
        public IActionResult PostCidade(CidadePostRequest pCidade)
        {
            string result = cidadesService.PostCidade(pCidade);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpPut]
        [Route("/PutCidade")]
        public IActionResult PutCidade(CidadePutRequest pCidade)
        {
            string result = cidadesService.PutCidade(pCidade);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpDelete]
        [Route("/DeleteCidade")]
        public IActionResult DeleteCidade(int pId)
        {
            string result = cidadesService.DeleteCidade(pId);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }
    }
}
