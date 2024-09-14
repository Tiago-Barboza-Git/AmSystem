using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Categoria
{
    public class CategoriaModel: PaiModel
    {
        private string Categoria;
        private string? Descricao;

        public CategoriaModel(): base()
        {
            this.Categoria = string.Empty;
            this.Descricao = string.Empty;
        }

        public CategoriaModel(int pId,string pCategoria, string? pDescricao, bool pAtivo, DateTime pDtCadastro, DateTime pDtAlteracao): base(pId,pAtivo,pDtCadastro,pDtAlteracao)
        {
            this.Categoria= pCategoria;
            this.Descricao= pDescricao;
        }

        public string categoria
        {
            get { return this.Categoria; }
            set { this.Categoria = value;}
        }

        public string? descricao
        {
            get { return this.Descricao; }
            set { this.Descricao = value; }
        }
    }
}
