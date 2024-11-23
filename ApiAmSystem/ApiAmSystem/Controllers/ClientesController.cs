using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Cliente;
using Microsoft.AspNetCore.Mvc;
using System.Reflection.Metadata.Ecma335;

namespace ApiAmSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ClientesController: ControllerBase
    {
        private readonly IClientesService clientesService;
        public ClientesController(IClientesService pIClientesServices)
        {
            this.clientesService = pIClientesServices;
        }

        [HttpGet]
        [Route("/GetCliente")]
        public IActionResult GetCidade(int pId)
        {
            ClienteModel result = clientesService.GetCliente(pId);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpGet]
        [Route("/GetClientes")]
        public IActionResult GetClientes(bool pAtivo)
        {
            IEnumerable<ClienteModel> result = clientesService.GetClientes(pAtivo);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpPost]
        [Route("/PostCliente")]
        public IActionResult PostCliente(ClientePostRequest pCliente)
        {
            string result = clientesService.PostCliente(pCliente);
            if (result.Contains("sucesso"))
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpPut]
        [Route("/PutCliente")]
        public IActionResult PutCliente(ClientePutRequest pCliente)
        {
            string result = clientesService.PutCliente(pCliente);
            if (result.Contains("sucesso"))
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpDelete]
        [Route("/DeleteCliente")]
        public IActionResult DeleteCliente(int pId)
        {
            string result = clientesService.DeleteCliente(pId);
            if (result.Contains("sucesso"))
                return Ok(result);
            else
                return BadRequest(result);
        }
    }
}
