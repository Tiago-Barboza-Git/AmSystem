using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Categoria;
using ApiAmSystem.Domain.Models.Cidade;
using ApiAmSystem.Domain.Models.Estado;
using ApiAmSystem.Domain.Models.Fornecedor;
using ApiAmSystem.Domain.Models.Produto;
using ApiAmSystem.Domain.Models.UnidadeMedida;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Security.Cryptography;
using System.Xml;

namespace ApiAmSystem.Services
{
    public class ProdutosService: IProdutosService
    {
        private readonly SqlConnection sqlConnection;
        public ProdutosService(SqlConnection pSqlConnection)
        {
            this.sqlConnection = pSqlConnection;
        }

        public ProdutoModel GetProduto(int pId)
        {
            try
            {
                using (sqlConnection)
                {
                    sqlConnection.Open();
                    string query = @"
                        select
                            p.Id,
                            p.Produto,
                            p.UnidadeMedida,
                            p.Quantidade,
                            p.PrecoVenda,
                            p.PrecoUltCompra,
                            p.DtUltCompra,
                            p.CustoMedio,
                            p.Observacao,
                            p.Ativo,
                            p.IdFornecedor,
                            p.DtCadastro,
                            p.DtAlteracao,
                            f.Id as 'IdFornecedor',
                            f.FornecedorRazaoSocial
                        from TbProdutos p
                        left join TbFornecedores f on
                            f.Id = p.IdFornecedor
                        where p.Id = @Id;
                    ";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pId;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        reader.Read();
                        return new ProdutoModel
                        {
                            id = reader.GetInt32("Id"),
                            produto = reader.GetString("Produto"),
                            quantidade = reader.GetInt32("Quantidade"),
                            precoVenda = reader.GetDecimal("PrecoVenda"),
                            precoUltCompra = reader.GetDecimal("PrecoUltCompra"),
                            dtUltCompra = reader.GetDateTime("DtUltCompra"),
                            custoMedio = reader.GetDecimal("CustoMedio"),
                            observacao = reader.GetString("Observacao"),
                            idFornecedor = reader.IsDBNull("IdFornecedor") ? null : reader.GetInt32("IdFornecedor"),
                            ativo = reader.GetBoolean("Ativo"),
                            dtCadastro = reader.GetDateTime("DtCadastro"),
                            dtAlteracao = reader.GetDateTime("DtAlteracao"),
                            fornecedor = reader.IsDBNull("IdFornecedor") ? null : new FornecedorModel
                            {
                                id = reader.GetInt32("IdFornecedor"),
                                fornecedorRazaoSocial = reader.GetString("FornecedorRazaoSocial")
                            }
                        };
                    }
                    else
                        return null;
                }
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

        public IEnumerable<ProdutoModel> GetProdutos(bool pAtivos)
        {
            try
            {
                using (sqlConnection)
                {
                    List<ProdutoModel> result = new List<ProdutoModel>();
                    sqlConnection.Open();
                    string query = @"
                        select
                            p.Id,
                            p.Produto,
                            p.Quantidade,
                            p.PrecoVenda,
                            p.PrecoUltCompra,
                            p.DtUltCompra,
                            p.CustoMedio,
                            p.Observacao,
                            p.Ativo,
                            p.DtCadastro,
                            p.DtAlteracao,
                            f.Id as 'IdFornecedor',
                            f.FornecedorRazaoSocial,
                            um.Id as 'IdUnidadeMedida',
                            um.UnidadeMedida as 'UnidadeMedida',
                            um.Simbolo as 'Simbolo',
                            c.Id as 'IdCategoria',
                            c.Categoria as 'Categoria',
                            c.Descricao as 'DescricaoCategoria'
                        from TbProdutos p
                        left join TbFornecedores f on
                            f.Id = p.IdFornecedor
                        inner join TbUnidadesMedidas um on
                            um.Id = p.IdUnidadeMedida
                        inner join TbCategorias c on
                            c.Id = p.IdCategoria
                        where p.Ativo = @Ativo;
                    ";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pAtivos;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result.Add(
                                new ProdutoModel
                                {
                                    id = reader.GetInt32("Id"),
                                    produto = reader.GetString("Produto"),
                                    quantidade = reader.IsDBNull("Quantidade") ? null : reader.GetInt32("Quantidade"),
                                    precoVenda = reader.IsDBNull("PrecoVenda") ? null : Math.Round(reader.GetDecimal("PrecoVenda"),2),
                                    precoUltCompra = reader.IsDBNull("PrecoUltCompra") ? null : Math.Round(reader.GetDecimal("PrecoUltCompra"),2),
                                    dtUltCompra = reader.IsDBNull("DtUltCompra") ? null : reader.GetDateTime("DtUltCompra"),
                                    custoMedio = reader.IsDBNull("CustoMedio") ? null : reader.GetDecimal("CustoMedio"),
                                    observacao = reader.IsDBNull("Observacao") ? null : reader.GetString("Observacao"),
                                    idUnidadeMedida = reader.GetInt32("IdUnidadeMedida"),
                                    idCategoria = reader.GetInt32("IdCategoria"),
                                    idFornecedor = reader.IsDBNull("IdFornecedor") ? null : reader.GetInt32("IdFornecedor"),
                                    ativo = reader.GetBoolean("Ativo"),
                                    dtCadastro = reader.GetDateTime("DtCadastro"),
                                    dtAlteracao = reader.GetDateTime("DtAlteracao"),
                                    unidadeMedida = new UnidadeMedidaModel
                                    {
                                        id = reader.GetInt32("IdUnidadeMedida"),
                                        unidadeMedida = reader.GetString("UnidadeMedida"),
                                        simbolo = reader.GetString("Simbolo"),
                                    },
                                    categoria = new CategoriaModel
                                    {
                                        id = reader.GetInt32("IdCategoria"),
                                        categoria = reader.GetString("Categoria"),
                                        descricao = reader.GetString("DescricaoCategoria")
                                    },
                                    fornecedor = reader.IsDBNull("IdFornecedor") ? null : new FornecedorModel
                                    {
                                        id = reader.GetInt32("IdFornecedor"),
                                        fornecedorRazaoSocial = reader.GetString("FornecedorRazaoSocial")
                                    },

                                });
                        }
                    }
                    return result;
                }
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

