using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Compra.ProdutoCompra;
using ApiAmSystem.Domain.Models.Produto;
using ApiAmSystem.Domain.Models.UnidadeMedida;
using ApiAmSystem.Domain.Models.Venda.ProdutoVenda;
using Microsoft.Data.SqlClient;
using System.Data;

namespace ApiAmSystem.Services
{
    public class ProdutoVendaService : IProdutoVendaService
    {
        private readonly SqlConnection sqlConnection;
        private readonly IProdutosService produtoService;
        public ProdutoVendaService(SqlConnection pSqlConnection, IProdutosService pIProdutoService)
        {
            this.sqlConnection = pSqlConnection;
            this.produtoService = pIProdutoService;
        }
        public IEnumerable<ProdutoVendaModel> GetProdutosVendaByVenda(int pNrNota, int pNrModelo, int pNrSerie, int pIdCliente)
        {
            using (SqlConnection conn = new SqlConnection("Server=DESKTOP-JPC14RO;Database=AmSystem;Trusted_Connection=True;Integrated Security=True;TrustServerCertificate=True;MultipleActiveResultSets=True;"))
            {
                try
                {
                    conn.Open();
                    List<ProdutoVendaModel> result = new List<ProdutoVendaModel>();
                    string query = @"select 
                                        pc.IdProduto,
                                        p.Produto,
                                        pc.Quantidade,
                                        pc.PrecoUnit,
                                        pc.PrecoTotal,
                                        p.IdUnidadeMedida,
                                        um.UnidadeMedida
                                    from TbProdutosVenda pv
                                    inner join TbProdutos p on p.Id = pv.IdProduto
                                    inner join TbUnidadesMedidas um on um.Id = p.IdUnidadeMedida
                                    where pv.NrNota = @NrNota and pv.NrModelo = @NrModelo and pv.NrSerie = @NrSerie and pv.IdCliente = @IdCliente;";
                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@NrNota", SqlDbType.Int).Value = pNrNota;
                    cmd.Parameters.Add("@NrModelo", SqlDbType.Int).Value = pNrModelo;
                    cmd.Parameters.Add("@NrSerie", SqlDbType.Int).Value = pNrSerie;
                    cmd.Parameters.Add("@IdCliente", SqlDbType.Int).Value = pIdCliente;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader != null && reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result.Add(new ProdutoVendaModel
                            {
                                NrNota = pNrNota,
                                NrModelo = pNrModelo,
                                NrSerie = pNrSerie,
                                IdCliente = pIdCliente,
                                IdProduto = reader.GetInt32("IdProduto"),
                                PrecoUnit = reader.GetDecimal("PrecoUnit"),
                                PrecoTotal = reader.GetDecimal("PrecoTotal"),
                                Quantidade = reader.GetInt32("Quantidade"),
                                Produto = new ProdutoModel
                                {
                                    Id = reader.GetInt32("IdProduto"),
                                    Produto = reader.GetString("Produto"),
                                    IdUnidadeMedida = reader.GetInt32("IdUnidadeMedida"),
                                    UnidadeMedida = new UnidadeMedidaModel
                                    {
                                        id = reader.GetInt32("IdUnidadeMedida"),
                                        unidadeMedida = reader.GetString("UnidadeMedida")
                                    }
                                },
                            });
                        }
                    }

                    return result;

                }
                catch (Exception ex)
                {
                    throw new Exception(ex.Message);
                }
                finally
                {
                    conn.Close();
                }
            }
        }
    }
}
