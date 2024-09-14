using ApiAmSystem.Domain.Models.Cidade;
using ApiAmSystem.Domain.Models.Pessoa;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ApiAmSystem.Domain.Models.Fornecedor
{
    public class FornecedorModel: PessoaModel
    {
        private string? Representante;
        private string? CelularRepresentante;

        public FornecedorModel()
        {
            this.Representante = string.Empty;
            this.CelularRepresentante = string.Empty;
        }

        public FornecedorModel(int pId, char pTpPessoa, string pPessoaRazaoSocial, string pApelidoNomeFantasia, char? pSexo, string? pRepresentante, 
            string? pCelularRepresentante, string pTelefone, string pCelular, string pEmail, string pCep, string pLogradouro, int pNumero, string pComplemento, 
            string pBairro, string pCpfCnpj, string pIeRg, bool pAtivo, DateTime? pDtNascimento, DateTime pDtCadastro, DateTime pDtAlteracao, int pIdCidade)
            : base(pId, pTpPessoa, pPessoaRazaoSocial, pApelidoNomeFantasia, pSexo, pTelefone, pCelular, pEmail,pCep, pLogradouro, pNumero,pComplemento, 
            pBairro, pCpfCnpj, pIeRg, pDtNascimento, pIdCidade, pAtivo,pDtCadastro, pDtAlteracao)
        {
            this.Representante = pRepresentante;
            this.CelularRepresentante = pCelularRepresentante;
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
    }
}
