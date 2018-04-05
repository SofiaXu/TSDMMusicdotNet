using System;
using System.Collections.Generic;
using System.Text.RegularExpressions;

namespace TSDMMusicdotNet.Helpers
{
    public class DiscuzCodeHelper
    {
        public static string ChangeColour(string body, string colour) => "[color=" + colour + "]" + body + "[/color]";
        public static string ChangeFont(string body, string font) => "[font=" + font + "]" + body + "[/font]";
        public static string ChangeSize(string body, int size) => "[font=" + size.ToString() + "]" + body + "[/font]";
        public static string AtSomeone(string someone) => "[@]" + someone + "[/@]";
        public static string AddUrl(string body, string url) => "[url=" + url + "]" + body + "[/url]";
        public static string AddUrl(string url)
        {
            if (Regex.IsMatch(url,"链接"))
            {
                string[] suburl = url.Split(' ');
                return url.Substring(0,3)+ "[url]" + suburl[0].Remove(0,3) + "[/url] "+ suburl[1];
            }
            else
            {
                return "[url]" + url + "[/url]";
            }
        }
        public static string AddAudio(string url) => "[audio]" + url + "[/audio]";
        public static string AddImg(string url) => "[img]" + url + "[/img]";
        public static string AddCode(string code) => "[code]" + code + "[/code]";
        public static string AddQuote(string quote) => "[quote]" + quote + "[/quote]";
        public static string AddDeleteLine(string body) => "[s]" + body + "[/s]";
        public static string AddHide(string body) => "[hide]" + body + "[/hide]";
        public static string AddHide(string body, int coin) => "[hide="+coin.ToString()+"]" + body + "[/hide]";
        public static string AddFree(string body) => "[free]" + body + "[/free]";
        public static string CreateList(string[] array)
        {
            string body = "[list]";
            for (int i = 0; i < array.Length; i++)
            {
                body += "[*]" + array[i] + "\n";
            }
            return body + "[/list]";
        }
        public static string CreateList<T>(List<T> list)
        {
            string body = "[list]";
            for (int i = 0; i < list.Count; i++)
            {
                body += "[*]" + list[i].ToString() + "\n";
            }
            return body + "[/list]";
        }
    }
}