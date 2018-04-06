using System.Windows;
using TSDMMusicdotNet.Commands;
using TSDMMusicdotNet.ViewModels;

namespace TSDMMusicdotNet
{
    /// <summary>
    /// MainWindow.xaml 的交互逻辑
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
            DataContext = new MainWindowViewModel(LayoutFrame.NavigationService);
        }
    }
}