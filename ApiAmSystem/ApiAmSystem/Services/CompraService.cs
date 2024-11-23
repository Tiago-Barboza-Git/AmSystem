using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Compra;
using ApiAmSystem.Domain.Models.Compra.ProdutoCompra;
using ApiAmSystem.Domain.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using ApiAmSystem.Domain.Models.Fornecedor;
using ApiAmSystem.Domain.Models.CondicaoPagamento;
using ApiAmSystem.Domain.Models.Compra.ContaPagar;
using Microsoft.Extensions.Logging.Abstractions;

namespace ApiAmSystem.Services
{
    public class CompraService : ICompraService
    {
        private SqlConnection sqlConnection;
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

        public IEnumerable<CompraModel> GetCompras(bool pCanceladas)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    List<CompraModel> result = new List<CompraModel>();
                    //string query = $@"
                    //    select
                    //        c.NrNota,
	                   //     c.NrModelo,
	                   //     c.NrSerie,
	                   //     c.IdFornecedor,
                    //        c.SequencialCompra,
	                   //     f.FornecedorRazaoSocial,
	                   //     c.DtEmissao,
	                   //     c.DtChegada,
	                   //     c.TpFrete,
	                   //     c.Frete,
	                   //     c.Seguro,
	                   //     c.OutrasDesp,
	                   //     c.TotalCusto,
	                   //     c.TotalProdutos,
	                   //     c.TotalCompra,
	                   //     c.DtCancelamento,
	                   //     c.DtCadastro,
                    //        c.DtAlteracao,
	                   //     c.IdCondicaoPagamento,
	                   //     cp.CondicaoPagamento
                    //    from TbCompras c
                    //    inner join TbFornecedores f on f.Id = c.IdFornecedor
                    //    inner join TbCondicoesPagamentos cp on cp.Id = c.IdCondicaoPagamento
                    //    where c.DtCancelamento {(pCanceladas == true ? "is not" : "is")} null
                    //";
                    string query = $@"
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
                            c.DtAlteracao,
	                        c.IdCondicaoPagamento,
	                        cp.CondicaoPagamento
                        from TbCompras c
                        inner join TbFornecedores f on f.Id = c.IdFornecedor
                        inner join TbCondicoesPagamentos cp on cp.Id = c.IdCondicaoPagamento
                        where c.DtCancelamento {(pCanceladas == true ? "is not" : "is")} null
                    ";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.ExecuteNonQuery();
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader != null && reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            int NrNota = reader.GetInt32("NrNota"); ;
                            int NrModelo = reader.GetInt32("NrModelo"); ;
                            int NrSerie = reader.GetInt32("NrSerie"); ;
                            int IdFornecedor = reader.GetInt32("IdFornecedor");

                            result.Add(new CompraModel
                            {
                                NrNota = NrNota,
                                NrModelo = NrModelo,
                                NrSerie = NrSerie,
                                IdFornecedor = IdFornecedor,
                                Fornecedor = new FornecedorRef
                                {
                                    Id = reader.GetInt32("IdFornecedor"),
                                    PessoaRazaoSocial = reader.GetString("FornecedorRazaoSocial")
                                },
                                DtEmissao = reader.GetDateTime("DtEmissao"),
                                DtChegada = reader.IsDBNull("DtChegada") ? null : reader.GetDateTime("DtChegada"),
                                TpFrete = reader.GetString("TpFrete"),
                                Frete = reader.GetDecimal("Frete"),
                                Seguro = reader.GetDecimal("Seguro"),
                                OutrasDesp = reader.GetDecimal("OutrasDesp"),
                                TotalCusto = reader.GetDecimal("TotalCusto"),
                                TotalProdutos = reader.GetDecimal("TotalProdutos"),
                                TotalNota = reader.GetDecimal("TotalCompra"),
                                DtCancelamento = reader.IsDBNull("DtCancelamento") ? null : reader.GetDateTime("DtCancelamento"),
                                DtCadastro = reader.GetDateTime("DtCadastro"),
                                DtAlteracao = reader.GetDateTime("DtAlteracao"),
                                IdCondicaoPagamento = reader.GetInt32("IdCondicaoPagamento"),
                                CondicaoPagamento = new CondicaoPagamentoModel
                                {
                                    id = reader.GetInt32("IdCondicaoPagamento"),
                                    condicaoPagamento = reader.GetString("CondicaoPagamento")
                                },
                                Produtos = this.produtoCompraService.GetProdutosCompraByCompra(NrNota, NrModelo, NrSerie, IdFornecedor),
                                ContasPagar = this.contaPagarService.GetContasPagarByCompra(NrNota, NrModelo, NrSerie, IdFornecedor)
                            });

