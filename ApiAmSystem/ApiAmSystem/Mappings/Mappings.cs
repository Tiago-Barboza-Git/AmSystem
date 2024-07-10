using ApiAmSystem.Interfaces;
using Microsoft.Data.SqlClient;
using System.Reflection;

namespace ApiAmSystem.Mappings
{
    public class Mappings: IMappings
    {
        public T ReaderToObj<T>(SqlDataReader reader) where T : new()
        {
            T obj = new T();
            PropertyInfo[] properties = typeof(T).GetProperties();
            foreach (PropertyInfo property in properties)
            {
                if (!reader.IsDBNull(reader.GetOrdinal(property.Name)))
                {
                    Type convertTo = Nullable.GetUnderlyingType(property.PropertyType) ?? property.PropertyType ;
                    property.SetValue(obj, Convert.ChangeType(reader[property.Name], convertTo), null);
                }
            }
            return obj;
        }
    }
}
