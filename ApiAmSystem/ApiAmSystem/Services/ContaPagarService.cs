using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Compra.ContaPagar;
using ApiAmSystem.Domain.Models.CondicaoPagamento;
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
	                        fp.FormaPagamento,
	                        cpag.Juros as 'JurosCondPag',
	                        cpag.Desconto as 'DescontoCondPag',
	                        cpag.Multa as 'MultaCondPag'
                        from TbContasPagar cp
                        inner join TbFornecedores f on f.Id = cp.IdFornecedor
                        inner join TbFormasPagamentos fp on fp.Id = cp.IdFormaPagamento
                        inner join TbCompras c on c.NrNota = cp.NrNota and c.NrModelo = cp.NrModelo and c.NrSerie = cp.NrSerie and c.IdFornecedor = cp.IdFornecedor
                        inner join TbCondicoesPagamentos cpag on cpag.Id = c.IdCondicaoPagamento
                        where cp.Cancelada = @Ativo;
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
                                Cancelada = reader.GetBoolean("Cancelada"),
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
                                CondicaoPagamento = new CondicaoPagamentoModel
                                {
                                    juros = reader.GetDecimal("JurosCondPag"),
                                    multa = reader.GetDecimal("MultaCondPag"),
                                    desconto = reader.GetDecimal("DescontoCondPag"),
                                }

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
        }

        public IEnumerable<ContaPagarModel> GetContasPagarByCompra(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor)
        {
            using (SqlConnection conn = new SqlConnection("Server=DESKTOP-JPC14RO;Database=AmSystem;Trusted_Connection=True;Integrated Security=True;TrustServerCertificate=True;MultipleActiveResultSets=True;"))
            {
                try
                {
                    conn.Open();
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
                                    cp.Cancelada,
	                                cp.IdFormaPagamento,
	                                cp.DtCadastro,
	                                cp.DtAlteracao,
                                    cp.Observacao,
	                                fp.FormaPagamento,
                                    cp.IdFornecedor,
	                                f.FornecedorRazaoSocial
                                from TbContasPagar cp
                                inner join TbFormasPagamentos fp on fp.Id = cp.IdFormaPagamento
                                inner join TbFornecedores f on f.Id = cp.IdFornecedor
                                where cp.NrNota = @NrNota and cp.NrModelo = @NrModelo and cp.NrSerie = @NrSerie and cp.IdFornecedor = @IdFornecedor;";
                    SqlCommand cmd = new SqlCommand(query, conn);
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
                                Cancelada = reader.GetBoolean("Cancelada"),
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
                finally
                {
                    conn.Close();
                }
            }
        }

        public string PutContaPagar(ContaPagarPutRequest pContaPagar)
        {
            using (this.sqlConnection)
            {
                try
                {
                    this.sqlConnection.Open();
                    string query = $@"update TbContasPagar set 
                                        DtPagamento = @DtPagamento, Juros = @Juros, Desconto = @Desconto, Multa = @Multa, ValorPago = @ValorPago, DtAlteracao = @DtAlteracao, Observacao = @Observacao
                                      where
                                        NrNota = @NrNota and NrModelo = @NrModelo and NrSerie = @NrSerie and IdFornecedor = @IdFornecedor and NumParcela = @NumParcela;";
                    SqlCommand cmd = new SqlCommand(query, this.sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@DtPagamento", SqlDbType.Date).Value = pContaPagar.DtPagamento;
                    cmd.Parameters.Add("@Juros", SqlDbType.Money).Value = pContaPagar.Juros;
                    cmd.Parameters.Add("@Desconto", SqlDbType.Money).Value = pContaPagar.Desconto;
                    cmd.Parameters.Add("@Multa", SqlDbType.Money).Value = pContaPagar.Multa;
                    cmd.Parameters.Add("@ValorPago", SqlDbType.Money).Value = pContaPagar.ValorPago;
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.DateTime).Value = DateTime.Now;
                    cmd.Parameters.Add("@NrNota", SqlDbType.Int).Value = pContaPagar.NrNota;
                    cmd.Parameters.Add("@NrModelo", SqlDbType.Int).Value = pContaPagar.NrModelo;
                    cmd.Parameters.Add("@NrSerie", SqlDbType.Int).Value = pContaPagar.NrSerie;
                    cmd.Parameters.Add("@IdFornecedor", SqlDbType.Int).Value = pContaPagar.IdFornecedor;
                    cmd.Parameters.Add("@NumParcela", SqlDbType.Int).Value = pContaPagar.NumParcela;
                    cmd.Parameters.Add("@Observacao", SqlDbType.VarChar).Value = pContaPagar.Observacao;
                    cmd.ExecuteNonQuery();

                    return "Sucesso";
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
        }
    }
}