                            //result.Add(new CompraModel
                            //{
                            //    NrNota = NrNota,
                            //    NrModelo = NrModelo,
                            //    NrSerie = NrSerie,
                            //    IdFornecedor = IdFornecedor,
                            //    SequencialNota = 
                            //    Fornecedor = new FornecedorRef
                            //    {
                            //        Id = reader.GetInt32("IdFornecedor"),
                            //        PessoaRazaoSocial = reader.GetString("FornecedorRazaoSocial")
                            //    },
                            //    DtEmissao = reader.GetDateTime("DtEmissao"),
                            //    DtChegada = reader.IsDBNull("DtChegada") ? null : reader.GetDateTime("DtChegada"),
                            //    TpFrete = reader.GetString("TpFrete"),
                            //    Frete = reader.GetDecimal("Frete"),
                            //    Seguro = reader.GetDecimal("Seguro"),
                            //    OutrasDesp = reader.GetDecimal("OutrasDesp"),
                            //    TotalCusto = reader.GetDecimal("TotalCusto"),
                            //    TotalProdutos = reader.GetDecimal("TotalProdutos"),
                            //    TotalNota = reader.GetDecimal("TotalCompra"),
                            //    DtCancelamento = reader.IsDBNull("DtCancelamento") ? null : reader.GetDateTime("DtCancelamento"),
                            //    DtCadastro = reader.GetDateTime("DtCadastro"),
                            //    DtAlteracao = reader.GetDateTime("DtAlteracao"),
                            //    IdCondicaoPagamento = reader.GetInt32("IdCondicaoPagamento"),
                            //    CondicaoPagamento = new CondicaoPagamentoModel
                            //    {
                            //        id = reader.GetInt32("IdCondicaoPagamento"),
                            //        condicaoPagamento = reader.GetString("CondicaoPagamento")
                            //    },
                            //    Produtos = this.produtoCompraService.GetProdutosCompraByCompra(NrNota, NrModelo, NrSerie, IdFornecedor),
                            //    ContasPagar = this.contaPagarService.GetContasPagarByCompra(NrNota, NrModelo, NrSerie, IdFornecedor)
                            //});
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
            foreach (ProdutoCompraPostRequest prod in pCompra.Produtos)
            {
                prod.Rateio = Math.Round(prod.PrecoTotal / pCompra.TotalProdutos, 8);
                prod.CustoProd = Math.Round(pCompra.TotalCusto * prod.Rateio, 8);
                prod.CustoUnit = Math.Round((prod.PrecoTotal + prod.CustoProd) / prod.Quantidade, 8);
            }

            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string queryCompra = "insert into \nTbCompras(NrNota, NrModelo, NrSerie, IdFornecedor, DtEmissao, DtChegada, TpFrete, Frete, Seguro, OutrasDesp, TotalCusto, TotalProdutos,TotalCompra, DtCadastro, DtAlteracao, IdCondicaoPagamento)\n values(@NrNota, @NrModelo, @NrSerie, @IdFornecedor, @DtEmissao, @DtChegada,@TpFrete, @Frete, @Seguro, @OutrasDesp, @TotalCusto, @TotalProdutos,@TotalCompra, @DtCadastro, @DtAlteracao, @IdCondicaoPagamento);";

