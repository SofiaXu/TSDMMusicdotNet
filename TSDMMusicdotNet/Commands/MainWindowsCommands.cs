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
    }
}
