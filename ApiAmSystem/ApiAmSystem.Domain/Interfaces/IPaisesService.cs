using ApiAmSystem.Domain.Models.Pais;
using Microsoft.Data.SqlClient;

namespace ApiAmSystem.Interfaces
{
    public interface IPaisesService
    {
        Task<PaisModel> GetPais(int pId);
        IEnumerable<PaisModel> GetPaises(bool pAtivo);
        string PostPais(PaisPostRequest pPais);
        string PutPais(PaisPutRequest pPais);
        string DeletePais(int pId);
    }
}
