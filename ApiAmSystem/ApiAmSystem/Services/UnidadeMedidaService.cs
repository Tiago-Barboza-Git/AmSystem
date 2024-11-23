using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.UnidadeMedida;
using Microsoft.Data.SqlClient;
using System.Data;

namespace ApiAmSystem.Services
{
    public class UnidadeMedidaService: IUnidadeMedidaService
    {
        private readonly SqlConnection sqlConnection;
        public UnidadeMedidaService(SqlConnection pSqlConnection)
        {
            this.sqlConnection = pSqlConnection;
        }

        public IEnumerable<UnidadeMedidaModel> GetUnidadesMedidas(bool pAtivo)
        {
            using (sqlConnection)
            {
                try
                {
                    List<UnidadeMedidaModel> result = new List<UnidadeMedidaModel>();
                    sqlConnection.Open();
                    string query = @"
                        select
                            u.Id,
                            u.UnidadeMedida,
                            u.Simbolo,
                            u.Ativo,
                            u.DtCadastro,
                            u.DtAlteracao
                        from 
                            TbUnidadesMedidas u
                        where u.Ativo = @Ativo
                        ";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pAtivo;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result.Add(new UnidadeMedidaModel
                            {
                                id = reader.GetInt32("Id"),
                                unidadeMedida = reader.GetString("UnidadeMedida"),
                                simbolo = reader.IsDBNull("UnidadeMedida") ? "" : reader.GetString("Simbolo"),
                                ativo = reader.GetBoolean("Ativo"),
                                dtCadastro = reader.GetDateTime("DtCadastro"),
                                dtAlteracao = reader.GetDateTime("DtAlteracao")

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
                    sqlConnection.Close();
                }
            }
        }

        public string PostUnidadeMedida(UnidadeMedidaPostRequest pUnidadeMedida)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = "insert into TbUnidadesMedidas(UnidadeMedida,Simbolo,Ativo,DtCadastro,DtAlteracao) values(dbo.fn_RemSpaceFromStr(@UnidadeMedida),dbo.fn_RemSpaceFromStr(@Simbolo),@Ativo,@DtCadastro,@DtAlteracao)";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@UnidadeMedida", SqlDbType.VarChar).Value = pUnidadeMedida.unidadeMedida;
                    cmd.Parameters.Add("@simbolo", SqlDbType.VarChar).Value = pUnidadeMedida.unidadeMedida == null ? "" : pUnidadeMedida.simbolo;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pUnidadeMedida.ativo;
                    cmd.Parameters.Add("@DtCadastro", SqlDbType.Date).Value = DateTime.Now;
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.Date).Value = DateTime.Now;
                    cmd.ExecuteNonQuery();
                    return "Unidade de medida adicionada com sucesso!";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 2627 || ex.Number == 2601)
                        return "Unidade de Medida já cadastrada!";
                    return "Erro ao adicionar unidade de medida!";
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }

        public string PutUnidadeMedida(UnidadeMedidaPutRequest pUnidadeMedida)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = "update TbUnidadesMedidas set UnidadeMedida = dbo.fn_RemSpaceFromStr(@UnidadeMedida), Simbolo = dbo.fn_RemSpaceFromStr(@Simbolo), Ativo = @Ativo, DtCadastro = @DtCadastro, DtAlteracao = @DtAlteracao where Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pUnidadeMedida.id;
                    cmd.Parameters.Add("@UnidadeMedida", SqlDbType.VarChar).Value = pUnidadeMedida.unidadeMedida;
                    cmd.Parameters.Add("@simbolo", SqlDbType.VarChar).Value = pUnidadeMedida.unidadeMedida == null ? "" : pUnidadeMedida.simbolo;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pUnidadeMedida.ativo;
                    cmd.Parameters.Add("@DtCadastro", SqlDbType.Date).Value = DateTime.Now;
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.Date).Value = DateTime.Now;
                    cmd.ExecuteNonQuery();
                    return "Unidade de medida alterada com sucesso!";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 2627 || ex.Number == 2601)
                        return "Unidade de Medida já cadastrada!";
                    return "Erro ao cadastrar unidade de medida!";
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }

        public string DeleteUnidadeMedida(int pId)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = "delete from TbUnidadesMedidas where Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pId;
                    cmd.ExecuteNonQuery();
                    return "Unidade de medida deletada com sucesso!";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 547)
                    {
                        return "Unidade de medida está vinculada a outros registros!";
                    }
                    return "Erro ao deletar unidade de medida!";
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }
    }
}
