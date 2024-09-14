using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Compra;
using ApiAmSystem.Domain.Models.CompraProdutos;
using ApiAmSystem.Domain.Models.ProdutoCompra;
using ApiAmSystem.Domain.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using ApiAmSystem.Domain.Models.Fornecedor;
using ApiAmSystem.Domain.Models.CondicaoPagamento;

namespace ApiAmSystem.Services
{
    public class CompraService: ICompraService
    {
        private readonly SqlConnection sqlConnection;
        private readonly IProdutoCompraService produtoCompraService;
        private readonly IContaPagarService contaPagarService;
        public CompraService(SqlConnection pSqlConnection, IProdutoCompraService pIProdutoCompraService, IContaPagarService pIContaPagarService)
        {
            this.sqlConnection = pSqlConnection;
            this.produtoCompraService = pIProdutoCompraService;
            this.contaPagarService = pIContaPagarService;
        }

        public CompraModel GetCompra(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @"
                        select
                            *
                        from TbCompras
                        where NrNota = @NrNota and NrModelo = @NrModelo and NrSerie = @NrSerie and IdFornecedor = @IdFornecedor;
                    ";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@NrNota", SqlDbType.Int).Value = pNrNota;
                    cmd.Parameters.Add("@NrModelo", SqlDbType.Int).Value = pNrModelo;
                    cmd.Parameters.Add("@NrSerie", SqlDbType.Int).Value = pNrSerie;
                    cmd.Parameters.Add("@IdFornecedor", SqlDbType.Int).Value = pIdFornecedor;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader != null && reader.HasRows)
                    {
                        return null;
                        //reader.Read();
                        //return new CompraModel
                        //{
                        //    NrNota = reader.GetInt32("NrNota"),
                        //    NrModelo = reader.GetInt32("NrNota"),
                        //    NrSerie = reader.GetInt32("NrSerie"),
                        //    IdFornecedor = reader.GetInt32("IdFornecedor"),
                        //    Fornecedor = fornecedorService.GetFornecedor(reader.GetInt32("IdFornecedor")),
                        //    DtEmissao = reader.GetDateTime("DtEmissao"),
                        //    DtChegada = reader.GetDateTime("DtChegada"),
                        //    TpFrete = reader.GetString("TpFrete"),
                        //    Frete = reader.GetDecimal("Frete"),
                        //    Seguro = reader.GetDecimal("Seguro"),
                        //    OutrasDesp = reader.GetDecimal("OutrasDesp"),
                        //    TotalCusto = reader.GetDecimal("TotalCusto"),
                        //    TotalProdutos = reader.GetDecimal("TotalProdutos"),
                        //    TotalCompra = reader.GetDecimal("TotalCompra"),
                        //    DtCancelamento = reader.GetDateTime("DtCancelamento"),
                        //    DtCadastro = reader.GetDateTime("DtCadastro"),
                        //    Produtos = produtoCompraService.GetProdutosCompra(reader.GetInt32("NrNota"), reader.GetInt32("NrNota"), reader.GetInt32("NrSerie"), reader.GetInt32("IdFornecedor")),
                        //    IdCondicaoPagamento = reader.GetInt32("IdCondicaoPagamento"),
                        //    CondicaoPagamento = condicaoPagamentoService.GetCondicaoPagamento(reader.GetInt32("IdCondicaoPagamento"))
                        //};
                    }
                    else
                    {
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
        }

