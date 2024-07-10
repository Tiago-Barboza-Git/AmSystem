using ApiAmSystem.Domain.Models.Pais;

namespace ApiAmSystem.Interfaces
{
    public interface IPaisesService
    {
        PaisModel GetPais(int pId);
        IEnumerable<PaisModel> GetPaises(bool pAtivo);
        string PostPais(PaisPostRequest pPais);
        string PutPais(PaisPutRequest pPais);
        string DeletePais(int pId);
    }
}
