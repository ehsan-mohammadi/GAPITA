import * as $ from "jquery"

const btnStart : HTMLButtonElement = document.querySelector("#btnStart");
const btnMore : HTMLDivElement = document.querySelector("#btnMore");
const divMoreMenu: HTMLDivElement = document.querySelector("#divMoreMenu");

btnStart.addEventListener("click", goToChat);
btnMore.addEventListener("click", toggleMoreMenu);

function goToChat() {
    window.location.replace("/chat.html");
}

function toggleMoreMenu() {
    var opacity: Number = $(divMoreMenu).css('opacity');

    if(opacity == 0)
        $(divMoreMenu).animate({ opacity: '1', top: '70px' });
    else if(opacity == 1)
        $(divMoreMenu).animate({ opacity: '0', top: '-300px' });
}