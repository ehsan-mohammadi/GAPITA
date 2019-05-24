import * as $ from "jquery"

// Initialize
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

// Add event listener
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

// More menu hide if you click out of it
$(document).mousedown(function(e){
    var moreMenuContainer = $(divMoreMenu);
    if (moreMenuContainer.css("opacity") == 1 && !moreMenuContainer.is(e.target) && moreMenuContainer.has(e.target).length === 0) 
    {
        toggleMoreMenu();
    }
});

// Click on more menu (When width < 650px)
function toggleMoreMenu() {
    var opacity: Number = $(divMoreMenu).css('opacity');

    if(opacity == 0)
        $(divMoreMenu).animate({ opacity: '1', top: '70px' });
    else if(opacity == 1)
        $(divMoreMenu).animate({ opacity: '0', top: '-300px' });
}

// Go to home page "index.html"
function goToHome() {
    window.location.replace("/index.html");
}

// Go to about page "about.html"
function goToAbout() {
    window.location.replace("/about.html")
}

// Go to GAPITA Github issue page
function goToIssue() {
    window.open("https://github.com/ehsan-mohammadi/GAPITA/issues", "_blank");
}

// Go to GAPITA Github page
function goToGithub() {
    window.open("https://github.com/ehsan-mohammadi/GAPITA", "_blank");
}