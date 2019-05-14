import * as signalR from "@aspnet/signalr";

const txtOnlineUsers: HTMLParagraphElement = document.querySelector("#txtOnlineUsers");
const txtMoreOnlineUsers: HTMLParagraphElement = document.querySelector("#txtMoreOnlineUsers");
const btnEmail: HTMLDivElement = document.querySelector("#btnEmail");
const btnTwitter: HTMLDivElement = document.querySelector("#btnTwitter");
const btnLinkedin: HTMLDivElement = document.querySelector("#btnLinkedin");
const btnGithub: HTMLDivElement = document.querySelector("#btnGithub");

btnEmail.addEventListener("click", mailToMe);
btnTwitter.addEventListener("click", goToMyTwitter);
btnLinkedin.addEventListener("click", goToMyLinkedin);
btnGithub.addEventListener("click", goToMyGithub);

const Connection = new signalR.HubConnectionBuilder()
.withUrl("/hub/GapitaHub").build();

Connection.start().catch(err => document.write(err))
.then(() => Connection.send("checkOnlineUsers", window.location.href));

Connection.on("getOnlineUsers", (onlineUsersCount: string) => {
    txtOnlineUsers.innerHTML = `Online users: <span style="font-weight:bold">${onlineUsersCount}</span>`;
    txtMoreOnlineUsers.innerHTML = `Online users: <span style="font-weight:bold">${onlineUsersCount}</span>`;
});

function mailToMe() {
    window.open("mailto:mohammadi.ehsan1994@gmail.com");
}

function goToMyTwitter() {
    window.open("https://twitter.com/EhsanMhdi", "_blank");
}

function goToMyLinkedin() {
    window.open("https://linkedin.com/in/ehsan-mohammadi", "_blank");
}

function goToMyGithub() {
    window.open("https://github.com/ehsan-mohammadi", "_blank");
}