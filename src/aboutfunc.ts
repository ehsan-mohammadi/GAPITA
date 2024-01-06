import * as signalR from "@aspnet/signalr";

// Initialize
const txtOnlineUsers: HTMLParagraphElement = document.querySelector("#txtOnlineUsers");
const txtMoreOnlineUsers: HTMLParagraphElement = document.querySelector("#txtMoreOnlineUsers");
const btnEmail: HTMLDivElement = document.querySelector("#btnEmail");
const btnTwitter: HTMLDivElement = document.querySelector("#btnTwitter");
const btnLinkedin: HTMLDivElement = document.querySelector("#btnLinkedin");
const btnGithub: HTMLDivElement = document.querySelector("#btnGithub");

// Add event listener
btnEmail.addEventListener("click", mailToMe);
btnTwitter.addEventListener("click", goToMyTwitter);
btnLinkedin.addEventListener("click", goToMyLinkedin);
btnGithub.addEventListener("click", goToMyGithub);

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

// Mail to Me
function mailToMe() {
    window.open("mailto:mohammadi.ehsan1994@gmail.com");
}

// Go to my Twitter page
function goToMyTwitter() {
    window.open("https://twitter.com/EhsanMhdi", "_blank");
}

// Go to my Linkedin page
function goToMyLinkedin() {
    window.open("https://linkedin.com/in/ehsan-mohammadi", "_blank");
}

// Go to my Github page
function goToMyGithub() {
    window.open("https://github.com/ehsan-mohammadi", "_blank");
}