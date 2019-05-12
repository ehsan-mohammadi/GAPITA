using System;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace SignalRWebPack.Hubs
{
    public class GapitaHub : Hub
    {
        private static Dictionary<string, string> users = new Dictionary<string, string>();
        
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            if(users.ContainsKey(Context.ConnectionId))
                users.Remove(Context.ConnectionId);

            int onlineUsersCount = GetUsersList();
            string onlineUsersStr = onlineUsersCount >= 100000 ? ("+100000") : onlineUsersCount.ToString();

            await Clients.All.SendAsync("getOnlineUsers", onlineUsersStr);
            await base.OnDisconnectedAsync(exception);
        }

        public async Task CheckOnlineUsers(string url)
        {
            if(url.Contains("/chat.html"))
            {
                users.Add(Context.ConnectionId, "-1");
            }

            int onlineUsersCount = GetUsersList();
            string onlineUsersStr = onlineUsersCount >= 100000 ? ("+100000") : onlineUsersCount.ToString();

            await Clients.All.SendAsync("getOnlineUsers", onlineUsersStr);
        }

        public async Task SearchStranger()
        {
            string aloneStrangerId = users.FirstOrDefault(user => (user.Value == "-1" && user.Key != Context.ConnectionId)).Key;

            if(aloneStrangerId != null)
                {
                    users[aloneStrangerId] = Context.ConnectionId;
                    users[Context.ConnectionId] = aloneStrangerId;

                    string groupName = Context.ConnectionId + aloneStrangerId;
                    await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
                    await Groups.AddToGroupAsync(aloneStrangerId, groupName);

                    await Clients.Clients(new List<string>() { aloneStrangerId, Context.ConnectionId }).SendAsync("joinToStranger", true);
                }
            else
                {
                    await Clients.Caller.SendAsync("joinToStranger", false);
                }
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