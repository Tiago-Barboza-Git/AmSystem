using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Cliente;
using ApiAmSystem.Domain.Models.Compra;
using ApiAmSystem.Domain.Models.Compra.ContaPagar;
using ApiAmSystem.Domain.Models.Compra.ProdutoCompra;
using ApiAmSystem.Domain.Models.CondicaoPagamento;
using ApiAmSystem.Domain.Models.Fornecedor;
using ApiAmSystem.Domain.Models.Funcionario;
using ApiAmSystem.Domain.Models.Venda;
using ApiAmSystem.Domain.Models.Venda.ContaReceber;
using ApiAmSystem.Domain.Models.Venda.ProdutoVenda;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.WebEncoders.Testing;
using System.Data;

namespace ApiAmSystem.Services
{
    public class VendaService : IVendaService
    {
        private SqlConnection sqlConnection { get; set; }
        private readonly IProdutoVendaService produtoVendaService;
        private readonly IContaReceberService contaReceberService;
        public VendaService(SqlConnection sqlConnection, IProdutoVendaService pIProdutoVendaService, IContaReceberService pIContaReceberService)
        {
            this.sqlConnection = sqlConnection;
            this.produtoVendaService = pIProdutoVendaService;
            this.contaReceberService = pIContaReceberService;
        }

