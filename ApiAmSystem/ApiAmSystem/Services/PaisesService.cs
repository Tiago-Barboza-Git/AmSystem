using ApiAmSystem.Domain.Models.Pais;
using ApiAmSystem.Interfaces;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using System.Data;

namespace ApiAmSystem.Services
{
    public class PaisesService: IPaisesService
    {
        private readonly SqlConnection sqlConnection;
        private readonly IMappings mappings;
        public PaisesService(SqlConnection pSqlConnection, IMappings pMappings)
        {
            this.sqlConnection = pSqlConnection;
            this.mappings = pMappings;
        }

        public PaisModel GetPais(int pId)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = "SELECT * FROM TbPaises WHERE Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pId;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        reader.Read();
                        return mappings.ReaderToObj<PaisModel>(reader);
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

        public IEnumerable<PaisModel> GetPaises(bool pAtivo)
        {
            List<PaisModel> result = new List<PaisModel>();
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = pAtivo == true ? "SELECT * FROM TbPaises WHERE Ativo = 1" : "SELECT * FROM TbPaises WHERE Ativo = 0";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    SqlDataReader reader = cmd.ExecuteReader();
                    PaisModel Pais = new PaisModel();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result.Add(mappings.ReaderToObj<PaisModel>(reader));
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

        public string PostPais(PaisPostRequest pPais)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = "INSERT INTO TbPaises(Pais, DDI, Sigla, Ativo, DtCadastro, DtAlteracao) values(@Pais, @DDI, @Sigla, @Ativo, @DtCadastro, @DtAlteracao);";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Pais", SqlDbType.VarChar).Value = pPais.pais;
                    cmd.Parameters.Add("@DDI", SqlDbType.Int).Value = pPais.ddi;
                    cmd.Parameters.Add("@Sigla", SqlDbType.VarChar).Value = pPais.sigla;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pPais.ativo;
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

        public string PutPais(PaisPutRequest pPais)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = "UPDATE TbPaises SET Pais = @Pais, DDI = @DDI, Sigla = @Sigla, Ativo = @Ativo, DtAlteracao = @DtAlteracao WHERE Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pPais.id;
                    cmd.Parameters.Add("@Pais", SqlDbType.VarChar).Value = pPais.pais;
                    cmd.Parameters.Add("@DDI", SqlDbType.Int).Value = pPais.ddi;
                    cmd.Parameters.Add("@Sigla", SqlDbType.VarChar).Value = pPais.sigla;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pPais.ativo;
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

        public string DeletePais(int pId)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = "DELETE FROM TbPaises WHERE Id = @Id";
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
