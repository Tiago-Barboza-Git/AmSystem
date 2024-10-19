using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Categoria;
using Microsoft.Data.SqlClient;
using System.Data;

namespace ApiAmSystem.Services
{
    public class CategoriaService: ICategoriaService
    {
        private readonly SqlConnection sqlConnection;
        public CategoriaService(SqlConnection pSqlConnection) 
        {
            this.sqlConnection = pSqlConnection;
        }

        public IEnumerable<CategoriaModel> GetCategorias(bool pAtivo)
        {
            using (sqlConnection)
            {
                try
                {
                    List<CategoriaModel> result = new List<CategoriaModel>();
                    sqlConnection.Open();
                    string query = @"
                        select
                            c.Id,
                            c.Categoria,
                            c.Descricao,
                            c.Ativo,
                            c.DtCadastro,
                            c.DtAlteracao
                        from
                            TbCategorias c
                        where c.Ativo = @Ativo
                    ";

                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pAtivo;
                    SqlDataReader reader = cmd.ExecuteReader();

                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result.Add(new CategoriaModel
                            {
                                id = reader.GetInt32("Id"),
                                categoria = reader.GetString("Categoria"),
                                descricao = reader.GetString("Descricao"),
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

        public string PostCategoria(CategoriaPostRequest pCategoria)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @"insert into TbCategorias(Categoria, Descricao, Ativo, DtCadastro, DtAlteracao) values(dbo.fn_RemSpaceFromStr(@Categoria), dbo.fn_RemSpaceFromStr(@Descricao), @Ativo, @DtCadastro, @DtAlteracao)";
                    SqlCommand cmd = new SqlCommand (query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Categoria", SqlDbType.VarChar).Value = pCategoria.categoria;
                    cmd.Parameters.Add("@Descricao", SqlDbType.VarChar).Value = pCategoria.descricao == null ? "" : pCategoria.descricao;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pCategoria.ativo;
                    cmd.Parameters.Add("@DtCadastro", SqlDbType.Date).Value = DateTime.Now; 
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.Date).Value = DateTime.Now;
                    cmd.ExecuteNonQuery();
                    return "Categoria adicionado com sucesso!";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 2627 || ex.Number == 2601)
                    {
                        return "Categoria já existente";
                    }
                    return "Erro ao adicionar categoria!";
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }

        public string PutCategoria(CategoriaPutRequest pCategoria)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @"update TbCategorias set Categoria = dbo.fn_RemSpaceFromStr(@Categoria), Descricao = dbo.fn_RemSpaceFromStr(@Descricao), Ativo = @Ativo, DtAlteracao = @DtAlteracao where Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pCategoria.id;
                    cmd.Parameters.Add("@Categoria", SqlDbType.VarChar).Value = pCategoria.categoria;
                    cmd.Parameters.Add("@Descricao", SqlDbType.VarChar).Value = pCategoria.descricao == null ? "" : pCategoria.descricao;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pCategoria.ativo;
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.Date).Value = DateTime.Now;
                    cmd.ExecuteNonQuery();
                    return "Categoria alterada com sucesso!";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 2627 || ex.Number == 2601)
                    {
                        return "Categoria já existente!";
                    }
                    return "Erro ao alterar categoria!";
                }
                finally 
                { 
                    sqlConnection.Close(); 
                }
            }
        }

        public string DeleteCategoria(int pId)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = "delete from TbCategorias where Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pId;
                    cmd.ExecuteNonQuery();
                    return "Categoria deletada com sucesso!";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 547)
                    {
                        return "Cateogria está vinculada a outros registros!";
                    }
                    return "Erro ao deletar categoria!";
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }
    }
}
