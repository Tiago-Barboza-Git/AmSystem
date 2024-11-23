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
                        left join TbCompras c on c.NrNota = cp.NrNota and c.NrModelo = cp.NrModelo and c.NrSerie = cp.NrSerie and c.IdFornecedor = cp.IdFornecedor
                        left join TbCondicoesPagamentos cpag on cpag.Id = c.IdCondicaoPagamento
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
                                Observacao = reader.GetString("Observacao"),
                                DtEmissao = reader.GetDateTime("DtEmissao"),
                                DtVencimento = reader.GetDateTime("DtVencimento"),
                                Desconto = reader.GetDecimal("Desconto"),
                                Juros = reader.GetDecimal("Juros"),
                                Multa = reader.GetDecimal("Multa"),
                                ValorPago = reader.GetDecimal("ValorPago"),
                                DtPagamento = reader.IsDBNull("DtPagamento") ? null : reader.GetDateTime("DtPagamento"),
                                Cancelada = reader.GetBoolean("Cancelada"),
                                Avulsa = reader.GetBoolean("Avulsa"),
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
                                    juros = reader.IsDBNull("JurosCondPag") ? 0 : reader.GetDecimal("JurosCondPag"),
                                    multa = reader.IsDBNull("MultaCondPag") ? 0 : reader.GetDecimal("MultaCondPag"),
                                    desconto = reader.IsDBNull("DescontoCondPag") ? 0 : reader.GetDecimal("DescontoCondPag"),
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
                                    cp.DtCancelamento,
	                                cp.Desconto,
	                                cp.Juros,
	                                cp.Multa,
	                                cp.ValorPago,
	                                cp.DtPagamento,
                                    cp.Cancelada,
                                    cp.Avulsa,
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
                                DtCancelamento = reader.IsDBNull("DtCancelamento") ? null : reader.GetDateTime("DtCancelamento"),
                                Cancelada = reader.GetBoolean("Cancelada"),
                                Avulsa = reader.GetBoolean("Avulsa"),
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

        public string PostContaPagarAvulsa(ContaPagarAvulsaPostRequest pContaPagar)
        {
            using (sqlConnection)
            {
                try
                {
                    this.sqlConnection.Open();
                    SqlCommand cmd;

                    string query = $@"
                        ALTER TABLE TbContasPagar NOCHECK CONSTRAINT FK_ContaPagar_Compra;                
        
                        insert into TbContasPagar(NrNota, NrModelo, NrSerie, IdFornecedor, IdFormaPagamento, NumParcela, ValorParcela, DtEmissao, DtVencimento, DtPagamento, Juros, Multa, Desconto, ValorPago, Observacao, DtCadastro, DtAlteracao, Cancelada, Avulsa) 
                        values(@NrNota, @NrModelo, @NrSerie, @IdFornecedor, @IdFormaPagamento, @NumParcela, @ValorParcela, @DtEmissao, @DtVencimento, @DtPagamento, @Juros, @Multa, @Desconto, @ValorPago, @Observacao, @DtCadastro, @DtAlteracao, @Cancelada, @Avulsa);

                        ALTER TABLE TbContasPagar CHECK CONSTRAINT FK_ContaPagar_Compra;
                        ";

                    cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.AddWithValue("@NrNota", pContaPagar.NrNota);
                    cmd.Parameters.AddWithValue("@NrModelo", pContaPagar.NrModelo);
                    cmd.Parameters.AddWithValue("@NrSerie", pContaPagar.NrSerie);
                    cmd.Parameters.AddWithValue("@IdFormaPagamento", pContaPagar.IdFormaPagamento);
                    cmd.Parameters.AddWithValue("@IdFornecedor", pContaPagar.IdFornecedor);
                    cmd.Parameters.AddWithValue("@NumParcela", pContaPagar.NumParcela);
                    cmd.Parameters.AddWithValue("@ValorParcela", pContaPagar.ValorParcela);
                    cmd.Parameters.AddWithValue("@DtEmissao", pContaPagar.DtEmissao);
                    cmd.Parameters.AddWithValue("@DtVencimento", pContaPagar.DtVencimento);
                    cmd.Parameters.AddWithValue("@DtPagamento", pContaPagar.DtPagamento);
                    cmd.Parameters.AddWithValue("@Juros", pContaPagar.Juros);
                    cmd.Parameters.AddWithValue("@Multa", pContaPagar.Multa);
                    cmd.Parameters.AddWithValue("@Desconto", pContaPagar.Desconto);
                    cmd.Parameters.AddWithValue("@ValorPago", pContaPagar.ValorPago);
                    cmd.Parameters.AddWithValue("@Observacao", pContaPagar.Observacao);
                    cmd.Parameters.AddWithValue("@DtCadastro", DateTime.Now);
                    cmd.Parameters.AddWithValue("@DtAlteracao", DateTime.Now);
                    cmd.Parameters.AddWithValue("@Cancelada", false);
                    cmd.Parameters.AddWithValue("@Avulsa", true);
                    cmd.ExecuteNonQuery();

                    return "Conta a pagar adicionada com sucesso!";
                }
                catch (SqlException ex)
                {
                    return "Erro ao adicionar conta a pagar";
                }
                finally
                {
                    this.sqlConnection.Close();
                }
            }
        }

        public string PutCancelarContaPagarAvulsa(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = $@"update TbContasPagar set DtCancelamento = '{DateTime.Now.ToString("yyyy-MM-dd")}', Cancelada = 1 where NrNota = {pNrNota} and NrModelo = {pNrModelo} and NrSerie = {pNrSerie} and IdFornecedor = {pIdFornecedor}";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.ExecuteNonQuery();
                    return "Conta a pagar cancelada com sucesso!";

                }
                catch (SqlException ex)
                {
                    return "Erro ao cancelar conta a pagar!";
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }
    }
}
