// GLOBAL
const isMobile = window.innerWidth < 480;
const isMobileLandscape = window.innerWidth < 768;
const timestamps = [0, 3, 6, 9, 12, 15, 18, 20, 22, 24];
const loadWrap = document.querySelector(".load-w");
const pageOverlay = document.querySelector(".page-overlay");
const loadBg = loadWrap.querySelector(".load-bg");
const navW = document.querySelector(".nav-w");
let titleLines;
let closeMenu;
let ranHomeLoader = false;
let generalFlag = false;
let mobileMenuOpen = false;
