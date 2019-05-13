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
            {
                string groupName = users[Context.ConnectionId];

                if(groupName != "-1")
                    await Clients.Group(groupName).SendAsync("strangerLeft");

                users.Remove(Context.ConnectionId);
            }

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
                    string groupName = Context.ConnectionId + aloneStrangerId;

                    users[aloneStrangerId] = groupName;
                    users[Context.ConnectionId] = groupName;

                    await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
                    await Groups.AddToGroupAsync(aloneStrangerId, groupName);

                    await Clients.Clients(new List<string>() { aloneStrangerId, Context.ConnectionId }).SendAsync("joinToStranger", true);
                }
            else
                {
                    await Clients.Caller.SendAsync("joinToStranger", false);
                }
        }

        public async Task DeleteRoom()
        {
            string groupName = users[Context.ConnectionId];
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

        public async Task LeftChat()
        {
            string groupName = users[Context.ConnectionId];

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("strangerLeft");
        }

        public async Task SendMessage(string message)
        {
            string groupName = users[Context.ConnectionId];
            await Clients.OthersInGroup(groupName).SendAsync("receiveMessage", message);
        }

        public async Task IsTyping()
        {
            string groupName = users[Context.ConnectionId];
            await Clients.OthersInGroup(groupName).SendAsync("strangerIsTyping");
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