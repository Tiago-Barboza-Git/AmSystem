using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Categoria
{
    public class CategoriaPostRequest: PaiPostRequest
    {
        private string Categoria;
        private string? Descricao;

        public CategoriaPostRequest()
        {
            this.Categoria = string.Empty;
            this.Descricao = string.Empty;
        }

        public CategoriaPostRequest(string pCategoria, string? pDescricao)
        {
            this.Categoria = pCategoria;
            this.Descricao = pDescricao;
        }

        public string categoria
        {
            get { return this.Categoria; }
            set { this.Categoria = value; }
        }

        public string? descricao
        {
            get { return this.Descricao; }
            set { this.Descricao = value; }
        }
    }
}
