using System;
using System.Collections.Generic;
using System.Windows;
using TSDMMusicdotNet;
using TSDMMusicdotNet.Views;
using TSDMMusicdotNet.Models;
using TSDMMusicdotNet.Helpers;
using TSDMMusicdotNet.Commands;
using System.Windows.Navigation;

namespace TSDMMusicdotNet.ViewModels
{
    public class MainWindowViewModel : ModelsBase
    {
        PostPage _postPage;
        NavigationService _navigationService;
        public DelegateCommand ChangePage { get; set; }
        public MainWindowViewModel(NavigationService navigationService)
        {
            _postPage = new PostPage(MainWindowsCommands.ReadTemplate());
            _navigationService = navigationService;
            ChangePage = new DelegateCommand();
            ChangePage.ExecuteCommand += new Action<object>(ChangePageCommand);
            _navigationService.Navigate(_postPage);
        }
        private void ChangePageCommand(object obj)
        {
            string str = (string)obj;
            if (str == "/TSDMMusicdotNet;component/Views/PostPage.xaml")
            {
                _navigationService.Navigate(_postPage);
            }
            else if (str == null)
            {

            }
            else
            {
                _navigationService.Navigate(new Uri(str, UriKind.Relative));
            }
        }
    }
}
