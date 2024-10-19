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
        public VendaModel GetVenda(int pNrNota, int pNrModelo, int pNrSerie, int pIdCliente)
        {
            throw new NotImplementedException();
        }

        public IEnumerable<VendaModel> GetVendas(bool pCanceladas)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    List<VendaModel> result = new List<VendaModel>();
                    string query = $@"
                        select
                            v.NrNota,
	                        v.NrModelo,
	                        v.NrSerie,
	                        v.IdCliente,
                            v.DtEmissao,
                            v.PercDesconto,
	                        v.TotalProdutos,
	                        v.TotalCompra,
	                        v.DtCancelamento,
	                        v.DtCadastro,
                            v.DtAlteracao,
	                        v.IdCondicaoPagamento,
                            v.IdFuncionario,
                            cp.CondicaoPagamento,
                            c.ClienteRazaoSocial,
                            f.Funcionario,
                        from TbVendas v
                        inner join TbClientes c on c.Id = v.IdCliente
                        inner join TbCondicoesPagamentos cp on cp.Id = v.IdCondicaoPagamento
                        inner join TbFuncionario f on f.Id = v.IdFuncionario
                        where v.DtCancelamento {(pCanceladas == true ? "is not" : "is")} null
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
                            int IdCliente = reader.GetInt32("IdCliente");

                            result.Add(new VendaModel
                            {
                                NrNota = NrNota,
                                NrModelo = NrModelo,
                                NrSerie = NrSerie,
                                IdCliente = IdCliente,
                                Cliente = new ClienteRef
                                {
                                    Id = reader.GetInt32("IdCliente"),
                                    PessoaRazaoSocial = reader.GetString("ClienteRazaoSocial")
                                },
                                DtEmissao = reader.GetDateTime("DtEmissao"),
                                TotalProdutos = reader.GetDecimal("TotalProdutos"),
                                TotalNota = reader.GetDecimal("TotalCompra"),
                                PercDesconto = reader.GetDecimal("PercDesconto"),
                                DtCancelamento = reader.IsDBNull("DtCancelamento") ? null : reader.GetDateTime("DtCancelamento"),
                                DtCadastro = reader.GetDateTime("DtCadastro"),
                                DtAlteracao = reader.GetDateTime("DtAlteracao"),
                                IdCondicaoPagamento = reader.GetInt32("IdCondicaoPagamento"),
                                CondicaoPagamento = new CondicaoPagamentoModel
                                {
                                    id = reader.GetInt32("IdCondicaoPagamento"),
                                    condicaoPagamento = reader.GetString("CondicaoPagamento")
                                },
                                IdFuncionario = reader.GetInt32("IdFuncionario"),
                                Funcionario = new FuncionarioRef
                                {
                                    Id = reader.GetInt32("IdFuncionario"),
                                    Funcionario = reader.GetString("Funcionario")
                                },
                                Produtos = this.produtoVendaService.GetProdutosVendaByVenda(NrNota, NrModelo, NrSerie, IdCliente),
                                ContasReceber = this.contaReceberService.GetContasReceberByVenda(NrNota, NrModelo, NrSerie, IdCliente),
                                
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

        public bool PostVenda(VendaPostRequest pVenda)
        {
            List<int> produtosRepetidos = new List<int>();

            foreach (ProdutoVendaPostRequest prod in pVenda.Produtos)
            {
                if (pVenda.Produtos.Where(x => x.IdProduto == prod.IdProduto).Count() > 1)
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
                    string queryVenda = "insert into \nTbVendas(NrNota, NrModelo, NrSerie, IdCliente, DtEmissao, TotalProdutos, TotalVenda, DtCadastro, DtAlteracao, IdCondicaoPagamento)\n values(@NrNota, @NrModelo, @NrSerie, @IdCliente, @DtEmissao, @TotalProdutos, @TotalVenda, @DtCadastro, @DtAlteracao, @IdCondicaoPagamento);";

                    string queryProdutosVenda = "declare @ProdutosId TABLE (IdProduto int, Quantidade int, PrecoUnit money,PrecoTotal money);\ninsert into @ProdutosId(IdProduto, Quantidade, PrecoUnit, PrecoTotal) values";

                    foreach (ProdutoVendaPostRequest prod in pVenda.Produtos)
                    {
                        queryProdutosVenda+= $"({prod.IdProduto},{prod.Quantidade},{prod.PrecoUnit},{prod.PrecoTotal}),";
                    }

                    queryProdutosVenda = queryProdutosVenda.Substring(0, queryProdutosVenda.Length - 1);
                    queryProdutosVenda += ";\n";

                    queryProdutosVenda += "insert into TbProdutosCompra (NrNota, NrModelo, NrSerie, IdCliente, IdProduto, Quantidade, PrecoUnit, PrecoTotal)\nselect @NrNota, @NrModelo, @NrSerie, @IdCliente, IdProduto, Quantidade, PrecoUnit, PrecoTotal from @ProdutosId";
                    queryProdutosVenda += ";\n";

                    string queryContasReceber = "insert into TbContasReceber(NrNota, NrModelo, NrSerie, IdCliente, IdFormaPagamento, NumParcela, ValorParcela, DtEmissao, DtVencimento, DtRecebimento, Juros, Multa, Desconto, ValorRecebido, Observacao, DtCadastro, DtAlteracao, Cancelada) \nvalues";

                    foreach (ContaReceberPostRequest contaReceber in pVenda.ContasReceber)
                    {
                        queryContasReceber += $"({pVenda.NrNota},{pVenda.NrModelo},{pVenda.NrSerie},{pVenda.IdCliente},{contaReceber.IdFormaPagamento},{contaReceber.NumParcela},{contaReceber.ValorParcela.ToString(System.Globalization.CultureInfo.InvariantCulture)},'{pVenda.DtEmissao.ToString("yyyy-MM-dd")}','{contaReceber.DtVencimento.ToString("yyyy-MM-dd")}',null,0,0,0,0,'','{DateTime.Now.ToString("yyyy-MM-dd")}','{DateTime.Now.ToString("yyyy-MM-dd")}',0),";
                    }

                    queryContasReceber = queryContasReceber.TrimEnd(',');

                    string queryProdutos = "";

                    foreach (ProdutoVendaPostRequest prod in pVenda.Produtos)
                    {
                        if (produtosRepetidos.FirstOrDefault(x => x == prod.IdProduto) == 0)
                            queryProdutos += $"\nupdate TbProdutos set Quantidade = Quantidade - {prod.Quantidade} where Id = {prod.IdProduto}";
                    }

                    if (produtosRepetidos.Count() > 0)
                    {
                        foreach (int idProduto in produtosRepetidos)
                        {
                            List<ProdutoVendaPostRequest> prods = pVenda.Produtos.Where(x => x.IdProduto == idProduto).ToList();
                            int quantidade = (prods.Sum(x => x.Quantidade));
                            queryProdutos += $"\nupdate TbProdutos set Quantidade = Quantidade + {quantidade} where Id = {idProduto}";
                        }
                    }

                    string query = queryVenda + queryProdutosVenda + queryContasReceber + queryProdutos;
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@NrNota", SqlDbType.Int).Value = pVenda.NrNota;
                    cmd.Parameters.Add("@NrModelo", SqlDbType.Int).Value = pVenda.NrModelo;
                    cmd.Parameters.Add("@NrSerie", SqlDbType.Int).Value = pVenda.NrSerie;
                    cmd.Parameters.Add("@IdCliente", SqlDbType.Int).Value = pVenda.IdCliente;
                    cmd.Parameters.Add("@DtEmissao", SqlDbType.Date).Value = pVenda.DtEmissao.ToString("yyyy-MM-dd");
                    cmd.Parameters.Add("@TotalProdutos", SqlDbType.Money).Value = pVenda.TotalProdutos;
                    cmd.Parameters.Add("@TotalCompra", SqlDbType.Money).Value = pVenda.TotalNota;
                    cmd.Parameters.Add("@DtCadastro", SqlDbType.DateTime).Value = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.DateTime).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd.Parameters.Add("@IdCondicaoPagamento", SqlDbType.Int).Value = pVenda.IdCondicaoPagamento;
                    cmd.ExecuteNonQuery();
                    return true;
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

        public bool PutCancelarVenda(int pNrNota, int pNrModelo, int pNrSerie, int pIdCliente)
        {
            throw new NotImplementedException();
        }
    }
}
