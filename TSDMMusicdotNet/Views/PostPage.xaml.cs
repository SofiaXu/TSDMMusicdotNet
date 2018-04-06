using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using TSDMMusicdotNet.ViewModels;

namespace TSDMMusicdotNet.Views
{
    /// <summary>
    /// PostPage.xaml 的交互逻辑
    /// </summary>
    public partial class PostPage : Page
    {
        public PostPage(string template)
        {
            InitializeComponent();
            DataContext = new PostPageViewModel(template);
        }
    }
}
