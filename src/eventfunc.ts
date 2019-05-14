import * as $ from "jquery"

const btnTitle: HTMLDivElement = document.querySelector("#btnTitle");
const btnMore : HTMLDivElement = document.querySelector("#btnMore");
const divMoreMenu: HTMLDivElement = document.querySelector("#divMoreMenu");
const btnMenuHome: HTMLDivElement = document.querySelector("#btnMenuHome");
const btnMenuBug: HTMLDivElement = document.querySelector("#btnMenuBug");
const btnMenuGithub: HTMLDivElement = document.querySelector("#btnMenuGithub");
const btnMenuAbout: HTMLDivElement = document.querySelector("#btnMenuAbout");
const btnMoreHome: HTMLDivElement = document.querySelector("#btnMoreHome");
const btnMoreBug: HTMLDivElement = document.querySelector("#btnMoreBug");
const btnMoreGithub: HTMLDivElement = document.querySelector("#btnMoreGithub");
const btnMoreAbout: HTMLDivElement = document.querySelector("#btnMoreAbout");

btnTitle.addEventListener("click", goToHome);

btnMore.addEventListener("click", toggleMoreMenu);

btnMenuHome.addEventListener("click", goToHome);
btnMenuBug.addEventListener("click", goToIssue);
btnMenuGithub.addEventListener("click", goToGithub);
btnMenuAbout.addEventListener("click", goToAbout);
btnMoreHome.addEventListener("click", goToHome);
btnMoreBug.addEventListener("click", goToIssue);
btnMoreGithub.addEventListener("click", goToGithub);
btnMoreAbout.addEventListener("click", goToAbout);

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

function goToAbout() {
    window.location.replace("/about.html")
}

function goToIssue() {
    window.open("https://github.com/ehsan-mohammadi/GAPITA/issues", "_blank");
}

function goToGithub() {
    window.open("https://github.com/ehsan-mohammadi/GAPITA", "_blank");
}