using ApiAmSystem.Domain.Models.Cidade;
using ApiAmSystem.Domain.Models.Estado;
using ApiAmSystem.Domain.Models.Pais;
using ApiAmSystem.Interfaces;
using Microsoft.Data.SqlClient;
using System.Data;
using System.IO.Pipelines;

namespace ApiAmSystem.Services
{
    public class CidadesService: ICidadesService
    {
        private readonly SqlConnection sqlConnection;
        private readonly IEstadosService estadosService;
        public CidadesService(SqlConnection pSqlConnection, IEstadosService pIEstadosService)
        {
            this.sqlConnection = pSqlConnection;
            this.estadosService = pIEstadosService;
        }

        public CidadeModel GetCidade(int pId)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @"
                        SELECT
	                        c.Id AS 'Id',
	                        c.Cidade AS 'Cidade',
	                        c.DDD AS 'DDD',
	                        c.Ativo AS 'Ativo',
	                        c.DtCadastro AS 'DtCadastro',
	                        c.DtAlteracao AS 'DtAlteracao',
	                        e.Id AS 'IdEstado',
	                        e.Estado AS 'Estado'
                            e.Uf,
                            e.IdPais,
                            p.Pais,
                            p.Sigla
                        FROM TbCidades c
                        INNER JOIN TbEstados e ON
	                        c.IdEstado = e.Id
                        inner join TbPaises p on p.Id = e.IdPais
                        WHERE c.Id = @Id;
                    ";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pId;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        reader.Read();
                        return new CidadeModel
                        {
                            id = reader.GetInt32("Id"),
                            cidade = reader.GetString("Cidade"),
                            ddd = reader.GetInt32("DDD"),
                            ativo = reader.GetBoolean("Ativo"),
                            dtCadastro = reader.GetDateTime("DtCadastro"),
                            dtAlteracao = reader.GetDateTime("DtAlteracao"),
                            idEstado = reader.GetInt32("IdEstado"),
                            estado = new EstadoModel
                            {
                                id = reader.GetInt32("IdEstado"),
                                estado = reader.GetString("Estado"),
                                uf = reader.GetString("Uf"),
                                pais = new PaisModel
                                {
                                    id = reader.GetInt32("IdPais"),
                                    pais = reader.GetString("Pais"),
                                    sigla = reader.GetString("Sigla")
                                }
                            }
                        };
                    }
                    else
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

        public IEnumerable<CidadeModel> GetCidades(bool pAtivo)
        {
            List<CidadeModel> result = new List<CidadeModel>();
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @"
                        SELECT
                            c.Id AS 'Id',
                            c.Cidade AS 'Cidade',
                            c.DDD AS 'DDD',
                            c.Ativo AS 'Ativo',
                            c.DtCadastro AS 'DtCadastro',
                            c.DtAlteracao AS 'DtAlteracao',
                            c.IdEstado AS 'IdEstado',
                            e.Estado,
                            e.Uf,
                            e.IdPais,
                            p.Pais,
                            p.Sigla
                        FROM TbCidades c 
                        inner join TbEstados e on e.Id = c.IdEstado
                        inner join TbPaises p on p.Id = e.IdPais
                        WHERE c.Ativo = @Ativo;
                    ";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pAtivo;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result.Add(
                                new CidadeModel
                                {
                                    id = reader.GetInt32("Id"),
                                    cidade = reader.GetString("Cidade"),
                                    ddd = reader.GetInt32("DDD"),
                                    ativo = reader.GetBoolean("Ativo"),
                                    dtCadastro = reader.GetDateTime("DtCadastro"),
                                    dtAlteracao = reader.GetDateTime("DtAlteracao"),
                                    idEstado = reader.GetInt32("IdEstado"),
                                    estado = new EstadoModel
                                    {
                                        id = reader.GetInt32("IdEstado"),
                                        estado = reader.GetString("Estado"),
                                        uf = reader.GetString("Uf"),
                                        pais = new PaisModel
                                        {
                                            id = reader.GetInt32("IdPais"),
                                            pais = reader.GetString("Pais"),
                                            sigla = reader.GetString("Sigla")
                                        }
                                    }
                                }
                            );
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

        public string PostCidade(CidadePostRequest pCidade)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = "INSERT INTO TbCidades(Cidade, DDD, Ativo, IdEstado, DtCadastro, DtAlteracao) VALUES(@Cidade, @DDD, @Ativo, @IdEstado, @DtCadastro, @DtAlteracao)";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Cidade", SqlDbType.VarChar).Value = pCidade.cidade;
                    cmd.Parameters.Add("@DDD", SqlDbType.VarChar).Value = pCidade.ddd;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pCidade.ativo;
                    cmd.Parameters.Add("@IdEstado", SqlDbType.Int).Value = pCidade.idEstado;
                    cmd.Parameters.Add("@DtCadastro", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
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

        public string PutCidade(CidadePutRequest pCidade)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = "UPDATE TbCidades SET Cidade = @Cidade, DDD = @ddd, Ativo = @Ativo, IdEstado = @IdEstado, DtAlteracao = @DtAlteracao WHERE Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pCidade.id;
                    cmd.Parameters.Add("@Cidade", SqlDbType.VarChar).Value = pCidade.cidade;
                    cmd.Parameters.Add("@DDD", SqlDbType.VarChar).Value = pCidade.ddd;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pCidade.ativo;
                    cmd.Parameters.Add("@IdEstado", SqlDbType.Int).Value = pCidade.idEstado;
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
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

        public string DeleteCidade(int pId)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = "DELETE FROM TbCidades WHERE Id = @Id";
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
