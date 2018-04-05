using System.Text.RegularExpressions;
using System.Threading.Tasks;
using TSDMMusicdotNet.Models;

namespace TSDMMusicdotNet.Helpers
{
    public class MoraHelper
    {
        public static async Task<string> GetMoraPackageLinkAsync(string url)
        {
            string callback = await NetworkHelper.GetStringAsync(url);
            string labelId = Regex.Match(callback, "labelId=\"(.*?)\"").ToString().Replace("labelId=\"", "").Replace("\"", "");
            string mountPoint = Regex.Match(callback, "mountPoint=\"(.*?)\"").ToString().Replace("mountPoint=\"", "").Replace("\"", "");
            string materialNo = Regex.Match(callback, "materialNo=\"(.*?)\"").ToString().Replace("materialNo=\"", "").Replace("\"", "");
            materialNo = materialNo.PadLeft(10, '0');
            return "http://cf.mora.jp/contents/package/" + mountPoint + "/" + labelId + "/" + materialNo.Substring(0, 4) + "/" + materialNo.Substring(4, 3) + "/" + materialNo.Substring(7, 3) + "/packageMeta.json";
        }

        public static async Task<MoraJsonObjectModel> GetMoraJsonObjectAsync(string url) => await NetworkHelper.GetJsonAsync<MoraJsonObjectModel>(url);
    }
}