using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace SignalRWebPack.Hubs
{
    public class OnlineUsersHub : Hub
    {
        public override async Task OnConnectedAsync()
        {
            int onlineUsersCount = ChatHub.GetUsersList();
            string onlineUsersStr = onlineUsersCount >= 100000 ? ("+100000") : onlineUsersCount.ToString();

            await Clients.Caller.SendAsync("onlineUsers", onlineUsersStr);

            await base.OnConnectedAsync();
        }
    }
}