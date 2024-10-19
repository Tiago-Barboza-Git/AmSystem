using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Cidade;
using ApiAmSystem.Domain.Models.Cliente;
using Microsoft.Data.SqlClient;
using System.Data;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Net.Sockets;
using System.Runtime.ConstrainedExecution;
using ApiAmSystem.Domain.Models.Estado;
using ApiAmSystem.Domain.Models.Pais;
using System.Reflection.Metadata.Ecma335;

namespace ApiAmSystem.Services
{
    public class ClientesService: IClientesService
    {
        private readonly SqlConnection sqlConnection;
        
        public ClientesService(SqlConnection pSqlConnection)
        {
            this.sqlConnection = pSqlConnection;
        }

        public ClienteModel GetCliente(int pId)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @"
                        SELECT 
                            c.Id,
                            c.TpCliente,
                            c.ClienteRazaoSocial,
                            c.ApelidoNomeFantasia,
                            c.Sexo,
                            c.Representante,
                            c.Telefone,
                            c.Celular,
                            c.Email,
                            c.Cep,
                            c.Logradouro,
                            c.Numero,
                            c.Complemento,
                            c.Bairro,
                            c.CpfCnpj,
                            c.IeRg,
                            c.Ativo,
                            c.DtNascimento,
                            c.DtCadastro,
                            c.DtAlteracao AS 'DtAlteracao',
                            c.Id AS 'IdCidade',
                            c2.Cidade AS 'Cidade'
                        FROM TbClientes c
                        INNER JOIN TbCidades c2 ON
	                        c2.Id = c.IdCidade 
                        WHERE c.Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pId;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        reader.Read();
                        return new ClienteModel
                        {
                            id = reader.GetInt32("Id"),
                            tpPessoa = Convert.ToChar(reader.GetString("TpCliente")),
                            pessoaRazaoSocial = reader.GetString("ClienteRazaoSocial"),
                            apelidoNomeFantasia = reader.IsDBNull("ApelidoNomeFantasia") ? "" : reader.GetString("ApelidoNomeFantasia"),
                            sexo = reader.IsDBNull("Sexo") ? null : Convert.ToChar(reader.GetString("Sexo")),
                            representante = reader.IsDBNull("Representante") ? "" : reader.GetString("Representante"),
                            celularRepresentante = reader.IsDBNull("CelularRepresentante") ? "" : reader.GetString("CelularRepresentante"),
                            telefone = reader.IsDBNull("Telefone") ? "" : reader.GetString("Telefone"),
                            celular = reader.GetString("Celular"),
                            email = reader.GetString("Email"),
                            cep = reader.GetString("Cep"),
                            logradouro = reader.GetString("Logradouro"),
                            numero = reader.GetInt32("Numero"),
                            complemento = reader.IsDBNull("Complemento") ? "" : reader.GetString("Complemento"),
                            bairro = reader.GetString("Bairro"),
                            cpfCnpj = reader.IsDBNull("CpfCnpj") ? "" : reader.GetString("CpfCnpj"),
                            ieRg = reader.IsDBNull("IeRg") ? "" : reader.GetString("IeRg"),
                            ativo = reader.GetBoolean("Ativo"),
                            dtNascimento = reader.IsDBNull("DtNascimento") ? null : reader.GetDateTime("DtNascimento"),
                            dtCadastro = reader.GetDateTime("DtCadastro"),
                            dtAlteracao = reader.GetDateTime("DtAlteracao"),
                            idCidade = reader.GetInt32("IdCidade"),
                            cidade = new CidadeModel
                            {
                                id = reader.GetInt32("IdCidade"),
                                cidade = reader.GetString("Cidade")
                            }
                        };
                    }
                    return null;
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

