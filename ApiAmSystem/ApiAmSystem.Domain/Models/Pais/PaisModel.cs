namespace ApiAmSystem.Domain.Models.Pais
{
    public class PaisModel
    {
        private int Id;
        private string Pais;
        private int DDI;
        private string Sigla;
        private bool Ativo;
        private DateTime? DtCadastro;
        private DateTime? DtAlteracao;
        public PaisModel()
        {
            Id = 0;
            Pais = string.Empty;
            DDI = 0;
            Sigla = string.Empty;
            Ativo = true;
            DtCadastro = null;
            DtAlteracao = null;
        }

        public PaisModel(int pId, string pPais, int pDDI, string pSigla, bool pAtivo, DateTime pDtCadastro, DateTime pDtAlteracao)
        {
            Id = pId;
            Pais = pPais;
            DDI = pDDI;
            Sigla = pSigla;
            Ativo = pAtivo;
            DtCadastro = pDtCadastro;
            DtAlteracao = pDtAlteracao;
        }

        public int id
        {
            get { return Id; }
            set { Id = value; }
        }

        public string pais
        {
            get { return Pais; }
            set { Pais = value; }
        }

        public int ddi
        {
            get { return DDI; }
            set { DDI = value; }
        }

        public string sigla
        {
            get { return Sigla; }
            set { Sigla = value; }
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
