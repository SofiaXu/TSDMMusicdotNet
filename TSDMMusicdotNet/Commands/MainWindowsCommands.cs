using System.Collections.Generic;
using TSDMMusicdotNet.Helpers;
using TSDMMusicdotNet.Models;
using System.Text.RegularExpressions;
using System.IO;
using TSDMMusicdotNet.Properties;

namespace TSDMMusicdotNet.Commands
{
    public class MainWindowsCommands
    {
        public static string ReadTemplate()
        {
            if (File.Exists("template.txt"))
            {
                return IOHelper.FileToString("template.txt");
            }
            else
            {
                return Settings.Default.BodyTemplate;
            }
        }
        public static List<DownloadLinkItem> GetDownloadLinkCollection(string template)
        {
            List<DownloadLinkItem> collection = new List<DownloadLinkItem>();
            int bd = GetDownloadLinkNumber(template, "/[bd(.*?)//]");
            int gd = GetDownloadLinkNumber(template, "/[gd(.*?)//]");
            int od = GetDownloadLinkNumber(template, "/[od(.*?)//]");
            int mega = GetDownloadLinkNumber(template, "/[mega(.*?)//]");
            int other = GetDownloadLinkNumber(template, "/[other(.*?)//]");
            for (int i = 0; i < bd; i++)
            {
                collection.Add(new DownloadLinkItem("bd",(i+1).ToString()));
            }
            for (int i = 0; i < gd; i++)
            {
                collection.Add(new DownloadLinkItem("gd", (i + 1).ToString()));
            }
            for (int i = 0; i < od; i++)
            {
                collection.Add(new DownloadLinkItem("od", (i + 1).ToString()));
            }
            for (int i = 0; i < mega; i++)
            {
                collection.Add(new DownloadLinkItem("mega", (i + 1).ToString()));
            }
            for (int i = 0; i < other; i++)
            {
                collection.Add(new DownloadLinkItem("other", (i + 1).ToString()));
            }
            return collection;
        }
        public static List<DownloadLinkItem> GetDownloadLinkCollection()
        {
            List<DownloadLinkItem> collection = new List<DownloadLinkItem>();
            for (int i = 0; i < 2; i++)
            {
                collection.Add(new DownloadLinkItem("bd", (i + 1).ToString()));
            }
            for (int i = 0; i < 2; i++)
            {
                collection.Add(new DownloadLinkItem("gd", (i + 1).ToString()));
            }
            for (int i = 0; i < 2; i++)
            {
                collection.Add(new DownloadLinkItem("od", (i + 1).ToString()));
            }
            for (int i = 0; i < 2; i++)
            {
                collection.Add(new DownloadLinkItem("mega", (i + 1).ToString()));
            }
            for (int i = 0; i < 2; i++)
            {
                collection.Add(new DownloadLinkItem("other", (i + 1).ToString()));
            }
            return collection;
            return collection;
        }
        private static int GetDownloadLinkNumber(string template, string type) => Regex.Matches(template, type).Count;
    }
}
