using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Cliente;
using ApiAmSystem.Domain.Models.Compra.ContaPagar;
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
            throw new NotImplementedException();
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
