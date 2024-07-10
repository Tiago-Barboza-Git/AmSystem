using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.FormaPagamento;
using ApiAmSystem.Domain.Models.Parcela;
using Microsoft.Data.SqlClient;
using System.Data;

namespace ApiAmSystem.Services
{
    public class ParcelaService: IParcelaService
    {
        private readonly SqlConnection sqlConnection;

        public ParcelaService(SqlConnection pSqlConnection)
        {
            this.sqlConnection = pSqlConnection;
        }

        public IEnumerable<ParcelaModel> GetParcelas(int pIdCondicaoPagamento)
        {
            using (SqlConnection sqlConnectionTeste = new SqlConnection("Server=DESKTOP-JPC14RO;Database=AmSystem;Trusted_Connection=True;Integrated Security=true;TrustServerCertificate=True"))
            {
                try
                {
                    List<ParcelaModel> result = new List<ParcelaModel>();
                    sqlConnectionTeste.Open();
                    string query = @"
                        select 
	                        p.Id,
	                        p.NumParcela,
	                        p.Dias,
	                        p.Porcentagem,
                            p.IdCondPagamento,
                            fp.Id as 'IdFormaPagamento',
	                        fp.FormaPagamento
                        from TbParcelas p
                        inner join TbFormasPagamentos fp on
	                        fp.Id = p.IdFormaPagamento
                        where p.IdCondPagamento = @IdCondPagamento";
                    SqlCommand cmd = new SqlCommand(query, sqlConnectionTeste);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@IdCondPagamento", SqlDbType.Int).Value = pIdCondicaoPagamento;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result.Add(new ParcelaModel
                            {
                                id = reader.GetInt32("Id"),
                                numParcela = reader.GetInt32("NumParcela"),
                                dias = reader.GetInt32("Dias"),
                                porcentagem = reader.GetDecimal("Porcentagem"),
                                idCondPagamento = reader.GetInt32("IdCondPagamento"),
                                idFormaPagamento = reader.GetInt32("IdFormaPagamento"),
                                formaPagamento = new FormaPagamentoModel 
                                { 
                                    id = reader.GetInt32("IdFormaPagamento"),
                                    formaPagamento = reader.GetString("FormaPagamento")
                                }
                            });
                        }
                    }
                    reader.Close();
                    return result;
                }
                catch (SqlException ex)
                {
                    throw new Exception(ex.Message);
                }
                finally
                {
                    sqlConnectionTeste.Close();
                }
            }
        }
    }
}