        public IEnumerable<CompraModel> GetCompras()
        {
            using (sqlConnection)
            {
                try
                {
                    List<CompraModel> result = new List<CompraModel>();
                    sqlConnection.Open();
                    string query = @"
                        select
                            c.NrNota,
	                        c.NrModelo,
	                        c.NrSerie,
	                        c.IdFornecedor,
	                        f.FornecedorRazaoSocial,
	                        c.DtEmissao,
	                        c.DtChegada,
	                        c.TpFrete,
	                        c.Frete,
	                        c.Seguro,
	                        c.OutrasDesp,
	                        c.TotalCusto,
	                        c.TotalProdutos,
	                        c.TotalCompra,
	                        c.DtCancelamento,
	                        c.DtCadastro,
	                        c.IdCondicaoPagamento,
	                        cp.CondicaoPagamento
                        from TbCompras c
                        inner join TbFornecedores f on f.Id = c.IdFornecedor
                        inner join TbCondicoesPagamentos cp on cp.Id = c.IdCondicaoPagamento
                    ";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.ExecuteNonQuery();
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader != null && reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result.Add(new CompraModel
                            {
                                NrNota = reader.GetInt32("NrNota"),
                                NrModelo = reader.GetInt32("NrNota"),
                                NrSerie = reader.GetInt32("NrSerie"),
                                IdFornecedor = reader.GetInt32("IdFornecedor"),
                                Fornecedor = new FornecedorModel
                                {
                                    id = reader.GetInt32("IdFornecedor"),
                                    pessoaRazaoSocial = reader.GetString("FornecedorRazaoSocial")
                                },
                                DtEmissao = reader.GetDateTime("DtEmissao"),
                                DtChegada = reader.GetDateTime("DtChegada"),
                                TpFrete = reader.GetString("TpFrete"),
                                Frete = reader.GetDecimal("Frete"),
                                Seguro = reader.GetDecimal("Seguro"),
                                OutrasDesp = reader.GetDecimal("OutrasDesp"),
                                TotalCusto = reader.GetDecimal("TotalCusto"),
                                TotalProdutos = reader.GetDecimal("TotalProdutos"),
                                TotalCompra = reader.GetDecimal("TotalCompra"),
                                DtCancelamento = reader.IsDBNull("DtCancelamento") ? null : reader.GetDateTime("DtCancelamento"),
                                DtCadastro = reader.GetDateTime("DtCadastro"),
                                IdCondicaoPagamento = reader.GetInt32("IdCondicaoPagamento"),
                                CondicaoPagamento = new CondicaoPagamentoModel
                                {
                                    id = reader.GetInt32("IdCondicaoPagamento"),
                                    condicaoPagamento = reader.GetString("CondicaoPagamento")
                                },
                                Produtos = this.produtoCompraService.GetProdutosCompra(reader.GetInt32("NrNota"), reader.GetInt32("NrNota"), reader.GetInt32("NrSerie"), reader.GetInt32("IdFornecedor")),
                                ContasPagar = this.contaPagarService.GetContasPagarByCompra(reader.GetInt32("NrNota"), reader.GetInt32("NrModelo"), reader.GetInt32("NrSerie"), reader.GetInt32("IdFornecedor"))
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

        public string PostCompra(CompraPostRequest pCompra)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string queryCompra = @"
                        insert into 
                            TbCompras(NrNota, NrModelo, NrSerie, IdFornecedor, DtEmissao, DtChegada, 
                                      TpFrete, Frete, Seguro, OutrasDesp, TotalCusto, TotalProdutos,
                                      TotalCompra, DtCadastro, IdCondicaoPagamento) 
                            values(@NrNota, @NrModelo, @NrSerie, @IdFornecedor, @DtEmissao, @DtChegada,
                                   @TpFrete, @Frete, @Seguro, @OutrasDesp, @TotalCusto, @TotalProdutos,
                                   @TotalCompra, @DtCadastro, @IdCondicaoPagamento);";

                    string queryProdutosCompra = @"
                        declare @ProdutosId TABLE (IdProduto int, Quantidade int, PrecoUnit money,PrecoTotal money, CustoProd money, CustoUnit money, Rateio money);
                        insert into @ProdutosId(IdProduto, Quantidade, PrecoUnit, PrecoTotal, CustoProd, CustoUnit, Rateio) values";

                    foreach (ProdutoCompraPostRequest prod in pCompra.Produtos)
                    {
                        queryProdutosCompra += $"({prod.IdProduto},{prod.Quantidade},{prod.PrecoUnit},{prod.PrecoTotal},{prod.CustoProd},{prod.CustoUnit},{prod.Rateio}),";
                    }

                    queryProdutosCompra = queryProdutosCompra.Substring(0, queryProdutosCompra.Length - 1);
                    queryProdutosCompra += ";\n";

                    queryProdutosCompra += @"
                        insert into TbProdutosCompra (NrNota, NrModelo, NrSerie, IdFornecedor, IdProduto, Quantidade, PrecoUnit, PrecoTotal, CustoProd, CustoUnit, Rateio)
                        select @NrNota, @NrModelo, @NrSerie, @IdFornecedor, IdProduto, Quantidade, PrecoUnit, PrecoTotal, CustoProd, CustoUnit, Rateio from @ProdutosId";

                    string query = queryCompra + queryProdutosCompra;
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@NrNota", SqlDbType.Int).Value = pCompra.NrNota ;
                    cmd.Parameters.Add("@NrModelo", SqlDbType.Int).Value = pCompra.NrModelo;
                    cmd.Parameters.Add("@NrSerie", SqlDbType.Int).Value = pCompra.NrSerie;
                    cmd.Parameters.Add("@IdFornecedor", SqlDbType.Int).Value = pCompra.IdFornecedor;
                    cmd.Parameters.Add("@DtEmissao", SqlDbType.Date).Value = pCompra.DtEmissao;
                    cmd.Parameters.Add("@DtChegada", SqlDbType.Date).Value = pCompra.DtChegada;
                    cmd.Parameters.Add("@TpFrete", SqlDbType.VarChar).Value = pCompra.TpFrete;
                    cmd.Parameters.Add("@Frete", SqlDbType.Money).Value = pCompra.Frete == null ? 0 : pCompra.Frete;
                    cmd.Parameters.Add("@Seguro", SqlDbType.Money).Value = pCompra.Seguro == null ? 0 : pCompra.Seguro;
                    cmd.Parameters.Add("@OutrasDesp", SqlDbType.Money).Value = pCompra.OutrasDesp == null ? 0 : pCompra.OutrasDesp;
                    cmd.Parameters.Add("@TotalCusto", SqlDbType.Money).Value = pCompra.TotalCusto;
                    cmd.Parameters.Add("@TotalProdutos", SqlDbType.Money).Value = pCompra.TotalProdutos;
                    cmd.Parameters.Add("@TotalCompra", SqlDbType.Money).Value = pCompra.TotalCompra;
                    cmd.Parameters.Add("@DtCadastro", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd.Parameters.Add("@IdCondicaoPagamento", SqlDbType.Int).Value = pCompra.IdCondicaoPagamento; 
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

        public bool VerificaExistenciaCompra(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @"
                        select
                            *
                        from TbCompras
                        where NrNota = @NrNota and NrModelo = @NrModelo and NrSerie = @NrSerie and IdFornecedor = @IdFornecedor;
                    ";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@NrNota", SqlDbType.Int).Value = pNrNota;
                    cmd.Parameters.Add("@NrModelo", SqlDbType.Int).Value = pNrModelo;
                    cmd.Parameters.Add("@NrSerie", SqlDbType.Int).Value = pNrSerie;
                    cmd.Parameters.Add("@IdFornecedor", SqlDbType.Int).Value = pIdFornecedor;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader != null && reader.HasRows)
                    {
                        return true;
                    }
                    else
                    {
                        return false;
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
        }
    }
}
