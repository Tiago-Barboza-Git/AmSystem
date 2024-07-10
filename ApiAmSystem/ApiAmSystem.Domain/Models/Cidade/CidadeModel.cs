using ApiAmSystem.Domain.Models.Estado;

namespace ApiAmSystem.Domain.Models.Cidade
{
    public class CidadeModel
    {
        private int Id;
        private string Cidade;
        private int DDD;
        private bool Ativo;
        private DateTime DtCadastro;
        private DateTime DtAlteracao;
        private int IdEstado;
        private EstadoModel Estado;

        public CidadeModel()
        {
            Id = 0;
            Cidade = "";
            DDD = 0;
            Ativo = false;
            DtCadastro = DateTime.Now;
            DtAlteracao = DateTime.Now;
            IdEstado = 0;
            Estado = new EstadoModel();
        }

        public CidadeModel(int pId, string pCidade, int pDDD, bool pAtivo, DateTime pDtCadastro, DateTime pDtAlteracao, int pIdEstado, EstadoModel pEstado)
        {
            Id = pId;
            Cidade = pCidade;
            DDD = pDDD;
            Ativo = pAtivo;
            DtCadastro = pDtCadastro;
            DtAlteracao = pDtAlteracao;
            IdEstado = pIdEstado;
            Estado = pEstado;
        }

        public int id
        {
            get { return Id; }
            set { Id = value; }
        }

        public string cidade
        {
            get { return Cidade; }
            set { Cidade = value; }
        }

        public int ddd
        {
            get { return DDD; }
            set { DDD = value; }
        }

        public bool ativo
        {
            get { return Ativo; }
            set { Ativo = value; }
        }

        public DateTime dtCadastro
        {
            get { return DtCadastro; }
            set { DtCadastro = value; }
        }

        public DateTime dtAlteracao
        {
            get { return DtAlteracao; }
            set { DtAlteracao = value; }
        }

        public int idEstado
        {
            get { return IdEstado; }
            set { IdEstado = value; }
        }

        public EstadoModel estado
        {
            get { return Estado; }
            set { Estado = value; }
        }
    }
}
