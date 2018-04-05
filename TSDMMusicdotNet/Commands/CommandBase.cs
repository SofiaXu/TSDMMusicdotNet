using System;
using System.Windows.Input;

namespace TSDMMusicdotNet.Commands
{

        public class DelegateCommand : ICommand
        {
            public Action<object> ExecuteCommand = null;

            public Func<object, bool> CanExecuteCommand = null;

            public event EventHandler CanExecuteChanged;

            public bool CanExecute(object parameter)
            {
                if (CanExecuteCommand != null)
                {
                    return this.CanExecuteCommand(parameter);
                }
                else
                {
                    return true;
                }
            }

            public void Execute(object parameter)
            {
                if (this.ExecuteCommand != null) this.ExecuteCommand(parameter);
            }

            public void RaiseCanExecuteChanged()
            {
                if (CanExecuteChanged != null)
                {
                    CanExecuteChanged(this, EventArgs.Empty);
                }
            }
        }
}
