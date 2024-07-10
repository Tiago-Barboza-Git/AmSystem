using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Categoria;
using ApiAmSystem.Domain.Models.Cidade;
using ApiAmSystem.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ApiAmSystem.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CategoriaController: ControllerBase
    {
        private readonly ICategoriaService categoriaService;
        public CategoriaController(ICategoriaService pICategoriaService)
        {
            this.categoriaService = pICategoriaService;
        }

        [HttpGet]
        [Route("/GetCategorias")]
        public IActionResult GetCategorias(bool pAtivo)
        {
            IEnumerable<CategoriaModel> result = categoriaService.GetCategorias(pAtivo);
            if (result != null)
                return Ok(result);
            else
                return BadRequest();
        }

        [HttpPost]
        [Route("/PostCategoria")]
        public IActionResult PostCategoria(CategoriaPostRequest pCategoria)
        {
            string result = categoriaService.PostCategoria(pCategoria);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpPut]
        [Route("/PutCategoria")]
        public IActionResult PutCategoria(CategoriaPutRequest pCategoria)
        {
            string result = categoriaService.PutCategoria(pCategoria);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }

        [HttpDelete]
        [Route("/DeleteCategoria")]
        public IActionResult DeleteCategoria(int pId)
        {
            string result = categoriaService.DeleteCategoria(pId);
            if (result == "Sucesso")
                return Ok(result);
            else
                return BadRequest(result);
        }
    }
}
