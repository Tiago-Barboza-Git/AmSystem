using ApiAmSystem.Domain.Models.Cidade;

namespace ApiAmSystem.Interfaces
{
    public interface ICidadesService
    {
        CidadeModel GetCidade(int pId);
        IEnumerable<CidadeModel> GetCidades(bool pAtivo);
        string PostCidade(CidadePostRequest pCidade);
        string PutCidade(CidadePutRequest pCidade);
        string DeleteCidade(int pId);
    }
}
