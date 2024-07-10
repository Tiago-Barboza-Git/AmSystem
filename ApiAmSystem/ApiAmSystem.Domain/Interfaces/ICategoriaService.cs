using ApiAmSystem.Domain.Models.Categoria;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Interfaces
{
    public interface ICategoriaService
    {
        //CategoriaModel GetCategoria(int pId);
        IEnumerable<CategoriaModel> GetCategorias(bool pAtivo);
        string PostCategoria(CategoriaPostRequest pCategoria);
        string PutCategoria(CategoriaPutRequest pCategoria);
        string DeleteCategoria(int pId);
    }
}
