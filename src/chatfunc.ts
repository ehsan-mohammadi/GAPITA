import * as signalR from "@aspnet/signalr";
import * as $ from "Jquery";

const txtOnlineUsers: HTMLParagraphElement = document.querySelector("#txtOnlineUsers");
const txtMoreOnlineUsers: HTMLParagraphElement = document.querySelector("#txtMoreOnlineUsers");
const divLoadingBackground: HTMLDivElement = document.querySelector("#divLoadingBackground");
const divLoading: HTMLDivElement = document.querySelector("#divLoading");
const divError: HTMLDivElement = document.querySelector("#divError");
const divTryAgain: HTMLDivElement = document.querySelector("#divTryAgain");
const btnBack: HTMLButtonElement = document.querySelector("#btnBack");
const btnTryAgain: HTMLButtonElement = document.querySelector("#btnTryAgain");
const divChat: HTMLDivElement = document.querySelector("#divChat");
const divChatContent: HTMLDivElement = document.querySelector("#divChatContent");
const btnLeft: HTMLDivElement = document.querySelector("#btnLeft");
const btnRefresh: HTMLDivElement = document.querySelector("#btnRefresh");
const divLeft: HTMLDivElement = document.querySelector("#divLeft");
const divRefresh: HTMLDivElement = document.querySelector("#divRefresh");
const btnSend: HTMLDivElement = document.querySelector("#btnSend");
const txtMessage: HTMLTextAreaElement = document.querySelector("#txtMessage");
const divTyping: HTMLDivElement = document.querySelector("#divTyping");

setInterval(function(){
    $(divTyping).fadeOut()
},3000);

btnBack.addEventListener("click", goToHome);
btnTryAgain.addEventListener("click", refreshChat)
btnLeft.addEventListener("click", leftChat);
btnRefresh.addEventListener("click", refreshChat);
btnSend.addEventListener("click", sendMessage);

txtMessage.addEventListener("keydown",(e : KeyboardEvent) => {
    if(!e.shiftKey && e.keyCode === 13)
    {
        sendMessage();
        if(event.preventDefault)
            event.preventDefault();

        return false;
    }
});

txtMessage.addEventListener("input", isTyping);

const connection = new signalR.HubConnectionBuilder()
.withUrl("/hub/GapitaHub").build();

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
    if(isAloneStranger) {
        $(divLoading).hide();
        $(divError).hide();
        $(divLoadingBackground).hide();
        $(divChat).show();

        divChatContent.innerHTML += `<p class="connect-disconnect-message">You're connected to stranger</p>`;
        divChatContent.innerHTML += `<p class="connect-disconnect-message">Now type something...</p>`;
        divChatContent.scrollTop = divChatContent.scrollHeight;
    }
});

connection.on("strangerLeft", () => {
    divChatContent.innerHTML += `<p class="connect-disconnect-message">Stranger left the chat</p>`;
    divChatContent.scrollTop = divChatContent.scrollHeight;
    $(divLeft).hide();
    $(divRefresh).show();
    $(txtMessage).prop("disabled", true);
    btnSend.removeEventListener("click", sendMessage);

    connection.send("deleteRoom");
});

connection.on("receiveMessage", (message: string) => {
    divChatContent.innerHTML += `<p class="message-stranger">${message}</p>`;
    divChatContent.scrollTop = divChatContent.scrollHeight;
});

connection.on("strangerIsTyping", () => {
    $(divTyping).fadeIn();
});

function leftChat() {
    divChatContent.innerHTML += `<p class="connect-disconnect-message">You left the chat</p>`;
    divChatContent.scrollTop = divChatContent.scrollHeight;
    $(divLeft).hide();
    $(divRefresh).show();
    $(txtMessage).prop("disabled", true);
    btnSend.removeEventListener("click", sendMessage);
    
    connection.send("leftChat");
}

function goToHome() {
    window.location.replace("/index.html");
}

function refreshChat() {
    window.location.replace("/chat.html");
}

function sendMessage() {
    let message: string = txtMessage.value.replace(/\n/g, "").replace(/ /g, "");

    if(message !== "") {
        let refinedMessage: string = txtMessage.value.replace(/\n/g, "<br/>");

        connection.send("sendMessage", refinedMessage)
        .then(() => {
            divChatContent.innerHTML += `<p class="message-caller">${refinedMessage}</p>`;
            divChatContent.scrollTop = divChatContent.scrollHeight;
            txtMessage.value = "";
        })
    }
}

function isTyping() {
    connection.send("isTyping");
}