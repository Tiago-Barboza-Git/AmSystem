using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Fornecedor;
using Microsoft.AspNetCore.Mvc;

namespace ApiAmSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FornecedoresController: ControllerBase
    {
        private readonly IFornecedoresService fornecedoresService;
        public FornecedoresController(IFornecedoresService pIFornecedoresServices)
        {
            this.fornecedoresService = pIFornecedoresServices;
        }

        [HttpGet]
        [Route("/GetFornecedor")]
        public IActionResult GetFornecedor(int pId)
        {
            FornecedorModel result = fornecedoresService.GetFornecedor(pId);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpGet]
        [Route("/GetFornecedores")]
        public IActionResult GetFornecedores(bool pAtivo)
        {
            IEnumerable<FornecedorModel> result = fornecedoresService.GetFornecedores(pAtivo);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpPost]
        [Route("/PostFornecedor")]
        public IActionResult PostFornecedor(FornecedorPostRequest pCliente)
        {
            string result = fornecedoresService.PostFornecedor(pCliente);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpPut]
        [Route("/PutFornecedor")]
        public IActionResult PutFornecedor(FornecedorPutRequest pCliente)
        {
            string result = fornecedoresService.PutFornecedor(pCliente);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpDelete]
        [Route("/DeleteFornecedor")]
        public IActionResult DeleteFornecedor(int pId)
        {
            string result = fornecedoresService.DeleteFornecedor(pId);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }
    }
}
