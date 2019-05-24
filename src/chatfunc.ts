import * as signalR from "@aspnet/signalr";
import * as $ from "Jquery";

// Initialize
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
const btnEmojis: HTMLDivElement = document.querySelector("#btnEmojis");
const divTyping: HTMLDivElement = document.querySelector("#divTyping");
const btnLeaveYes: HTMLButtonElement = document.querySelector("#btnLeaveYes");
const btnLeaveNo: HTMLButtonElement = document.querySelector("#btnLeaveNo");
const divLeaveConfirmationBackground: HTMLDivElement = document.querySelector("#divLeaveConfirmationBackground");
const soundMessageAppear: HTMLAudioElement = document.querySelector("#soundMessageAppear");
const soundMessageNotification: HTMLAudioElement = document.querySelector("#soundMessageNotification");

var isMainTitle = true;
var isFocused = true;
var alertInterval = null;

// Set interval that every 3000 milisecond, hide the typing div
setInterval(function(){
    $(divTyping).fadeOut()
},3000);

// Check that you focus on the GAPITA tab or not
onVisibilityChange(function(visible) {
    isFocused = visible;
    if(isFocused) {
        document.title = "GAPITA - Chat room";
        clearInterval(alertInterval);
    }
});

// Add event listener
btnBack.addEventListener("click", goToHome);
btnTryAgain.addEventListener("click", refreshChat)
btnLeft.addEventListener("click", (e: Event) => {leaveConfirmationDialog(true)});
btnRefresh.addEventListener("click", refreshChat);
btnSend.addEventListener("click", sendMessage);
btnLeaveYes.addEventListener("click", leftChat);
btnLeaveNo.addEventListener("click", (e: Event) => leaveConfirmationDialog(false));

txtMessage.addEventListener("focus", (e: Event) => focusOnTxtMessage(true));
txtMessage.addEventListener("blur", (e: Event) => focusOnTxtMessage(false));
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

// Initialize the SignalR connection
const connection = new signalR.HubConnectionBuilder()
.withUrl("/hub/GapitaHub").build();

// Start the connection. After start completed, check the online users and hide loading div and show chat div
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

// Connection on receive
// On receive online users
connection.on("getOnlineUsers", (onlineUsersCount: string) => {
    txtOnlineUsers.innerHTML = `Online users: <span style="font-weight:bold">${onlineUsersCount}</span>`;
    txtMoreOnlineUsers.innerHTML = `Online users: <span style="font-weight:bold">${onlineUsersCount}</span>`;
});

// On receive join to a stranger
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

// On stranger left the chat
connection.on("strangerLeft", () => {
    divChatContent.innerHTML += `<p class="connect-disconnect-message">Stranger left the chat</p>`;
    divChatContent.scrollTop = divChatContent.scrollHeight;
    $(divLeft).hide();
    $(divRefresh).show();
    $(txtMessage).prop("disabled", true);
    btnSend.removeEventListener("click", sendMessage);

    connection.send("deleteRoom");
});

// On receive a message form the stranger
connection.on("receiveMessage", (message: string) => {
    divChatContent.innerHTML += `<p dir="auto" class="message-stranger">${message}</p>`;
    divChatContent.scrollTop = divChatContent.scrollHeight;

    // Play message notification sound and change the tab title
    if(!isFocused) {
        soundMessageNotification.play();
        clearInterval(alertInterval);
        alertInterval = setInterval(alertTitleNewMessage, 700);
    }
    else {
        soundMessageAppear.play();
    }
});

// On stranger is typing
connection.on("strangerIsTyping", () => {
    $(divTyping).fadeIn();
});

// Show/Hide leave confirmation dialog
function leaveConfirmationDialog(state: boolean) {
    if(state)
        $(divLeaveConfirmationBackground).show();
    else
        $(divLeaveConfirmationBackground).hide();
}

// Change emoji button border style when focus on txtMessage
function focusOnTxtMessage(state: boolean) {
    if(state)
        $(btnEmojis).css("border-color", "#fe9400");
    else
        $(btnEmojis).css("border-color", "#ccc");
}

// Disable btnSend and txtMessage
function leftChat() {
    divChatContent.innerHTML += `<p class="connect-disconnect-message">You left the chat</p>`;
    divChatContent.scrollTop = divChatContent.scrollHeight;
    $(divLeft).hide();
    $(divRefresh).show();
    $(txtMessage).prop("disabled", true);
    $(divLeaveConfirmationBackground).hide();
    btnSend.removeEventListener("click", sendMessage);
    
    connection.send("leftChat");
}

// Go to home page "index.html"
function goToHome() {
    window.location.replace("/index.html");
}

// Refresh the chat page
function refreshChat() {
    window.location.replace("/chat.html");
}

// When click on btnSend, a message sends to SignalR hub and then sends to the stranger
function sendMessage() {
    let message: string = txtMessage.value.replace(/\n/g, "").replace(/ /g, "");

    if(message !== "") {
        let refinedMessage: string = txtMessage.value.replace(/\n/g, "<br/>");

        connection.send("sendMessage", refinedMessage)
        .then(() => {
            divChatContent.innerHTML += `<p dir="auto" class="message-caller">${refinedMessage}</p>`;
            divChatContent.scrollTop = divChatContent.scrollHeight;
            txtMessage.value = "";

            // Play message appear sound
            soundMessageAppear.play();
        })
    }
}

// When user typing, a message sends to SignalR hub and then sends to the stranger to found out typing
function isTyping() {
    connection.send("isTyping");
}

// Check you focus on GAPITA tab or not
function onVisibilityChange(callback) {
    var visible = true;

    if (!callback) {
        throw new Error('no callback given');
    }

    function focused() {
        if (!visible) {
            callback(visible = true);
        }
    }

    function unfocused() {
        if (visible) {
            callback(visible = false);
        }
    }

    // Standards foccus
    if ('hidden' in document) {
        document.addEventListener('visibilitychange',
            function() {(document.hidden ? unfocused : focused)()});
    } else {
        // All others
        window.onpageshow = window.onfocus = focused;
        window.onpagehide = window.onblur = unfocused;
    }
};

// Change the tab title when receive new message and you don't focus on tab
function alertTitleNewMessage() {
    isMainTitle = !isMainTitle;
    document.title = isMainTitle ? "GAPITA - Chat room" : "New Message!";
}