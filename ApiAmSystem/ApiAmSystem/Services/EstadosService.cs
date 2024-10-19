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
        private readonly IPaisesService paisesService;
        public EstadosService(SqlConnection pSqlConnection, IPaisesService pIPaisesService) 
        {
            this.sqlConnection = pSqlConnection;
            this.paisesService = pIPaisesService;
        }
        
        public EstadoModel GetEstado(int pId)
        {
            using (SqlConnection connection = new SqlConnection("Server=DESKTOP-JPC14RO;Database=AmSystem;Trusted_Connection=True;Integrated Security=true;TrustServerCertificate=True"))
            {
                try
                {
                    connection.Open();
                    string query = @"
                        SELECT 
	                        e.Id AS 'Id',
	                        e.Estado AS 'Estado',
	                        e.Uf AS 'Uf',
	                        e.Ativo AS 'Ativo',
	                        e.DtCadastro AS 'DtCadastro',
	                        e.DtAlteracao AS 'DtAlteracao',
	                        e.IdPais,
	                        p.Pais,
                            p.Sigla
                        FROM TbEstados e
                        INNER JOIN TbPaises p on
	                        p.Id = e.IdPais
                        WHERE e.Id = @Id
                    ";
                    SqlCommand cmd = new SqlCommand(query, connection);
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
                                id = reader.GetInt32("IdPais"),
                                pais = reader.GetString("Pais"),
                                sigla = reader.GetString("Sigla")
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
                            e.IdPais AS 'IdPais',
                        	p.Pais,
	                        p.Sigla
                        FROM TbEstados e
                        inner join TbPaises p on e.IdPais = p.Id
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
                                        id = reader.GetInt32("IdPais"),
                                        pais = reader.GetString("Pais"),
                                        sigla = reader.GetString("Sigla")
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
                    sqlConnection.CloseAsync();
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
                    string query = "INSERT INTO TbEstados(Estado, Uf, Ativo, IdPais, DtCadastro, DtAlteracao) VALUES(dbo.fn_RemSpaceFromStr(@Estado), @Uf, @Ativo, @IdPais, @DtCadastro, @DtAlteracao)";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Estado", SqlDbType.VarChar).Value = pEstado.estado;
                    cmd.Parameters.Add("@Uf", SqlDbType.VarChar).Value = pEstado.uf;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pEstado.ativo;
                    cmd.Parameters.Add("@IdPais", SqlDbType.Int).Value = pEstado.idPais;
                    cmd.Parameters.Add("@DtCadastro", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd.ExecuteNonQuery();
                    return "Estado adicionado com sucesso!";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 2627 || ex.Number == 2601)
                    {
                        return "Estado já cadastrado!";
                    }
                    return "Erro ao adicionar estado!";
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
                    string query = "UPDATE TbEstados SET Estado = dbo.fn_RemSpaceFromStr(@Estado), Uf = @Uf, Ativo = @Ativo, IdPais = @IdPais, DtAlteracao = @DtAlteracao WHERE Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pEstado.id;
                    cmd.Parameters.Add("@Estado", SqlDbType.VarChar).Value = pEstado.estado;
                    cmd.Parameters.Add("@Uf", SqlDbType.VarChar).Value = pEstado.uf;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pEstado.ativo;
                    cmd.Parameters.Add("@IdPais", SqlDbType.Int).Value = pEstado.idPais;
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd.ExecuteNonQuery();
                    return "Estado alterado com sucesso!";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 2627 || ex.Number == 2601)
                    {
                        return "Estado já cadastrado!";
                    }
                    return "Erro ao alterar o estado!";
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
                    return "País deletado com sucesso!";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 547)
                    {
                        return "Estado está vinculado a outros registros!";
                    }
                    return "Erro ao deletar estado!";
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }
    }
}
