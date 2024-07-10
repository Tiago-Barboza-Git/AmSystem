using Microsoft.Data.SqlClient;

namespace ApiAmSystem.Interfaces
{
    public interface IMappings
    {
        T ReaderToObj<T>(SqlDataReader reader) where T : new();
    }
}
