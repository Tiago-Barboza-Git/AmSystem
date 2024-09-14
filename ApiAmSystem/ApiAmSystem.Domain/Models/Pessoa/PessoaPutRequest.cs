using ApiAmSystem.Domain.Models.Cidade;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Pessoa
{
    public class PessoaPutRequest: PaiPutRequest
    {
        private char TpPessoa;
        private string PessoaRazaoSocial;
        private string? ApelidoNomeFantasia;
        private char? Sexo;
        private string? Telefone;
        private string Celular;
        private string Email;
        private string Cep;
        private string Logradouro;
        private int Numero;
        private string? Complemento;
        private string Bairro;
        private string CpfCnpj;
        private string? IeRg;
        private DateTime? DtNascimento;
        private int IdCidade;
        private CidadeModel Cidade;

        public PessoaPutRequest() : base()
        {

        }

        public PessoaPutRequest(int pId,char pTpPessoa, string pPessoaRazaoSocial, string? pApelidoNomeFantasia, char? pSexo, string? pTelefone, string pCelular,
            string pEmail, string pCep, string pLogradouro, int pNumero, string pBairro, string? pComplemento, string pCpfCnpj, string? pIeRg,
            int pIdCidade, DateTime? pDtNascimento, bool pAtivo) : base(pId,pAtivo)
        {
            this.TpPessoa = pTpPessoa;
            this.PessoaRazaoSocial = pPessoaRazaoSocial;
            this.ApelidoNomeFantasia = pApelidoNomeFantasia;
            this.Sexo = pSexo;
            this.Telefone = pTelefone;
            this.Celular = pCelular;
            this.Email = pEmail;
            this.Cep = pCep;
            this.Logradouro = pLogradouro;
            this.Numero = pNumero;
            this.Complemento = pComplemento;
            this.Bairro = pBairro;
            this.CpfCnpj = pCpfCnpj;
            this.IeRg = pIeRg;
            this.DtNascimento = pDtNascimento;
            this.IdCidade = pIdCidade;
        }

        public char tpPessoa
        {
            get { return this.TpPessoa; }
            set { this.TpPessoa = value; }
        }

        public string pessoaRazaoSocial
        {
            get { return this.PessoaRazaoSocial; }
            set { this.PessoaRazaoSocial = value; }
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

        public string? telefone
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

        public string logradouro
        {
            get { return this.Logradouro; }
            set { this.Logradouro = value; }
        }

        public int numero
        {
            get { return this.Numero; }
            set { this.Numero = value; }
        }

        public string bairro
        {
            get { return this.Bairro; }
            set { this.Bairro = value; }
        }

        public string? complemento
        {
            get { return this.Complemento; }
            set { this.Complemento = value; }
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

        public DateTime? dtNascimento
        {
            get { return this.DtNascimento; }
            set { this.DtNascimento = value; }
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
