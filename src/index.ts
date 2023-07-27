import anime from "animejs";
import "./styles.scss";
const goToDpcument = document.querySelector(".go-to") as HTMLDivElement;
const headerElement = document.querySelector("header") as HTMLElement;
const progressBar = document.querySelector(".progress-bar") as HTMLElement;

import detectScroll from "./utils/scrolling";

function scrolling(sp: number) {
  const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const scrolled = (sp / height) * 100;
  progressBar.style.width = scrolled + "%";
  if (scrolled > 5) {
    if (headerElement) {
      headerElement.classList.add("scrolled");
    }
  } else {
    headerElement.classList.remove("scrolled");
  }
  if (scrolled > 5 && goToDpcument) {
    goToDpcument.classList.add("show-go-to");
  } else {
    goToDpcument.classList.remove("show-go-to");
  }
}
detectScroll(scrolling, 40);

//get scroll value

const preloader = document.querySelector("#preloader") as HTMLElement;
const img2 = document.querySelector(".img2") as HTMLElement;
window.onload = function () {
  console.log("Auto Lesio.eu");
  // Hide the preloader once the page has finished loading
  if (!preloader) return;
  preloader.style.display = "none";
  if (!img2) return;
  img2.classList.add("showed");
  // register Swiper custom elements
};

const images = document.querySelectorAll(".img-thumb");
const timeline = anime.timeline();

// define the animation properties
const animationProperties = {
  scale: [0, 1],
  easing: "easeOutQuad",
  duration: 1000,
};

// add the animation to the timeline with a staggered delay
timeline.add({
  targets: images,
  ...animationProperties,
  delay: anime.stagger(600),
});

const acc = document.getElementsByClassName("accordion") as HTMLCollectionOf<HTMLElement>;
for (let i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function (this: HTMLElement) {
    this.classList.toggle("active");
    const panel = this.nextElementSibling as HTMLElement;
    if (panel) {
      panel.style.maxHeight = panel.style.maxHeight ? null! : `${panel.scrollHeight}px`;
    }
  });
}