        public string PostProduto(ProdutoPostRequest pProduto)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query;
                    if (pProduto.idFornecedor > 0)
                        query = "INSERT INTO TbProdutos(Produto, Quantidade, PrecoVenda, PrecoUltCompra, DtUltCompra, CustoMedio, Observacao, Ativo, IdUnidadeMedida, IdCategoria, IdFornecedor, DtCadastro, DtAlteracao) VALUES(@Produto, @Quantidade, @PrecoVenda, @PrecoUltCompra, @DtUltCompra, @CustoMedio, @Observacao, @Ativo, @IdUnidadeMedida, @IdCategoria, @IdFornecedor, @DtCadastro, @DtAlteracao)";
                    else
                        query = "INSERT INTO TbProdutos(Produto, Quantidade, PrecoVenda, PrecoUltCompra, DtUltCompra, CustoMedio, Observacao, Ativo, IdUnidadeMedida, IdCategoria, DtCadastro, DtAlteracao) VALUES(@Produto, @Quantidade, @PrecoVenda, @PrecoUltCompra, @DtUltCompra, @CustoMedio, @Observacao, @Ativo, @IdUnidadeMedida, @IdCategoria, @DtCadastro, @DtAlteracao)";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Produto", SqlDbType.VarChar).Value = pProduto.produto;
                    cmd.Parameters.Add("@Quantidade", SqlDbType.Int).Value = pProduto.quantidade == null ? DBNull.Value : pProduto.quantidade;
                    cmd.Parameters.Add("@PrecoVenda", SqlDbType.Money).Value = pProduto.precoVenda == null ? DBNull.Value : pProduto.precoVenda;
                    cmd.Parameters.Add("@PrecoUltCompra", SqlDbType.Money).Value = pProduto.precoUltCompra == null ? DBNull.Value : pProduto.precoUltCompra;
                    cmd.Parameters.Add("@DtUltCompra", SqlDbType.Date).Value = pProduto.dtUltCompra == null ? DBNull.Value : pProduto.dtUltCompra;
                    cmd.Parameters.Add("@CustoMedio", SqlDbType.Money).Value = pProduto.custoMedio == null ? DBNull.Value : pProduto.custoMedio;
                    cmd.Parameters.Add("@Observacao", SqlDbType.VarChar).Value = pProduto.observacao == null ? DBNull.Value : pProduto.observacao;
                    cmd.Parameters.Add("@IdUnidadeMedida", SqlDbType.Int).Value = pProduto.idUnidadeMedida;
                    cmd.Parameters.Add("@IdCategoria", SqlDbType.Int).Value = pProduto.idCategoria;
                    cmd.Parameters.Add("@IdFornecedor", SqlDbType.Int).Value = pProduto.idFornecedor == null ? DBNull.Value : pProduto.idFornecedor;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pProduto.ativo;
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

