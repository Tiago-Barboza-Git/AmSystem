using ApiAmSystem.Domain.Models.Estado;
using ApiAmSystem.Domain.Models.Pais;
using ApiAmSystem.Interfaces;
//using ApiAmSystem.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace ApiAmSystem.Services
{
    public class EstadosService: IEstadosService
    {
        private readonly SqlConnection sqlConnection;
        private readonly IMappings mappings;
        public EstadosService(SqlConnection pSqlConnection, IMappings pMappings) 
        {
            this.sqlConnection = pSqlConnection;
            this.mappings = pMappings;
        }
        
        public EstadoModel GetEstado(int pId)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @"
                        SELECT 
	                        e.Id AS 'Id',
	                        e.Estado AS 'Estado',
	                        e.Uf AS 'Uf',
	                        e.Ativo AS 'Ativo',
	                        e.DtCadastro AS 'DtCadastro',
	                        e.DtAlteracao AS 'DtAlteracao',
	                        p.Id AS 'IdPais',
	                        p.Pais AS 'Pais'
                        FROM TbEstados e
                        INNER JOIN TbPaises p on
	                        p.Id = e.IdPais
                        WHERE e.Id = @Id
                    ";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pId;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        reader.Read();
                        return new EstadoModel
                        {
                            id = reader.GetInt32(reader.GetOrdinal("Id")),
                            estado = reader.GetString(reader.GetOrdinal("Estado")),
                            uf = reader.GetString(reader.GetOrdinal("Uf")),
                            ativo = reader.GetBoolean(reader.GetOrdinal("Ativo")),
                            dtCadastro = reader.GetDateTime(reader.GetOrdinal("DtCadastro")),
                            dtAlteracao = reader.GetDateTime(reader.GetOrdinal("DtAlteracao")),
                            idPais = reader.GetInt32(reader.GetOrdinal("IdPais")),
                            pais = new PaisModel
                            {
                                id = reader.GetInt32(reader.GetOrdinal("IdPais")),
                                pais = reader.GetString(reader.GetOrdinal("Pais"))
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

        public IEnumerable<EstadoModel> GetEstados(bool pAtivo)
        {
            List<EstadoModel> result = new List<EstadoModel>();
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @"
                        SELECT 
                            e.Id AS 'Id',
                            e.Estado AS 'Estado',
                            e.Uf AS 'Uf',
                            e.Ativo AS 'Ativo',
                            e.DtCadastro AS 'DtCadastro',
                            e.DtAlteracao AS 'DtAlteracao',
                            p.Id AS 'IdPais',
                            p.Pais AS 'Pais'
                        FROM TbEstados e
                        INNER JOIN TbPaises p on
                            p.Id = e.IdPais
                        WHERE e.Ativo = @Ativo
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
                                new EstadoModel
                                {
                                    id = reader.GetInt32(reader.GetOrdinal("Id")),
                                    estado = reader.GetString(reader.GetOrdinal("Estado")),
                                    uf = reader.GetString(reader.GetOrdinal("Uf")),
                                    ativo = reader.GetBoolean(reader.GetOrdinal("Ativo")),
                                    dtCadastro = reader.GetDateTime(reader.GetOrdinal("DtCadastro")),
                                    dtAlteracao = reader.GetDateTime(reader.GetOrdinal("DtAlteracao")),
                                    idPais = reader.GetInt32(reader.GetOrdinal("IdPais")),
                                    pais = new PaisModel
                                    {
                                        id = reader.GetInt32(reader.GetOrdinal("IdPais")),
                                        pais = reader.GetString(reader.GetOrdinal("Pais"))
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
                    sqlConnection.Close();
                }
            }
        }

        public string PostEstado(EstadoPostRequest pEstado)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = "INSERT INTO TbEstados(Estado, Uf, Ativo, IdPais, DtCadastro, DtAlteracao) VALUES(@Estado, @Uf, @Ativo, @IdPais, @DtCadastro, @DtAlteracao)";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Estado", SqlDbType.VarChar).Value = pEstado.estado;
                    cmd.Parameters.Add("@Uf", SqlDbType.VarChar).Value = pEstado.uf;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pEstado.ativo;
                    cmd.Parameters.Add("@IdPais", SqlDbType.Int).Value = pEstado.idPais;
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

        public string PutEstado(EstadoPutRequest pEstado)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = "UPDATE TbEstados SET Estado = @Estado, Uf = @Uf, Ativo = @Ativo, IdPais = @IdPais, DtAlteracao = @DtAlteracao WHERE Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pEstado.id;
                    cmd.Parameters.Add("@Estado", SqlDbType.VarChar).Value = pEstado.estado;
                    cmd.Parameters.Add("@Uf", SqlDbType.VarChar).Value = pEstado.uf;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pEstado.ativo;
                    cmd.Parameters.Add("@IdPais", SqlDbType.Int).Value = pEstado.idPais;
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

        public string DeleteEstado(int pId)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = "DELETE FROM TbEstados WHERE Id = @Id";
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
