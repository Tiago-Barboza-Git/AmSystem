using ApiAmSystem.Domain.Models.Funcionario;
using ApiAmSystem.Interfaces;
using ApiAmSystem.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace ApiAmSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FuncionariosController: ControllerBase
    {
        private readonly IFuncionariosService funcionariosService;
        public FuncionariosController(IFuncionariosService pIFuncionarioService) 
        { 
            this.funcionariosService = pIFuncionarioService;
        }

        [HttpGet]
        [Route("/GetFuncionario")]
        [ProducesResponseType(typeof(FuncionarioModel),200)]
        [ProducesResponseType(typeof(BadRequest), 400)]
        public IActionResult GetEstado(int pId)
        {
            FuncionarioModel result = funcionariosService.GetFuncionario(pId);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpGet]
        [Route("/GetFuncionarios")]
        [ProducesResponseType(typeof(IEnumerable<FuncionarioModel>), 200)]
        [ProducesResponseType(typeof(BadRequest), 400)]
        public IActionResult GetEstados(bool pAtivo)
        {
            IEnumerable<FuncionarioModel> result = funcionariosService.GetFuncionarios(pAtivo);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpPost]
        [Route("/PostFuncionario")]
        [ProducesResponseType(typeof(Ok), 200)]
        [ProducesResponseType(typeof(BadRequest), 400)]
        public IActionResult PostEstado(FuncionarioPostRequest pFuncionario)
        {
            string result = funcionariosService.PostFuncionario(pFuncionario);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpPut]
        [Route("/PutFuncionario")]
        [ProducesResponseType(typeof(Ok), 200)]
        [ProducesResponseType(typeof(BadRequest), 400)]
        public IActionResult PutEstado(FuncionarioPutRequest pFuncionario)
        {
            string result = funcionariosService.PutFuncionario(pFuncionario);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpDelete]
        [Route("/DeleteFuncionario")]
        [ProducesResponseType(typeof(Ok), 200)]
        [ProducesResponseType(typeof(BadRequest), 400)]
        public IActionResult DeleteEstado(int pId)
        {
            string result = funcionariosService.DeleteFuncionario(pId);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }
    }
}
