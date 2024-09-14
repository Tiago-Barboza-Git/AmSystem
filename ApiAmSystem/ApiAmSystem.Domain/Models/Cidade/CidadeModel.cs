using ApiAmSystem.Domain.Models.Estado;

namespace ApiAmSystem.Domain.Models.Cidade
{
    public class CidadeModel: PaiModel
    {  
        private string Cidade;
        private int DDD;
        private int IdEstado;
        private EstadoModel Estado;

        public CidadeModel(): base()
        {
            Cidade = "";
            DDD = 0;
            IdEstado = 0;
            Estado = new EstadoModel();
        }

        public CidadeModel(int pId, string pCidade, int pDDD, bool pAtivo, DateTime pDtCadastro, DateTime pDtAlteracao, int pIdEstado, EstadoModel pEstado): base(pId, pAtivo, pDtCadastro, pDtAlteracao)
        {
            Cidade = pCidade;
            DDD = pDDD;
            IdEstado = pIdEstado;
            Estado = pEstado;
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
