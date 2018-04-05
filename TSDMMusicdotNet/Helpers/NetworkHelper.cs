using System;
using System.IO;
using System.Net;
using System.Threading.Tasks;

namespace TSDMMusicdotNet.Helpers
{
    public class NetworkHelper
    {
        public static async Task<Stream> GetStreamAsync(string url)
        {
            HttpWebRequest httpRequest = (HttpWebRequest)WebRequest.Create(new Uri(url));
            httpRequest.UserAgent = "Mozilla/5.0 (Windows NT; Windows NT 10.0; zh-CN) WindowsPowerShell/5.1.16257.1";
            httpRequest.Accept = "text/html, application/xhtml+xml, */*";
            httpRequest.ContentType = "application/x-www-form-urlencoded";
            httpRequest.Method = "GET";
            HttpWebResponse httpResponse = (HttpWebResponse)await httpRequest.GetResponseAsync();
            return httpResponse.GetResponseStream();
        }

        public static async Task<string> GetStringAsync(string url) => IOHelper.StreamToString(await GetStreamAsync(url));

        public static async Task<T> GetJsonAsync<T>(string url) => JsonHelper.DataContractJsonDeserialize<T>(await GetStreamAsync(url));
    }
}