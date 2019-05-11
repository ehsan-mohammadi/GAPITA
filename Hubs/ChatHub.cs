using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace SignalRWebPack.Hubs
{
    public class ChatHub : Hub
    {
        private static List<string> users = new List<string>();
        
        public override async Task OnConnectedAsync()
        {
            users.Add("Ehsan");
            await Clients.All.SendAsync("newUser");

            await base.OnConnectedAsync();
        }

        public async Task NewMessage(string username, string message)
        {
            await Clients.All.SendAsync("messageReceived", username, message);
        }

        public static int GetUsersList()
        {
            if(users.Count < 100000)
                return users.Count;
            else
                return 100000;
        }
    }
}