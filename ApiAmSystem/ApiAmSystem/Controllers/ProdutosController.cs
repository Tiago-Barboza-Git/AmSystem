using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Cidade;
using ApiAmSystem.Domain.Models.Produto;
using ApiAmSystem.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ApiAmSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ProdutosController: ControllerBase
    {
        private readonly IProdutosService produtosService;
        public ProdutosController(IProdutosService pIProdutosService)
        {
            this.produtosService = pIProdutosService;
        }

        [HttpGet]
        [Route("/GetProduto")]
        public IActionResult GetProduto(int pId)
        {
            ProdutoModel result = produtosService.GetProduto(pId);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpGet]
        [Route("/GetProdutos")]
        public IActionResult GetProdutos(bool pAtivo)
        {
            IEnumerable<ProdutoModel> result = produtosService.GetProdutos(pAtivo);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpPost]
        [Route("/PostProduto")]
        public IActionResult PostProduto(ProdutoPostRequest pProduto)
        {
            string result = produtosService.PostProduto(pProduto);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpPut]
        [Route("/PutProduto")]
        public IActionResult PutProduto(ProdutoPutRequest pProduto)
        {
            string result = produtosService.PutProduto(pProduto);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpDelete]
        [Route("/DeleteProduto")]
        public IActionResult DeleteProduto(int pId)
        {
            string result = produtosService.DeleteProduto(pId);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }
    }
}
