using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Compra.ProdutoCompra;
using ApiAmSystem.Domain.Models.Produto;
using ApiAmSystem.Domain.Models.UnidadeMedida;
using Microsoft.Data.SqlClient;
using System.Data;

namespace ApiAmSystem.Services
{
    public class ProdutoCompraService : IProdutoCompraService
    {
        private readonly SqlConnection sqlConnection;
        private readonly IProdutosService produtoService;
        public ProdutoCompraService(SqlConnection pSqlConnection, IProdutosService pIProdutoService)
        {
            this.sqlConnection = pSqlConnection;
            this.produtoService = pIProdutoService;
        }

        public IEnumerable<ProdutoCompraModel> GetProdutosCompraByCompra(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor)
        {
            using (SqlConnection conn = new SqlConnection("Server=DESKTOP-JPC14RO;Database=AmSystem;Trusted_Connection=True;Integrated Security=True;TrustServerCertificate=True;MultipleActiveResultSets=True;"))
            {
                try
                {
                    conn.Open();
                    List<ProdutoCompraModel> result = new List<ProdutoCompraModel>();
                    string query = @"select 
                                        pc.IdProduto,
                                        p.Produto,
                                        pc.Quantidade,
                                        pc.PrecoUnit,
                                        pc.PrecoTotal,
                                        pc.CustoProd,
                                        pc.CustoUnit,
                                        pc.Desconto,
                                        pc.Rateio,
                                        p.IdUnidadeMedida,
                                        um.UnidadeMedida
                                    from TbProdutosCompra pc
                                    inner join TbProdutos p on p.Id = pc.IdProduto
                                    inner join TbUnidadesMedidas um on um.Id = p.IdUnidadeMedida
                                    where pc.NrNota = @NrNota and pc.NrModelo = @NrModelo and pc.NrSerie = @NrSerie and pc.IdFornecedor = @IdFornecedor;";
                    SqlCommand cmd = new SqlCommand(query, conn);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@NrNota", SqlDbType.Int).Value = pNrNota;
                    cmd.Parameters.Add("@NrModelo", SqlDbType.Int).Value = pNrModelo;
                    cmd.Parameters.Add("@NrSerie", SqlDbType.Int).Value = pNrSerie;
                    cmd.Parameters.Add("@IdFornecedor", SqlDbType.Int).Value = pIdFornecedor;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader != null && reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result.Add(new ProdutoCompraModel
                            {
                                NrNota = pNrNota,
                                NrModelo = pNrModelo,
                                NrSerie = pNrSerie,
                                IdFornecedor = pIdFornecedor,
                                IdProduto = reader.GetInt32("IdProduto"),
                                PrecoUnit = reader.GetDecimal("PrecoUnit"),
                                PrecoTotal = reader.GetDecimal("PrecoTotal"),
                                CustoProd = reader.GetDecimal("CustoProd"),
                                CustoUnit = reader.GetDecimal("CustoUnit"),
                                Quantidade = reader.GetInt32("Quantidade"),
                                Rateio = reader.GetDecimal("Rateio"),
                                Desconto = reader.GetDecimal("Desconto"),
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
