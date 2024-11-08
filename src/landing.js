// GLOBAL
gsap.registerPlugin(ScrollTrigger, CustomEase);
const timestamps = [0, 1.5, 3, 4.5, 6, 7.5, 9, 10.5, 12, 13.5];
let lenis;
if (Webflow.env("editor") === undefined) {
  lenis = new Lenis();

  $("[data-lenis-start]").on("click", function () {
    lenis.start();
  });
  $("[data-lenis-stop]").on("click", function () {
    lenis.stop();
  });
  $("[data-lenis-toggle]").on("click", function () {
    $(this).toggleClass("stop-scroll");
    if ($(this).hasClass("stop-scroll")) {
      lenis.stop();
    } else {
      lenis.start();
    }
  });

  lenis.on("scroll", ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });

  gsap.ticker.lagSmoothing(0);
}
const isMobile = window.innerWidth < 480;
const isMobileLandscape = window.innerWidth < 768;
const isDesktop = window.innerWidth > 991;
const loadWrap = document.querySelector(".load-w");
const pageOverlay = document.querySelector(".page-overlay");
const loadBg = loadWrap.querySelector(".load-bg");
const navW = document.querySelector(".nav-w");

let titleLines;
let closeMenu;
let ranHomeLoader = false;
let generalFlag = false;
let mobileMenuOpen = false;
let dropdownOpen = false;
let dropdownClick = false;
let globalMuteState = false;
let globalPlayState = true;
const lottieAnimations = [
  "https://uploads-ssl.webflow.com/659f15a242e58eb40c8cf14b/65cdf88239dc5b5eeb090c11_Leaf%2003.json",
  "https://uploads-ssl.webflow.com/659f15a242e58eb40c8cf14b/65cdf882765a69af7c1dee90_Leaf%2002.json",
  "https://uploads-ssl.webflow.com/659f15a242e58eb40c8cf14b/65cdf882218339a1bb49c9f5_Leaf%2001.json",
];
const cardWrapTimelines = new Map();
let splitLetters;
let splitLines;
let splitWords;
let resizeTimer;
let previousWindowWidth = window.innerWidth;

function handleResize() {
  const currentWindowWidth = window.innerWidth;
  if (currentWindowWidth !== previousWindowWidth) {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      window.location.reload();
      previousWindowWidth = window.innerWidth;
    }, 250);
  }
}
window.addEventListener("resize", handleResize);
function supportsTouch() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
function prefersReducedMotion() {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  return query.matches;
}

