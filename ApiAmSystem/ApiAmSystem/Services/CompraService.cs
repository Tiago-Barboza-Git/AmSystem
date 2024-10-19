using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Compra;
using ApiAmSystem.Domain.Models.Compra.ProdutoCompra;
using ApiAmSystem.Domain.Models;
using Microsoft.Data.SqlClient;
using System.Data;
using ApiAmSystem.Domain.Models.Fornecedor;
using ApiAmSystem.Domain.Models.CondicaoPagamento;
using ApiAmSystem.Domain.Models.Compra.ContaPagar;

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
            List<int> produtosRepetidos = new List<int>();

            foreach (ProdutoCompraPostRequest prod in pCompra.Produtos)
            {
                prod.Rateio = prod.PrecoTotal / pCompra.TotalProdutos;
                prod.CustoProd = pCompra.TotalCusto * prod.Rateio;
                prod.CustoUnit = (prod.PrecoTotal + prod.CustoProd) / prod.Quantidade;
                if (pCompra.Produtos.Where(x => x.IdProduto == prod.IdProduto).Count() > 1) 
                {
                    if (produtosRepetidos.FirstOrDefault(x => x == prod.IdProduto) == 0)
                        produtosRepetidos.Add(prod.IdProduto);
                }
            }

            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string queryCompra = "insert into \nTbCompras(NrNota, NrModelo, NrSerie, IdFornecedor, DtEmissao, DtChegada, TpFrete, Frete, Seguro, OutrasDesp, TotalCusto, TotalProdutos,TotalCompra, DtCadastro, DtAlteracao, IdCondicaoPagamento)\n values(@NrNota, @NrModelo, @NrSerie, @IdFornecedor, @DtEmissao, @DtChegada,@TpFrete, @Frete, @Seguro, @OutrasDesp, @TotalCusto, @TotalProdutos,@TotalCompra, @DtCadastro, @DtAlteracao, @IdCondicaoPagamento);";

                    string queryProdutosCompra = "declare @ProdutosId TABLE (IdProduto int, Quantidade int, PrecoUnit money,PrecoTotal money, CustoProd money, CustoUnit money, Rateio money);\ninsert into @ProdutosId(IdProduto, Quantidade, PrecoUnit, PrecoTotal, CustoProd, CustoUnit, Rateio) values";

                    foreach (ProdutoCompraPostRequest prod in pCompra.Produtos)
                    {
                        queryProdutosCompra += $"({prod.IdProduto},{prod.Quantidade},{prod.PrecoUnit},{prod.PrecoTotal},{prod.CustoProd.ToString(System.Globalization.CultureInfo.InvariantCulture)},{prod.CustoUnit.ToString(System.Globalization.CultureInfo.InvariantCulture)},{prod.Rateio.ToString(System.Globalization.CultureInfo.InvariantCulture)}),";
                    }

                    queryProdutosCompra = queryProdutosCompra.Substring(0, queryProdutosCompra.Length - 1);
                    queryProdutosCompra += ";\n";

                    queryProdutosCompra += "insert into TbProdutosCompra (NrNota, NrModelo, NrSerie, IdFornecedor, IdProduto, Quantidade, PrecoUnit, PrecoTotal, CustoProd, CustoUnit, Rateio)\nselect @NrNota, @NrModelo, @NrSerie, @IdFornecedor, IdProduto, Quantidade, PrecoUnit, PrecoTotal, CustoProd, CustoUnit, Rateio from @ProdutosId";
                    queryProdutosCompra += ";\n";

                    string queryContasPagar = "insert into TbContasPagar(NrNota, NrModelo, NrSerie, IdFornecedor, IdFormaPagamento, NumParcela, ValorParcela, DtEmissao, DtVencimento, DtPagamento, Juros, Multa, Desconto, ValorPago, Observacao, DtCadastro, DtAlteracao, Cancelada) \nvalues";

                    foreach (ContaPagarPostRequest contaPagar in pCompra.ContasPagar)
                    {
                        queryContasPagar += $"({pCompra.NrNota},{pCompra.NrModelo},{pCompra.NrSerie},{pCompra.IdFornecedor},{contaPagar.IdFormaPagamento},{contaPagar.NumParcela},{contaPagar.ValorParcela.ToString(System.Globalization.CultureInfo.InvariantCulture)},'{pCompra.DtEmissao.ToString("yyyy-MM-dd")}','{contaPagar.DtVencimento.ToString("yyyy-MM-dd")}',null,0,0,0,0,'','{DateTime.Now.ToString("yyyy-MM-dd")}','{DateTime.Now.ToString("yyyy-MM-dd")}',0),";
                    }

                    queryContasPagar = queryContasPagar.TrimEnd(',');

                    string queryProdutos = "";

                    foreach (ProdutoCompraPostRequest prod in pCompra.Produtos)
                    {
                        if (produtosRepetidos.FirstOrDefault(x => x == prod.IdProduto) == 0)
                            queryProdutos += $"\nupdate TbProdutos set Quantidade = Quantidade + {prod.Quantidade}, PrecoUltCompra = {prod.PrecoUnit.ToString(System.Globalization.CultureInfo.InvariantCulture)}, DtUltCompra = '{pCompra.DtEmissao.ToString("yyyy-MM-dd")}', CustoMedio = {prod.CustoUnit.ToString(System.Globalization.CultureInfo.InvariantCulture)} where Id = {prod.IdProduto}";
                    }

                    if (produtosRepetidos.Count() > 0)
                    {
                        foreach (int idProduto in produtosRepetidos)
                        {
                            List<ProdutoCompraPostRequest> prods = pCompra.Produtos.Where(x => x.IdProduto == idProduto).ToList();
                            var precoUltCompra = (prods.Sum(x => x.PrecoUnit) / prods.Count()) ;
                            var custoMedio = (prods.Sum(x => x.CustoUnit * x.Quantidade)) / prods.Sum(x => x.Quantidade);
                            int quantidade = (prods.Sum(x => x.Quantidade));
                            queryProdutos += $"\nupdate TbProdutos set Quantidade = Quantidade + {quantidade},PrecoUltCompra = {precoUltCompra.ToString(System.Globalization.CultureInfo.InvariantCulture)}, DtUltCompra = '{pCompra.DtEmissao.ToString("yyyy-MM-dd")}', CustoMedio = {custoMedio.ToString(System.Globalization.CultureInfo.InvariantCulture)} where Id = {idProduto}";
                        }
                    }

                    string query = queryCompra + queryProdutosCompra + queryContasPagar + queryProdutos;
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@NrNota", SqlDbType.Int).Value = pCompra.NrNota;
                    cmd.Parameters.Add("@NrModelo", SqlDbType.Int).Value = pCompra.NrModelo;
                    cmd.Parameters.Add("@NrSerie", SqlDbType.Int).Value = pCompra.NrSerie;
                    cmd.Parameters.Add("@IdFornecedor", SqlDbType.Int).Value = pCompra.IdFornecedor;
                    cmd.Parameters.Add("@DtEmissao", SqlDbType.Date).Value = pCompra.DtEmissao.ToString("yyyy-MM-dd");
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
                        return true;
                    else
                        return false;

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

        public bool PutCancelarCompra(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor)
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
                                return false;
                            }
                        }
                    }

                    string queryCompra = "update TbCompras set DtCancelamento = @DtCancelamento where NrNota = @NrNota and NrModelo = @NrModelo and NrSerie = @NrSerie and IdFornecedor = @IdFornecedor \n\n";
                    string queryContasPagar = "update TbContasPagar set Cancelada = 1 where NrNota = @NrNota and NrModelo = @NrModelo and NrSerie = @NrSerie and IdFornecedor = @IdFornecedor";
                    cmd = new SqlCommand(queryCompra + queryContasPagar, this.sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@DtCancelamento", SqlDbType.Date).Value = DateTime.Now;
                    cmd.Parameters.Add("@NrNota", SqlDbType.Int).Value = pNrNota;
                    cmd.Parameters.Add("@NrModelo", SqlDbType.Int).Value = pNrModelo;
                    cmd.Parameters.Add("@NrSerie", SqlDbType.Int).Value = pNrSerie;
                    cmd.Parameters.Add("@IdFornecedor", SqlDbType.Int).Value = pIdFornecedor;
                    cmd.ExecuteNonQuery();

                    IEnumerable<ProdutoCompraModel> produtosCompraDeletada = this.produtoCompraService.GetProdutosCompraByCompra(pNrNota, pNrModelo, pNrSerie, pIdFornecedor);

                    string queryProdComCanc = "";

                    List<int> produtosCompraDeletadaAjustados = new List<int>();
                    foreach (ProdutoCompraModel prodCompraDeletada in produtosCompraDeletada)
                    {
                        if (produtosCompraDeletadaAjustados.FirstOrDefault(x => x == prodCompraDeletada.IdProduto) == 0)
                        {
                            List<ProdutoCompraModel> prods = produtosCompraDeletada.Where(x => x.IdProduto == prodCompraDeletada.IdProduto).ToList();
                            int quantidade = prods.Sum(x => x.Quantidade);
                            queryProdComCanc += $"update TbProdutos set Quantidade = Quantidade - {quantidade} where Id = {prodCompraDeletada.IdProduto}\n\n";
                        }
                        produtosCompraDeletadaAjustados.Add(prodCompraDeletada.IdProduto);
                    }

                    // Subtrai a quantidade dos produtos da compra cancelada
                    cmd = new SqlCommand(queryProdComCanc, sqlConnection);
                    cmd.ExecuteNonQuery();

                    string queryProdutos = "";
                    List<int> produtosAjustados = new List<int>();
                    foreach (ProdutoCompraModel prod in produtosCompraDeletada)
                    {
                        if (produtosAjustados.FirstOrDefault(x => x == prod.IdProduto) == 0)
                        {
                            CompraModel compra = this.GetLastCompraActiveByProduct(prod.IdProduto);

                            if (compra != null)
                            {
                                List<int> produtosRepetidosLastCompra = new List<int>();

                                foreach (ProdutoCompraModel prodLastCompra in compra.Produtos)
                                {
                                    if (compra.Produtos.Where(x => x.IdProduto == prodLastCompra.IdProduto).Count() > 1)
                                    {
                                        if (produtosRepetidosLastCompra.FirstOrDefault(x => x == prodLastCompra.IdProduto) != 0)
                                            produtosRepetidosLastCompra.Add(prodLastCompra.IdProduto);
                                    }
                                }

                                queryProdutos = "";

                                foreach (ProdutoCompraModel prodLastCompra in compra.Produtos)
                                {
                                    if (produtosRepetidosLastCompra.FirstOrDefault(x => x == prod.IdProduto) == 0)
                                        queryProdutos += $"\nupdate TbProdutos set PrecoUltCompra = {prodLastCompra.PrecoUnit.ToString(System.Globalization.CultureInfo.InvariantCulture)}, DtUltCompra = '{compra.DtEmissao.ToString("yyyy-MM-dd")}', CustoMedio = {prodLastCompra.CustoUnit.ToString(System.Globalization.CultureInfo.InvariantCulture)} where Id = {prodLastCompra.IdProduto}";
                                }

                                if (produtosRepetidosLastCompra.Count() > 0)
                                {
                                    foreach (int idProduto in produtosRepetidosLastCompra)
                                    {
                                        List<ProdutoCompraModel> prods = compra.Produtos.Where(x => x.IdProduto == idProduto).ToList();
                                        var precoUltCompra = (prods.Sum(x => x.PrecoUnit) / prods.Count());
                                        var custoMedio = (prods.Sum(x => x.CustoUnit * x.Quantidade)) / prods.Sum(x => x.Quantidade);
                                        queryProdutos += $"\nupdate TbProdutos set PrecoUltCompra = {precoUltCompra.ToString(System.Globalization.CultureInfo.InvariantCulture)}, DtUltCompra = '{compra.DtEmissao.ToString("yyyy-MM-dd")}', CustoMedio = {custoMedio.ToString(System.Globalization.CultureInfo.InvariantCulture)} where Id = {idProduto}";
                                    }
                                }

                                cmd = new SqlCommand(queryProdutos, sqlConnection);
                                cmd.ExecuteNonQuery();
                            }
                            else
                            {
                                queryProdutos = "";
                                queryProdutos += $"\nupdate TbProdutos set Quantidade = 0,PrecoUltCompra = 0, DtUltCompra = null, CustoMedio = 0 where Id = {prod.IdProduto}";
                                cmd = new SqlCommand(queryProdutos, sqlConnection);
                                cmd.ExecuteNonQuery();
                            }
                        }
                        
                        produtosAjustados.Add(prod.IdProduto);
                    }

                    return true;
                }
                catch (SqlException exception)
                {
                    throw new Exception(exception.Message);
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
