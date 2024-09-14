using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.ContaPagar;
using ApiAmSystem.Domain.Models.FormaPagamento;
using ApiAmSystem.Domain.Models.Fornecedor;
using Microsoft.Data.SqlClient;
using System.Data;

namespace ApiAmSystem.Services
{
    public class ContaPagarService : IContaPagarService
    {
        private readonly SqlConnection sqlConnection;
        public ContaPagarService(SqlConnection pSqlConnection)
        {
            this.sqlConnection = pSqlConnection;
        }

        public IEnumerable<ContaPagarModel> GetContasPagar(bool pAtivo)
        {
            using (this.sqlConnection)
            {
                try
                {
                    List<ContaPagarModel> result = new List<ContaPagarModel>();
                    this.sqlConnection.Open();
                    string query = @"
                       select 
	                        cp.*,
	                        f.FornecedorRazaoSocial,
	                        fp.FormaPagamento
                        from TbContasPagar cp
                        inner join TbFornecedores f on f.Id = cp.IdFornecedor
                        inner join TbFormasPagamentos fp on fp.Id = cp.IdFormaPagamento
                        where cp.Ativo = @Ativo;
                    ";

                    SqlCommand cmd = new SqlCommand(query, this.sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Ativo", SqlDbType.Int).Value = pAtivo;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader != null && reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result.Add(new ContaPagarModel
                            {
                                NrNota = reader.GetInt32("NrNota"),
                                NrModelo = reader.GetInt32("NrModelo"),
                                NrSerie = reader.GetInt32("NrSerie"),
                                IdFornecedor = reader.GetInt32("IdFornecedor"),
                                IdFormaPagamento = reader.GetInt32("IdFormaPagamento"),
                                NumParcela = reader.GetInt32("NumParcela"),
                                ValorParcela = reader.GetDecimal("ValorParcela"),
                                DtEmissao = reader.GetDateTime("DtEmissao"),
                                DtVencimento = reader.GetDateTime("DtVencimento"),
                                Desconto = reader.GetDecimal("Desconto"),
                                Juros = reader.GetDecimal("Juros"),
                                Multa = reader.GetDecimal("Multa"),
                                ValorPago = reader.GetDecimal("ValorPago"),
                                DtPagamento = reader.IsDBNull("DtPagamento") ? null : reader.GetDateTime("DtPagamento"),
                                Ativo = reader.GetBoolean("Ativo"),
                                DtCadastro = reader.GetDateTime("DtCadastro"),
                                DtAlteracao = reader.GetDateTime("DtAlteracao"),
                                FormaPagamento = new FormaPagamentoModel
                                {
                                    id = reader.GetInt32("IdFormaPagamento"),
                                    formaPagamento = reader.GetString("FormaPagamento")
                                },
                                Fornecedor = new FornecedorModel
                                {
                                    id = reader.GetInt32("IdFornecedor"),
                                    pessoaRazaoSocial = reader.GetString("FornecedorRazaoSocial")
                                },

                            });
                        }
                    }

                    return result;
                }
                catch (SqlException ex)
                {
                    throw new Exception(ex.Message);
                }
                finally
                {
                    this.sqlConnection.Close();
                }
            }
            return null;
        }

        public IEnumerable<ContaPagarModel> GetContasPagarByCompra(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor)
        {
            using (sqlConnection)
            {
                try
                {
                    if (sqlConnection.State != ConnectionState.Open)
                        sqlConnection.Open();
                    List<ContaPagarModel> result = new List<ContaPagarModel>();
                    string query = @"
                                select 
	                                cp.NumParcela,
	                                cp.ValorParcela,
	                                cp.DtEmissao,
	                                cp.DtVencimento,
	                                cp.Desconto,
	                                cp.Juros,
	                                cp.Multa,
	                                cp.ValorPago,
	                                cp.DtPagamento,
                                    cp.Ativo,
	                                cp.IdFormaPagamento,
	                                cp.DtCadastro,
	                                cp.DtAlteracao,
	                                fp.FormaPagamento,
                                    cp.IdFornecedor,
	                                f.FornecedorRazaoSocial
                                from TbContasPagar cp
                                inner join TbFormasPagamentos fp on fp.Id = cp.IdFormaPagamento
                                inner join TbFornecedores f on f.Id = cp.IdFornecedor
                                where cp.NrNota = @NrNota and cp.NrModelo = @NrModelo and cp.NrSerie = @NrSerie and cp.IdFornecedor = @IdFornecedor;";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@NrNota", SqlDbType.Int).Value = pNrNota;
                    cmd.Parameters.Add("@NrModelo", SqlDbType.Int).Value = pNrModelo;
                    cmd.Parameters.Add("@NrSerie", SqlDbType.Int).Value = pNrSerie;
                    cmd.Parameters.Add("@IdFornecedor", SqlDbType.Int).Value = pIdFornecedor;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader != null && reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result.Add(new ContaPagarModel
                            {
                                NrNota = pNrNota,
                                NrModelo = pNrModelo,
                                NrSerie = pNrSerie,
                                IdFornecedor = pIdFornecedor,
                                NumParcela = reader.GetInt32("NumParcela"),
                                ValorParcela = reader.GetDecimal("ValorParcela"),
                                DtEmissao = reader.GetDateTime("DtEmissao"),
                                DtVencimento = reader.GetDateTime("DtVencimento"),
                                Desconto = reader.GetDecimal("Desconto"),
                                Juros = reader.GetDecimal("Juros"),
                                Multa = reader.GetDecimal("Multa"),
                                ValorPago = reader.GetDecimal("ValorPago"),
                                DtPagamento = reader.IsDBNull("DtPagamento") ? null : reader.GetDateTime("DtPagamento"),
                                Ativo = reader.GetBoolean("Ativo"),
                                IdFormaPagamento = reader.GetInt32("IdFormaPagamento"),
                                DtCadastro = reader.GetDateTime("DtCadastro"),
                                DtAlteracao = reader.GetDateTime("DtAlteracao"),
                                FormaPagamento = new FormaPagamentoModel
                                {
                                    id = reader.GetInt32("IdFormaPagamento"),
                                    formaPagamento = reader.GetString("FormaPagamento")
                                },
                                Fornecedor = new FornecedorModel
                                {
                                    id = reader.GetInt32("IdFornecedor"),
                                    pessoaRazaoSocial = reader.GetString("FornecedorRazaoSocial")
                                },

                            });
                        }
                    }
                    return result;
                }
                catch (SqlException ex)
                {
                    throw new Exception(ex.Message);
                }
            }
        }
    }
}
