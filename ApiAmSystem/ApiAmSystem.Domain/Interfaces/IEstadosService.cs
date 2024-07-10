using ApiAmSystem.Domain.Models.Estado;

namespace ApiAmSystem.Interfaces
{
    public interface IEstadosService
    {
        EstadoModel GetEstado(int pId);
        IEnumerable<EstadoModel> GetEstados(bool pAtivo);
        string PostEstado(EstadoPostRequest pEstado);
        string PutEstado(EstadoPutRequest pEstado);
        string DeleteEstado(int pId);
    }
}
