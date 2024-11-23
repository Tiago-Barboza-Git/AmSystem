using ApiAmSystem.Domain.Models.Pais;
using ApiAmSystem.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ApplicationParts;
using System.Reflection.Metadata.Ecma335;

namespace ApiAmSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PaisesController: ControllerBase
    {
        private readonly IPaisesService paisesService;
        public PaisesController(IPaisesService pIPaisesService)
        {
            paisesService = pIPaisesService; 
        }

        [HttpGet]
        [Route("/GetPais")]
        [ProducesResponseType(typeof(PaisModel),200)]
        [ProducesResponseType(typeof(BadRequest), 400)]
        public IActionResult GetPais(int pId)
        {
            Task<PaisModel> result = paisesService.GetPais(pId);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpGet]
        [Route("/GetPaises")]
        [ProducesResponseType(typeof(IEnumerable<PaisModel>), 200)]
        [ProducesResponseType(typeof(BadRequest), 400)]
        public IActionResult GetPaises(bool pAtivo) 
        {
            IEnumerable<PaisModel> result = paisesService.GetPaises(pAtivo);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpPost]
        [Route("/PostPais")]
        [ProducesResponseType(typeof(string), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult PostPais(PaisPostRequest pPais)
        {
            string result = paisesService.PostPais(pPais);
            if (result.Contains("sucesso"))
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpPut]
        [Route("/PutPais")]
        [ProducesResponseType(typeof(string), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult PutPais(PaisPutRequest pPais)
        {
            string result = paisesService.PutPais(pPais);
            if (result.Contains("sucesso"))
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpDelete]
        [Route("/DeletePais")]
        [ProducesResponseType(typeof(string), 200)]
        [ProducesResponseType(typeof(string), 400)]
        public IActionResult DeletePais(int pId)
        {
            string result = paisesService.DeletePais(pId);
            if (result.Contains("sucesso"))
                return Ok(result);
            else
                return BadRequest(result);
        }


    }
}