//
// GENERAL
function playLottieAnimationsStaggered(animations, staggerTime) {
  animations.forEach((animation, index) => {
    gsap.delayedCall(staggerTime * index, () => animation.play());
  });
}
function resetLottieAnimations(animations) {
  animations.forEach((animation) => {
    animation.goToAndStop(0, true);
  });
}
function initBurgerMenu() {
  let wrap = document.querySelector(".menu-w");
  let bg = wrap.querySelector(".menu-bg");
  let button = document.querySelector(".menu-button");
  let lineTop = document.querySelector(".menu-button__line.is--top");
  let lineCenter = document.querySelector(".menu-button__line.is--center");
  let lineBottom = document.querySelector(".menu-button__line.is--btm");
  let logo = document.querySelector(".nav-logo");
  let logoPaths = document.querySelectorAll(".logo-path");
  let navButton = document.querySelector(".nav-button.is--primary");
  let menuFade = wrap.querySelectorAll("[data-menu-fade]");
  let linkColumns = wrap.querySelectorAll(".footer-col");
  let menuLinks = wrap.querySelectorAll("[data-menu-link]");

  let logoColor;

  if (window.innerWidth < 768) {
    gsap.set(logoPaths, { scale: 0 });
  }

  const openMenu = () => {
    mobileMenuOpen = true;
    logoColor = logo.style.color;
    let tl = gsap.timeline({
      defaults: {
        duration: 0.5,
        ease: "back.out(3)",
        overwrite: true,
      },
    });
    tl.set(wrap, { display: "flex" })
      .fromTo(
        bg,
        {
          scaleY: 0,
          borderRadius: "0vw 0vw 100vw 100vw",
        },
        {
          scaleY: 1,
          borderRadius: "0vw 0vw 0vw 0vw",
          ease: "expo.inOut",
          duration: 1,
        }
      )
      .to(
        logo,
        {
          color: "black",
        },
        0
      )
      .fromTo(
        logoPaths,
        {
          scale: 0,
          rotate: () => Math.random() * 24 - 12,
        },
        {
          scale: 1,
          rotate: 0,
          stagger: 0.015,
          ease: "back.out(3)",
        },
        0.4
      )
      .to(
        navButton,
        {
          autoAlpha: 0,
          yPercent: -50,
        },
        0
      )
      .to(button, { color: "black" }, 0)
      .to(lineCenter, { scaleX: 0, ease: "power3.out" }, 0)
      .to(lineTop, { rotate: 135, y: 4, ease: "back.out(3)" }, 0)
      .to(lineBottom, { rotate: -135, y: -4, ease: "back.out(3)" }, 0)
      .fromTo(
        menuLinks,
        {
          yPercent: 50,
          autoAlpha: 0,
        },
        {
          yPercent: 0,
          autoAlpha: 1,
          stagger: 0.05,
        },
        0.6
      )
      .fromTo(
        menuFade,
        {
          yPercent: 50,
          autoAlpha: 0,
        },
        {
          yPercent: 0,
          autoAlpha: 1,
          stagger: 0.025,
        },
        "<"
      );
  };

  closeMenu = () => {
    mobileMenuOpen = false;
    let tl = gsap.timeline({
      defaults: {
        duration: 0.5,
        ease: "power3.out",
        overwrite: true,
      },
    });
    tl.to(menuLinks, {
      yPercent: 50,
      autoAlpha: 0,
      stagger: { each: 0.05, from: "end" },
    })
      .to(
        menuFade,
        {
          yPercent: 50,
          autoAlpha: 0,
          stagger: { each: 0.025, from: "end" },
        },
        "<"
      )
      .to(button, { color: logoColor }, 0)
      .to(lineCenter, { scaleX: 1, ease: "power3.out" }, 0)
      .to(lineTop, { rotate: 0, y: 0, ease: "back.out(2)" }, 0)
      .to(lineBottom, { rotate: 0, y: 0, ease: "back.out(2)" }, 0)
      .to(
        bg,
        {
          scaleY: 0,
          borderRadius: "0vw 0vw 100vw 100vw",
          ease: "expo.inOut",
          duration: 0.8,
        },
        0
      )
      .to(
        logo,
        {
          color: logoColor,
        },
        0.5
      )
      .to(
        logoPaths,
        {
          scale: 0,
          rotate: () => Math.random() * 24 - 12,
          stagger: { each: 0.015, from: "end" },
          ease: "power3.out",
        },
        0
      )
      .to(
        navButton,
        {
          autoAlpha: 1,
          yPercent: 0,
        },
        "<"
      )
      .set(wrap, { display: "none" });
  };

  button.addEventListener("click", () => {
    mobileMenuOpen ? closeMenu() : openMenu();
  });
}
function initNavScroll() {
  const navFadeElements = document.querySelectorAll("[data-nav-fade]");
  let lastScrollTop = 0;
  const buffer = 25;

  let ddToggle = document.querySelector(".dd-toggle");
  if (!dropdownClick) {
    ddToggle.addEventListener("click", function () {
      dropdownOpen = !dropdownOpen;
    });
  }

  window.addEventListener(
    "scroll",
    () => {
      let scrollTop = window.scrollY || document.documentElement.scrollTop;

      if (Math.abs(scrollTop - lastScrollTop) > buffer) {
        if (dropdownOpen) {
          ddToggle.click();
        }
        if (scrollTop > lastScrollTop) {
          gsap.to(navFadeElements, {
            autoAlpha: 0,
            y: "-75%",
            stagger: 0.05,
            ease: "power3",
            overwrite: "auto",
          });
        } else {
          gsap.to(navFadeElements, {
            autoAlpha: 1,
            y: "0%",
            stagger: 0.05,
            ease: "power3",
            overwrite: "auto",
            stagger: {
              each: 0.03,
              from: "end",
            },
          });
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
      }
    },
    { passive: true }
  );
}
function initDocumentClick() {
  if (generalFlag === true) return;

  let ddLinks = document.querySelectorAll(".dd-link");
  let ddButton = document.querySelector(".dd-toggle");
  ddLinks.forEach((link) => {
    link.addEventListener("click", function () {
      ddButton.click();
    });
  });

  document.addEventListener("click", function (event) {
    generalFlag = true;
    if (event.target.classList.contains("lottie-player")) return;

    const randomIndex = Math.floor(Math.random() * lottieAnimations.length);
    const selectedAnimation = lottieAnimations[randomIndex];

    const lottieContainer = document.createElement("div");
    lottieContainer.style.position = "absolute";
    lottieContainer.style.width = "180px";
    lottieContainer.style.height = "180px";
    lottieContainer.style.left = event.pageX - 90 + "px";
    lottieContainer.style.top = event.pageY - 90 + "px";
    lottieContainer.style.zIndex = "9999";
    lottieContainer.style.pointerEvents = "none";

    const randomRotation = Math.floor(Math.random() * 360);
    lottieContainer.style.transform = `rotate(${randomRotation}deg)`;

    document.body.appendChild(lottieContainer);

    const animation = lottie.loadAnimation({
      container: lottieContainer,
      renderer: "svg",
      loop: false,
      autoplay: true,
      path: selectedAnimation,
    });
    animation.addEventListener("complete", function () {
      lottieContainer.remove();
    });
  });
}
function initCursorAndButtons(container) {
  if (generalFlag === false) {
    container = document.querySelector("body");
  }
  let follower = document.querySelector(".cursor-item");
  if (!follower) return;
  let targetX = 0,
    targetY = 0;
  let currentX = 0,
    currentY = 0;
  let velocityX = 0,
    velocityY = 0;
  let lastY = 0;
  let rotation = 0;

  function lerp(start, end, factor) {
    return (1 - factor) * start + factor * end;
  }

  const stiffness = 0.1;
  const damping = 0.55;
  const rotationSensitivity = 0.1;

  function animate() {
    let dx = targetX - currentX;
    let dy = targetY - currentY;

    // Calculate velocity
    velocityX += dx * stiffness;
    velocityY += dy * stiffness;

    // Apply damping
    velocityX *= damping;
    velocityY *= damping;

    // Update current position
    currentX += velocityX;
    currentY += velocityY;

    let speedY = targetY - lastY;

    if (Math.abs(speedY) > 0.2) {
      rotation = Math.max(
        Math.min(rotation + speedY * (rotationSensitivity * -1), 90),
        -90
      );
    } else {
      rotation = lerp(rotation, 0, 0.06);
    }

    follower.style.transform = `translate(${currentX}px, ${currentY}px) rotate(${rotation}deg)`;

    lastY = targetY;

    requestAnimationFrame(animate);
  }
  animate();

  document.addEventListener("mousemove", (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
  });

  document.querySelectorAll("[data-cursor]").forEach((element) => {
    element.addEventListener("mouseenter", function () {
      const cursorWrapper = document.querySelector(".cursor-item");
      if (cursorWrapper) {
        cursorWrapper.style.display = "flex";
      }
      const cursorText = this.getAttribute("data-cursor");
      if (cursorText) {
        const cursorTextElement = document.querySelector("[data-cursor-text]");
        if (cursorTextElement) {
          cursorTextElement.textContent = cursorText;
        }
      }
    });

    element.addEventListener("mouseleave", function () {
      const cursorWrapper = document.querySelector(".cursor-item");
      if (cursorWrapper) {
        cursorWrapper.style.display = "";
      }
    });
  });
  //
  //
  //
  //
  //
  function setPositionAndTransform(container, position) {
    switch (position) {
      case "top-left":
        container.style.left = "0px";
        container.style.top = "0px";
        container.style.transform = "translate(-50%, -50%)";
        break;
      case "top-right":
        container.style.right = "0px";
        container.style.top = "0px";
        container.style.transform = "translate(50%, -50%)";
        break;
      case "bottom-left":
        container.style.left = "0px";
        container.style.bottom = "0px";
        container.style.transform = "translate(-50%, 50%)";
        break;
      case "bottom-right":
        container.style.right = "0px";
        container.style.bottom = "0px";
        container.style.transform = "translate(50%, 50%)";
        break;
    }
  }

  container.querySelectorAll(".button").forEach((button) => {
    if (prefersReducedMotion()) return;
    button.addEventListener("mouseenter", function () {
      const parentDiv = button.parentElement;
      const buttonSize = button.getBoundingClientRect();
      const numberOfAnimations = Math.floor(Math.random() * 2) + 1;

      for (let i = 0; i < numberOfAnimations; i++) {
        const lottieContainer = document.createElement("div");
        lottieContainer.style.position = "absolute";
        lottieContainer.style.width = "120px";
        lottieContainer.style.height = "120px";
        lottieContainer.style.pointerEvents = "none";

        const randomIndex = Math.floor(Math.random() * lottieAnimations.length);
        const selectedAnimation = lottieAnimations[randomIndex];

        const positions = [
          "top-left",
          "top-right",
          "bottom-left",
          "bottom-right",
        ];
        const selectedPosition =
          positions[Math.floor(Math.random() * positions.length)];

        setPositionAndTransform(lottieContainer, selectedPosition);
        parentDiv.appendChild(lottieContainer);

        const animation = lottie.loadAnimation({
          container: lottieContainer,
          renderer: "svg",
          loop: false,
          autoplay: true,
          path: selectedAnimation,
        });

        let tl = gsap.timeline({});

        tl.to(button, {
          scale: 0.95,
          duration: 0.25,
        }).to(button, {
          scale: 1,
          duration: 0.45,
          ease: "back.out(5)",
        });

        animation.addEventListener("complete", () => {
          lottieContainer.remove();
        });
      }
    });
  });
}
function initToolTips() {
  const wrappers = document.querySelectorAll(".tooltip-w");
  if (!wrappers) return;

  wrappers.forEach((wrapper) => {
    wrapper.addEventListener("mouseenter", () => {
      const tooltip = wrapper.querySelector(".tooltip");
      if (tooltip) {
        tooltip.classList.add("active");
        tooltip.parentElement.style.zIndex = 4;
      }
    });

    wrapper.addEventListener("mouseleave", () => {
      const tooltip = wrapper.querySelector(".tooltip");
      if (tooltip) {
        tooltip.classList.remove("active");
        tooltip.parentElement.style.zIndex = 3;
      }
    });
  });
}
function initHomeVideo() {
  let target;
  if (isMobile) {
    target = document.querySelector("#hero-vid-mobile");
  } else {
    target = document.querySelector("#hero-vid-desktop");
  }
  if (!target) return;
  setupTextTransitions(target, timestamps);
}
function setupTextTransitions(videoSelector, timestamps) {
  const video = videoSelector;
  const texts = document.querySelectorAll("[data-home-sub] p");
  const duration = 0.4;
  let lastTime = 0;
  let currentIndex = 0;

  gsap.set(texts, { autoAlpha: 0 });
  gsap.to(texts[0].querySelectorAll(".word"), {
    autoAlpha: 1,
    y: "0em",
    stagger: 0.01,
    duration: duration,
    ease: "back.out(1)",
    onComplete: () => gsap.set(texts[0], { autoAlpha: 1 }),
  });

  video.addEventListener("timeupdate", () => {
    const currentTime = video.currentTime;

    if (currentTime < lastTime) {
      transitionTexts(currentIndex, 0);
      currentIndex = 0;
    } else {
      const nextIndex = timestamps.findIndex(
        (time, index) => currentTime >= time && index > currentIndex
      );

      if (nextIndex !== -1 && nextIndex !== currentIndex) {
        transitionTexts(currentIndex, nextIndex);
        currentIndex = nextIndex;
      }
    }

    lastTime = currentTime;
  });

  function transitionTexts(fromIndex, toIndex) {
    gsap.fromTo(
      texts[fromIndex].querySelectorAll(".word"),
      {
        autoAlpha: 1,
        y: "0em",
      },
      {
        autoAlpha: 0,
        y: "-1em",
        stagger: prefersReducedMotion() ? 0 : 0.025,
        duration: duration,
        ease: "power3.out",
        onComplete: () => {
          //gsap.set(texts[fromIndex], { autoAlpha: 0, y: "1em" });
          gsap.set(texts[fromIndex].querySelectorAll(".word"), {
            autoAlpha: 0,
            y: "1em",
          });
        },
      }
    );
    gsap.fromTo(
      texts[toIndex].querySelectorAll(".word"),
      { y: "1em", autoAlpha: 0 },
      {
        y: "0em",
        autoAlpha: 1,
        stagger: prefersReducedMotion() ? 0 : 0.025,
        delay: 0.1,
        duration: duration,
        ease: "back.out(1.5)",
        onStart: () => gsap.set(texts[toIndex], { autoAlpha: 1 }),
      }
    );
  }
}
function controlTimeline(cardWrapSelector, action) {
  const cardWrap = document.querySelector(cardWrapSelector);
  const timeline = cardWrap ? cardWrapTimelines.get(cardWrap) : null;

  if (timeline) {
    if (action === "play") {
      timeline.play();
    } else if (action === "reverse") {
      timeline.reverse();
    }
  }
}
function initSplitText(container) {
  if (!container) {
    container = document.querySelector('[data-barba="container"]');
  }
  function runSplit() {
    splitLetters = new SplitType("[data-split-letters]", {
      types: "words, chars",
    });
    splitLines = new SplitType("[data-split-lines]", {
      types: "lines",
    });
    splitWords = new SplitType("[data-split-words]", {
      types: "lines words",
    });
  }
  runSplit();

  // ————— Update on window resize
  let windowWidth = $(window).innerWidth();
  window.addEventListener("resize", function () {
    if (windowWidth !== $(window).innerWidth()) {
      windowWidth = $(window).innerWidth();
      splitLetters.revert();
      splitLines.revert();
      splitWords.revert();
      runSplit();
    }
  });
}
function initHeadlines(container) {
  if (!container) {
    container = document.querySelector('[data-barba="container"]');
  }
  function createScrollTrigger(triggerElement, timeline) {
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top bottom",
      onLeaveBack: () => {
        timeline.progress(0);
        timeline.pause();
      },
    });
    ScrollTrigger.create({
      trigger: triggerElement,
      start: "top 80%",
      onEnter: () => {
        timeline.play();
        //ScrollTrigger.refresh();
      },
    });
  }

  document
    .querySelectorAll("[lines-slide-up]")
    .forEach(function (element, index) {
      let tl = gsap.timeline({ paused: true });
      tl.fromTo(
        element.querySelectorAll(".line"),
        { opacity: 0, yPercent: 50, rotate: 3 },
        {
          opacity: 1,
          rotate: 0,
          yPercent: 0,
          duration: 0.5,
          ease: "back.out(3)",
          stagger: { amount: 0.25 },
        }
      );
      createScrollTrigger(element, tl);
    });

  let faqItems = container.querySelectorAll(".faq-item");
  if (!faqItems) return;

  faqItems.forEach(function (element, index) {
    let tl = gsap.timeline({ paused: true });
    tl.fromTo(
      element,
      { opacity: 0, yPercent: 50, rotate: 3 },
      {
        opacity: 1,
        rotate: 0,
        yPercent: 0,
        duration: 0.5,
        ease: "back.out(3)",
      }
    );
    createScrollTrigger(element, tl);
  });
}
function initVideoControls(container) {
  if (!container) {
    container = document.querySelector('[data-barba="container"]');
  }
  const videoContainers = container.querySelectorAll("[data-video-controls]");
  const playButton = container.querySelectorAll(".play-button-icon");
  const soundButton = container.querySelectorAll(".sound-button-icon");

  if (!globalPlayState) {
    playButton.forEach((button) => {
      button.classList.add("active");
    });
  }
  if (!globalMuteState) {
    soundButton.forEach((button) => {
      button.classList.add("muted");
    });
  }

  videoContainers.forEach((container) => {
    const video = container.querySelector("video");
    const autoplay = container.getAttribute("data-video-controls");

    if (!autoplay) {
      video.addEventListener("click", () => {
        if (video.paused) {
          video.play();
          playButton.forEach((button) => {
            button.classList.remove("active");
          });
          globalPlayState = true;
        } else {
          video.pause();
          playButton.forEach((button) => {
            button.classList.add("active");
          });
          globalPlayState = false;
        }
      });
    }

    soundButton.forEach((button) => {
      button.addEventListener("click", () => {
        video.muted = !video.muted;
        globalMuteState = video.muted;
        soundButton.forEach((button) => {
          button.classList.toggle("muted");
        });
      });
    });
  });
}

