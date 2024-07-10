using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.CondicaoPagamento;
using ApiAmSystem.Domain.Models.FormaPagamento;
using ApiAmSystem.Domain.Models.Parcela;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Globalization;
using System.Transactions;

namespace ApiAmSystem.Services
{
    public class CondicaoPagamentoService : ICondicaoPagamentoService
    {
        private readonly SqlConnection sqlConnection;
        private readonly IParcelaService parcelaService;

        public CondicaoPagamentoService(SqlConnection pSqlConnection, IParcelaService pParcelaService)
        {
            this.sqlConnection = pSqlConnection;
            this.parcelaService = pParcelaService;
        }

        public CondicaoPagamentoModel GetCondicaoPagamento(int pId)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Close();
                    string query = @"
                        select
                            c.Id,
                            c.CondicaoPagamento,
                            c.Desconto,
                            c.Juros,
                            c.Multa,
                            c.Ativo,
                            c.DtCadastro,
                            c.DtAlteracao
                        from TbCondicoesPagamentos c
                        where c.Id = @Id;
                    ";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pId;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        reader.Read();
                        return new CondicaoPagamentoModel
                        {
                            id = reader.GetInt32("Id"),
                            condicaoPagamento = reader.GetString("CondicaoPagamento"),
                            desconto = reader.GetDecimal("Desconto"),
                            juros = reader.GetDecimal("Juros"),
                            multa = reader.GetDecimal("Multa"),
                            ativo = reader.GetBoolean("Ativo"),
                            dtCadastro = reader.GetDateTime("DtCadastro"),
                            dtAlteracao = reader.GetDateTime("DtAlteracao")
                        };
                    }
                    return null;
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

        public IEnumerable<CondicaoPagamentoModel> GetCondicoesPagamentos(bool pAtivo)
        {
            using (sqlConnection)
            {
                try
                {
                    List<CondicaoPagamentoModel> result = new List<CondicaoPagamentoModel>();
                    sqlConnection.Open();
                    string query = @"
                        select
                            c.Id,
                            c.CondicaoPagamento,
                            c.Desconto,
                            c.Juros,
                            c.Multa,
                            c.Ativo,
                            c.DtCadastro,
                            c.DtAlteracao
                        from TbCondicoesPagamentos c
                        where c.Ativo = @Ativo";

                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pAtivo;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            CondicaoPagamentoModel condPag = new CondicaoPagamentoModel();

                            condPag.id = reader.GetInt32("Id");
                            condPag.condicaoPagamento = reader.GetString("CondicaoPagamento");
                            condPag.desconto = reader.GetDecimal("Desconto");
                            condPag.juros = reader.GetDecimal("Juros");
                            condPag.multa = reader.GetDecimal("Multa");
                            condPag.ativo = reader.GetBoolean("Ativo");
                            condPag.dtCadastro = reader.GetDateTime("DtCadastro");
                            condPag.dtAlteracao = reader.GetDateTime("DtAlteracao");
                            condPag.parcelas = parcelaService.GetParcelas(reader.GetInt32("Id"));

                            result.Add(condPag);
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
                    sqlConnection.Close();
                }
            }
        }

