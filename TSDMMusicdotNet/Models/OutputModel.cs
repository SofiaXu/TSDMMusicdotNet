using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using TSDMMusicdotNet.Helpers;

namespace TSDMMusicdotNet.Models
{
    public class OutputModel
    {
        public string ArtistName { get; set; }
        public string AlbumLength { get; set; }
        public string MediaFormat { get; set; }
        public string Introduction { get; set; }
        public string ImageUrl { get; set; }
        public string AlbumTitle { get; set; }
        public List<TrackInfo> TrackList { get; set; }
        public int TrackNumber { get; set; }
        public string CertificationLink { get; set; }
        public string Url { get; set; }
        public string ReleaseDate { get; set; }
        public string ReleaseDateType2 { get => ReleaseDate.Substring(2).Replace(".", ""); }
        public string Resolution { get; set; }
        public bool IsHires { get; set; }
        public List<Tuple<string, string>> DownloadLinkDictionary { get; set; }

        public OutputModel(MoraJsonObjectModel mora, ObservableCollection<DownloadLinkItem> dictionary, string certificationlink, string url)
        {
            ArtistName = mora.artistName;
            Tuple<bool, string, string> tuple = MusicHelper.GetMediaTypeAndResulotion(mora.mediaFormatNo, mora.bitPerSample, mora.samplingFreq, mora.mediaType);
            MediaFormat = tuple.Item2;
            Resolution = tuple.Item3;
            IsHires = tuple.Item1;
            Introduction = mora.packageComment;
            ImageUrl = mora.packageUrl + mora.fullsizeimage;
            AlbumTitle = mora.title;
            int totalsecond = 0;
            TrackList = new List<TrackInfo>();
            for (int i = 0; i < mora.trackList.Length; i++)
            {
                TrackList.Add(new TrackInfo(mora.trackList[i].title, mora.trackList[i].duration, i + 1));
                totalsecond += mora.trackList[i].duration;
            }
            AlbumLength = MusicHelper.GetAlbumLength(totalsecond);
            TrackNumber = mora.trackList.Length;
            CertificationLink = certificationlink;
            ReleaseDate = mora.dispStartDateStr;
            DownloadLinkDictionary = new List<Tuple<string, string>>();
            for (int i = 0; i < dictionary.Count; i++)
            {
                if (dictionary[i].DownloadLink != "")
                {
                    DownloadLinkDictionary.Add(new Tuple<string, string>(string.Format("[{0}{1}/]", dictionary[i].DownloadLinkType, dictionary[i].DownloadLinkNumber), dictionary[i].DownloadLink));
                }
            }
            Url = url;
        }
        public string OutputTitle()
        {
            string title = "[mora自购]";
            if (IsHires==true)
            {
                title += "[HI-RES]";
            }
            title += ReleaseDateType2 + AlbumTitle + "/" + ArtistName + "[" + MediaFormat + "]";
            return title;
        }
        public string OutputBody(string template)
        {
            string body = template.Replace("[artistname/]",ArtistName).Replace("[albumtitle/]",AlbumTitle);
            body = body.Replace("[packagelink/]", DiscuzCodeHelper.AddUrl(Url)).Replace("[cover/]", DiscuzCodeHelper.AddImg(ImageUrl));
            body = body.Replace("[tracklist/]", DiscuzCodeHelper.CreateList(TrackList));
            body = body.Replace("[tracknumber/]", TrackNumber.ToString()).Replace("[resolution/]", Resolution).Replace("[releasedate/]",ReleaseDate);
            body = body.Replace("[certification/]", CertificationLink).Replace("[introduction/]", Introduction);
            for (int i = 0; i < DownloadLinkDictionary.Count; i++)
            {
                body = body.Replace(DownloadLinkDictionary[i].Item1, DiscuzCodeHelper.AddUrl(DownloadLinkDictionary[i].Item2));
            }
            return body;
        }
    }

    public class DownloadLinkItem : ModelsBase
    {
        private string _downloadLinkName = "";

        public string DownloadLinkName
        {
            get
            {
                switch (DownloadLinkType)
                {
                    case "bd":
                        _downloadLinkName = "百度网盘" + DownloadLinkNumber;
                        break;

                    case "gd":
                        _downloadLinkName = "谷歌网盘" + DownloadLinkNumber;
                        break;

                    case "od":
                        _downloadLinkName = "OneDrive" + DownloadLinkNumber;
                        break;

                    case "mega":
                        _downloadLinkName = "Mega网盘" + DownloadLinkNumber;
                        break;

                    case "other":
                        _downloadLinkName = "其他" + DownloadLinkNumber;
                        break;

                    default:
                        break;
                }
                return _downloadLinkName;
            }
        }

        private string _downloadLink = "";

        public string DownloadLink
        {
            get { return _downloadLink; }
            set
            {
                _downloadLink = value;
                this.RaisePropertyChanged("DownloadLink");
            }
        }

        public string DownloadLinkType { get; set; }
        public string DownloadLinkNumber { get; set; }

        public DownloadLinkItem(string type, string typeNumber)
        {
            DownloadLinkType = type;
            DownloadLinkNumber = typeNumber;
        }
    }

    public class TrackInfo
    {
        public int No { get; set; }
        public string Title { get; set; }
        public string TrackLength { get; set; }

        public TrackInfo(string title, int duration, int no)
        {
            Title = title;
            TrackLength = MusicHelper.GetTrackLength(duration);
            No = no;
        }
        public override string ToString()
        {
            return No.ToString() + ". " + Title + "  " + TrackLength;
        }
    }
}