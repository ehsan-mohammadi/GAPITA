using System;
using System.Linq;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace SignalRWebPack.Hubs
{
    public class GapitaHub : Hub
    {
        // Save users ConnectionId and GroupName (If exist)
        private static Dictionary<string, string> users = new Dictionary<string, string>();
        
        /// On user connected
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        /// On user disconnected
        public override async Task OnDisconnectedAsync(Exception exception)
        {
            if(users.ContainsKey(Context.ConnectionId)) // If user exist in users list
            {
                string groupName = users[Context.ConnectionId];

                // If user already is in a group
                if(groupName != "-1")
                    await Clients.Group(groupName).SendAsync("strangerLeft");

                // Remove the user from the list
                users.Remove(Context.ConnectionId);
            }

            // Refresh online users and send onlineUsersStr to all connections
            int onlineUsersCount = GetUsersList();
            string onlineUsersStr = onlineUsersCount >= 100000 ? ("+100000") : onlineUsersCount.ToString();

            await Clients.All.SendAsync("getOnlineUsers", onlineUsersStr);
            await base.OnDisconnectedAsync(exception);
        }

        // Check the online users number
        public async Task CheckOnlineUsers(string url)
        {
            // If user is in "chat.html" page, add him to users list
            if(url.Contains("/chat.html"))
            {
                users.Add(Context.ConnectionId, "-1");
            }

            // Refresh online users and send onlineUsersStr to all connections
            int onlineUsersCount = GetUsersList();
            string onlineUsersStr = onlineUsersCount >= 100000 ? ("+100000") : onlineUsersCount.ToString();

            await Clients.All.SendAsync("getOnlineUsers", onlineUsersStr);
        }

        // Search a stranger to connect and chat
        public async Task SearchStranger()
        {
            // Find a stranger ConnectionId
            string aloneStrangerId = users.FirstOrDefault(user => (user.Value == "-1" && user.Key != Context.ConnectionId)).Key;

            // If alone stranger found
            if(aloneStrangerId != null)
            {
                // Set a group and add them to the group
                string groupName = Context.ConnectionId + aloneStrangerId;

                users[aloneStrangerId] = groupName;
                users[Context.ConnectionId] = groupName;

                await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
                await Groups.AddToGroupAsync(aloneStrangerId, groupName);

                // Send message and let them to start the chat
                await Clients.Clients(new List<string>() { aloneStrangerId, Context.ConnectionId }).SendAsync("joinToStranger", true);
            }
            else
            {
                // Send a message to caller, alone stranger not found
                await Clients.Caller.SendAsync("joinToStranger", false);
            }
        }

        // When one of the starnger left the chat, remove the group
        public async Task DeleteRoom()
        {
            string groupName = users[Context.ConnectionId];
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
        }

        // When caller left the chat
        public async Task LeftChat()
        {
            // Remove caller from the group
            string groupName = users[Context.ConnectionId];

            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            await Clients.Group(groupName).SendAsync("strangerLeft");
        }

        // Send caller message to other in group
        public async Task SendMessage(string message)
        {
            string groupName = users[Context.ConnectionId];
            await Clients.OthersInGroup(groupName).SendAsync("receiveMessage", message);
        }

        // Send caller isTyping to other in group
        public async Task IsTyping()
        {
            string groupName = users[Context.ConnectionId];
            await Clients.OthersInGroup(groupName).SendAsync("strangerIsTyping");
        }

        // Get the online users
        public static int GetUsersList()
        {
            if(users.Count < 100000)
                return users.Count;
            else
                return 100000;
        }
    }
}