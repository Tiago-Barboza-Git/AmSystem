using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Categoria
{
    public class CategoriaPutRequest : PaiPutRequest
    {
        private string Categoria;
        private string? Descricao;

        public CategoriaPutRequest()
        {
            this.Categoria = string.Empty;
            this.Descricao = string.Empty;
        }

        public CategoriaPutRequest(string pCategoria, string? pDescricao)
        {
            Categoria = pCategoria;
            Descricao = pDescricao;
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