        public IEnumerable<ClienteModel> GetClientes(bool pAtivos)
        {
            using (sqlConnection)
            {
                try
                {
                    List<ClienteModel> result = new List<ClienteModel>();

                    sqlConnection.Open();
                    string query = @"
                        SELECT 
                            c.Id,
                            c.TpCliente,
                            c.ClienteRazaoSocial,
                            c.ApelidoNomeFantasia,
                            c.Sexo,
                            c.Representante,
                            c.CelularRepresentante,
                            c.Telefone,
                            c.Celular,
                            c.Email,
                            c.Cep,
                            c.Logradouro,
                            c.Numero,
                            c.Complemento,
                            c.Bairro,
                            c.CpfCnpj,
                            c.IeRg,
                            c.Ativo,
                            c.DtNascimento,
                            c.DtCadastro,
                            c.DtAlteracao as 'DtAlteracao',
                            c.IdCidade as 'IdCidade',
                            c2.Cidade as 'Cidade',
	                        c2.DDD as 'DDD',
                            c2.Ativo as 'CidadeAtivo',
	                        e.Id as 'IdEstado',
	                        e.Estado as 'Estado',
	                        e.Uf as 'UF',
                            e.Ativo as 'EstadoAtivo',
	                        p.Id as 'IdPais',
	                        p.Pais as 'Pais',
	                        p.Sigla as 'Sigla',
	                        p.DDI as 'DDI',
                            p.Ativo as 'PaisAtivo'
                        FROM TbClientes c
                        INNER JOIN TbCidades c2 ON
                            c2.Id = c.IdCidade
                        INNER JOIN TbEstados e ON 
	                        e.Id = c2.IdEstado
                        INNER JOIN TbPaises p ON
	                        p.Id = e.IdPais
                        WHERE c.Ativo = @Ativo
                    ";

                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pAtivos;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result.Add(new ClienteModel
                            {
                                id = reader.GetInt32("Id"),
                                tpPessoa = Convert.ToChar(reader.GetString("TpCliente")),
                                pessoaRazaoSocial = reader.GetString("ClienteRazaoSocial"),
                                apelidoNomeFantasia = reader.IsDBNull("ApelidoNomeFantasia") ? "" : reader.GetString("ApelidoNomeFantasia"),
                                sexo = Convert.ToChar(reader.GetString("Sexo")),
                                representante = reader.IsDBNull("Representante") ? "" : reader.GetString("Representante"),
                                celularRepresentante = reader.IsDBNull("CelularRepresentante") ? "" : reader.GetString("CelularRepresentante"),
                                telefone = reader.IsDBNull("Telefone") ? "" : reader.GetString("Telefone"),
                                celular = reader.GetString("Celular"),
                                email = reader.GetString("Email"),
                                cep = reader.GetString("Cep"),
                                logradouro = reader.GetString("Logradouro"),
                                numero = reader.GetInt32("Numero"),
                                complemento = reader.IsDBNull("Complemento") ? "" : reader.GetString("Complemento"),
                                bairro = reader.GetString("Bairro"),
                                cpfCnpj = reader.IsDBNull("CpfCnpj") ? "" : reader.GetString("CpfCnpj"),
                                ieRg = reader.IsDBNull("IeRg") ? "" : reader.GetString("IeRg"),
                                ativo = reader.GetBoolean("Ativo"),
                                dtNascimento = reader.IsDBNull("DtNascimento") ? null : reader.GetDateTime("DtNascimento"),
                                dtCadastro = reader.GetDateTime("DtCadastro"),
                                dtAlteracao = reader.GetDateTime("DtAlteracao"),
                                idCidade = reader.GetInt32("IdCidade"),
                                cidade = new CidadeModel
                                {
                                    id = reader.GetInt32("IdCidade"),
                                    cidade = reader.GetString("Cidade"),
                                    ddd = reader.GetInt32("DDD"),
                                    idEstado = reader.GetInt32("IdEstado"),
                                    ativo = reader.GetBoolean("CidadeAtivo"),
                                    estado = new EstadoModel
                                    {
                                        id = reader.GetInt32("IdEstado"),
                                        estado = reader.GetString("Estado"),
                                        uf = reader.GetString("UF"),
                                        ativo = reader.GetBoolean("EstadoAtivo"),
                                        pais = new PaisModel 
                                        { 
                                            id = reader.GetInt32("IdPais"),
                                            pais = reader.GetString("Pais"),
                                            sigla = reader.GetString("Sigla"),
                                            ddi = reader.GetInt32("DDI"),
                                            ativo = reader.GetBoolean("PaisAtivo")
                                        }
                                    }
                                }
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
                    sqlConnection.Close();
                }
            }
        }

        public string PostCliente(ClientePostRequest pCliente)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @"INSERT INTO TbClientes 
                                        (TpCliente,ClienteRazaoSocial, ApelidoNomeFantasia, Sexo, Representante, CelularRepresentante, Telefone, Celular, Email, Cep, Logradouro, 
                                         Numero, Complemento, Bairro, CpfCnpj, IeRg, Ativo, DtNascimento, DtCadastro, DtAlteracao, IdCidade)
                                    VALUES(@TpCliente, dbo.fn_RemSpaceFromStr(@ClienteRazaoSocial), dbo.fn_RemSpaceFromStr(@ApelidoNomeFantasia), @Sexo, dbo.fn_RemSpaceFromStr(@Representante), dbo.fn_RemSpaceFromStr(@CelularRepresentante), dbo.fn_RemSpaceFromStr(@Telefone), dbo.fn_RemSpaceFromStr(@Celular), dbo.fn_RemSpaceFromStr(@Email), dbo.fn_RemSpaceFromStr(@Cep), dbo.fn_RemSpaceFromStr(@Logradouro), 
                                         @Numero, dbo.fn_RemSpaceFromStr(@Complemento), dbo.fn_RemSpaceFromStr(@Bairro), @CpfCnpj, @IeRg, @Ativo, @DtNascimento, @DtCadastro, @DtAlteracao, @IdCidade)";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@TpCliente", SqlDbType.Char).Value = pCliente.tpPessoa;
                    cmd.Parameters.Add("@ClienteRazaoSocial", SqlDbType.VarChar).Value = pCliente.pessoaRazaoSocial;
                    cmd.Parameters.Add("@ApelidoNomeFantasia", SqlDbType.VarChar).Value = pCliente.apelidoNomeFantasia == null ? "" : pCliente.apelidoNomeFantasia;
                    cmd.Parameters.Add("@Sexo", SqlDbType.Char).Value = pCliente.sexo == null ? "" : pCliente.sexo;
                    cmd.Parameters.Add("@Representante", SqlDbType.VarChar).Value = pCliente.representante;
                    cmd.Parameters.Add("@CelularRepresentante", SqlDbType.VarChar).Value = pCliente.celularRepresentante;
                    cmd.Parameters.Add("@Telefone", SqlDbType.VarChar).Value = pCliente.telefone == null ? "" : pCliente.telefone;
                    cmd.Parameters.Add("@Celular", SqlDbType.VarChar).Value = pCliente.celular;
                    cmd.Parameters.Add("@Email", SqlDbType.VarChar).Value = pCliente.email;
                    cmd.Parameters.Add("@Cep", SqlDbType.VarChar).Value = pCliente.cep;
                    cmd.Parameters.Add("@Logradouro", SqlDbType.VarChar).Value = pCliente.logradouro;
                    cmd.Parameters.Add("@Numero", SqlDbType.Int).Value = pCliente.numero;
                    cmd.Parameters.Add("@Complemento", SqlDbType.VarChar).Value = pCliente.complemento == null ? "" : pCliente.complemento;
                    cmd.Parameters.Add("@Bairro", SqlDbType.VarChar).Value = pCliente.bairro;
                    cmd.Parameters.Add("@CpfCnpj", SqlDbType.VarChar).Value = pCliente.cpfCnpj.Length == 0 ? DBNull.Value : pCliente.cpfCnpj;
                    cmd.Parameters.Add("@IeRg", SqlDbType.VarChar).Value = pCliente.ieRg == null ? "" : pCliente.ieRg;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pCliente.ativo;
                    cmd.Parameters.Add("@DtNascimento", SqlDbType.DateTime).Value = pCliente.dtNascimento == null ? DBNull.Value : pCliente.dtNascimento;
                    cmd.Parameters.Add("@DtCadastro", SqlDbType.DateTime).Value = DateTime.Now;
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.DateTime).Value = DateTime.Now;
                    cmd.Parameters.Add("@IdCidade", SqlDbType.Int).Value = pCliente.idCidade;
                    cmd.ExecuteNonQuery();
                    return "Cliente adicionado com sucesso!";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 2627 || ex.Number == 2601)
                    {
                        if (pCliente.tpPessoa == 'F') return "Cpf já existente";
                        else return "Cnpj já existente";
                    }
                    return "Erro ao adicionar cliente!";
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }

        public string PutCliente(ClientePutRequest pCliente)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @" UPDATE TbClientes SET TpCliente = @TpCliente, ClienteRazaoSocial = dbo.fn_RemSpaceFromStr(@ClienteRazaoSocial), ApelidoNomeFantasia = dbo.fn_RemSpaceFromStr(@ApelidoNomeFantasia), 
                                        Sexo = @Sexo, Representante = dbo.fn_RemSpaceFromStr(@Representante), CelularRepresentante = dbo.fn_RemSpaceFromStr(@CelularRepresentante), Telefone = dbo.fn_RemSpaceFromStr(@Telefone), Celular = dbo.fn_RemSpaceFromStr(@Celular), Email = dbo.fn_RemSpaceFromStr(@Email), Cep = dbo.fn_RemSpaceFromStr(@Cep), Logradouro = dbo.fn_RemSpaceFromStr(@Logradouro), Numero = @Numero, 
                                        Complemento = dbo.fn_RemSpaceFromStr(@Complemento), Bairro = dbo.fn_RemSpaceFromStr(@Bairro), CpfCnpj = @CpfCnpj, IeRg = @IeRg, Ativo = @Ativo, DtNascimento = @DtNascimento,
                                        DtAlteracao = @DtAlteracao, IdCidade = @IdCidade WHERE Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pCliente.id;
                    cmd.Parameters.Add("@TpCliente", SqlDbType.Char).Value = pCliente.tpPessoa;
                    cmd.Parameters.Add("@ClienteRazaoSocial", SqlDbType.VarChar).Value = pCliente.pessoaRazaoSocial;
                    cmd.Parameters.Add("@ApelidoNomeFantasia", SqlDbType.VarChar).Value = pCliente.apelidoNomeFantasia == null ? "" : pCliente.apelidoNomeFantasia;
                    cmd.Parameters.Add("@Sexo", SqlDbType.Char).Value = pCliente.sexo == null ? "" : pCliente.sexo;
                    cmd.Parameters.Add("@Representante", SqlDbType.VarChar).Value = pCliente.representante == null ? "" : pCliente.representante;
                    cmd.Parameters.Add("@CelularRepresentante", SqlDbType.VarChar).Value = pCliente.celularRepresentante == null ? "" : pCliente.celularRepresentante;
                    cmd.Parameters.Add("@Telefone", SqlDbType.VarChar).Value = pCliente.telefone == null ? "" : pCliente.telefone;
                    cmd.Parameters.Add("@Celular", SqlDbType.VarChar).Value = pCliente.celular;
                    cmd.Parameters.Add("@Email", SqlDbType.VarChar).Value = pCliente.email;
                    cmd.Parameters.Add("@Cep", SqlDbType.VarChar).Value = pCliente.cep;
                    cmd.Parameters.Add("@Logradouro", SqlDbType.VarChar).Value = pCliente.logradouro;
                    cmd.Parameters.Add("@Numero", SqlDbType.Int).Value = pCliente.numero;
                    cmd.Parameters.Add("@Complemento", SqlDbType.VarChar).Value = pCliente.complemento == null ? "" : pCliente.complemento;
                    cmd.Parameters.Add("@Bairro", SqlDbType.VarChar).Value = pCliente.bairro;
                    cmd.Parameters.Add("@CpfCnpj", SqlDbType.VarChar).Value = pCliente.cpfCnpj.Length == 0 ? DBNull.Value : pCliente.cpfCnpj;
                    cmd.Parameters.Add("@IeRg", SqlDbType.VarChar).Value = pCliente.ieRg == null ? "" : pCliente.ieRg;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pCliente.ativo;
                    cmd.Parameters.Add("@DtNascimento", SqlDbType.DateTime).Value = pCliente.dtNascimento == null ? DBNull.Value : pCliente.dtNascimento;
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.DateTime).Value = DateTime.Now;
                    cmd.Parameters.Add("@IdCidade", SqlDbType.Int).Value = pCliente.idCidade;
                    cmd.ExecuteNonQuery();
                    return "Cliente alterado com sucesso!";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 2627 || ex.Number == 2601)
                    {
                        if (pCliente.tpPessoa == 'F') return "Cpf já existente";
                        else return "Cnpj já existente";
                    }
                    return "Erro ao alterar cliente!";
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }

        public string DeleteCliente(int pId)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = "DELETE FROM TbClientes WHERE Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pId;
                    cmd.ExecuteNonQuery();
                    return "Cliente deletado com sucesso!";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 547)
                    {
                        return "Cliente está vinculado a outros registros!";
                    }
                    return "Erro ao deletar cliente!";
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }
    }
}