                    SqlCommand cmd = new SqlCommand(queryCompra, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@NrNota", SqlDbType.Int).Value = pCompra.NrNota;
                    cmd.Parameters.Add("@NrModelo", SqlDbType.Int).Value = pCompra.NrModelo;
                    cmd.Parameters.Add("@NrSerie", SqlDbType.Int).Value = pCompra.NrSerie;
                    cmd.Parameters.Add("@IdFornecedor", SqlDbType.Int).Value = pCompra.IdFornecedor;
                    cmd.Parameters.Add("@DtEmissao", SqlDbType.DateTime).Value = new DateTime(pCompra.DtEmissao.Year, pCompra.DtEmissao.Month, pCompra.DtEmissao.Day, DateTime.Now.Hour, DateTime.Now.Minute, DateTime.Now.Second).ToString("yyyy-MM-dd HH:mm:ss");
                    //cmd.Parameters.Add("@DtEmissao", SqlDbType.DateTime).Value = pCompra.DtEmissao.ToString("yyyy-MM-dd HH:mm:ss");
                    cmd.Parameters.Add("@DtChegada", SqlDbType.Date).Value = pCompra.DtChegada == null ? null : pCompra.DtChegada.ToString("yyyy-MM-dd");
                    cmd.Parameters.Add("@TpFrete", SqlDbType.VarChar).Value = pCompra.TpFrete;
                    cmd.Parameters.Add("@Frete", SqlDbType.Money).Value = pCompra.Frete == null ? 0 : pCompra.Frete;
                    cmd.Parameters.Add("@Seguro", SqlDbType.Money).Value = pCompra.Seguro == null ? 0 : pCompra.Seguro;
                    cmd.Parameters.Add("@OutrasDesp", SqlDbType.Money).Value = pCompra.OutrasDesp == null ? 0 : pCompra.OutrasDesp;
                    cmd.Parameters.Add("@TotalCusto", SqlDbType.Money).Value = pCompra.TotalCusto;
                    cmd.Parameters.Add("@TotalProdutos", SqlDbType.Money).Value = pCompra.TotalProdutos;
                    cmd.Parameters.Add("@TotalCompra", SqlDbType.Money).Value = pCompra.TotalNota;
                    cmd.Parameters.Add("@DtCadastro", SqlDbType.DateTime).Value = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.DateTime).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd.Parameters.Add("@IdCondicaoPagamento", SqlDbType.Int).Value = pCompra.IdCondicaoPagamento;
                    cmd.ExecuteNonQuery();

                    string queryContasPagar = "insert into TbContasPagar(NrNota, NrModelo, NrSerie, IdFornecedor, IdFormaPagamento, NumParcela, ValorParcela, DtEmissao, DtVencimento, DtPagamento, Juros, Multa, Desconto, ValorPago, Observacao, DtCadastro, DtAlteracao, Cancelada, Avulsa) \nvalues";

                    foreach (ContaPagarPostRequest contaPagar in pCompra.ContasPagar)
                    {
                        queryContasPagar += $"({pCompra.NrNota},{pCompra.NrModelo},{pCompra.NrSerie},{pCompra.IdFornecedor},{contaPagar.IdFormaPagamento},{contaPagar.NumParcela},{contaPagar.ValorParcela.ToString(System.Globalization.CultureInfo.InvariantCulture)},@DtEmissao,'{contaPagar.DtVencimento.ToString("yyyy-MM-dd")}',null,0,0,0,0,'',@DtCadastro,@DtAlteracao,0,0),";
                    }

                    queryContasPagar = queryContasPagar.TrimEnd(',');

