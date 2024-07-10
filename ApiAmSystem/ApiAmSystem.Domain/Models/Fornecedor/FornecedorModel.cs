using ApiAmSystem.Domain.Models.Cidade;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Fornecedor
{
    public class FornecedorModel
    {
        private int Id;
        private char TpFornecedor;
        private string FornecedorRazaoSocial;
        private string? ApelidoNomeFantasia;
        private char? Sexo;
        private string? Representante;
        private string? CelularRepresentante;
        private string? Telefone;
        private string Celular;
        private string Email;
        private string Cep;
        private string Endereco;
        private int Numero;
        private string? Complemento;
        private string Bairro;
        private string CpfCnpj;
        private string? IeRg;
        private bool Ativo;
        private DateTime? DtNascimento;
        private DateTime DtCadastro;
        private DateTime DtAlteracao;
        private int IdCidade;
        private CidadeModel Cidade;

        public FornecedorModel()
        {
            this.Id = 0;
            this.TpFornecedor = ' ';
            this.FornecedorRazaoSocial = "";
            this.ApelidoNomeFantasia = "";
            this.Sexo = ' ';
            this.Representante = "";
            this.CelularRepresentante = "";
            this.Telefone = "";
            this.Celular = "";
            this.Email = "";
            this.Cep = "";
            this.Endereco = "";
            this.Numero = 0;
            this.Complemento = "";
            this.Bairro = "";
            this.CpfCnpj = "";
            this.IeRg = "";
            this.Ativo = false;
            this.DtNascimento = null;
            this.DtCadastro = DateTime.Now;
            this.DtAlteracao = DateTime.Now;
            this.IdCidade = 0;
        }

        public FornecedorModel(int pId, char pTpFornecedor, string pFornecedorRazaoSocial, string pApelidoNomeFantasia, char? pSexo, string? pRepresentante, string? pCelularRepresentante, string pTelefone, string pCelular, string pEmail, string pCep, string pEndereco, int pNumero, string pComplemento, string pBairro, string pCpfCnpj, string pIeRg, bool pAtivo, DateTime? pDtNascimento, DateTime pDtCadastro, DateTime pDtAlteracao, int pIdCidade)
        {
            this.Id = pId;
            this.TpFornecedor = pTpFornecedor;
            this.FornecedorRazaoSocial = pFornecedorRazaoSocial;
            this.ApelidoNomeFantasia = pApelidoNomeFantasia;
            this.Sexo = pSexo;
            this.Representante = pRepresentante;
            this.CelularRepresentante = pCelularRepresentante;
            this.Telefone = pTelefone;
            this.Celular = pCelular;
            this.Email = pEmail;
            this.Cep = pCep;
            this.Endereco = pEndereco;
            this.Numero = pNumero;
            this.Complemento = pComplemento;
            this.Bairro = pBairro;
            this.CpfCnpj = pCpfCnpj;
            this.IeRg = pIeRg;
            this.Ativo = pAtivo;
            this.DtNascimento = pDtNascimento;
            this.DtCadastro = pDtCadastro;
            this.DtAlteracao = pDtAlteracao;
            this.IdCidade = pIdCidade;
        }

        public int id
        {
            get { return this.Id; }
            set { this.Id = value; }
        }

        public char tpFornecedor
        {
            get { return this.TpFornecedor; }
            set { this.TpFornecedor = value; }
        }

        public string fornecedorRazaoSocial
        {
            get { return this.FornecedorRazaoSocial; }
            set { this.FornecedorRazaoSocial = value; }
        }

        public string? apelidoNomeFantasia
        {
            get { return this.ApelidoNomeFantasia; }
            set { this.ApelidoNomeFantasia = value; }
        }

        public char? sexo
        {
            get { return this.Sexo; }
            set { this.Sexo = value; }
        }

        public string? representante
        {
            get { return this.Representante; }
            set { this.Representante = value; }
        }

        public string? celularRepresentante
        {
            get { return this.CelularRepresentante; }
            set { this.CelularRepresentante = value; }
        }

        public string telefone
        {
            get { return this.Telefone; }
            set { this.Telefone = value; }
        }

        public string celular
        {
            get { return this.Celular; }
            set { this.Celular = value; }
        }

        public string email
        {
            get { return this.Email; }
            set { this.Email = value; }
        }

        public string cep
        {
            get { return this.Cep; }
            set { this.Cep = value; }
        }

        public string endereco
        {
            get { return this.Endereco; }
            set { this.Endereco = value; }
        }

        public int numero
        {
            get { return this.Numero; }
            set { this.Numero = value; }
        }

        public string? complemento
        {
            get { return this.Complemento; }
            set { this.Complemento = value; }
        }

        public string bairro
        {
            get { return this.Bairro; }
            set { this.Bairro = value; }
        }

        public string cpfCnpj
        {
            get { return this.CpfCnpj; }
            set { this.CpfCnpj = value; }
        }

        public string? ieRg
        {
            get { return this.IeRg; }
            set { this.IeRg = value; }
        }

        public bool ativo
        {
            get { return this.Ativo; }
            set { this.Ativo = value; }
        }

        public DateTime? dtNascimento
        {
            get { return this.DtNascimento; }
            set { this.DtNascimento = value; }
        }

        public DateTime dtCadastro
        {
            get { return this.DtCadastro; }
            set { this.DtCadastro = value; }
        }

        public DateTime dtAlteracao
        {
            get { return this.DtAlteracao; }
            set { this.DtAlteracao = value; }
        }

        public int idCidade
        {
            get { return this.IdCidade; }
            set { this.IdCidade = value; }
        }

        public CidadeModel cidade
        {
            get { return this.Cidade; }
            set { this.Cidade = value; }
        }
    }
}