        public string PostCondicaoPagamento(CondicaoPagamentoPostRequest pCondicaoPagamento)
        {
            using (sqlConnection)
            {
                try
                {
                    string query = "declare @IdCondPag int;\n\n";
                    query += "insert into TbCondicoesPagamentos (CondicaoPagamento, Desconto, Juros, Multa, Ativo, DtCadastro, DtAlteracao) values(@CondicaoPagamento, @Desconto, @Juros, @Multa, @Ativo, @DtCadastro, @DtAlteracao);\n\n";
	                query += "set @IdCondPag = SCOPE_IDENTITY();\n\n";

                    string valuesParcelas = "";
                    if (pCondicaoPagamento.parcelas != null && pCondicaoPagamento.parcelas.Count() > 0)
                    {
                        foreach (ParcelaModel parcela in pCondicaoPagamento.parcelas)
                        {
                            valuesParcelas += $"({parcela.numParcela},{parcela.dias},{parcela.porcentagem.ToString(CultureInfo.InvariantCulture)},@IdCondPag,{parcela.idFormaPagamento}),";
                        }
                        valuesParcelas = valuesParcelas.Substring(0, valuesParcelas.Length - 1);

                        if (!string.IsNullOrEmpty(valuesParcelas))
                            query += $"insert into TbParcelas(NumParcela, Dias, Porcentagem, IdCondPagamento, IdFormaPagamento) values{valuesParcelas};";
                    }
                    
                    sqlConnection.Open();
                    
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@CondicaoPagamento", SqlDbType.VarChar).Value = pCondicaoPagamento.condicaoPagamento;
                    cmd.Parameters.Add("@Desconto", SqlDbType.Decimal).Value = pCondicaoPagamento.desconto;
                    cmd.Parameters.Add("@Juros", SqlDbType.Decimal).Value = pCondicaoPagamento.juros;
                    cmd.Parameters.Add("@Multa", SqlDbType.Decimal).Value = pCondicaoPagamento.multa;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pCondicaoPagamento.ativo;
                    cmd.Parameters.Add("@DtCadastro", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
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

        public string PutCondicaoPagamento(CondicaoPagamentoPutRequest pCondicaoPagamento)
        {
            using (sqlConnection)
            {
                try
                {
                    string query = @"
                            update TbCondicoesPagamentos
                            set CondicaoPagamento = @CondicaoPagamento,
                                Desconto = @Desconto,
                                Juros = @Juros,
                                Multa = @Multa,
                                Ativo = @Ativo,
                                DtAlteracao = @DtAlteracao
                            where Id = @Id";

                    sqlConnection.Open();

                    // Atualizar CondicaoPagamento
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pCondicaoPagamento.id;
                    cmd.Parameters.Add("@CondicaoPagamento", SqlDbType.VarChar).Value = pCondicaoPagamento.condicaoPagamento;
                    cmd.Parameters.Add("@Desconto", SqlDbType.Decimal).Value = pCondicaoPagamento.desconto;
                    cmd.Parameters.Add("@Juros", SqlDbType.Decimal).Value = pCondicaoPagamento.juros;
                    cmd.Parameters.Add("@Multa", SqlDbType.Decimal).Value = pCondicaoPagamento.multa;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pCondicaoPagamento.ativo;
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd.ExecuteNonQuery();

                    // Puxa o número das parcelas existentes
                    string selectParcelasQuery = "select NumParcela from TbParcelas where IdCondPagamento = @IdCondPagamento";
                    
                    SqlCommand cmdParcelas = new SqlCommand(selectParcelasQuery, sqlConnection);
                    cmdParcelas.Parameters.Clear();
                    cmdParcelas.Parameters.Add("@IdCondPagamento", SqlDbType.Int).Value = pCondicaoPagamento.id;
                    SqlDataReader reader = cmdParcelas.ExecuteReader();

                    // Lista com o número das parcelas existentes
                    List<int> existingParcelas = new List<int>();
                    while (reader.Read())
                        existingParcelas.Add(reader.GetInt32("NumParcela"));
                    reader.Close();

                    // Lista Para identificar quais parcelas foram atualizadas para definir quais serão removidas ou não.
                    List<int> updatedParcelas = new List<int>();

                    // Atualiza ou insere as parcelas
                    foreach (ParcelaModel parcela in pCondicaoPagamento.parcelas)
                    {
                        if (existingParcelas.Contains(parcela.numParcela))
                        {
                            string updateParcelaQuery = @"
                                update 
                                    TbParcelas
                                set 
                                    Dias = @Dias,
                                    Porcentagem = @Porcentagem,
                                    IdFormaPagamento = @IdFormaPagamento
                                where NumParcela = @NumParcela and IdCondPagamento = @IdCondPagamento";

                            SqlCommand updateCmd = new SqlCommand(updateParcelaQuery, sqlConnection);
                            updateCmd.Parameters.Clear();
                            updateCmd.Parameters.Add("@Id", SqlDbType.Int).Value = parcela.id;
                            updateCmd.Parameters.Add("@NumParcela", SqlDbType.Int).Value = parcela.numParcela;
                            updateCmd.Parameters.Add("@Dias", SqlDbType.Int).Value = parcela.dias;
                            updateCmd.Parameters.Add("@Porcentagem", SqlDbType.Decimal).Value = parcela.porcentagem;
                            updateCmd.Parameters.Add("@IdFormaPagamento", SqlDbType.Int).Value = parcela.idFormaPagamento;
                            updateCmd.Parameters.Add("@IdCondPagamento", SqlDbType.Int).Value = pCondicaoPagamento.id;
                            updateCmd.ExecuteNonQuery();
                        }
                        else
                        {
                            string insertParcelaQuery = @"
                                insert into TbParcelas 
                                    (NumParcela, Dias, Porcentagem, IdCondPagamento, IdFormaPagamento)
                                values 
                                    (@NumParcela, @Dias, @Porcentagem, @IdCondPagamento, @IdFormaPagamento)";

                            SqlCommand insertCmd = new SqlCommand(insertParcelaQuery, sqlConnection);
                            insertCmd.Parameters.Clear();
                            insertCmd.Parameters.Add("@NumParcela", SqlDbType.Int).Value = parcela.numParcela;
                            insertCmd.Parameters.Add("@Dias", SqlDbType.Int).Value = parcela.dias;
                            insertCmd.Parameters.Add("@Porcentagem", SqlDbType.Decimal).Value = parcela.porcentagem;
                            insertCmd.Parameters.Add("@IdCondPagamento", SqlDbType.Int).Value = pCondicaoPagamento.id;
                            insertCmd.Parameters.Add("@IdFormaPagamento", SqlDbType.Int).Value = parcela.idFormaPagamento;
                            insertCmd.ExecuteNonQuery();
                        }
                        updatedParcelas.Add(parcela.numParcela);
                    }

                    // Remove as parcelas 
                    foreach (int existingParcela in existingParcelas)
                    {
                        if (!updatedParcelas.Contains(existingParcela))
                        {
                            string deleteParcelaQuery = "delete from TbParcelas where Id = @Id";
                            SqlCommand deleteCmd = new SqlCommand(deleteParcelaQuery, sqlConnection);
                            deleteCmd.Parameters.Clear();
                            deleteCmd.Parameters.Add("@Id", SqlDbType.Int).Value = existingParcela;
                            deleteCmd.ExecuteNonQuery();
                        }
                    }

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


        public string DeleteCondicaoPagamento(int pId)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string queryParcelas = "delete from TbParcelas where IdCondPagamento = @Id";
                    SqlCommand cmdParcelas = new SqlCommand(queryParcelas, sqlConnection);
                    cmdParcelas.Parameters.Clear();
                    cmdParcelas.Parameters.Add("@Id", SqlDbType.Int).Value = pId;
                    cmdParcelas.ExecuteNonQuery();

                    string queryCondicaoPagamento = @"delete from TbCondicoesPagamentos where Id = @Id;";
                    SqlCommand cmdCondicaoPagamento = new SqlCommand(queryCondicaoPagamento, sqlConnection);
                    cmdCondicaoPagamento.Parameters.Clear();
                    cmdCondicaoPagamento.Parameters.Add("@Id", SqlDbType.Int).Value = pId;
                    cmdCondicaoPagamento.ExecuteNonQuery();
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
    }
}
