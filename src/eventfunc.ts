import * as $ from "jquery"

const btnMore : HTMLDivElement = document.querySelector("#btnMore");
const divMoreMenu: HTMLDivElement = document.querySelector("#divMoreMenu");
const btnMenuHome: HTMLDivElement = document.querySelector("#btnMenuHome");
const btnMoreHome: HTMLDivElement = document.querySelector("#btnMoreHome");

btnMore.addEventListener("click", toggleMoreMenu);

btnMenuHome.addEventListener("click", goToHome);
btnMoreHome.addEventListener("click", goToHome);

function toggleMoreMenu() {
    var opacity: Number = $(divMoreMenu).css('opacity');

    if(opacity == 0)
        $(divMoreMenu).animate({ opacity: '1', top: '70px' });
    else if(opacity == 1)
        $(divMoreMenu).animate({ opacity: '0', top: '-300px' });
}

function goToHome() {
    window.location.replace("/index.html");
}