        public string PutProduto(ProdutoPutRequest pProduto)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query;
                    if (pProduto.idFornecedor > 0)
                        query = @"update TbProdutos set Produto = @Produto, Quantidade = @Quantidade, PrecoVenda = @PrecoVenda, 
                                    PrecoUltCompra = @PrecoUltCompra, DtUltCompra = @DtUltCompra, CustoMedio = @CustoMedio, Observacao = @Observacao, IdUnidadeMedida = @IdUnidadeMedida,
                                    IdCategoria = @IdCategoria, IdFornecedor = @IdFornecedor, Ativo = @Ativo, DtAlteracao = @DtAlteracao where Id = @Id";
                    else
                        query = @"update TbProdutos set Produto = @Produto, Quantidade = @Quantidade, PrecoVenda = @PrecoVenda, 
                                    PrecoUltCompra = @PrecoUltCompra, DtUltCompra = @DtUltCompra, CustoMedio = @CustoMedio, Observacao = @Observacao, IdUnidadeMedida = @IdUnidadeMedida,
                                    IdCategoria = @IdCategoria, Ativo = @Ativo, DtAlteracao = @DtAlteracao where Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pProduto.id;
                    cmd.Parameters.Add("@Produto", SqlDbType.VarChar).Value = pProduto.produto;
                    cmd.Parameters.Add("@Quantidade", SqlDbType.Int).Value = pProduto.quantidade == null ? 0 : pProduto.quantidade;
                    cmd.Parameters.Add("@PrecoVenda", SqlDbType.Money).Value = pProduto.precoVenda == null ? 0 : pProduto.precoVenda;
                    cmd.Parameters.Add("@PrecoUltCompra", SqlDbType.Money).Value = pProduto.precoUltCompra == null ? DBNull.Value : pProduto.precoUltCompra;
                    cmd.Parameters.Add("@DtUltCompra", SqlDbType.Date).Value = pProduto.dtUltCompra == null ? DBNull.Value : pProduto.dtUltCompra;
                    cmd.Parameters.Add("@CustoMedio", SqlDbType.Money).Value = pProduto.custoMedio == null ? 0 : pProduto.custoMedio; ;
                    cmd.Parameters.Add("@Observacao", SqlDbType.VarChar).Value = pProduto.observacao == null ? "" : pProduto.observacao;
                    cmd.Parameters.Add("@IdUnidadeMedida", SqlDbType.Int).Value = pProduto.idUnidadeMedida;
                    cmd.Parameters.Add("@IdCategoria", SqlDbType.Int).Value = pProduto.idCategoria;
                    cmd.Parameters.Add("@IdFornecedor", SqlDbType.Int).Value = pProduto.idFornecedor == null ? DBNull.Value : pProduto.idFornecedor;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pProduto.ativo;
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

        public string DeleteProduto(int pId)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = "delete from TbProdutos where Id = @Id";
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
