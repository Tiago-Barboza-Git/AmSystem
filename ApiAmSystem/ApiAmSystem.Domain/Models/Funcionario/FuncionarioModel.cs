﻿using ApiAmSystem.Domain.Models.Cidade;

namespace ApiAmSystem.Domain.Models.Funcionario
{
    public class FuncionarioModel
    {
        private int Id;
        private string Funcionario;
        private string Apelido;
        private char Sexo;
        private string Cpf;
        private string? Rg;
        private DateTime? DtNascimento;
        private string Email;
        private string? Telefone;
        private string Celular;
        private string? Pis;
        private string CEP;
        private string Logradouro;
        private int Numero;
        private string? Complemento;
        private string Bairro;
        private decimal? Salario;
        private string? Cargo;
        private bool Ativo; 
        private int IdCidade;
        private DateTime? DtAdmissao;
        private DateTime? DtDemissao;
        private DateTime DtCadastro;
        private DateTime DtAlteracao;
        private CidadeModel Cidade;

        public FuncionarioModel()
        {
            this.Id = 0;
            this.Funcionario = string.Empty;
            this.Apelido = string.Empty;
            this.Cpf = string.Empty;
            this.Rg = string.Empty;
            this.DtNascimento = null;
            this.Email = string.Empty;
            this.Telefone = string.Empty;
            this.Celular = string.Empty;
            this.Salario = 0;
            this.Pis = string.Empty;
            this.CEP = string.Empty;
            this.Logradouro = string.Empty;
            this.Bairro = string.Empty;
            this.Numero = 0;
            this.Complemento = string.Empty;
            this.Sexo = ' ';
            this.Cargo = string.Empty;
            this.Ativo = false;
            this.IdCidade = 0;
            this.DtAdmissao = null;
            this.DtDemissao = null;
            this.DtCadastro = DateTime.Now;
            this.DtAlteracao = DateTime.Now;
            this.Cidade = new CidadeModel();
        }

        public FuncionarioModel(int pId, string pFuncionario, string? pApelido, string pCPF, string? pRG, DateTime? pDtNasciomento,
                                string pEmail, string? pTelefone, string pCelular, decimal? pSalario, string? pPis, string pCEP, string pLogradouro, string pBairro,
                                int pNumero, string? pComplemento, char pSexo, string? pCargo, bool pAtivo, int pIdCidade, DateTime? pDtAdmissao,
                                DateTime? pDtDemissao, DateTime pDtCadastro, DateTime pDtAlteracao, CidadeModel pCidade)
        {
            this.Id = pId;
            this.Funcionario = pFuncionario;
            this.Apelido = pApelido;
            this.Cpf = pCPF;
            this.Rg = pRG;
            this.DtNascimento = pDtNasciomento;
            this.Email = pEmail;
            this.Telefone = pTelefone;
            this.Celular = pCelular;
            this.Salario = pSalario;
            this.Pis = pPis;
            this.CEP = pCEP;
            this.Logradouro = pLogradouro;
            this.Bairro = pBairro;
            this.Numero = pNumero;
            this.Complemento = pComplemento;
            this.Sexo = pSexo;
            this.Cargo = pCargo;
            this.Ativo = pAtivo;
            this.IdCidade = pIdCidade;
            this.DtAdmissao = pDtAdmissao;
            this.DtDemissao = pDtDemissao;
            this.DtCadastro = pDtCadastro;
            this.DtAlteracao = pDtAlteracao;
            this.Cidade = pCidade;
        }

        public int id
        {
            get { return this.Id; }
            set { this.Id = value; }
        }

        public string funcionario
        {
            get { return this.Funcionario; }
            set { this.Funcionario = value; }
        }

        public string? apelido
        {
            get { return this.Apelido; }
            set { this.Apelido = value; }
        }

        public string cpf
        {
            get { return this.Cpf; }
            set { this.Cpf = value; }
        }

        public string? rg
        {
            get { return this.Rg; }
            set { this.Rg = value; }
        }

        public DateTime? dtNascimento
        {
            get { return this.DtNascimento; }
            set { this.DtNascimento = value; }
        }

        public string email
        {
            get { return this.Email; }
            set { this.Email = value; }
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

        public decimal? salario
        {
            get { return this.Salario; }
            set { this.Salario = value; }
        }

        public string? pis
        {
            get { return this.Pis; }
            set { this.Pis = value; }
        }

        public string cep
        {
            get { return this.CEP; }
            set { this.CEP = value; }
        }

        public string logradouro
        {
            get { return this.Logradouro; }
            set { this.Logradouro = value; }
        }

        public string bairro
        {
            get { return this.Bairro; }
            set { this.Bairro = value; }
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

        public char sexo
        {
            get { return this.Sexo; }
            set { this.Sexo = value;}
        }

        public string cargo
        {
            get { return this.Cargo; }
            set { this.Cargo = value; }
        }

        public int idCidade
        {
            get { return this.IdCidade; }
            set { this.IdCidade = value; }
        }

        public bool ativo
        {
            get { return this.Ativo; }
            set { this.Ativo = value; }
        }
        public DateTime? dtAdmissao
        {
            get { return this.DtAdmissao; }
            set { this.DtAdmissao = value; }
        }
        public DateTime? dtDemissao
        {
            get { return this.DtDemissao; }
            set { this.DtDemissao = value; }
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

        public CidadeModel cidade
        {
            get { return this.Cidade; }
            set { this.Cidade = value; }
        }
    }
}