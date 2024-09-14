﻿using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.CompraProdutos;
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

        public IEnumerable<ProdutoCompraModel> GetProdutosCompra(int pNrNota, int pNrModelo, int pNrSerie, int pIdFornecedor)
        {
            using (sqlConnection)
            {
                try
                {
                    if (sqlConnection.State != ConnectionState.Open)
                        sqlConnection.Open();
                    List<ProdutoCompraModel> result = new List<ProdutoCompraModel>();
                    string query = @"select 
                                        pc.IdProduto,
                                        p.Produto,
                                        pc.Quantidade,
                                        pc.PrecoUnit,
                                        pc.PrecoTotal,
                                        pc.CustoProd,
                                        pc.CustoUnit,
                                        pc.Rateio,
                                        p.IdUnidadeMedida,
                                        um.UnidadeMedida
                                    from TbProdutosCompra pc
                                    inner join TbProdutos p on p.Id = pc.IdProduto
                                    inner join TbUnidadesMedidas um on um.Id = p.IdUnidadeMedida
                                    where pc.NrNota = @NrNota and pc.NrModelo = @NrModelo and pc.NrSerie = @NrSerie and pc.IdFornecedor = @IdFornecedor;";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
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
                            result.Add(new ProdutoCompraModel()
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
                                Produto = new ProdutoModel
                                {
                                    id = reader.GetInt32("IdProduto"),
                                    produto = reader.GetString("Produto"),
                                    idUnidadeMedida = reader.GetInt32("IdUnidadeMedida"),
                                    unidadeMedida = new UnidadeMedidaModel
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
                }
            }
        }
    }
}