using ApiAmSystem.Domain.Models;
using ApiAmSystem.Domain.Models.Pais;

namespace ApiAmSystem.Domain.Models.Estado
{
    public class EstadoModel
    {
        private int Id;
        private string Estado;
        private string UF;
        private int IdPais;
        private bool Ativo;
        private PaisModel? Pais;
        private DateTime? DtCadastro;
        private DateTime? DtAlteracao;

        public EstadoModel()
        {
            Id = 0;
            Estado = "";
            UF = "";
            IdPais = 0;
            Ativo = true;
            Pais = null;
            DtCadastro = null;
            DtAlteracao = null;
        }

        public EstadoModel(int pId, string pEstado, string pUF, int pIdPais, bool pAtivo, PaisModel pPais, DateTime? pDtcadastro, DateTime? pDtAlteracao)
        {
            Id = pId;
            Estado = pEstado;
            UF = pUF;
            IdPais = pIdPais;
            Ativo = pAtivo;
            Pais = pPais;
            DtCadastro = pDtcadastro;
            DtAlteracao = pDtAlteracao;
        }

        public int id
        {
            get { return Id; }
            set { Id = value; }
        }

        public string estado
        {
            get { return Estado; }
            set { Estado = value; }
        }

        public string uf
        {
            get { return UF; }
            set { UF = value; }
        }

        public int idPais
        {
            get { return IdPais; }
            set { IdPais = value; }
        }

        public bool ativo
        {
            get { return Ativo; }
            set { Ativo = value; }
        }

        public PaisModel? pais
        {
            get { return Pais; }
            set { Pais = value; }
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
