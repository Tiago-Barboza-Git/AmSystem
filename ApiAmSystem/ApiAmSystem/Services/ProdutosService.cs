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
        private readonly IFornecedoresService fornecedoresService;
        private readonly IUnidadeMedidaService unidadeMedidaService;
        public ProdutosService(SqlConnection pSqlConnection, IFornecedoresService pIFornecedorService, IUnidadeMedidaService pIUnidadeMedidaService)
        {
            this.sqlConnection = pSqlConnection;
            this.fornecedoresService = pIFornecedorService;
            this.unidadeMedidaService = pIUnidadeMedidaService;
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
                            p.IdUnidadeMedida,
                            p.Quantidade,
                            p.PrecoVenda,
                            p.PrecoUltCompra,
                            p.DtUltCompra,
                            p.CustoMedio,
                            p.Desconto,
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
                            Id = reader.GetInt32("Id"),
                            Produto = reader.GetString("Produto"),
                            Quantidade = reader.GetInt32("Quantidade"),
                            PrecoVenda = reader.GetDecimal("PrecoVenda"),
                            PrecoUltCompra = reader.GetDecimal("PrecoUltCompra"),
                            DtUltCompra = reader.GetDateTime("DtUltCompra"),
                            CustoMedio = reader.GetDecimal("CustoMedio"),
                            Observacao = reader.GetString("Observacao"),
                            Desconto = reader.GetDecimal("Desconto"),
                            IdFornecedor = reader.IsDBNull("IdFornecedor") ? null : reader.GetInt32("IdFornecedor"),
                            Ativo = reader.GetBoolean("Ativo"),
                            DtCadastro = reader.GetDateTime("DtCadastro"),
                            DtAlteracao = reader.GetDateTime("DtAlteracao"),
                            Fornecedor = reader.IsDBNull("IdFornecedor") ? null : fornecedoresService.GetFornecedor(reader.GetInt32("IdFornecedor")),
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
                            p.CustoUnitUltCompra,
                            p.Desconto,
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
                                    Id = reader.GetInt32("Id"),
                                    Produto = reader.GetString("Produto"),
                                    Quantidade = reader.IsDBNull("Quantidade") ? null : reader.GetInt32("Quantidade"),
                                    PrecoVenda = reader.IsDBNull("PrecoVenda") ? null : Math.Round(reader.GetDecimal("PrecoVenda"),2),
                                    PrecoUltCompra = reader.IsDBNull("PrecoUltCompra") ? null : Math.Round(reader.GetDecimal("PrecoUltCompra"),2),
                                    DtUltCompra = reader.IsDBNull("DtUltCompra") ? null : reader.GetDateTime("DtUltCompra"),
                                    CustoMedio = reader.IsDBNull("CustoMedio") ? null : reader.GetDecimal("CustoMedio"),
                                    CustoUnitUltCompra = reader.IsDBNull("CustoUnitUltCompra") ? 0 : reader.GetDecimal("CustoUnitUltCompra"),
                                    Observacao = reader.IsDBNull("Observacao") ? null : reader.GetString("Observacao"),
                                    Desconto = reader.GetDecimal("Desconto"),
                                    IdUnidadeMedida = reader.GetInt32("IdUnidadeMedida"),
                                    IdCategoria = reader.GetInt32("IdCategoria"),
                                    IdFornecedor = reader.IsDBNull("IdFornecedor") ? null : reader.GetInt32("IdFornecedor"),
                                    Ativo = reader.GetBoolean("Ativo"),
                                    DtCadastro = reader.GetDateTime("DtCadastro"),
                                    DtAlteracao = reader.GetDateTime("DtAlteracao"),
                                    UnidadeMedida = new UnidadeMedidaModel
                                    {
                                        id = reader.GetInt32("IdUnidadeMedida"),
                                        unidadeMedida = reader.GetString("UnidadeMedida"),
                                        simbolo = reader.GetString("Simbolo"),
                                    },
                                    Categoria = new CategoriaModel
                                    {
                                        id = reader.GetInt32("IdCategoria"),
                                        categoria = reader.GetString("Categoria"),
                                        descricao = reader.GetString("DescricaoCategoria")
                                    },
                                    Fornecedor = reader.IsDBNull("IdFornecedor") ? null : new FornecedorModel
                                    {
                                        id = reader.GetInt32("IdFornecedor"),
                                        pessoaRazaoSocial = reader.GetString("FornecedorRazaoSocial")
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
                    if (pProduto.IdFornecedor > 0)
                        query = "INSERT INTO TbProdutos(Produto, Quantidade, PrecoVenda, PrecoUltCompra, DtUltCompra, CustoMedio, Desconto, Observacao, Ativo, IdUnidadeMedida, IdCategoria, IdFornecedor, DtCadastro, DtAlteracao) VALUES(dbo.fn_RemSpaceFromStr(@Produto), @Quantidade, @PrecoVenda, @PrecoUltCompra, @DtUltCompra, @CustoMedio, @Desconto, @Observacao, @Ativo, @IdUnidadeMedida, @IdCategoria, @IdFornecedor, @DtCadastro, @DtAlteracao)";
                    else
                        query = "INSERT INTO TbProdutos(Produto, Quantidade, PrecoVenda, PrecoUltCompra, DtUltCompra, CustoMedio, Desconto, Observacao, Ativo, IdUnidadeMedida, IdCategoria, DtCadastro, DtAlteracao) VALUES(dbo.fn_RemSpaceFromStr(@Produto), @Quantidade, @PrecoVenda, @PrecoUltCompra, @DtUltCompra, @CustoMedio, @Desconto, @Observacao, @Ativo, @IdUnidadeMedida, @IdCategoria, @DtCadastro, @DtAlteracao)";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Produto", SqlDbType.VarChar).Value = pProduto.Produto;
                    cmd.Parameters.Add("@Quantidade", SqlDbType.Int).Value = pProduto.Quantidade == null ? DBNull.Value : pProduto.Quantidade;
                    cmd.Parameters.Add("@PrecoVenda", SqlDbType.Money).Value = pProduto.PrecoVenda == null ? DBNull.Value : pProduto.PrecoVenda;
                    cmd.Parameters.Add("@PrecoUltCompra", SqlDbType.Money).Value = pProduto.PrecoUltCompra == null ? DBNull.Value : pProduto.PrecoUltCompra;
                    cmd.Parameters.Add("@DtUltCompra", SqlDbType.Date).Value = pProduto.DtUltCompra == null ? DBNull.Value : pProduto.DtUltCompra;
                    cmd.Parameters.Add("@CustoMedio", SqlDbType.Money).Value = pProduto.CustoMedio == null ? DBNull.Value : pProduto.CustoMedio;
                    cmd.Parameters.Add("@Desconto", SqlDbType.Money).Value = pProduto.Desconto;
                    cmd.Parameters.Add("@Observacao", SqlDbType.VarChar).Value = pProduto.Observacao == null ? DBNull.Value : pProduto.Observacao;
                    cmd.Parameters.Add("@IdUnidadeMedida", SqlDbType.Int).Value = pProduto.IdUnidadeMedida;
                    cmd.Parameters.Add("@IdCategoria", SqlDbType.Int).Value = pProduto.IdCategoria;
                    cmd.Parameters.Add("@IdFornecedor", SqlDbType.Int).Value = pProduto.IdFornecedor == null ? DBNull.Value : pProduto.IdFornecedor;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pProduto.Ativo;
                    cmd.Parameters.Add("@DtCadastro", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd.ExecuteNonQuery();
                    return "Produto adicionado com sucesso!";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 2627 || ex.Number == 2601)
                    {
                        return "Produto já cadastrado!";
                    }
                    return "Erro ao cadastrar produto!";
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
                    if (pProduto.IdFornecedor > 0)
                        query = @"update TbProdutos set Produto = dbo.fn_RemSpaceFromStr(@Produto), Quantidade = @Quantidade, PrecoVenda = @PrecoVenda, 
                                    PrecoUltCompra = @PrecoUltCompra, DtUltCompra = @DtUltCompra, CustoMedio = @CustoMedio, Desconto = @Desconto, Observacao = @Observacao, IdUnidadeMedida = @IdUnidadeMedida,
                                    IdCategoria = @IdCategoria, IdFornecedor = @IdFornecedor, Ativo = @Ativo, DtAlteracao = @DtAlteracao where Id = @Id";
                    else
                        query = @"update TbProdutos set Produto = dbo.fn_RemSpaceFromStr(@Produto), Quantidade = @Quantidade, PrecoVenda = @PrecoVenda, 
                                    PrecoUltCompra = @PrecoUltCompra, DtUltCompra = @DtUltCompra, CustoMedio = @CustoMedio, Desconto = @Desconto, Observacao = @Observacao, IdUnidadeMedida = @IdUnidadeMedida,
                                    IdCategoria = @IdCategoria, Ativo = @Ativo, DtAlteracao = @DtAlteracao where Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pProduto.Id;
                    cmd.Parameters.Add("@Produto", SqlDbType.VarChar).Value = pProduto.Produto;
                    cmd.Parameters.Add("@Quantidade", SqlDbType.Int).Value = pProduto.Quantidade == null ? 0 : pProduto.Quantidade;
                    cmd.Parameters.Add("@PrecoVenda", SqlDbType.Money).Value = pProduto.PrecoVenda == null ? 0 : pProduto.PrecoVenda;
                    cmd.Parameters.Add("@PrecoUltCompra", SqlDbType.Money).Value = pProduto.PrecoUltCompra == null ? DBNull.Value : pProduto.PrecoUltCompra;
                    cmd.Parameters.Add("@DtUltCompra", SqlDbType.Date).Value = pProduto.DtUltCompra == null ? DBNull.Value : pProduto.DtUltCompra;
                    cmd.Parameters.Add("@CustoMedio", SqlDbType.Money).Value = pProduto.CustoMedio == null ? 0 : pProduto.CustoMedio;
                    cmd.Parameters.Add("@Desconto", SqlDbType.Money).Value = pProduto.Desconto;
                    cmd.Parameters.Add("@Observacao", SqlDbType.VarChar).Value = pProduto.Observacao == null ? "" : pProduto.Observacao;
                    cmd.Parameters.Add("@IdUnidadeMedida", SqlDbType.Int).Value = pProduto.IdUnidadeMedida;
                    cmd.Parameters.Add("@IdCategoria", SqlDbType.Int).Value = pProduto.IdCategoria;
                    cmd.Parameters.Add("@IdFornecedor", SqlDbType.Int).Value = pProduto.IdFornecedor == null ? DBNull.Value : pProduto.IdFornecedor;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pProduto.Ativo;
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd.ExecuteNonQuery();
                    return "Produto alterado com sucesso!";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 2627 || ex.Number == 2601)
                    {
                        return "Produto já cadastrado!";
                    }
                    return "Erro ao alterar produto!";
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
                    return "Produto deletado com sucesso!";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 547)
                    {
                        return "Produto está vinculado a outros registros!";
                    }
                    return "Erro ao deletar produto!";
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }
    }
}
