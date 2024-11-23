using ApiAmSystem.Domain.Models.Estado;
using ApiAmSystem.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ApiAmSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EstadosController: ControllerBase
    {
        private readonly IEstadosService estadosService;
        public EstadosController(IEstadosService pIEstadosService)
        {
            this.estadosService= pIEstadosService;
        }

        [HttpGet]
        [Route("/GetEstado")]
        public IActionResult GetEstado(int pId)
        {
            EstadoModel result = estadosService.GetEstado(pId);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpGet]
        [Route("/GetEstados")]
        public IActionResult GetEstados(bool pAtivo)
        {
            IEnumerable<EstadoModel> result = estadosService.GetEstados(pAtivo);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpPost]
        [Route("/PostEstado")]
        public IActionResult PostEstado(EstadoPostRequest pEstado)
        {
            string result = estadosService.PostEstado(pEstado);
            if (result.Contains("sucesso"))
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpPut]
        [Route("/PutEstado")]
        public IActionResult PutEstado(EstadoPutRequest pEstado)
        {
            string result = estadosService.PutEstado(pEstado);
            if (result.Contains("sucesso"))
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpDelete]
        [Route("/DeleteEstado")]
        public IActionResult DeleteEstado(int pId)
        {
            string result = estadosService.DeleteEstado(pId);
            if (result.Contains("sucesso"))
                return Ok(result);
            else
                return BadRequest(result);
        }
    }
}
