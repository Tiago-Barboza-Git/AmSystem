using ApiAmSystem.Domain.Models.Funcionario;
using ApiAmSystem.Interfaces;
using ApiAmSystem.Domain.Models;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Data.SqlClient;
using System.Data;
using static System.Runtime.InteropServices.JavaScript.JSType;
using ApiAmSystem.Domain.Models.Cidade;
using ApiAmSystem.Domain.Models.Estado;
using ApiAmSystem.Domain.Models.Pais;
using System.Runtime.ConstrainedExecution;

namespace ApiAmSystem.Services
{
    public class FuncionariosService: IFuncionariosService
    {
        private readonly SqlConnection sqlConnection;
        private readonly IMappings mappings;
        public FuncionariosService(SqlConnection pConnection,IMappings pMappings) 
        {
            this.sqlConnection = pConnection;
            this.mappings = pMappings;
        }
        public FuncionarioModel GetFuncionario(int pId)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = "SELECT * FROM TbFuncionarios WHERE Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pId;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        reader.Read();
                        return null;
                    }
                    else
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

        public IEnumerable<FuncionarioModel> GetFuncionarios(bool pAtivo)
        {
            List<FuncionarioModel> result = new List<FuncionarioModel>();
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @"
                        select
                            f.Id,
                            f.Funcionario,
                            f.Apelido,
                            f.Cpf,
                            f.Rg,
                            f.DtNascimento,
                            f.Email,
                            f.Telefone,
                            f.Celular,
                            f.Salario,
                            f.Pis,
                            f.CEP,
                            f.Logradouro,
                            f.Bairro,
                            f.Numero,
                            f.Complemento,
                            f.Sexo,
                            f.Cargo,
                            f.Ativo,
                            f.DtAdmissao,
                            f.DtDemissao,
                            f.DtCadastro,
                            f.DtAlteracao,
                            f.IdCidade,
                            c.Cidade,
                            c.DDD,
                            c.IdEstado,
                            e.Estado,
                            e.Uf,
                            e.IdPais,
                            p.Pais,
                            p.Sigla,
                            p.DDI
                        from TbFuncionarios f
                        inner join TbCidades c on
                            c.Id = f.IdCidade
                        inner join TbEstados e on
                            e.Id = c.IdEstado
                        inner join TbPaises p on
                            p.Id = e.IdPais
                        where f.Ativo = @Ativo";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pAtivo;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader != null)
                    {
                        while (reader.Read())
                        {
                            result.Add(new FuncionarioModel
                            {
                                id = reader.GetInt32("Id"),
                                funcionario = reader.GetString("Funcionario"),
                                apelido = reader.IsDBNull("Apelido") ? "" : reader.GetString("Apelido"),
                                cpf = reader.IsDBNull("Cpf") ? "" : reader.GetString("Cpf"),
                                rg = reader.IsDBNull("Rg") ? "" : reader.GetString("Rg"),
                                dtNascimento = reader.IsDBNull("DtNascimento") ? null : reader.GetDateTime("DtNascimento"),
                                email = reader.GetString("Email"),
                                telefone = reader.IsDBNull("Telefone") ? "" : reader.GetString("Telefone"),
                                celular = reader.GetString("Celular"),
                                salario = reader.IsDBNull("Salario") ? 0 : reader.GetDecimal("Salario"),
                                pis = reader.IsDBNull("Pis") ? "" : reader.GetString("Pis"),
                                cep = reader.GetString("CEP"),
                                logradouro = reader.GetString("Logradouro"),
                                bairro = reader.GetString("Bairro"),
                                numero = reader.GetInt32("Numero"),
                                complemento = reader.IsDBNull("Complemento") ? "" : reader.GetString("Complemento"),
                                sexo = Convert.ToChar(reader.GetString("Sexo")),
                                cargo = reader.IsDBNull("Cargo") ? "" : reader.GetString("Cargo"),
                                ativo = reader.GetBoolean("Ativo"),
                                dtAdmissao = reader.IsDBNull("DtAdmissao") ? null : reader.GetDateTime("DtAdmissao"),
                                dtDemissao = reader.IsDBNull("DtDemissao") ? null : reader.GetDateTime("DtDemissao"),
                                dtCadastro = reader.GetDateTime("DtCadastro"),
                                dtAlteracao = reader.GetDateTime("DtAlteracao"),
                                idCidade = reader.GetInt32("IdCidade"),
                                cidade = new CidadeModel
                                {
                                    id = reader.GetInt32("IdCidade"),
                                    cidade = reader.GetString("Cidade"),
                                    ddd = reader.GetInt32("DDD"),
                                    idEstado = reader.GetInt32("IdEstado"),
                                    estado = new EstadoModel
                                    {
                                        id = reader.GetInt32("IdEstado"),
                                        estado = reader.GetString("Estado"),
                                        uf = reader.GetString("Uf"),
                                        idPais = reader.GetInt32("IdPais"),
                                        pais = new PaisModel
                                        {
                                            id = reader.GetInt32("IdPais"),
                                            pais = reader.GetString("Pais"),
                                            ddi = reader.GetInt32("DDI"),
                                            sigla = reader.GetString("Sigla")
                                        }
                                    }
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
                    sqlConnection.Close();
                }
            }
        }

        public string PostFuncionario(FuncionarioPostRequest pFuncionario)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @"INSERT INTO 
                        TbFuncionarios(
                            Funcionario, Apelido, Cpf, Rg, DtNascimento, Email, Telefone, Celular, Salario, Pis, CEP, Logradouro, Bairro, 
                            Numero, Complemento, Sexo, Cargo, IdCidade, Ativo, DtAdmissao, DtDemissao, DtCadastro, DtAlteracao
                        )
                        VALUES(
                            @Funcionario, @Apelido, @Cpf, @Rg, @DtNascimento, @Email, @Telefone, @Celular, @Salario, @Pis, @CEP, @Logradouro, @Bairro, 
                            @Numero, @Complemento, @Sexo, @Cargo, @IdCidade, @Ativo, @DtAdmissao, @DtDemissao, @DtCadastro, @DtAlteracao)";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Funcionario", SqlDbType.VarChar).Value = pFuncionario.funcionario;
                    cmd.Parameters.Add("@Apelido", SqlDbType.VarChar).Value = pFuncionario.apelido == null ? "" : pFuncionario.apelido;
                    cmd.Parameters.Add("@Cpf", SqlDbType.VarChar).Value = pFuncionario.cpf.Length == 0 ? DBNull.Value : pFuncionario.cpf;
                    cmd.Parameters.Add("@Rg", SqlDbType.VarChar).Value = pFuncionario.rg == null ? "" : pFuncionario.rg;
                    cmd.Parameters.Add("@DtNascimento", SqlDbType.Date).Value = pFuncionario.dtNascimento == null ? DBNull.Value : pFuncionario.dtNascimento?.ToString("yyyy-MM-dd");
                    cmd.Parameters.Add("@Email", SqlDbType.VarChar).Value = pFuncionario.email;
                    cmd.Parameters.Add("@Telefone", SqlDbType.VarChar).Value = pFuncionario.telefone;
                    cmd.Parameters.Add("@Celular", SqlDbType.VarChar).Value = pFuncionario.celular;
                    cmd.Parameters.Add("@Salario", SqlDbType.VarChar).Value = pFuncionario.salario;
                    cmd.Parameters.Add("@Pis", SqlDbType.VarChar).Value = pFuncionario.pis.Length == 0 ? DBNull.Value : pFuncionario.pis;
                    cmd.Parameters.Add("@CEP", SqlDbType.VarChar).Value = pFuncionario.cep;
                    cmd.Parameters.Add("@Logradouro", SqlDbType.VarChar).Value = pFuncionario.logradouro;
                    cmd.Parameters.Add("@Bairro", SqlDbType.VarChar).Value = pFuncionario.bairro;
                    cmd.Parameters.Add("@Numero", SqlDbType.VarChar).Value = pFuncionario.numero;
                    cmd.Parameters.Add("@Complemento", SqlDbType.VarChar).Value = pFuncionario.complemento == null ? "" : pFuncionario.complemento;
                    cmd.Parameters.Add("@Sexo", SqlDbType.Char).Value = pFuncionario.sexo;
                    cmd.Parameters.Add("@Cargo", SqlDbType.VarChar).Value = pFuncionario.cargo == null ? "" : pFuncionario.cargo;
                    cmd.Parameters.Add("@IdCidade", SqlDbType.Int).Value = pFuncionario.idCidade;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pFuncionario.ativo;
                    cmd.Parameters.Add("@DtAdmissao", SqlDbType.Date).Value = pFuncionario.dtAdmissao == null ? DBNull.Value : pFuncionario.dtAdmissao?.ToString("yyyy-MM-dd");
                    cmd.Parameters.Add("@DtDemissao", SqlDbType.Date).Value = pFuncionario.dtDemissao == null ? DBNull.Value : pFuncionario.dtDemissao?.ToString("yyyy-MM-dd");
                    cmd.Parameters.Add("@DtCadastro", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd.ExecuteNonQuery();
                    return "Funcionário adicionado com sucesso!";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 2627 || ex.Number == 2601)
                    {
                        return "CPF ou PIS já cadastrado!";
                    }
                    return "Erro ao adicionar funcionário!";
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }

        public string PutFuncionario(FuncionarioPutRequest pFuncionario)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @"
                        UPDATE 
                            TbFuncionarios SET Funcionario = @Funcionario, Apelido = @Apelido, Cpf = @Cpf, Rg = @Rg, 
                            DtNascimento = @DtNascimento, Email = @Email, Telefone = @Telefone, Celular = @Celular, Salario = @Salario, 
                            Pis = @Pis, Logradouro = @Logradouro, Bairro = @Bairro, Numero = @Numero, Complemento = @Complemento, 
                            Sexo = @Sexo, Cargo = @Cargo, IdCidade = @IdCidade, Ativo = @Ativo, DtAdmissao = @DtAdmissao, 
                            DtDemissao = @DtDemissao, DtAlteracao = @DtAlteracao WHERE Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pFuncionario.id;
                    cmd.Parameters.Add("@Funcionario", SqlDbType.VarChar).Value = pFuncionario.funcionario;
                    cmd.Parameters.Add("@Apelido", SqlDbType.VarChar).Value = pFuncionario.apelido == null ? "" : pFuncionario.apelido;
                    cmd.Parameters.Add("@Cpf", SqlDbType.VarChar).Value = pFuncionario.cpf.Length == 0 ? DBNull.Value : pFuncionario.cpf;
                    cmd.Parameters.Add("@Rg", SqlDbType.VarChar).Value = pFuncionario.rg == null ? "" : pFuncionario.rg;
                    cmd.Parameters.Add("@DtNascimento", SqlDbType.Date).Value = pFuncionario.dtNascimento == null ? DBNull.Value : pFuncionario.dtNascimento?.ToString("yyyy-MM-dd");
                    cmd.Parameters.Add("@Email", SqlDbType.VarChar).Value = pFuncionario.email;
                    cmd.Parameters.Add("@Telefone", SqlDbType.VarChar).Value = pFuncionario.telefone == null ? "" : pFuncionario.telefone;
                    cmd.Parameters.Add("@Celular", SqlDbType.VarChar).Value = pFuncionario.celular;
                    cmd.Parameters.Add("@Salario", SqlDbType.VarChar).Value = pFuncionario.salario;
                    cmd.Parameters.Add("@Pis", SqlDbType.VarChar).Value = pFuncionario.pis.Length == 0 ? DBNull.Value : pFuncionario.pis;
                    cmd.Parameters.Add("@Logradouro", SqlDbType.VarChar).Value = pFuncionario.logradouro;
                    cmd.Parameters.Add("@Bairro", SqlDbType.VarChar).Value = pFuncionario.bairro;
                    cmd.Parameters.Add("@Numero", SqlDbType.VarChar).Value = pFuncionario.numero;
                    cmd.Parameters.Add("@Complemento", SqlDbType.VarChar).Value = pFuncionario.complemento == null ? "" : pFuncionario.complemento;
                    cmd.Parameters.Add("@Sexo", SqlDbType.Char).Value = pFuncionario.sexo;
                    cmd.Parameters.Add("@Cargo", SqlDbType.VarChar).Value = pFuncionario.cargo == null ? "" : pFuncionario.cargo;
                    cmd.Parameters.Add("@IdCidade", SqlDbType.Int).Value = pFuncionario.idCidade;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pFuncionario.ativo;
                    cmd.Parameters.Add("@DtAdmissao", SqlDbType.Date).Value = pFuncionario.dtAdmissao == null ? DBNull.Value : pFuncionario.dtAdmissao?.ToString("yyyy-MM-dd");
                    cmd.Parameters.Add("@DtDemissao", SqlDbType.Date).Value = pFuncionario.dtDemissao == null ? DBNull.Value : pFuncionario.dtDemissao?.ToString("yyyy-MM-dd");
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.Date).Value = DateTime.Now.ToString("yyyy-MM-dd");
                    cmd.ExecuteNonQuery();
                    return "Funcionário alterado com sucesso!";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 2627 || ex.Number == 2601)
                    {
                        return "CPF já cadastrado";
                    }
                    return "Erro ao alterar funcionário!";
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }

        public string DeleteFuncionario(int pId)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = "DELETE FROM TbFuncionarios WHERE Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pId;
                    cmd.ExecuteNonQuery();
                    return "Funcionário deletado com sucesso!";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 547)
                    {
                        return "Funcionário está vinculado a outros registros!";
                    }
                    return "Erro ao adicionar funcionário!";
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }
    }
}
