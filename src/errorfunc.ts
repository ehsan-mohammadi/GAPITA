import * as signalR from "@aspnet/signalr";

// Initialize
const txtOnlineUsers: HTMLParagraphElement = document.querySelector("#txtOnlineUsers");
const txtMoreOnlineUsers: HTMLParagraphElement = document.querySelector("#txtMoreOnlineUsers");
const btnBack: HTMLButtonElement = document.querySelector("#btnBack");

// Add event listener
btnBack.addEventListener("click", goToHome);

// Initialize the SignalR connection
const Connection = new signalR.HubConnectionBuilder()
.withUrl("/hub/GapitaHub").build();

// Start the connection. After start completed, check the online users
Connection.start().catch(err => document.write(err))
.then(() => Connection.send("checkOnlineUsers", window.location.href));

// Connection on receive
// On receive online users
Connection.on("getOnlineUsers", (onlineUsersCount: string) => {
    txtOnlineUsers.innerHTML = `Online users: <span style="font-weight:bold">${onlineUsersCount}</span>`;
    txtMoreOnlineUsers.innerHTML = `Online users: <span style="font-weight:bold">${onlineUsersCount}</span>`;
});

// Go to home page "index.html"
function goToHome() {
    window.location.replace("/index.html");
}