using ApiAmSystem.Domain.Interfaces;
using ApiAmSystem.Domain.Models.Cidade;
using ApiAmSystem.Domain.Models.Cliente;
using ApiAmSystem.Domain.Models.Estado;
using ApiAmSystem.Domain.Models.Fornecedor;
using ApiAmSystem.Domain.Models.Pais;
using Microsoft.Data.SqlClient;
using System.Data;

namespace ApiAmSystem.Services
{
    public class FornecedoresService: IFornecedoresService
    {
        private readonly SqlConnection sqlConnection;

        public FornecedoresService(SqlConnection pSqlConnection)
        {
            this.sqlConnection = pSqlConnection;
        }

        public FornecedorModel GetFornecedor(int pId)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @"
                        SELECT 
                            f.Id,
                            f.TpFornecedor,
                            f.FornecedorRazaoSocial,
                            f.ApelidoNomeFantasia,
                            f.Sexo,
                            f.Representante,
                            f.Telefone,
                            f.Celular,
                            f.Email,
                            f.Cep,
                            f.Endereco,
                            f.Numero,
                            f.Complemento,
                            f.Bairro,
                            f.CpfCnpj,
                            f.IeRg,
                            f.Ativo,
                            f.DtNascimento,
                            f.DtCadastro,
                            f.DtAlteracao AS 'DtAlteracao',
                            f.Id AS 'IdCidade',
                            c2.Cidade AS 'Cidade'
                        FROM TbFornecedores f
                        INNER JOIN TbCidades c2 ON
	                        c2.Id = f.IdCidade 
                        WHERE f.Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pId;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        reader.Read();
                        return new FornecedorModel
                        {
                            id = reader.GetInt32("Id"),
                            tpFornecedor = Convert.ToChar(reader.GetString("TpFornecedor")),
                            fornecedorRazaoSocial = reader.GetString("FornecedorRazaoSocial"),
                            apelidoNomeFantasia = reader.IsDBNull("ApelidoNomeFantasia") ? null : reader.GetString("ApelidoNomeFantasia"),
                            sexo = reader.IsDBNull("Sexo") ? null : Convert.ToChar(reader.GetString("Sexo")),
                            representante = reader.IsDBNull("Representante") ? null : reader.GetString("Representante"),
                            celularRepresentante = reader.IsDBNull("CelularRepresentante") ? null : reader.GetString("CelularRepresentante"),
                            telefone = reader.IsDBNull("Telefone") ? null : reader.GetString("Telefone"),
                            celular = reader.GetString("Celular"),
                            email = reader.GetString("Email"),
                            cep = reader.GetString("Cep"),
                            endereco = reader.GetString("Endereco"),
                            numero = reader.GetInt32("Numero"),
                            complemento = reader.IsDBNull("Complemento") ? null : reader.GetString("Complemento"),
                            bairro = reader.GetString("Bairro"),
                            cpfCnpj = reader.GetString("CpfCnpj"),
                            ieRg = reader.IsDBNull("IeRg") ? null : reader.GetString("IeRg"),
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

        public IEnumerable<FornecedorModel> GetFornecedores(bool pAtivos)
        {
            using (sqlConnection)
            {
                try
                {
                    List<FornecedorModel> result = new List<FornecedorModel>();

                    sqlConnection.Open();
                    string query = @"
                        SELECT 
                            f.Id,
                            f.TpFornecedor,
                            f.FornecedorRazaoSocial,
                            f.ApelidoNomeFantasia,
                            f.Sexo,
                            f.Representante,
                            f.CelularRepresentante,
                            f.Telefone,
                            f.Celular,
                            f.Email,
                            f.Cep,
                            f.Endereco,
                            f.Numero,
                            f.Complemento,
                            f.Bairro,
                            f.CpfCnpj,
                            f.IeRg,
                            f.Ativo,
                            f.DtNascimento,
                            f.DtCadastro,
                            f.DtAlteracao as 'DtAlteracao',
                            f.IdCidade as 'IdCidade',
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
                        FROM TbFornecedores f
                        INNER JOIN TbCidades c2 ON
                            c2.Id = f.IdCidade
                        INNER JOIN TbEstados e ON 
	                        e.Id = c2.IdEstado
                        INNER JOIN TbPaises p ON
	                        p.Id = e.IdPais
                        WHERE f.Ativo = @Ativo
                    ";

                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pAtivos;
                    SqlDataReader reader = cmd.ExecuteReader();
                    if (reader.HasRows)
                    {
                        while (reader.Read())
                        {
                            result.Add(new FornecedorModel
                            {
                                id = reader.GetInt32("Id"),
                                tpFornecedor = Convert.ToChar(reader.GetString("TpFornecedor")),
                                fornecedorRazaoSocial = reader.GetString("FornecedorRazaoSocial"),
                                apelidoNomeFantasia = reader.IsDBNull("ApelidoNomeFantasia") ? null : reader.GetString("ApelidoNomeFantasia"),
                                sexo = reader.IsDBNull("Sexo") ? null : Convert.ToChar(reader.GetString("Sexo")),
                                representante = reader.IsDBNull("Representante") ? null : reader.GetString("Representante"),
                                celularRepresentante = reader.IsDBNull("CelularRepresentante") ? null : reader.GetString("CelularRepresentante"),
                                telefone = reader.IsDBNull("Telefone") ? null : reader.GetString("Telefone"),
                                celular = reader.GetString("Celular"),
                                email = reader.GetString("Email"),
                                cep = reader.GetString("Cep"),
                                endereco = reader.GetString("Endereco"),
                                numero = reader.GetInt32("Numero"),
                                complemento = reader.IsDBNull("Complemento") ? null : reader.GetString("Complemento"),
                                bairro = reader.GetString("Bairro"),
                                cpfCnpj = reader.GetString("CpfCnpj"),
                                ieRg = reader.IsDBNull("IeRg") ? null : reader.GetString("IeRg"),
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

        public string PostFornecedor(FornecedorPostRequest pFornecedor)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @"INSERT INTO TbFornecedores
                                        (TpFornecedor,FornecedorRazaoSocial, ApelidoNomeFantasia, Sexo, Representante, CelularRepresentante, Telefone, Celular, Email, Cep, Endereco, 
                                         Numero, Complemento, Bairro, CpfCnpj, IeRg, Ativo, DtNascimento, DtCadastro, DtAlteracao, IdCidade)
                                    VALUES(@TpFornecedor, @FornecedorRazaoSocial, @ApelidoNomeFantasia, @Sexo, @Representante, @CelularRepresentante, @Telefone, @Celular, @Email, @Cep, @Endereco, 
                                         @Numero, @Complemento, @Bairro, @CpfCnpj, @IeRg, @Ativo, @DtNascimento, @DtCadastro, @DtAlteracao, @IdCidade)";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@TpFornecedor", SqlDbType.Char).Value = pFornecedor.tpFornecedor;
                    cmd.Parameters.Add("@FornecedorRazaoSocial", SqlDbType.VarChar).Value = pFornecedor.fornecedorRazaoSocial;
                    cmd.Parameters.Add("@ApelidoNomeFantasia", SqlDbType.VarChar).Value = pFornecedor.apelidoNomeFantasia == null ? string.Empty : pFornecedor.apelidoNomeFantasia;
                    cmd.Parameters.Add("@Sexo", SqlDbType.Char).Value = pFornecedor.sexo == null ? string.Empty : pFornecedor.sexo;
                    cmd.Parameters.Add("@Representante", SqlDbType.VarChar).Value = pFornecedor.representante == null ? string.Empty : pFornecedor.representante;
                    cmd.Parameters.Add("@CelularRepresentante", SqlDbType.VarChar).Value = pFornecedor.celularRepresentante == null ? string.Empty : pFornecedor.celularRepresentante;
                    cmd.Parameters.Add("@Telefone", SqlDbType.VarChar).Value = pFornecedor.telefone == null ? string.Empty : pFornecedor.telefone;
                    cmd.Parameters.Add("@Celular", SqlDbType.VarChar).Value = pFornecedor.celular;
                    cmd.Parameters.Add("@Email", SqlDbType.VarChar).Value = pFornecedor.email;
                    cmd.Parameters.Add("@Cep", SqlDbType.VarChar).Value = pFornecedor.cep;
                    cmd.Parameters.Add("@Endereco", SqlDbType.VarChar).Value = pFornecedor.endereco;
                    cmd.Parameters.Add("@Numero", SqlDbType.Int).Value = pFornecedor.numero;
                    cmd.Parameters.Add("@Complemento", SqlDbType.VarChar).Value = pFornecedor.complemento == null ? string.Empty : pFornecedor.complemento;
                    cmd.Parameters.Add("@Bairro", SqlDbType.VarChar).Value = pFornecedor.bairro;
                    cmd.Parameters.Add("@CpfCnpj", SqlDbType.VarChar).Value = pFornecedor.cpfCnpj;
                    cmd.Parameters.Add("@IeRg", SqlDbType.VarChar).Value = pFornecedor.ieRg == null ? string.Empty : pFornecedor.ieRg;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pFornecedor.ativo;
                    cmd.Parameters.Add("@DtNascimento", SqlDbType.DateTime).Value = pFornecedor.dtNascimento == null ? DBNull.Value : pFornecedor.dtNascimento;
                    cmd.Parameters.Add("@DtCadastro", SqlDbType.DateTime).Value = DateTime.Now;
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.DateTime).Value = DateTime.Now;
                    cmd.Parameters.Add("@IdCidade", SqlDbType.Int).Value = pFornecedor.idCidade;
                    cmd.ExecuteNonQuery();
                    return "Sucesso";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 2627 || ex.Number == 2601)
                    {
                        if (pFornecedor.tpFornecedor == 'F') return "Cpf já existente";
                        else return "Cnpj já existente";
                    }
                    return ex.Message;
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }

        public string PutFornecedor(FornecedorPutRequest pFornecedor)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = @" UPDATE TbFornecedores SET TpFornecedor = @TpFornecedor, FornecedorRazaoSocial = @FornecedorRazaoSocial, ApelidoNomeFantasia = @ApelidoNomeFantasia, 
                                        Sexo = @Sexo, Representante = @Representante, CelularRepresentante = @CelularRepresentante, Telefone = @Telefone, Celular = @Celular, Email = @Email, Cep = @Cep, Endereco = @Endereco, Numero = @Numero, 
                                        Complemento = @Complemento, Bairro = @Bairro, CpfCnpj = @CpfCnpj, IeRg = @IeRg, Ativo = @Ativo, DtNascimento = @DtNascimento,
                                        DtAlteracao = @DtAlteracao, IdCidade = @IdCidade WHERE Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pFornecedor.id;
                    cmd.Parameters.Add("@TpFornecedor", SqlDbType.Char).Value = pFornecedor.tpFornecedor;
                    cmd.Parameters.Add("@FornecedorRazaoSocial", SqlDbType.VarChar).Value = pFornecedor.fornecedorRazaoSocial;
                    cmd.Parameters.Add("@ApelidoNomeFantasia", SqlDbType.VarChar).Value = pFornecedor.apelidoNomeFantasia == null ? string.Empty : pFornecedor.apelidoNomeFantasia;
                    cmd.Parameters.Add("@Sexo", SqlDbType.Char).Value = pFornecedor.sexo == null ? string.Empty : pFornecedor.sexo;
                    cmd.Parameters.Add("@Representante", SqlDbType.VarChar).Value = pFornecedor.representante == null ? string.Empty : pFornecedor.representante;
                    cmd.Parameters.Add("@CelularRepresentante", SqlDbType.VarChar).Value = pFornecedor.celularRepresentante == null ? string.Empty : pFornecedor.celularRepresentante;
                    cmd.Parameters.Add("@Telefone", SqlDbType.VarChar).Value = pFornecedor.telefone == null ? string.Empty : pFornecedor.telefone;
                    cmd.Parameters.Add("@Celular", SqlDbType.VarChar).Value = pFornecedor.celular;
                    cmd.Parameters.Add("@Email", SqlDbType.VarChar).Value = pFornecedor.email;
                    cmd.Parameters.Add("@Cep", SqlDbType.VarChar).Value = pFornecedor.cep;
                    cmd.Parameters.Add("@Endereco", SqlDbType.VarChar).Value = pFornecedor.endereco;
                    cmd.Parameters.Add("@Numero", SqlDbType.Int).Value = pFornecedor.numero;
                    cmd.Parameters.Add("@Complemento", SqlDbType.VarChar).Value = pFornecedor.complemento == null ? string.Empty : pFornecedor.complemento;
                    cmd.Parameters.Add("@Bairro", SqlDbType.VarChar).Value = pFornecedor.bairro;
                    cmd.Parameters.Add("@CpfCnpj", SqlDbType.VarChar).Value = pFornecedor.cpfCnpj;
                    cmd.Parameters.Add("@IeRg", SqlDbType.VarChar).Value = pFornecedor.ieRg == null ? string.Empty : pFornecedor.ieRg;
                    cmd.Parameters.Add("@Ativo", SqlDbType.Bit).Value = pFornecedor.ativo;
                    cmd.Parameters.Add("@DtNascimento", SqlDbType.DateTime).Value = pFornecedor.dtNascimento == null ? DBNull.Value : pFornecedor.dtNascimento;
                    cmd.Parameters.Add("@DtAlteracao", SqlDbType.DateTime).Value = DateTime.Now;
                    cmd.Parameters.Add("@IdCidade", SqlDbType.Int).Value = pFornecedor.idCidade;
                    cmd.ExecuteNonQuery();
                    return "Sucesso";
                }
                catch (SqlException ex)
                {
                    if (ex.Number == 2627 || ex.Number == 2601)
                    {
                        if (pFornecedor.tpFornecedor == 'F') return "Cpf já existente";
                        else return "Cnpj já existente";
                    }
                    return ex.Message;
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }

        public string DeleteFornecedor(int pId)
        {
            using (sqlConnection)
            {
                try
                {
                    sqlConnection.Open();
                    string query = "DELETE FROM TbFornecedores WHERE Id = @Id";
                    SqlCommand cmd = new SqlCommand(query, sqlConnection);
                    cmd.Parameters.Clear();
                    cmd.Parameters.Add("@Id", SqlDbType.Int).Value = pId;
                    cmd.ExecuteNonQuery();
                    return "Sucesso";
                }
                catch (SqlException ex)
                {
                    return ex.Message;
                }
                finally
                {
                    sqlConnection.Close();
                }
            }
        }
    }
}
