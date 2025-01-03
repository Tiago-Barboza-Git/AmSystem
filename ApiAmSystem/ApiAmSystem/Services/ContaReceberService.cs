﻿using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Cliente;
using ApiAmSystem.Domain.Models.Compra.ContaPagar;
using ApiAmSystem.Domain.Models.CondicaoPagamento;
using ApiAmSystem.Domain.Models.FormaPagamento;
using ApiAmSystem.Domain.Models.Fornecedor;
using ApiAmSystem.Domain.Models.Venda.ContaReceber;
using Microsoft.Data.SqlClient;
using System.Data;

namespace ApiAmSystem.Services
{
    public class ContaReceberService : IContaReceberService
    {
        private readonly SqlConnection sqlConnection;
        public ContaReceberService(SqlConnection sqlConnection)
        {
            this.sqlConnection = sqlConnection;
        }

        public IEnumerable<ContaReceberModel> GetContasReceber(bool pAtivo)
        {
            using (this.sqlConnection)
            {
                try
                {
                    List<ContaReceberModel> result = new List<ContaReceberModel>();
                    this.sqlConnection.Open();
                    string query = @"
                       select 
                         cr.*,
                         c.ClienteRazaoSocial,
                         fp.FormaPagamento,
                         cpag.Juros as 'JurosCondPag',
                         cpag.Desconto as 'DescontoCondPag',
                         cpag.Multa as 'MultaCondPag'
                     from TbContasReceber cr
                     inner join TbClientes c on c.Id = cr.IdCliente
                     inner join TbFormasPagamentos fp on fp.Id = cr.IdFormaPagamento
                     inner join TbVendas v on v.NrNota = cr.NrNota and v.NrModelo = cr.NrModelo and v.NrSerie = cr.NrSerie and v.IdCliente = cr.IdCliente
                     inner join TbCondicoesPagamentos cpag on cpag.Id = v.IdCondicaoPagamento
                     where cr.Cancelada = @Ativo;
                    ";

                    SqlCommand cmd = new SqlCommand(query, this.sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Ativo", SqlDbType.Int).Value = pAtivo;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader != null && reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result.Add(new ContaReceberModel
                            {
                                NrNota = reader.GetInt32("NrNota"),
                                NrModelo = reader.GetInt32("NrModelo"),
                                NrSerie = reader.GetInt32("NrSerie"),
                                IdCliente = reader.GetInt32("IdCliente"),
                                IdFormaPagamento = reader.GetInt32("IdFormaPagamento"),
                                NumParcela = reader.GetInt32("NumParcela"),
                                ValorParcela = reader.GetDecimal("ValorParcela"),
                                DtEmissao = reader.GetDateTime("DtEmissao"),
                                DtVencimento = reader.GetDateTime("DtVencimento"),
                                Desconto = reader.GetDecimal("Desconto"),
                                Juros = reader.GetDecimal("Juros"),
                                Multa = reader.GetDecimal("Multa"),
                                ValorPago = reader.GetDecimal("ValorRecebido"),
                                DtPagamento = reader.IsDBNull("DtRecebimento") ? null : reader.GetDateTime("DtRecebimento"),
                                Cancelada = reader.GetBoolean("Cancelada"),
                                DtCadastro = reader.GetDateTime("DtCadastro"),
                                DtAlteracao = reader.GetDateTime("DtAlteracao"),
                                FormaPagamento = new FormaPagamentoModel
                                {
                                    id = reader.GetInt32("IdFormaPagamento"),
                                    formaPagamento = reader.GetString("FormaPagamento")
                                },
                                Cliente = new ClienteModel
                                {
                                    id = reader.GetInt32("IdCliente"),
                                    pessoaRazaoSocial = reader.GetString("ClienteRazaoSocial")
                                },
                                CondicaoPagamento = new CondicaoPagamentoModel
                                {
                                    juros = reader.GetDecimal("JurosCondPag"),
                                    multa = reader.GetDecimal("MultaCondPag"),
                                    desconto = reader.GetDecimal("DescontoCondPag"),
                                }
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
                    this.sqlConnection.Close();
                }
            }
        }

        public string PutContaReceber(ContaReceberPutRequest pContaReceber)
        {
            using (this.sqlConnection)
            {
                try
                {
                    this.sqlConnection.Open();
                    string query = $@"update TbContasReceber set 
                                        DtRecebimento = @DtRecebimento, Juros = @Juros, Desconto = @Desconto, Multa = @Multa, ValorRecebido = @ValorRecebido, DtAlteracao = @DtAlteracao, Observacao = @Observacao
                                      where
                                        NrNota = @NrNota and NrModelo = @NrModelo and NrSerie = @NrSerie and IdCliente = @IdCliente and NumParcela = @NumParcela;";
                    SqlCommand cmd = new SqlCommand(query, this.sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@DtRecebimento", SqlDbType.Date).Value = pContaReceber.DtPagamento;
                    cmd.Parameters.Add("@Juros", SqlDbType.Money).Value = pContaReceber.Juros;
                    cmd.Parameters.Add("@Desconto", SqlDbType.Money).Value = pContaReceber.Desconto;
                    cmd.Parameters.Add("@Multa", SqlDbType.Money).Value = pContaReceber.Multa;
                    cmd.Parameters.Add("@ValorRecebido", SqlDbType.Money).Value = pContaReceber.ValorPago;
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.DateTime).Value = DateTime.Now;
                    cmd.Parameters.Add("@NrNota", SqlDbType.Int).Value = pContaReceber.NrNota;
                    cmd.Parameters.Add("@NrModelo", SqlDbType.Int).Value = pContaReceber.NrModelo;
                    cmd.Parameters.Add("@NrSerie", SqlDbType.Int).Value = pContaReceber.NrSerie;
                    cmd.Parameters.Add("@IdCliente", SqlDbType.Int).Value = pContaReceber.IdCliente;
                    cmd.Parameters.Add("@NumParcela", SqlDbType.Int).Value = pContaReceber.NumParcela;
                    cmd.Parameters.Add("@Observacao", SqlDbType.VarChar).Value = pContaReceber.Observacao;
                    cmd.ExecuteNonQuery();

                    return "Conta à receber paga com sucesso!";
                }
                catch (SqlException ex)
                {
                    return "Erro ao realizar o pagamento da conta à receber!";
                }
                finally
                {
                    this.sqlConnection.Close();
                }
            }
        }

        public IEnumerable<ContaReceberModel> GetContasReceberByVenda(int pNrNota, int pNrModelo, int pNrSerie, int pIdCliente)
        {
            using (SqlConnection conn = new SqlConnection("Server=DESKTOP-JPC14RO;Database=AmSystem;Trusted_Connection=True;Integrated Security=True;TrustServerCertificate=True;MultipleActiveResultSets=True;"))
            {
                try
                {
                    conn.Open();
                    List<ContaReceberModel> result = new List<ContaReceberModel>();
                    string query =
                        @"
                            select 
                                cr.NumParcela,
                                cr.ValorParcela,
                                cr.DtEmissao,
                                cr.DtVencimento,
                                cr.Desconto,
                                cr.Juros,
                                cr.Multa,
                                cr.ValorRecebido,
                                cr.DtRecebimento,
                                cr.Cancelada,
                                cr.IdFormaPagamento,
                                cr.DtCadastro,
                                cr.DtAlteracao,
                                cr.Observacao,
                                fp.FormaPagamento,
                                cr.IdCliente,
                                c.ClienteRazaoSocial
                            from TbContasReceber cr
                            inner join TbFormasPagamentos fp on fp.Id = cr.IdFormaPagamento
                            inner join TbClientes c on c.Id = cr.IdCliente
                            where cr.NrNota = @NrNota and cr.NrModelo = @NrModelo and cr.NrSerie = @NrSerie and cr.IdCliente = @IdCliente;
                        ";

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
                            result.Add(new ContaReceberModel
                            {
                                NrNota = pNrNota,
                                NrModelo = pNrModelo,
                                NrSerie = pNrSerie,
                                IdCliente = pIdCliente,
                                NumParcela = reader.GetInt32("NumParcela"),
                                ValorParcela = reader.GetDecimal("ValorParcela"),
                                DtEmissao = reader.GetDateTime("DtEmissao"),
                                DtVencimento = reader.GetDateTime("DtVencimento"),
                                Desconto = reader.GetDecimal("Desconto"),
                                Juros = reader.GetDecimal("Juros"),
                                Multa = reader.GetDecimal("Multa"),
                                ValorPago = reader.GetDecimal("ValorRecebido"),
                                DtPagamento = reader.IsDBNull("DtRecebimento") ? null : reader.GetDateTime("DtRecebimento"),
                                Cancelada = reader.GetBoolean("Cancelada"),
                                IdFormaPagamento = reader.GetInt32("IdFormaPagamento"),
                                DtCadastro = reader.GetDateTime("DtCadastro"),
                                DtAlteracao = reader.GetDateTime("DtAlteracao"),
                                FormaPagamento = new FormaPagamentoModel
                                {
                                    id = reader.GetInt32("IdFormaPagamento"),
                                    formaPagamento = reader.GetString("FormaPagamento")
                                },
                                Cliente = new ClienteModel
                                {
                                    id = reader.GetInt32("IdCliente"),
                                    pessoaRazaoSocial = reader.GetString("ClienteRazaoSocial")
                                },
                                Observacao = reader.GetString("Observacao")

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