                    SqlCommand cmd3 = new SqlCommand(queryContasPagar, sqlConnection);
                    cmd3.Parameters.Clear();
                    cmd3.Parameters.Add("@DtEmissao", SqlDbType.DateTime).Value = new DateTime(pCompra.DtEmissao.Year, pCompra.DtEmissao.Month, pCompra.DtEmissao.Day, DateTime.Now.Hour, DateTime.Now.Minute, DateTime.Now.Second).ToString("yyyy-MM-dd HH:mm:ss");
                    cmd3.Parameters.Add("@DtCadastro", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd3.Parameters.Add("@DtAlteracao", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd3.ExecuteNonQuery();



                    string queryProdutosCompra = "declare @ProdutosId TABLE (IdProduto int, Quantidade int, PrecoUnit money,PrecoTotal money, CustoProd decimal(18,8), CustoUnit decimal(18,8), Rateio decimal(18,8), Desconto money);\ninsert into @ProdutosId(IdProduto, Quantidade, PrecoUnit, PrecoTotal, CustoProd, CustoUnit, Rateio, Desconto) values";

                    foreach (ProdutoCompraPostRequest prod in pCompra.Produtos)
                    {
                        queryProdutosCompra += $"({prod.IdProduto},{prod.Quantidade},{prod.PrecoUnit.ToString(System.Globalization.CultureInfo.InvariantCulture)},{prod.PrecoTotal.ToString(System.Globalization.CultureInfo.InvariantCulture)},{prod.CustoProd.ToString(System.Globalization.CultureInfo.InvariantCulture)},{prod.CustoUnit.ToString(System.Globalization.CultureInfo.InvariantCulture)},{prod.Rateio.ToString(System.Globalization.CultureInfo.InvariantCulture)},{prod.Desconto.ToString(System.Globalization.CultureInfo.InvariantCulture)}),";
                    }

                    queryProdutosCompra = queryProdutosCompra.Substring(0, queryProdutosCompra.Length - 1);
                    queryProdutosCompra += ";\n";

                    queryProdutosCompra += $"insert into TbProdutosCompra (NrNota, NrModelo, NrSerie, IdFornecedor, IdProduto, Quantidade, PrecoUnit, PrecoTotal, CustoProd, CustoUnit, Rateio, Desconto)\nselect {pCompra.NrNota}, {pCompra.NrModelo}, {pCompra.NrSerie}, {pCompra.IdFornecedor}, IdProduto, Quantidade, PrecoUnit, PrecoTotal, CustoProd, CustoUnit, Rateio, Desconto from @ProdutosId";
                    queryProdutosCompra += ";\n";

                    SqlCommand cmd2 = new SqlCommand(queryProdutosCompra, sqlConnection);
                    cmd2.Parameters.Add("@NrNota", SqlDbType.Int).Value = pCompra.NrNota;
                    cmd2.Parameters.Add("@NrModelo", SqlDbType.Int).Value = pCompra.NrModelo;
                    cmd2.Parameters.Add("@NrSerie", SqlDbType.Int).Value = pCompra.NrSerie;
                    cmd2.Parameters.Add("@IdFornecedor", SqlDbType.Int).Value = pCompra.IdFornecedor;
                    cmd2.ExecuteNonQuery();
                    return "Compra adiconada com sucesso!";
                }
                catch (SqlException ex)
                {
                    return "Erro ao adicionar compra!";
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }

        public string VerificaExistenciaCompra(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    SqlCommand cmd;
                    string query = @"
                        select
                            *
                        from TbCompras
                        where NrNota = @NrNota and NrModelo = @NrModelo and NrSerie = @NrSerie and IdFornecedor = @IdFornecedor;
                    ";
                    cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@NrNota", SqlDbType.Int).Value = pNrNota;
                    cmd.Parameters.Add("@NrModelo", SqlDbType.Int).Value = pNrModelo;
                    cmd.Parameters.Add("@NrSerie", SqlDbType.Int).Value = pNrSerie;
                    cmd.Parameters.Add("@IdFornecedor", SqlDbType.Int).Value = pIdFornecedor;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader != null && reader.HasRows)
                        return "Já existe uma compra com essas informações da nota!";
                    else
                    {
                        string queryContasPagar = @"select * from TbContasPagar where NrNota = @NrNota and NrModelo = @NrModelo and NrSerie = @NrSerie and IdFornecedor = @IdFornecedor and Avulsa = 1 and Cancelada = 0";
                        cmd = new SqlCommand(queryContasPagar, sqlConnection);
                        cmd.Parameters.Clear();
                        cmd.Parameters.Add("@NrNota", SqlDbType.Int).Value = pNrNota;
                        cmd.Parameters.Add("@NrModelo", SqlDbType.Int).Value = pNrModelo;
                        cmd.Parameters.Add("@NrSerie", SqlDbType.Int).Value = pNrSerie;
                        cmd.Parameters.Add("@IdFornecedor", SqlDbType.Int).Value = pIdFornecedor;
                        SqlDataReader readerContasPagar = cmd.ExecuteReader();
                        if (readerContasPagar != null && readerContasPagar.HasRows)
                            return "Já existe uma conta à pagar avulsa com essas informações da nota!";

                        return "";
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

        public string PutCancelarCompra(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor)
        {
            using (this.sqlConnection)
            {
                try
                {
                    SqlCommand cmd;
                    this.sqlConnection.Open();
                    string queryVerificaContasPagar = "select cp.ValorPago from TbContasPagar cp where cp.NrNota = @NrNota and cp.NrModelo = @NrModelo and cp.NrSerie = @NrSerie and cp.IdFornecedor = @IdFornecedor;";
                    cmd = new SqlCommand(queryVerificaContasPagar, this.sqlConnection);
                    cmd.Parameters.Add("@NrNota", SqlDbType.Int).Value = pNrNota;
                    cmd.Parameters.Add("@NrModelo", SqlDbType.Int).Value = pNrModelo;
                    cmd.Parameters.Add("@NrSerie", SqlDbType.Int).Value = pNrSerie;
                    cmd.Parameters.Add("@IdFornecedor", SqlDbType.Int).Value = pIdFornecedor;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader != null && reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            if (reader.GetDecimal("ValorPago") > 0)
                            {
                                return "Não é possível cancelar a compra, pois, já foi dada baixa em uma conta a pagar!";
                            }
                        }
                    }

                    


                    string queryCompra = "update TbCompras set DtCancelamento = @DtCancelamento where NrNota = @NrNota and NrModelo = @NrModelo and NrSerie = @NrSerie and IdFornecedor = @IdFornecedor \n\n";
                    string queryContasPagar = "update TbContasPagar set Cancelada = 1, DtCancelamento = @DtCancelamento where NrNota = @NrNota and NrModelo = @NrModelo and NrSerie = @NrSerie and IdFornecedor = @IdFornecedor";
                    cmd = new SqlCommand(queryCompra + queryContasPagar, this.sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@DtCancelamento", SqlDbType.Date).Value = DateTime.Now;
                    cmd.Parameters.Add("@NrNota", SqlDbType.Int).Value = pNrNota;
                    cmd.Parameters.Add("@NrModelo", SqlDbType.Int).Value = pNrModelo;
                    cmd.Parameters.Add("@NrSerie", SqlDbType.Int).Value = pNrSerie;
                    cmd.Parameters.Add("@IdFornecedor", SqlDbType.Int).Value = pIdFornecedor;
                    cmd.ExecuteNonQuery();

                    return "Compra cancelada com sucesso!";
                }
                catch (SqlException exception)
                {
                    return "Erro ao cancelar compra!";
                }
                finally
                {
                    this.sqlConnection.Close();
                }
            }
        }

        public CompraModel GetLastCompraActiveByProduct(int pIdProduto)
        {
            using (SqlConnection conn = new SqlConnection("Server=DESKTOP-JPC14RO;Database=AmSystem;Trusted_Connection=True;Integrated Security=True;TrustServerCertificate=True;MultipleActiveResultSets=True;"))
            {
                try
                {
                    conn.Open();
                    string query = @$"
                        select
	                        top 1
	                        *
                        from TbCompras c
                        inner join TbProdutosCompra pc on pc.NrNota = c.NrNota and pc.NrModelo = c.NrModelo and pc.NrSerie = c.NrSerie and pc.IdFornecedor = c.IdFornecedor and pc.IdProduto = {pIdProduto}
                        where c.DtCancelamento is null
                        order by c.DtCadastro desc";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.ExecuteNonQuery();
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader != null && reader.HasRows)
                    {
                        reader.Read();
                        int NrNota = reader.GetInt32("NrNota"); ;
                        int NrModelo = reader.GetInt32("NrModelo"); ;
                        int NrSerie = reader.GetInt32("NrSerie"); ;
                        int IdFornecedor = reader.GetInt32("IdFornecedor");

                        return new CompraModel
                        {
                            NrNota = NrNota,
                            NrModelo = NrModelo,
                            NrSerie = NrSerie,
                            IdFornecedor = IdFornecedor,
                            Fornecedor = new FornecedorRef
                            {
                                Id = reader.GetInt32("IdFornecedor"),
                                PessoaRazaoSocial = reader.GetString("FornecedorRazaoSocial")
                            },
                            DtEmissao = reader.GetDateTime("DtEmissao"),
                            DtChegada = reader.IsDBNull("DtChegada") ? null : reader.GetDateTime("DtChegada"),
                            TpFrete = reader.GetString("TpFrete"),
                            Frete = reader.GetDecimal("Frete"),
                            Seguro = reader.GetDecimal("Seguro"),
                            OutrasDesp = reader.GetDecimal("OutrasDesp"),
                            TotalCusto = reader.GetDecimal("TotalCusto"),
                            TotalProdutos = reader.GetDecimal("TotalProdutos"),
                            TotalNota = reader.GetDecimal("TotalCompra"),
                            DtCancelamento = reader.IsDBNull("DtCancelamento") ? null : reader.GetDateTime("DtCancelamento"),
                            DtCadastro = reader.GetDateTime("DtCadastro"),
                            IdCondicaoPagamento = reader.GetInt32("IdCondicaoPagamento"),
                            CondicaoPagamento = new CondicaoPagamentoModel
                            {
                                id = reader.GetInt32("IdCondicaoPagamento"),
                                condicaoPagamento = reader.GetString("CondicaoPagamento")
                            },
                            Produtos = this.produtoCompraService.GetProdutosCompraByCompra(NrNota, NrModelo, NrSerie, IdFornecedor),
                            ContasPagar = this.contaPagarService.GetContasPagarByCompra(NrNota, NrModelo, NrSerie, IdFornecedor)
                        };
                    }
                    return null;
                }
                catch (SqlException exception)
                {
                    throw new Exception(exception.Message);
                }
                finally
                {
                    conn.Close();
                }
            }
        }

    }
}
