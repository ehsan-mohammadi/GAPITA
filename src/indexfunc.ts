import * as signalR from "@aspnet/signalr";

const btnStart: HTMLButtonElement = document.querySelector("#btnStart");
const txtOnlineUsers: HTMLParagraphElement = document.querySelector("#txtOnlineUsers");
const txtMoreOnlineUsers: HTMLParagraphElement = document.querySelector("#txtMoreOnlineUsers");

btnStart.addEventListener("click", goToChat);

function goToChat() {
    window.location.replace("/chat.html");
}

const Connection = new signalR.HubConnectionBuilder()
.withUrl("/hub/GapitaHub").build();

Connection.start().catch(err => document.write(err))
.then(() => Connection.send("checkOnlineUsers", window.location.href));

Connection.on("getOnlineUsers", (onlineUsersCount: string) => {
    txtOnlineUsers.innerHTML = `Online users: <span style="font-weight:bold">${onlineUsersCount}</span>`;
    txtMoreOnlineUsers.innerHTML = `Online users: <span style="font-weight:bold">${onlineUsersCount}</span>`;
});