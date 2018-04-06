using TSDMMusicdotNet.Commands;
using TSDMMusicdotNet.Models;
using System.Collections.ObjectModel;
using System;
using TSDMMusicdotNet.Helpers;
using System.Text.RegularExpressions;

namespace TSDMMusicdotNet.ViewModels
{
    public class PostPageViewModel : ModelsBase
    {
        public ObservableCollection<DownloadLinkItem> DownloadLinkCollection { get; set; }
        private string _outBody = "";

        public string OutBody
        {
            get { return _outBody; }
            set
            {
                _outBody = value;
                this.RaisePropertyChanged("OutBody");
            }
        }
        private string _certificationLink = "";

        public string CertificationLink
        {
            get { return _certificationLink; }
            set
            {
                _certificationLink = value;
                this.RaisePropertyChanged("CertificationLink");
            }
        }
        private string _moraLink = "";

        public string MoraLink
        {
            get { return _moraLink; }
            set
            {
                _moraLink = value;
                this.RaisePropertyChanged("MoraLink");
            }
        }
        private string _outTitle = "";

        public string OutTitle
        {
            get { return _outTitle; }
            set
            {
                _outTitle = value;
                this.RaisePropertyChanged("OutTitle");
            }
        }
        private string _nowWorking = "";

        public string NowWorking
        {
            get { return _nowWorking; }
            set
            {
                _nowWorking = value;
                this.RaisePropertyChanged("NowWorking");
            }
        }
        private int _nowProgress = 0;

        public int NowProgress
        {
            get { return _nowProgress; }
            set
            {
                _nowProgress = value;
                this.RaisePropertyChanged("NowProgress");
            }
        }
        public DelegateCommand ClearCommand { get; set; }
        public DelegateCommand CreateCommand { get; set; }
        private string _template = "";

        public PostPageViewModel(string template)
        {
            _template = template;
            DownloadLinkCollection = new ObservableCollection<DownloadLinkItem>(PostPageCommands.GetDownloadLinkCollection());
            MoraLink = "";
            CertificationLink = "";
            OutBody = "";
            OutTitle = "";
            ClearCommand = new DelegateCommand();
            CreateCommand = new DelegateCommand();
            ClearCommand.ExecuteCommand += new Action<object>(_clearPage);
            CreateCommand.ExecuteCommand += new Action<object>(_create);
        }
        private void _clearPage(object obj)
        {
            MoraLink = "";
            CertificationLink = "";
            OutBody = "";
            OutTitle = "";
            for (int i = 0; i < DownloadLinkCollection.Count; i++)
            {
                DownloadLinkCollection[i].DownloadLink = "";
            }
        }
        private async void _create(object obj)
        {
            bool isgoodlink = LinksCheck();
            if (isgoodlink)
            {
                UpdateProgress("连接mora...", 0);
                string packagelink = await MoraHelper.GetMoraPackageLinkAsync(MoraLink);
                UpdateProgress("读取信息...", 1);
                MoraJsonObjectModel moraJsonObject = await MoraHelper.GetMoraJsonObjectAsync(packagelink);
                UpdateProgress("生成主题...", 2);
                OutputModel output = new OutputModel(moraJsonObject, DownloadLinkCollection, CertificationLink, MoraLink);
                OutTitle = output.OutputTitle();
                OutBody = output.OutputBody(_template);
                UpdateProgress("完成生成", 3);
            }
            else
            {
                System.Windows.Forms.MessageBox.Show("mora链接错误！");
            }
        }
        private void UpdateProgress(string working, int progress)
        {
            this.NowWorking = working;
            this.NowProgress = progress;
        }
        private bool LinksCheck()
        {
            bool result = false;
            if (Regex.IsMatch(MoraLink, "http://mora.jp/package/(.*?)/(.*?)/") || Regex.IsMatch(MoraLink, "http://mora.jp/package/(.*?)/(.*?)/(.*?)"))
            {
                result = true;
            }
            return result;
        }
    }
}