using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models
{
    public class PaiModel
    {
        private int Id;
        private bool Ativo;
        private DateTime? DtCadastro;
        private DateTime? DtAlteracao;

        public PaiModel()
        {
            this.Id = 0;
            this.Ativo = true;
            this.DtCadastro = null;
            this.DtAlteracao = null;
        }

        public PaiModel(int pId, bool pAtivo, DateTime? pDtCadastro, DateTime? pDtAlteracao)
        {
            this.Id = pId;
            this.Ativo = pAtivo;
            this.DtCadastro = pDtCadastro;
            this.DtAlteracao = pDtAlteracao;
        }

        public int id
        {
            get { return Id; }
            set { Id = value; }
        }

        public bool ativo
        {
            get { return Ativo; }
            set { Ativo = value; }
        }

        public DateTime? dtCadastro
        {
            get { return DtCadastro; }
            set { DtCadastro = value; }
        }

        public DateTime? dtAlteracao
        {
            get { return DtAlteracao; }
            set { DtAlteracao = value; }
        }

    }
}
