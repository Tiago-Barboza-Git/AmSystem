using ApiAmSystem.Domain.Models.Funcionario;

namespace ApiAmSystem.Interfaces
{
    public interface IFuncionariosService
    {
        FuncionarioModel GetFuncionario(int pId);
        IEnumerable<FuncionarioModel> GetFuncionarios(bool pAtivo);
        string PostFuncionario(FuncionarioPostRequest pFuncionario);
        string PutFuncionario(FuncionarioPutRequest pFuncionario);
        string DeleteFuncionario(int pId);
    }
}
