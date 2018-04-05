using System.IO;

namespace TSDMMusicdotNet.Helpers
{
    public class IOHelper
    {
        public static string StreamToString(Stream stream)
        {
            StreamReader reader = new StreamReader(stream);
            return reader.ReadToEnd();
        }
        public static Stream FileToStream(string path) => new FileStream(path, FileMode.Open, FileAccess.Read);
        public static string FileToString(string path) => StreamToString(FileToStream(path));
    }
}