import * as signalR from "@aspnet/signalr";
import * as $ from "Jquery";

/*const divMessage: HTMLDivElement = document.querySelector("#divMessage");
const tbMessage: HTMLInputElement = document.querySelector("#tbMessage");
const btnSend: HTMLButtonElement = document.querySelector("#btnSend");
const username = new Date().getTime();*/

const txtOnlineUsers: HTMLParagraphElement = document.querySelector("#txtOnlineUsers");
const txtMoreOnlineUsers: HTMLParagraphElement = document.querySelector("#txtMoreOnlineUsers");
const divLoadingBackground: HTMLDivElement = document.querySelector("#divLoadingBackground");
const divLoading: HTMLDivElement = document.querySelector("#divLoading");
const divError: HTMLDivElement = document.querySelector("#divError");
const divTryAgain: HTMLDivElement = document.querySelector("#divTryAgain");
const divChat: HTMLDivElement = document.querySelector("#divChat");

const connection = new signalR.HubConnectionBuilder()
    .withUrl("/hub/GapitaHub")
    .build();

connection.start().catch(err => {
    $(divLoading).hide();
    $(divTryAgain).hide();
    $(divError).show();
})
.then(() => {
    connection.send("checkOnlineUsers", window.location.href);
    connection.send("searchStranger");
    setTimeout(function() {
        if($(divLoading).is(":visible")) {
            connection.stop();
            $(divLoading).hide();
            $(divError).hide();
            $(divTryAgain).show();
        }
    }, 60000);
});

connection.on("getOnlineUsers", (onlineUsersCount: string) => {
    txtOnlineUsers.innerHTML = `Online users: <span style="font-weight:bold">${onlineUsersCount}</span>`;
    txtMoreOnlineUsers.innerHTML = `Online users: <span style="font-weight:bold">${onlineUsersCount}</span>`;
});

connection.on("joinToStranger", (isAloneStranger: boolean) => {
    console.log(isAloneStranger);
    if(isAloneStranger) {
        $(divLoading).hide();
        $(divError).hide();
        $(divLoadingBackground).hide();
        $(divChat).show();
    }
});

/*connection.on("tryAgain", () => {
    $(divLoading).hide();
    $(divTryAgain).show();
});*/

/*const onlineUsersConnection = new signalR.HubConnectionBuilder()
    .withUrl("/hub/OnlineUsersHub")
    .build();

onlineUsersConnection.start().catch(err => document.write(err));

onlineUsersConnection.on("onlineUsers", (onlineUsersCount: string) => {
    txtOnlineUsers.innerHTML = `Online users: <span style="font-weight:bold">${onlineUsersCount}</span>`;
    txtMoreOnlineUsers.innerHTML = `Online users: <span style="font-weight:bold">${onlineUsersCount}</span>`;
});*/


/*connection.on("messageReceived", (username: string, message: string) => {
    let m = document.createElement("div");

    m.innerHTML =
        `<div class="message-author">${username}</div><div>${message}</div>`;
    divMessage.appendChild(m);
    divMessage.scrollTop = divMessage.scrollHeight;
});

connection.on("newUser", () => {
    console.log("New user joined!");
});

connection.on("onlineUsers", (onlineUsersCount: number) => {
    console.log(onlineUsersCount);
});

tbMessage.addEventListener("keyup", (e: KeyboardEvent) => {
    if(e.keyCode === 13) {
        send();
    }
});

btnSend.addEventListener("click", send);

function send() {
    connection.send("newMessage", username, tbMessage.value)
        .then(() => tbMessage.value = "");
}*/