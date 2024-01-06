import * as signalR from "@aspnet/signalr";

// Initialize
const btnStart: HTMLButtonElement = document.querySelector("#btnStart");
const txtOnlineUsers: HTMLParagraphElement = document.querySelector("#txtOnlineUsers");
const txtMoreOnlineUsers: HTMLParagraphElement = document.querySelector("#txtMoreOnlineUsers");

// Add event listener
btnStart.addEventListener("click", goToChat);

// Initialize the SignalR connection
const Connection = new signalR.HubConnectionBuilder()
.withUrl("/hub/GapitaHub").build();

// Start the connection. After start completed, check the online users
Connection.start().catch(err => document.write(err))
.then(() => Connection.send("checkOnlineUsers", window.location.href));

// Connection on receive
// On receive online users
Connection.on("getOnlineUsers", (onlineUsersCount: string) => {
    txtOnlineUsers.innerHTML = `Người chờ chat: <span style="font-weight:bold">${onlineUsersCount}</span>`;
    txtMoreOnlineUsers.innerHTML = `Người chờ chat: <span style="font-weight:bold">${onlineUsersCount}</span>`;
});

// Go to chat page "chat.html"
function goToChat() {
    window.location.replace("/chat.html");
}