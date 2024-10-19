using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.FormaPagamento;
using Microsoft.Data.SqlClient;
using System.Data;

namespace ApiAmSystem.Services
{
    public class FormasPagamentosService: IFormasPagamentosService
    {
        private readonly SqlConnection sqlConnection;

        public FormasPagamentosService(SqlConnection pSqlConnection)
        {
            this.sqlConnection = pSqlConnection;
        }

        public FormaPagamentoModel GetFormaPagamento(int pId)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Close();
                    string query = @"
                        select
                            f.Id,
                            f.FormaPagamento,
                            f.Ativo,
                            f.DtCadastro,
                            f.DtAlteracao
                        from TbFormasPagamentos f
                        where f.Id = @Id;
                    ";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pId;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        reader.Read();
                        return new FormaPagamentoModel
                        {
                            id = reader.GetInt32("Id"),
                            formaPagamento = reader.GetString("FormaPagamento"),
                            ativo = reader.GetBoolean("Ativo"),
                            dtCadastro = reader.GetDateTime("DtCadastro"),
                            dtAlteracao = reader.GetDateTime("DtAlteracao")
                        };
                    }
                    return null;
                }
                catch (SqlException ex)
                {
                    throw new Exception(ex.Message);
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }

        public IEnumerable<FormaPagamentoModel> GetFormasPagamentos(bool pAtivo)
        {
            using (sqlConnection)
            {
                try
                {
                    List<FormaPagamentoModel> result = new List<FormaPagamentoModel>();
                    sqlConnection.Open();
                    string query = @"
                        select
                            f.Id,
                            f.FormaPagamento,
                            f.Ativo,
                            f.DtCadastro,
                            f.DtAlteracao
                        from TbFormasPagamentos f
                        where f.Ativo = @Ativo";

                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pAtivo;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result.Add(new FormaPagamentoModel
                            {
                                id = reader.GetInt32("Id"),
                                formaPagamento = reader.GetString("FormaPagamento"),
                                ativo = reader.GetBoolean("Ativo"),
                                dtCadastro = reader.GetDateTime("DtCadastro"),
                                dtAlteracao = reader.GetDateTime("DtAlteracao")
                            });
                        }
                    }

                    return result;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }

        public string PostFormaPagamento(FormaPagamentoPostRequest pFormaPagamento)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @"
                        insert into TBFormasPagamentos(FormaPagamento, Ativo, DtCadastro, DtAlteracao)
                        values(dbo.fn_RemSpaceFromStr(@FormaPagamento), @Ativo, @DtCadastro, @DtAlteracao);";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@FormaPagamento", SqlDbType.VarChar).Value = pFormaPagamento.formaPagamento;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pFormaPagamento.ativo;
                    cmd.Parameters.Add("@DtCadastro", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd.ExecuteNonQuery();
                    return "Sucesso";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 2627 || ex.Number == 2601)
                    {
                        return "Forma de pagamento já existente";
                    }
                    return ex.Message;
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }

        public string PutFormaPagamento(FormaPagamentoPutRequest pFormaPagamento)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @"
                        update TbFormasPagamentos set
                            FormaPagamento = dbo.fn_RemSpaceFromStr(@FormaPagamento), Ativo = @Ativo, DtAlteracao = @DtAlteracao
                        where Id = @Id;";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pFormaPagamento.id;
                    cmd.Parameters.Add("@FormaPagamento", SqlDbType.VarChar).Value = pFormaPagamento.formaPagamento;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pFormaPagamento.ativo;
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd.ExecuteNonQuery();
                    return "Sucesso";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 2627 || ex.Number == 2601)
                    {
                        return "Forma de pagamento já existente";
                    }
                    return ex.Message;
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }

        public string DeleteFormaPagamento(int pId)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @"delete from TbFormasPagamentos where Id = @Id;";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pId;
                    cmd.ExecuteNonQuery();
                    return "Sucesso";
                }
                catch (SqlException ex)
                {
                    throw new Exception(ex.Message);
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }
    }
}