        public bool VerificaExistenciaVenda(int pNrNota, int pNrModelo, int pNrSerie, int pIdCliente)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @$"
                        select
                            *
                        from TbVendas
                        where NrNota = {pNrNota} and NrModelo = {pNrModelo} and NrSerie = {pNrSerie} and IdCliente = {pIdCliente};
                    ";

                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader != null && reader.HasRows)
                        return true;
                    else
                        return false;
                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
            }
        }

        public VendaRequest GetVendas(bool pCanceladas)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    VendaRequest result = new VendaRequest
                    {
                        NextIdent = 0,
                        Vendas = new List<VendaModel>()
                    };
                    SqlCommand cmd;
                    SqlDataReader reader;
                    //List<VendaModel> result = new List<VendaModel>();
                    string query = $@"
                        select
                            v.NrNota,
	                        v.NrModelo,
	                        v.NrSerie,
	                        v.IdCliente,
                            v.DtEmissao,
	                        v.TotalProdutos,
	                        v.TotalVenda,
	                        v.DtCancelamento,
	                        v.DtCadastro,
                            v.DtAlteracao,
	                        v.IdCondicaoPagamento,
                            cp.CondicaoPagamento,
                            c.ClienteRazaoSocial
                        from TbVendas v
                        inner join TbClientes c on c.Id = v.IdCliente
                        inner join TbCondicoesPagamentos cp on cp.Id = v.IdCondicaoPagamento
                        where v.DtCancelamento {(pCanceladas == true ? "is not" : "is")} null
                    ";
                    cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.ExecuteNonQuery();
                    reader = cmd.ExecuteReader();
                    if (reader != null && reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            int NrNota = reader.GetInt32("NrNota"); 
                            int NrModelo = reader.GetInt32("NrModelo"); 
                            int NrSerie = reader.GetInt32("NrSerie"); 
                            int IdCliente = reader.GetInt32("IdCliente");

                            result.Vendas.Add(new VendaModel
                            {
                                NrNota = NrNota,
                                NrModelo = NrModelo,
                                NrSerie = NrSerie,
                                IdCliente = IdCliente,
                                Cliente = new ClienteModel
                                {
                                    id = reader.GetInt32("IdCliente"),
                                    pessoaRazaoSocial = reader.GetString("ClienteRazaoSocial")
                                },
                                DtEmissao = reader.GetDateTime("DtEmissao"),
                                TotalProdutos = reader.GetDecimal("TotalProdutos"),
                                TotalNota = reader.GetDecimal("TotalVenda"),
                                DtCancelamento = reader.IsDBNull("DtCancelamento") ? null : reader.GetDateTime("DtCancelamento"),
                                DtCadastro = reader.GetDateTime("DtCadastro"),
                                DtAlteracao = reader.GetDateTime("DtAlteracao"),
                                IdCondicaoPagamento = reader.GetInt32("IdCondicaoPagamento"),
                                CondicaoPagamento = new CondicaoPagamentoModel
                                {
                                    id = reader.GetInt32("IdCondicaoPagamento"),
                                    condicaoPagamento = reader.GetString("CondicaoPagamento")
                                },
                                Produtos = this.produtoVendaService.GetProdutosVendaByVenda(NrNota, NrModelo, NrSerie, IdCliente),
                                ContasReceber = this.contaReceberService.GetContasReceberByVenda(NrNota, NrModelo, NrSerie, IdCliente),

                            });
                        }
                    }
                    reader.Close();

                    string queryNextIdent = @"SELECT IDENT_CURRENT('TbVendas') + 1 as 'NextIdent'";

                    cmd = new SqlCommand(queryNextIdent, sqlConnection);
                    cmd.Parameters.Clear();
                    reader = cmd.ExecuteReader();
                    if (reader != null && reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result.NextIdent = Convert.ToInt32(reader.GetDecimal("NextIdent"));
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

        public string PostVenda(VendaPostRequest pVenda)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    SqlCommand cmd;

                    // Venda
                    string queryVenda = "insert into \nTbVendas(NrModelo, NrSerie, IdCliente, DtEmissao, TotalProdutos, TotalVenda, DtCadastro, DtAlteracao, IdCondicaoPagamento)\n values(@NrModelo, @NrSerie, @IdCliente, @DtEmissao, @TotalProdutos, @TotalVenda, @DtCadastro, @DtAlteracao, @IdCondicaoPagamento);";

                    cmd = new SqlCommand(queryVenda, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@NrModelo", SqlDbType.Int).Value = pVenda.NrModelo;
                    cmd.Parameters.Add("@NrSerie", SqlDbType.Int).Value = pVenda.NrSerie;
                    cmd.Parameters.Add("@IdCliente", SqlDbType.Int).Value = pVenda.IdCliente;
                    cmd.Parameters.Add("@DtEmissao", SqlDbType.Date).Value = pVenda.DtEmissao.ToString("yyyy-MM-dd");
                    cmd.Parameters.Add("@TotalProdutos", SqlDbType.Decimal).Value = pVenda.TotalProdutos;
                    cmd.Parameters.Add("@TotalVenda", SqlDbType.Decimal).Value = pVenda.TotalNota;
                    cmd.Parameters.Add("@DtCadastro", SqlDbType.DateTime).Value = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.DateTime).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd.Parameters.Add("@IdCondicaoPagamento", SqlDbType.Int).Value = pVenda.IdCondicaoPagamento;
                    cmd.ExecuteNonQuery();


                    // Produtos Venda
                    string queryProdutosVenda = "declare @ProdutosId TABLE (IdProduto int, Quantidade int, PrecoUnit decimal(18,2), Desconto decimal(18,2),PrecoTotal decimal(18,2));\ninsert into @ProdutosId(IdProduto, Quantidade, PrecoUnit, Desconto, PrecoTotal) values";

                    foreach (ProdutoVendaPostRequest prod in pVenda.Produtos)
                    {
                        queryProdutosVenda+= $"({prod.IdProduto},{prod.Quantidade},{prod.PrecoUnit.ToString(System.Globalization.CultureInfo.InvariantCulture)},{prod.Desconto.ToString(System.Globalization.CultureInfo.InvariantCulture)},{prod.PrecoTotal.ToString(System.Globalization.CultureInfo.InvariantCulture)}),";
                    }

                    queryProdutosVenda = queryProdutosVenda.Substring(0, queryProdutosVenda.Length - 1);
                    queryProdutosVenda += ";\n";

                    queryProdutosVenda += $"insert into TbProdutosVenda (NrNota, NrModelo, NrSerie, IdCliente, IdProduto, Quantidade, PrecoUnit, Desconto, PrecoTotal)\nselect {pVenda.NrNota}, {pVenda.NrModelo}, {pVenda.NrSerie}, {pVenda.IdCliente}, IdProduto, Quantidade, PrecoUnit, Desconto, PrecoTotal from @ProdutosId";
                    queryProdutosVenda += ";\n";

                    cmd = new SqlCommand(queryProdutosVenda, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.ExecuteNonQuery();

                    // Contas a Receber
                    string queryContasReceber = "insert into TbContasReceber(NrNota, NrModelo, NrSerie, IdCliente, IdFormaPagamento, NumParcela, ValorParcela, DtEmissao, DtVencimento, DtRecebimento, Juros, Multa, Desconto, ValorRecebido, Observacao, DtCadastro, DtAlteracao, Cancelada) \nvalues";

                    foreach (ContaReceberPostRequest contaReceber in pVenda.ContasReceber)
                    {
                        queryContasReceber += $"({pVenda.NrNota},{pVenda.NrModelo},{pVenda.NrSerie},{pVenda.IdCliente},{contaReceber.IdFormaPagamento},{contaReceber.NumParcela},{contaReceber.ValorParcela.ToString(System.Globalization.CultureInfo.InvariantCulture)},@DtEmissao,'{contaReceber.DtVencimento.ToString("yyyy-MM-dd")}',null,0,0,0,0,'',@DtCadastro,@DtAlteracao,0),";
                    }

                    queryContasReceber = queryContasReceber.TrimEnd(',');

                    cmd = new SqlCommand(queryContasReceber, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@DtEmissao", SqlDbType.DateTime).Value = new DateTime(pVenda.DtEmissao.Year, pVenda.DtEmissao.Month, pVenda.DtEmissao.Day, DateTime.Now.Hour, DateTime.Now.Minute, DateTime.Now.Second).ToString("yyyy-MM-dd HH:mm:ss");
                    cmd.Parameters.Add("@DtCadastro", SqlDbType.DateTime).Value = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.DateTime).Value = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    cmd.ExecuteNonQuery();

                    // Produtos
                    string queryProdutos = "";

                    foreach (ProdutoVendaPostRequest prod in pVenda.Produtos)
                    {
                        queryProdutos += $"\nupdate TbProdutos set Quantidade = Quantidade - {prod.Quantidade} where Id = {prod.IdProduto}";
                    }

                    cmd = new SqlCommand(queryProdutos,sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.ExecuteNonQuery();
                    return "Venda adicionada com sucesso!";
                }
                catch (SqlException ex)
                {
                    return "Erro ao adicionar venda!";
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }

        public string PutCancelarVenda(int pNrNota, int pNrModelo, int pNrSerie, int pIdCliente)
        {
            using (sqlConnection)
            {
                try
                {
                    SqlCommand cmd;
                    sqlConnection.Open();
                    string queryVerificarContaReceber = $"select cr.ValorRecebido from TbContasReceber cr where cr.NrNota = {pNrNota} and cr.NrModelo = {pNrModelo} and cr.NrSerie = {pNrSerie} and cr.IdCliente = {pIdCliente};";
                    cmd = new SqlCommand(queryVerificarContaReceber, sqlConnection);
                    cmd.Parameters.Clear();
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader != null && reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            if (reader.GetDecimal("ValorRecebido") > 0)
                            {
                                return "Não é possível cancelar a venda, pois, já foi dada baixa em uma conta a receber!";
                            }
                        }
                    }

                    string queryVenda = "update TbVendas set DtCancelamento = @DtCancelamento where NrNota = @NrNota and NrModelo = @NrModelo and NrSerie = @NrSerie and IdCliente = @IdCliente \n\n";
                    string queryContasReceber = "update TbContasReceber set Cancelada = 1 where NrNota = @NrNota and NrModelo = @NrModelo and NrSerie = @NrSerie and IdCliente = @IdCliente";
                    cmd = new SqlCommand(queryVenda + queryContasReceber, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@DtCancelamento", SqlDbType.DateTime).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd.Parameters.Add("@NrNota", SqlDbType.Int).Value = pNrNota;
                    cmd.Parameters.Add("@NrModelo", SqlDbType.Int).Value = pNrModelo;
                    cmd.Parameters.Add("@NrSerie", SqlDbType.Int).Value = pNrSerie;
                    cmd.Parameters.Add("@IdCliente", SqlDbType.Int).Value = pIdCliente;
                    cmd.ExecuteNonQuery();
                    return "Venda cancelada com sucesso!";
                }
                catch (SqlException ex)
                {
                    return "Erro ao cancelar venda!";
                }
                catch (Exception ex)
                {
                    return "Erro ao cancelar venda!";
                }
                finally
                {
                    this.sqlConnection.Close();
                }
            }
        }

        public int GetLastVendaKey()
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    return 0;
                }
                catch (SqlException ex)
                {
                    return 0;
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }
    }
}