//
//
//HOME
function initMobileSliders() {
  const guidesMobile = new Swiper(".g-card__wrap.swiper", {
    slidesPerView: "auto",
    spaceBetween: 0,
    centeredSlides: true,
    speed: 800,
    init: true,
    initialSlide: 2,
    breakpoints: {
      768: {
        init: false,
      },
    },
  });
  const guideNav = document.querySelectorAll(".g-nav__item");
  guideNav[2].classList.add("active");

  guideNav.forEach((item, index) => {
    item.addEventListener("click", function () {
      guideNav.forEach((nav) => nav.classList.remove("active"));
      this.classList.add("active");
      guidesMobile.slideTo(index);
    });
  });

  function playActiveVid(image, video) {
    gsap.to(image, {
      opacity: 0,
      duration: 0.3,
      ease: "power1.inOut",
    });
    gsap.to(video, {
      opacity: 1,
      duration: 0.3,
      ease: "power1.inOut",
      onComplete: () => {
        video.play();
      },
    });
  }
  function pausePreviousVid(image, video) {
    gsap.to(image, {
      opacity: 1,
      duration: 0.3,
      ease: "power1.inOut",
    });
    gsap.to(video, {
      opacity: 0,
      duration: 0.3,
      ease: "power1.inOut",
      onComplete: () => {
        video.pause();
      },
    });
  }

  var activeGuide = document.querySelector(".g-card.swiper-slide-active");
  var guideImg = activeGuide.querySelector("img");
  var guideVid = activeGuide.querySelector("video");
  playActiveVid(guideImg, guideVid);

  guidesMobile.on("beforeSlideChangeStart", function () {
    var activeSlide = document.querySelector(".g-card.swiper-slide-active");
    var activeImg = activeSlide.querySelector("img");
    var activeVid = activeSlide.querySelector("video");
    pausePreviousVid(activeImg, activeVid);
  });
  guidesMobile.on("slideChangeTransitionEnd", function () {
    guideNav.forEach((nav) => nav.classList.remove("active"));
    const activeIndex = guidesMobile.activeIndex;
    guideNav[activeIndex].classList.add("active");

    var activeSlide = document.querySelector(".g-card.swiper-slide-active");
    var activeImg = activeSlide.querySelector("img");
    var activeVid = activeSlide.querySelector("video");
    playActiveVid(activeImg, activeVid);
  });

  const membersMobile = new Swiper(".t-card__wrap", {
    slidesPerView: "auto",
    spaceBetween: 0,
    centeredSlides: true,
    speed: 800,
    init: true,
    initialSlide: 2,
    breakpoints: {
      768: {
        init: false,
      },
    },
  });
  var activeMember = document.querySelector(".t-card.swiper-slide-active");
  var memberImg = activeMember.querySelector("img");
  var memberVid = activeMember.querySelector("video");
  playActiveVid(memberImg, memberVid);

  membersMobile.on("beforeSlideChangeStart", function () {
    var activeMember = document.querySelector(".t-card.swiper-slide-active");
    var memberImg = activeMember.querySelector("img");
    var memberVid = activeMember.querySelector("video");
    pausePreviousVid(memberImg, memberVid);
  });
  membersMobile.on("slideChangeTransitionEnd", function () {
    var activeMember = document.querySelector(".t-card.swiper-slide-active");
    var memberImg = activeMember.querySelector("img");
    var memberVid = activeMember.querySelector("video");
    playActiveVid(memberImg, memberVid);
  });
}
function initNavToggle() {
  const navToggleEl = document.querySelector("[data-nav-toggle]");
  if (navToggleEl) {
    ScrollTrigger.create({
      trigger: navToggleEl,
      start: "top top",
      onEnter: () => {
        navW.setAttribute("theme", "dark");
      },
      onLeaveBack: () => {
        navW.setAttribute("theme", "light");
      },
    });
  }
}
function initHomeHero(next) {
  if (prefersReducedMotion()) return;
  if (!next) {
    next = document.querySelector('[data-barba="container"]');
  }
  let isIllustrated;
  let fern;
  let orange;
  if (next.querySelector(".full-hero__bg")) {
    isIllustrated = true;
  }
  let triggerElement = next.querySelector('[data-home-hero="trigger"]');
  let bgElement = triggerElement.querySelector('[data-home-hero="bg"]');
  if (isIllustrated) {
    fern = next.querySelector(".full-hero__fern");
    orange = next.querySelector(".full-hero__orange");
  }
  let tl = gsap
    .timeline({
      scrollTrigger: {
        trigger: triggerElement,
        start: isMobile ? "bottom 85%" : "bottom bottom",
        end: "bottom center",
        scrub: true,
      },
    })
    .to(triggerElement, { scale: 0.95 }, 0)
    .from(
      bgElement,
      {
        borderRadius: "0rem, 0rem, 0rem, 0rem",
      },
      0
    );

  tl.to(fern, { yPercent: -5, xPercent: -5 }, 0).to(orange, { yPercent: 5 }, 0);
}
function initGuidesOverlay(next) {
  if (!next) {
    next = document.querySelector('[data-barba="container"]');
  }
  const overlayOpenTriggers = next.querySelectorAll("[data-overlay-open]");
  const overlayWrapper = next.querySelector(".overlay-w");
  const overlayItems = next.querySelectorAll(".overlay-item");
  const overlayCloseTrigger = next.querySelectorAll("[data-overlay-close]");
  const overlayCta = next.querySelector("[data-overlay-cta]");
  const overlayNextButton = next.querySelector("[data-overlay-next]");
  const overlayPrevButton = next.querySelector("[data-overlay-prev]");
  const fade = next.querySelectorAll("[data-overlay-fade]");
  const tags = next.querySelectorAll("[data-overlay-tag]");

  gsap.set(".overlay-inner", { yPercent: 20, opacity: 0 });

  overlayOpenTriggers.forEach((trigger, index) => {
    trigger.addEventListener("click", () => {
      gsap
        .timeline()
        .set(overlayWrapper, { display: "flex" })
        .fromTo(".overlay-bg", { opacity: 0 }, { opacity: 1, duration: 0.4 })
        .fromTo(
          ".overlay-inner",
          { yPercent: 20, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.6, ease: "back.out(2)" },
          "<"
        )
        .fromTo(
          fade,
          {
            opacity: 0,
            y: "1rem",
          },
          {
            opacity: 1,
            y: "0rem",
            stagger: 0.05,
            duration: 0.45,
          },
          "<+=0.1"
        )
        .fromTo(
          tags,
          {
            opacity: 0,
            y: "1rem",
          },
          {
            opacity: 1,
            y: "0rem",
            stagger: 0.05,
            duration: 0.45,
            ease: "back.out(2)",
          },
          "<"
        );

      if (index > 5) {
        index = index - 6;
      }
      const prevIndex = index === 0 ? overlayItems.length - 1 : index - 1;
      const nextIndex = index === overlayItems.length - 1 ? 0 : index + 1;

      const activeItem = overlayItems[index];
      const prevItemName =
        overlayItems[prevIndex].getAttribute("data-overlay-name");
      const nextItemName =
        overlayItems[nextIndex].getAttribute("data-overlay-name");

      const overlayPrevNameElement = next.querySelector(
        "[data-overlay-prev-name]"
      );
      const overlayNextNameElement = next.querySelector(
        "[data-overlay-next-name]"
      );

      const video = activeItem.querySelector("video");
      if (globalPlayState) {
        video.muted = globalMuteState;
        video.play();
      }

      overlayItems.forEach((item) => item.classList.remove("is--active"));
      activeItem.classList.add("is--active");
      const overlayName = activeItem.getAttribute("data-overlay-name");
      //overlayCta.textContent = overlayName;

      if (overlayPrevNameElement)
        overlayPrevNameElement.textContent = prevItemName;
      if (overlayNextNameElement)
        overlayNextNameElement.textContent = nextItemName;
    });
  });

  overlayCloseTrigger.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      overlayItems.forEach((item) => {
        let video = item.querySelector("video");
        video.pause();
      });
      gsap
        .timeline()
        .fromTo(
          ".overlay-bg",
          { opacity: 1 },
          { opacity: 0, duration: 0.3, ease: "power3" }
        )
        .fromTo(
          ".overlay-inner",
          { yPercent: 0, opacity: 1 },
          { yPercent: 10, opacity: 0, duration: 0.3, ease: "power3" },
          0
        )
        .set(overlayWrapper, { display: "none" })
        .then(() => {
          overlayItems.forEach((item) => {
            item.classList.remove("is--active");
            gsap.set(item, { opacity: 0, xPercent: 0, clearProps: "all" });
          });
        });
    });
  });

  //
  //

  function updateActiveItem(newIndex, direction) {
    const currentActiveIndex = Array.from(overlayItems).findIndex((item) =>
      item.classList.contains("is--active")
    );
    const newActiveItem = overlayItems[newIndex];
    const currentActiveItem = overlayItems[currentActiveIndex];
    const yMovement = direction === "next" ? -1 : 1;

    let currentVideo = currentActiveItem.querySelector("video");
    let newVideo = newActiveItem.querySelector("video");

    currentVideo.pause();

    const tlOut = gsap.timeline({
      onComplete: () => {
        if (currentActiveItem) {
          currentActiveItem.classList.remove("is--active");
        }
        newActiveItem.classList.add("is--active");
        animateInNewActiveItem();
      },
    });

    if (currentActiveItem) {
      tlOut.to(
        currentActiveItem.querySelectorAll("[data-overlay-fade]"),
        {
          opacity: 0,
          y: `${yMovement}rem`,
          stagger: 0.05,
          duration: 0.3,
          ease: "power3",
        },
        "<"
      );
      tlOut.to(
        currentActiveItem.querySelectorAll("[data-overlay-tag]"),
        {
          opacity: 0,
          y: `${yMovement}rem`,
          stagger: 0.1,
          duration: 0.3,
          ease: "power3",
        },
        "<"
      );
    }

    function animateInNewActiveItem() {
      if (globalPlayState) {
        newVideo.muted = globalMuteState;
        newVideo.play();
      }
      const yInitialMovement = direction === "next" ? "1rem" : "-1rem";
      const tlIn = gsap.timeline({
        onStart: () => {
          const overlayName = newActiveItem.getAttribute("data-overlay-name");
          //overlayCta.textContent = overlayName;
          updateAdjacentNames(newIndex);
        },
      });
      tlIn
        .fromTo(
          newActiveItem.querySelectorAll("[data-overlay-fade]"),
          {
            opacity: 0,
            y: yInitialMovement,
          },
          {
            opacity: 1,
            y: "0rem",
            stagger: 0.05,
            duration: 0.45,
          }
        )
        .fromTo(
          newActiveItem.querySelectorAll("[data-overlay-tag]"),
          {
            opacity: 0,
            y: yInitialMovement,
          },
          {
            opacity: 1,
            y: "0rem",
            stagger: 0.05,
            duration: 0.45,
            ease: "back.out(2)",
          },
          "<"
        );
    }

    // Function to update previous and next names
    function updateAdjacentNames(activeIndex) {
      const prevIndex =
        activeIndex === 0 ? overlayItems.length - 1 : activeIndex - 1;
      const nextIndex =
        activeIndex === overlayItems.length - 1 ? 0 : activeIndex + 1;
      const prevItemName =
        overlayItems[prevIndex].getAttribute("data-overlay-name");
      const nextItemName =
        overlayItems[nextIndex].getAttribute("data-overlay-name");
      document.querySelector("[data-overlay-prev-name]").textContent =
        prevItemName;
      document.querySelector("[data-overlay-next-name]").textContent =
        nextItemName;
    }
  }

  overlayNextButton.addEventListener("click", () => {
    let currentIndex = Array.from(overlayItems).findIndex((item) =>
      item.classList.contains("is--active")
    );
    let newIndex =
      currentIndex === overlayItems.length - 1 ? 0 : currentIndex + 1;
    updateActiveItem(newIndex, "next");
  });

  overlayPrevButton.addEventListener("click", () => {
    let currentIndex = Array.from(overlayItems).findIndex((item) =>
      item.classList.contains("is--active")
    );
    let newIndex =
      currentIndex === 0 ? overlayItems.length - 1 : currentIndex - 1;
    updateActiveItem(newIndex, "prev");
  });
}
function initMemberStories() {
  document.querySelectorAll("[data-modal-open]").forEach((element) => {
    element.addEventListener("click", function () {
      const videoSrc = this.getAttribute("data-video-src");
      openVideoModal(videoSrc);
    });
  });

  function openVideoModal(videoSrc) {
    const tl = gsap.timeline();
    tl.set(".modal-w", { display: "flex" })
      .fromTo(
        ".modal-bg",
        { filter: "blur(0px)", opacity: 0 },
        {
          filter: "blur(4px)",
          opacity: 1,
          duration: 0.6,
          ease: "power3.out",
        }
      )
      .fromTo(
        ".modal-inner",
        {
          opacity: 0,
          yPercent: 5,
        },
        {
          opacity: 1,
          yPercent: 0,
          duration: 0.6,
          ease: "power3.out",
        },
        0
      );

    const videoElement = document.querySelector(".modal-w video");
    if (videoElement.getAttribute("src") !== videoSrc) {
      videoElement.src = videoSrc;
      videoElement.load();
      if (!globalPlayState) {
        videoElement.oncanplay = () => {
          videoElement.pause();
        };
      }
    } else {
      if (globalPlayState) {
        videoElement.muted = globalMuteState;
        videoElement.play();
      }
    }
    if (globalPlayState) {
      videoElement.oncanplay = () => {
        videoElement.muted = globalMuteState;
        videoElement.play();
      };
    }

    document.querySelectorAll("[data-modal-close]").forEach((closeElement) => {
      closeElement.addEventListener("click", function () {
        videoElement.pause();
        gsap.to(".modal-bg", {
          filter: "blur(0px)",
          duration: 0.5,
          opacity: 0,
          onComplete: () => {
            gsap.set(".modal-w", { display: "none" });
          },
        });
        gsap.to(".modal-inner", {
          opacity: 0,
          yPercent: 5,
          duration: 0.5,
          ease: "power3.out",
        });
      });
    });
  }
}
function initGoalsScroll(next) {
  if (prefersReducedMotion()) return;
  next = next || document;
  let wrap = next.querySelector(".goals-wrap");
  let cards = wrap.querySelectorAll(".goals-card");
  gsap
    .timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    })
    .from(cards, {
      bottom: "40%",
      left: "42%",
      ease: "back.out(2.5)",
      duration: 1,
      stagger: { each: 0.05, from: "end" },
      rotate: () => Math.random() * 24 - 12,
    });
}
function initGuidesCollage(next) {
  if (prefersReducedMotion()) return;
  next = next || document;
  let wrap = next.querySelector(".guides-collage");
  if (!wrap) return;
  let cards = wrap.querySelectorAll(".g-card");
  gsap
    .timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    })
    .from(cards, {
      top: "30%",
      left: "42%",
      ease: "back.out(2)",
      duration: 0.8,
      stagger: { each: 0.05, from: "end" },
      rotate: () => Math.random() * 24 - 12,
    });
}
function initHomeIntro() {
  //if (isMobile) return;
  let introText = document.querySelector("[data-intro-text]");
  if (!introText) return;
  let introSpacerTop = introText.querySelector(".intro-spacer.is--top");
  let introSpacerBottom = introText.querySelector(".intro-spacer.is--bottom");
  let introImageTop = document.querySelector(".intro-image__top");
  let introImageBottom = document.querySelector(".intro-image__bottom");
  let lottieTop = introImageTop.querySelector("[data-lottie]");
  let lottieBottom = introImageBottom.querySelector("[data-lottie]");

  let animationTop = lottie.loadAnimation({
    container: lottieTop,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: lottieTop.getAttribute("data-lottie-path"),
  });

  let animationBottom = lottie.loadAnimation({
    container: lottieBottom,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: lottieBottom.getAttribute("data-lottie-path"),
  });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: introText,
        start: "bottom bottom",
        toggleActions: "play none none reverse",
      },
      onReverseComplete: () => {
        animationTop.goToAndStop(0, true);
        animationBottom.goToAndStop(0, true);
      },
      defaults: { ease: "expo.inOut", duration: 1 },
    })
    .fromTo(
      introSpacerBottom,
      { width: isDesktop ? "0.5em" : "0em" },
      { width: isDesktop ? "2.8em" : "0em", duration: 1 },
      0
    )
    .fromTo(
      introSpacerTop,
      { width: isDesktop ? "0.5em" : "0em" },
      { width: isDesktop ? "2em" : "0em", duration: 1 },
      0
    )
    .from(
      introImageTop,
      {
        rotate: 15,
        scale: 0,
        onStart: () => {
          gsap.delayedCall(0.5, () => {
            animationTop.play();
          });
        },
      },
      0
    )
    .from(
      introImageBottom,
      {
        rotate: -10,
        scale: 0,
        onStart: () => {
          gsap.delayedCall(0.5, () => {
            animationBottom.play();
          });
        },
      },
      0.1
    );
}
function initBushCTA(next) {
  next = next || document;
  if (isMobile) return;
  let wrap = next.querySelector(".bush-cta");
  if (!wrap) return;
  let cardLeft = wrap.querySelector(".bush-cta__card.is--left");
  let cardRight = wrap.querySelector(".bush-cta__card.is--right");
  let butterflyLeft = wrap.querySelector(".bush-cta__butterfly.is--left");
  let butterflyRight = wrap.querySelector(".bush-cta__butterfly.is--right");
  let anim = wrap.querySelector("[data-lottie]");

  let animation = lottie.loadAnimation({
    container: anim,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: anim.getAttribute("data-lottie-path"),
  });

  const scrollTl = gsap.timeline({
    scrollTrigger: {
      trigger: wrap,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
    },
    defaults: { ease: "linear", duration: 1 },
  });
  scrollTl
    .fromTo(
      butterflyLeft,
      { y: "5em", xPercent: -100 },
      { y: "-1em", xPercent: 25 }
    )
    .fromTo(
      butterflyRight,
      { y: "10em", xPercent: 100 },
      { y: "-4em", xPercent: -100 },
      "<"
    );

  const introTl = gsap.timeline({
    scrollTrigger: {
      trigger: wrap,
      start: "center bottom",
      toggleActions: "play none none reverse",
    },
    defaults: { ease: "back.out(1.8)", duration: 0.6 },
    onStart: () => {
      gsap.delayedCall(0.5, () => {
        animation.play();
      });
    },
    onReverseComplete: () => {
      animation.goToAndStop(0, true);
    },
  });
  introTl
    .from(cardLeft, { scale: 0.85, rotate: 2, xPercent: 10 })
    .from(cardRight, { scale: 0.85, rotate: -2, xPercent: -10 }, "<");
}
function initHomeSliders(next) {
  next = next || document;
  let introSlider = next.querySelector(".swiper.is--intro__cards");
  let stepsSlider = next.querySelector(".swiper.is--steps__cards");
  if (introSlider) {
    const introSwiper = new Swiper(introSlider, {
      spaceBetween: 16,
      slidesPerView: "auto",
      centeredSlides: true,
      slideToClickedSlide: true,
      speed: 800,
      pagination: {
        el: ".pagination.is--intro__cards",
        type: "bullets",
      },
    });
    if (!isMobileLandscape) {
      introSwiper.destroy(true, true);
      lenis.resize();
      ScrollTrigger.refresh();
    }
  }
  if (stepsSlider) {
    const stepsSwiper = new Swiper(stepsSlider, {
      spaceBetween: 16,
      slidesPerView: "auto",
      centeredSlides: true,
      slideToClickedSlide: true,
      speed: 800,
      pagination: {
        el: ".pagination.is--steps__cards",
        type: "bullets",
      },
    });
    if (!isMobileLandscape) {
      stepsSwiper.destroy(true, true);
      lenis.resize();
      ScrollTrigger.refresh();
    }
  }
}
function initVideoOnHover() {
  if (supportsTouch()) {
    return;
  }
  let videoPlayTriggers = document.querySelectorAll("[data-video-hover]");
  if (!videoPlayTriggers) return;

  videoPlayTriggers.forEach((trigger) => {
    let image = trigger.querySelector("img");
    let video = trigger.querySelector("video");

    trigger.addEventListener("mouseenter", () => {
      gsap.to(image, {
        opacity: 0,
        duration: 0.2,
        ease: "power2",
      });
      gsap.to(video, {
        opacity: 1,
        duration: 0.2,
        ease: "power2",
        onComplete: () => {
          video.play();
        },
      });
    });
    trigger.addEventListener("mouseleave", () => {
      gsap.to(image, {
        opacity: 1,
        duration: 0.2,
        ease: "power2",
      });
      gsap.to(video, {
        opacity: 0,
        duration: 0.2,
        ease: "power2",
        onComplete: () => {
          video.pause();
        },
      });
    });
  });
}
function createCardWrapTimeline(cardWrap, rotation) {
  const tl = gsap.timeline({
    paused: true,
    defaults: {
      ease: CustomEase.create(
        "guides-bounce",
        "M0,0 C0.084,0.61 0.202,0.898 0.327,0.977 0.555,1.121 0.661,0.92 1,1 "
      ),
      duration: 1,
    },
  });

  tl.fromTo(
    cardWrap.querySelectorAll("[data-card]"),
    { yPercent: (i) => 50 + 10 * i, rotate: (i) => 2 * (i + 2) },
    {
      yPercent: 0,
      rotate: rotation ? (i) => Math.random() * 6 - 3 : 0,
      stagger: 0.075,
      overwrite: "true",
      onStart: () =>
        gsap.set(cardWrap.querySelectorAll("[data-card]"), {
          pointerEvents: "none",
        }),
      onComplete: () =>
        gsap.set(cardWrap.querySelectorAll("[data-card]"), {
          pointerEvents: "auto",
        }),
    }
  );

  return tl;
}
function initCardsIntro(next) {
  if (prefersReducedMotion()) return;
  next = next || document;
  const cardWraps = next.querySelectorAll("[data-cards-wrap]");

  cardWraps.forEach((cardWrap, index) => {
    const isStatic = cardWrap.getAttribute("data-cards-wrap") === "static";
    const rotation = !isStatic;
    const tl = createCardWrapTimeline(cardWrap, rotation);
    cardWrapTimelines.set(cardWrap, tl);

    ScrollTrigger.create({
      trigger: cardWrap,
      start: "top bottom-=15%",
      toggleActions: "play none none reverse",
      onEnter: () => tl.play(),
      onLeaveBack: () => tl.reverse(),
    });
  });
}
function initCardsHover() {
  const cards = document.querySelectorAll("[data-card]");
  cards.forEach((card) => {
    const originalZIndex = card.style.zIndex || 0;
    const isStatic = card.getAttribute("data-card") === "static";
    if (isStatic === true) return;
    const video = card.querySelector("video");
    const image = card.querySelector("img");

    card.addEventListener("mouseenter", () => {
      card.style.zIndex = 2;

      gsap.to(card, {
        scale: prefersReducedMotion() ? 1 : 1.15,
        rotate: prefersReducedMotion() ? 0 : Math.random() * 16 - 8,
        duration: 0.6,
        ease: CustomEase.create(
          "guides-bounce",
          "M0,0 C0.084,0.61 0.202,0.898 0.327,0.977 0.555,1.121 0.661,0.92 1,1 "
        ),
      });
      if (!supportsTouch()) {
        gsap.to(image, {
          opacity: 0,
          duration: 0.2,
          ease: "power2",
        });
        gsap.to(video, {
          opacity: 1,
          duration: 0.2,
          ease: "power2",
          onComplete: () => {
            video.play();
          },
        });
      }
    });

    card.addEventListener("mouseleave", () => {
      card.style.zIndex = originalZIndex;
      gsap.to(card, {
        scale: 1,
        rotate: prefersReducedMotion() ? 0 : Math.random() * 6 - 3,
        duration: 0.6,
        ease: CustomEase.create(
          "guides-bounce",
          "M0,0 C0.084,0.61 0.202,0.898 0.327,0.977 0.555,1.121 0.661,0.92 1,1 "
        ),
      });
      if (!supportsTouch()) {
        gsap.to(image, {
          opacity: 1,
          duration: 0.2,
          ease: "power2",
        });
        gsap.to(video, {
          opacity: 0,
          duration: 0.2,
          ease: "power2",
          onComplete: () => {
            video.pause();
          },
        });
      }
    });
  });
}
function initHomeParallax() {
  const trigger = document.querySelector('[data-parallax="trigger"]');
  const treeLeft = trigger.querySelector('[data-parallax="tree-left"]');
  const treeRight = trigger.querySelector('[data-parallax="tree-right"]');
  const people = trigger.querySelector('[data-parallax="people"]');
  const bLeft = trigger.querySelector('[data-parallax="b-left"]');
  const bRight = document.querySelector('[data-parallax="b-right"]');
  const bg = trigger.querySelector('[data-parallax="bg"]');

  const textWrapper = document.querySelector('[data-parallax="text"]');
  const heading = textWrapper.querySelector(".h-med");
  const paragraph = textWrapper.querySelector(".p-med");

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: trigger,
      start: "top 85%",
      end: "bottom center",
      scrub: true,
    },
    defaults: { ease: "linear", duration: 1 },
  });

  tl.to(treeRight, {
    yPercent: 24,
    duration: 1,
  })
    .to(
      treeLeft,
      {
        yPercent: 18,
        duration: 1,
      },
      0
    )
    .to(
      bLeft,
      {
        yPercent: -250,
        xPercent: -60,
        rotate: -3,
        duration: 1,
      },
      0
    )
    .to(
      bRight,
      {
        yPercent: -250,
        xPercent: 160,
        rotate: 4,
        duration: 1,
      },
      0
    )
    .from(
      textWrapper,
      {
        y: isMobileLandscape ? "-180vw" : "-120vw",
        duration: 0.7,
      },
      0.3
    )
    .fromTo(
      heading,
      {
        fontSize: isMobile ? "4em" : "10em",
      },
      {
        fontSize: isMobile ? "2em" : "3.25em",
        duration: 0.7,
      },
      "<"
    )
    .from(
      textWrapper,
      {
        color: "#fff",
        duration: 0.2,
      },
      0.8
    )
    .fromTo(
      heading,
      {
        lineHeight: "0.9",
      },
      {
        lineHeight: "1.1",
        duration: 0.2,
      },
      0.8
    )
    .from(
      paragraph,
      {
        opacity: 0,
        yPercent: 100,
        duration: 0.2,
      },
      0.8
    );
}
function initStackingNav() {
  const stackingCards = document.querySelectorAll(".stacking-card");
  if (!stackingCards) return;
  stackingCards.forEach((triggerElement, index) => {
    let targetElement = triggerElement.previousElementSibling;

    gsap
      .timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "top 65%",
          end: "top top",
          scrub: 1,
        },
      })
      .fromTo(
        targetElement,
        {
          scale: 1,
          filter: prefersReducedMotion() ? "blur(0px)" : "blur(0px)",
        },
        {
          scale: 0.85,
          filter: prefersReducedMotion() ? "blur(0px)" : "blur(8px)",
        }
      )
      .fromTo(
        triggerElement,
        { boxShadow: "0px 0px 0px 0px rgba(0, 0, 0, 0.02)" },
        { boxShadow: "0px -49px 49px 0px rgba(0, 0, 0, 0.02)" }
      );
  });

  const navLinks = document.querySelectorAll(".stacking-nav__link");

  navLinks.forEach((link, index) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const wrap = document.querySelector("[data-stack-wrap]");
      if (!wrap) return;

      const rect = wrap.getBoundingClientRect();
      const viewportTop = window.scrollY;
      const topRelativeToViewport = rect.top + viewportTop;
      const height = rect.height;
      let targetScroll = topRelativeToViewport;

      switch (index) {
        case 0:
          targetScroll = topRelativeToViewport;
          break;
        case 1:
          targetScroll = topRelativeToViewport + height / 3;
          break;
        case 2:
          targetScroll = topRelativeToViewport + height - height / 3;
          break;
        default:
          break;
      }

      lenis.scrollTo(targetScroll, {
        duration: 1.2,
      });
    });
  });

  stackingCards.forEach((card, index) => {
    ScrollTrigger.create({
      trigger: card,
      start: "top center",
      end: "bottom center",
      onEnter: () => updateNavLink(index),
      onLeave: () => updateNavLink(index + 1),
      onEnterBack: () => updateNavLink(index),
      onLeaveBack: () => updateNavLink(index - 1),
    });
  });

  function updateNavLink(activeIndex) {
    navLinks.forEach((link, index) => {
      link.classList.toggle("is--active", index === activeIndex);
    });
  }

  let stackingNav = gsap.timeline({
    default: {
      ease: "back.out(3)",
      duration: 0.5,
    },
  });

  let showStackingNav = () => {
    ScrollTrigger.refresh();
    stackingNav.clear(0);
    stackingNav.progress(0);
    stackingNav
      .set(".stacking-cards__nav", { display: "flex" })
      .to(".stacking-nav__bg", {
        width: "100%",
        ease: "back.out(2)",
        duration: 0.5,
      })
      .to(
        ".stacking-nav__link",
        {
          opacity: 1,
          y: "0%",
          stagger: 0.1,
          ease: "back.out(3)",
          duration: 0.45,
        },
        0
      );
  };
  let hideStackingNav = () => {
    stackingNav.clear(0);
    stackingNav.progress(0);
    stackingNav
      .to(".stacking-nav__link", {
        opacity: 0,
        y: "50%",
        stagger: 0.1,
        duration: 0.4,
      })
      .to(
        ".stacking-nav__bg",
        {
          width: "0%",
          duration: 0.4,
        },
        0.1
      )
      .set(".stacking-cards__nav", { display: "none" });
  };

  hideStackingNav();

  ScrollTrigger.create({
    trigger: "[data-stack-wrap]",
    start: "top bottom",
    end: "bottom bottom-=25%",
    onEnter: showStackingNav,
    onEnterBack: showStackingNav,
    onLeave: hideStackingNav,
    onLeaveBack: hideStackingNav,
  });
}
function initStackGuidanceAnimations(next) {
  if (!next) {
    next = document.querySelector('[data-barba="container"]');
  }
  let stackGuidanceWrap = next.querySelector("[data-stack-guidance]");
  if (!stackGuidanceWrap) return;
  let lottieElements = stackGuidanceWrap.querySelectorAll("[data-lottie]");
  let lottieAnimations = [];

  lottieElements.forEach((elem) => {
    let animation = lottie.loadAnimation({
      container: elem,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: elem.getAttribute("data-lottie-path"),
    });
    lottieAnimations.push(animation);
  });

  gsap.timeline({
    scrollTrigger: {
      trigger: stackGuidanceWrap,
      start: "top center",
      end: "top bottom",
      onEnter: () => playLottieAnimationsStaggered(lottieAnimations, 1),
    },
  });
}
function initStackSaveAnimations(next) {
  if (!next) {
    next = document.querySelector('[data-barba="container"]');
  }
  let stackSave = next.querySelector("[data-stack-save]");
  if (!stackSave) return;
  let lottieElements = stackSave.querySelectorAll("[data-lottie]");
  let lottieAnimations = [];

  lottieElements.forEach((elem) => {
    let animation = lottie.loadAnimation({
      container: elem,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: elem.getAttribute("data-lottie-path"),
    });
    lottieAnimations.push(animation);
  });

  gsap.timeline({
    scrollTrigger: {
      trigger: stackSave,
      start: "top center",
      end: "top bottom",
      onEnter: () => playLottieAnimationsStaggered(lottieAnimations, 0.15),
    },
  });
}
function initStackInvestAnimations(next) {
  if (!next) {
    next = document.querySelector('[data-barba="container"]');
  }
  let stackGuidanceWrap = next.querySelector("[data-stack-invest]");
  if (!stackGuidanceWrap) return;
  let lottieElements = stackGuidanceWrap.querySelectorAll("[data-lottie]");
  let lottieAnimations = [];

  lottieElements.forEach((elem) => {
    let animation = lottie.loadAnimation({
      container: elem,
      renderer: "svg",
      loop: false,
      autoplay: false,
      path: elem.getAttribute("data-lottie-path"),
    });
    lottieAnimations.push(animation);
  });

  gsap.timeline({
    scrollTrigger: {
      trigger: stackGuidanceWrap,
      start: "top center",
      end: "top bottom",
      onEnter: () => playLottieAnimationsStaggered(lottieAnimations, 0.2),
    },
  });
}
function initPricingScroll() {
  if (prefersReducedMotion() || window.innerWidth < 768) return;
  ScrollTrigger.refresh();
  const section = document.querySelector("[data-pricing-section]");
  if (!section) return;
  const textWrap = section.querySelector("[data-pricing-heading]");
  const heading = textWrap.querySelector("h3");
  const eyebrow = section.querySelector(".eyebrow");

  gsap
    .timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        end: "top top",
        scrub: true,
      },
    })
    .from(
      textWrap,
      {
        y: "-20em",
        ease: "none",
      },
      0
    )
    .fromTo(
      heading,
      {
        fontSize: "7.25em",
      },
      {
        fontSize: "2.5em",
        ease: "none",
      },
      0
    )
    .fromTo(
      eyebrow,
      {
        fontSize: "1.25rem",
      },
      {
        fontSize: "0.75rem",
        ease: "none",
      },
      0
    );
}
function initPriceCards(next) {
  ScrollTrigger.refresh();
  if (!next) {
    next = document.querySelector('[data-barba="container"]');
  }
  let wrap = next.querySelector(".p-cards__container");
  let left = wrap.querySelector(".p-card.is--left");
  let right = wrap.querySelector(".p-card.is--right");
  let center = wrap.querySelector(".p-card.is--center");
  let anim = wrap.querySelector("[data-lottie]");
  let cards = wrap.querySelectorAll(".p-card");
  let sub = wrap.querySelectorAll(".p-card__sub");

  let animation = lottie.loadAnimation({
    container: anim,
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: anim.getAttribute("data-lottie-path"),
  });

  gsap
    .timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top bottom",
        toggleActions: "play none none reverse",
      },
      onReverseComplete: () => {
        animation.goToAndStop(0, true);
      },
    })
    .from(left, {
      xPercent: 80,
      yPercent: 30,
      rotate: 6,
      duration: 0.8,
      ease: "back.out(1.8)",
    })
    .from(
      right,
      {
        xPercent: -80,
        yPercent: 30,
        rotate: -6,
        duration: 0.8,
        ease: "back.out(1.8)",
      },
      0
    )
    .from(
      center,
      {
        yPercent: 10,
        scale: 0.85,
        duration: 0.8,
        ease: "back.out(1.5)",
        onStart: () => {
          gsap.delayedCall(0.5, () => {
            animation.play();
          });
        },
      },
      0
    );

  // HOVERING
  cards.forEach((card) => {
    card.addEventListener("mouseenter", () => {
      cards.forEach((c) => c.classList.remove("is--active"));
      card.classList.add("is--active");
      gsap.to(card, {
        scale: prefersReducedMotion() ? 1 : 1.1,
        duration: 0.3,
        ease: "back.out(1.8)",
        overwrite: "auto",
      });
    });

    card.addEventListener("mouseleave", () => {
      card.classList.remove("is--active");
      center.classList.add("is--active");
      gsap.to(card, {
        scale: 1,
        duration: 0.3,
        ease: "back.out(1.5)",
        overwrite: "auto",
      });
    });
  });

  // PRICE CHANGE
  const solo = next.querySelector("[data-price-solo]");
  const joint = next.querySelector("[data-price-joint]");
  const toggleTl = gsap.timeline({ paused: true });
  toggleTl
    .to(".p-card__heading", {
      y: "-0.9em",
      duration: 0.5,
      ease: "back.inOut(2)",
    })
    .to(
      ".p-card__eyebrow .eyebrow",
      {
        yPercent: -100,
        duration: 0.5,
        ease: "back.inOut(2)",
      },
      0
    )
    .to(
      ".p-card__sign.offset",
      {
        left: "0em",
        duration: 0.5,
        ease: "back.inOut(2)",
      },
      0
    )
    .to(
      sub,
      {
        x: "0em",
        duration: 0.5,
        ease: "back.inOut(2)",
      },
      0
    );

  solo.addEventListener("click", () => {
    if (!solo.classList.contains("is--active")) {
      joint.classList.remove("is--active");
      solo.classList.add("is--active");
      toggleTl.reverse();
    }
  });

  joint.addEventListener("click", () => {
    if (!joint.classList.contains("is--active")) {
      solo.classList.remove("is--active");
      joint.classList.add("is--active");
      toggleTl.play();
    }
  });
  wrap = null;
}

//
//
// INIT
function initGeneral(container) {
  ScrollTrigger.refresh();
  initSplitText(container);
  initBurgerMenu();
  initNavScroll();
  initCursorAndButtons(container);
  initToolTips();
  initVideoControls(container);
  if (!prefersReducedMotion()) {
    initDocumentClick();
    setTimeout(() => {
      initHeadlines(container);
    }, 1000);
  }
}
function initHome(next) {
  if (!next) {
    next = document;
  }
  initHomeHero(next);
  initNavToggle();
  initHomeSliders(next);
  if (isMobile) initMobileSliders();
  initHomeIntro();
  initBushCTA(next);
  initVideoOnHover();
  initStackingNav();
  initCardsIntro();
  initCardsHover();
  initGuidesOverlay(next);
  initGuidesCollage(next);
  initHomeParallax();
  initStackGuidanceAnimations(next);
  initStackSaveAnimations(next);
  initStackInvestAnimations(next);
  initPriceCards(next);
  initPricingScroll();
  initGoalsScroll(next);
  initMemberStories();
}

initGeneral();
initHomeVideo();
initHome();
