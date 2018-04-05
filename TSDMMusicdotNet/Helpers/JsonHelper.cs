using System.IO;
using System.Runtime.Serialization.Json;
using System.Text;

namespace TSDMMusicdotNet.Helpers
{
    public class JsonHelper
    {
        public static T DataContractJsonDeserialize<T>(string json)
        {
            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(T));
            T obj = default(T);
            MemoryStream ms = new MemoryStream(Encoding.UTF8.GetBytes(json));
            obj = (T)serializer.ReadObject(ms);
            return obj;
        }

        public static T DataContractJsonDeserialize<T>(Stream stream)
        {
            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(T));
            T obj = default(T);
            obj = (T)serializer.ReadObject(stream);
            return obj;
        }

        public static Stream DataContractJsonSerialize<T>(T t)
        {
            DataContractJsonSerializer serializer = new DataContractJsonSerializer(typeof(T));
            MemoryStream memoryStream = new MemoryStream();
            serializer.WriteObject(memoryStream, t);
            return memoryStream;
        }
    }
}