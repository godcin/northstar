(() => {
  "use strict";

  window.lucide?.createIcons();

  const menuToggle = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector("#mobile-nav");
  const closeMenu = () => {
    mobileNav.hidden = true;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "展开导航");
    menuToggle.title = "展开导航";
  };
  menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") !== "true";
    mobileNav.hidden = !expanded;
    menuToggle.setAttribute("aria-expanded", String(expanded));
    menuToggle.setAttribute("aria-label", expanded ? "收起导航" : "展开导航");
    menuToggle.title = expanded ? "收起导航" : "展开导航";
  });
  mobileNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !mobileNav.hidden) {
      closeMenu();
      menuToggle.focus();
    }
  });
  window.matchMedia("(min-width: 721px)").addEventListener("change", (event) => {
    if (event.matches) closeMenu();
  });

  const demoSection = document.querySelector("#desktop-journey");
  const demoViewport = document.querySelector(".demo-carousel-viewport");
  const demoTrack = document.querySelector(".demo-carousel-track");
  const demoSlides = [...document.querySelectorAll("[data-demo-slide]")];
  const demoTabs = [...document.querySelectorAll("[data-demo-tab]")];
  let demoIndex = 0;
  let swipeStart = null;
  let suppressClickUntil = 0;

  const resizeDemo = () => {
    const height = `${demoSlides[demoIndex].getBoundingClientRect().height}px`;
    if (demoViewport.style.height !== height) demoViewport.style.height = height;
  };
  const selectDemo = (index) => {
    const focusInSlide = demoSlides[demoIndex].contains(document.activeElement);
    demoIndex = (index + demoSlides.length) % demoSlides.length;
    demoSlides.forEach((slide, slideIndex) => {
      const active = slideIndex === demoIndex;
      slide.inert = !active;
      slide.setAttribute("aria-hidden", String(!active));
    });
    demoTabs.forEach((tab, tabIndex) => {
      const active = tabIndex === demoIndex;
      tab.setAttribute("aria-selected", String(active));
      tab.tabIndex = active ? 0 : -1;
    });
    demoSection.setAttribute("aria-labelledby", demoSlides[demoIndex].querySelector("h2").id);
    demoTrack.style.transform = `translateX(${-100 * demoIndex}%)`;
    resizeDemo();
    if (focusInSlide) demoTabs[demoIndex].focus({ preventScroll: true });
  };
  demoTabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectDemo(index));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = demoIndex + 1;
      if (event.key === "ArrowLeft") next = demoIndex - 1;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = demoSlides.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectDemo(next);
      demoTabs[demoIndex].focus({ preventScroll: true });
    });
  });
  document.querySelector("[data-demo-prev]").addEventListener("click", () => selectDemo(demoIndex - 1));
  document.querySelector("[data-demo-next]").addEventListener("click", () => selectDemo(demoIndex + 1));
  demoViewport.addEventListener("pointerdown", (event) => {
    if (event.isPrimary && event.pointerType !== "mouse") {
      swipeStart = { x: event.clientX, y: event.clientY, id: event.pointerId };
    }
  });
  demoViewport.addEventListener("pointerup", (event) => {
    if (!swipeStart || swipeStart.id !== event.pointerId) return;
    const dx = event.clientX - swipeStart.x;
    const dy = event.clientY - swipeStart.y;
    swipeStart = null;
    if (Math.abs(dx) < Math.min(80, demoViewport.clientWidth * 0.18) || Math.abs(dx) < Math.abs(dy) * 1.25) return;
    suppressClickUntil = performance.now() + 400;
    selectDemo(demoIndex + (dx < 0 ? 1 : -1));
  });
  demoViewport.addEventListener("pointercancel", () => { swipeStart = null; });
  demoViewport.addEventListener("click", (event) => {
    if (performance.now() < suppressClickUntil) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
  const demoResizeObserver = new ResizeObserver(resizeDemo);
  demoSlides.forEach((slide) => demoResizeObserver.observe(slide));
  selectDemo(0);

  const tabs = [...document.querySelectorAll(".role-tabs [role=tab]")];
  const panel = document.querySelector("#role-panel");
  const workbench = document.querySelector("#workbench-image");
  const description = document.querySelector("#role-description");
  const roles = {
    pm: { description: "聚焦产品需求与待确认事项，让每个决策都有上下文。", alt: "Northstar Viewer 产品角色视图：左侧需求文档，中间产品需求说明，右侧待确认事项。内容为示例项目。" },
    dev: { description: "聚焦技术设计与待修复事项，从确认的需求推进实现。", alt: "Northstar Viewer 技术角色视图：左侧技术文档，中间技术设计，右侧待修复事项。内容为示例项目。" },
    qa: { description: "聚焦测试计划与验收事项，让质量证据连接交付目标。", alt: "Northstar Viewer 质量角色视图：左侧质量文档，中间验收与测试计划，右侧待验收事项。内容为示例项目。" },
  };
  let selectedRole = "pm";
  let imageRequest = 0;

  const selectRole = (tab) => {
    const role = tab.dataset.role;
    selectedRole = role;
    tabs.forEach((item) => {
      const selected = item === tab;
      item.setAttribute("aria-selected", String(selected));
      item.tabIndex = selected ? 0 : -1;
    });
    panel.setAttribute("aria-labelledby", tab.id);
    const request = ++imageRequest;
    const nextImage = new Image();
    panel.setAttribute("aria-busy", "true");
    nextImage.onload = () => {
      if (request !== imageRequest) return;
      workbench.src = nextImage.src;
      workbench.alt = roles[role].alt;
      description.textContent = roles[role].description;
      panel.removeAttribute("aria-busy");
    };
    nextImage.onerror = () => {
      if (request !== imageRequest) return;
      description.textContent = "该角色截图暂时无法加载，请重试或查看其他角色。";
      panel.removeAttribute("aria-busy");
    };
    nextImage.src = `assets/workbench-${role}.webp`;
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => selectRole(tab));
    tab.addEventListener("keydown", (event) => {
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
      if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      tabs[next].focus();
      selectRole(tabs[next]);
    });
  });

  const dialog = document.querySelector("#image-dialog");
  const dialogImage = document.querySelector("#dialog-image");
  const expandButton = document.querySelector(".expand-demo");
  expandButton.addEventListener("click", () => {
    dialogImage.src = workbench.src;
    dialogImage.alt = workbench.alt;
    dialog.showModal();
    document.body.classList.add("dialog-open");
  });
  document.querySelector(".close-dialog").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener("close", () => {
    document.body.classList.remove("dialog-open");
    expandButton.focus({ preventScroll: true });
  });

  const shareUrl = document.querySelector('link[rel="canonical"]').href;
  const shareTitle = document.querySelector('meta[property="og:title"]').content;
  const shareDescription = document.querySelector('meta[property="og:description"]').content;
  const shareImage = document.querySelector('meta[property="og:image"]').content;
  const shareText = `${shareTitle}\n${shareDescription}`;
  const sharePlatforms = {
    x: { endpoint: "https://twitter.com/intent/tweet", params: { url: shareUrl, text: shareText } },
    reddit: { endpoint: "https://www.reddit.com/submit", params: { url: shareUrl, title: shareTitle } },
    facebook: { endpoint: "https://www.facebook.com/sharer/sharer.php", params: { u: shareUrl } },
    weibo: { endpoint: "https://service.weibo.com/share/share.php", params: { url: shareUrl, title: shareText, pic: shareImage } },
  };
  document.querySelectorAll("[data-share-platform]").forEach((link) => {
    const platform = sharePlatforms[link.dataset.sharePlatform];
    const url = new URL(platform.endpoint);
    url.search = new URLSearchParams(platform.params).toString();
    link.href = url.href;
  });

  const wechatShareButton = document.querySelector("[data-share-wechat]");
  const wechatShareDialog = document.querySelector("#wechat-share-dialog");
  const wechatShareUrl = document.querySelector("#wechat-share-url");
  const shareStatus = document.querySelector("#share-status");
  const wechatShareStatus = document.querySelector("#wechat-share-status");
  let wechatShareTrigger = wechatShareButton;
  let shareStatusTimeout;
  wechatShareUrl.value = shareUrl;

  const openWechatShare = (trigger = wechatShareButton) => {
    wechatShareTrigger = trigger;
    wechatShareDialog.showModal();
    document.body.classList.add("dialog-open");
  };
  const setShareStatus = (status, text) => {
    clearTimeout(shareStatusTimeout);
    shareStatus.textContent = "";
    wechatShareStatus.textContent = "";
    status.textContent = text;
    shareStatusTimeout = setTimeout(() => { status.textContent = ""; }, 4000);
  };
  wechatShareButton.addEventListener("click", () => openWechatShare());
  document.querySelector(".close-wechat-share").addEventListener("click", () => wechatShareDialog.close());
  wechatShareDialog.addEventListener("click", (event) => {
    if (event.target !== wechatShareDialog) return;
    const bounds = wechatShareDialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) wechatShareDialog.close();
  });
  wechatShareDialog.addEventListener("close", () => {
    if (!dialog.open) document.body.classList.remove("dialog-open");
    wechatShareStatus.textContent = "";
    wechatShareTrigger.focus({ preventScroll: true });
  });
  document.querySelectorAll("[data-copy-share-link]").forEach((button) => {
    button.addEventListener("click", async () => {
      button.disabled = true;
      try {
        await navigator.clipboard.writeText(shareUrl);
        setShareStatus(wechatShareDialog.open ? wechatShareStatus : shareStatus, "链接已复制");
      } catch {
        if (!wechatShareDialog.open) openWechatShare(button);
        wechatShareUrl.focus();
        wechatShareUrl.select();
        setShareStatus(wechatShareStatus, "无法自动复制链接");
      } finally {
        button.disabled = false;
      }
    });
  });

  const video = document.querySelector("#demo-video");
  const videoSource = window.NORTHSTAR_SITE?.demoVideo?.trim();
  if (videoSource) {
    video.src = videoSource;
    video.hidden = false;
    workbench.hidden = true;
    document.querySelector(".role-tabs").hidden = true;
    expandButton.hidden = true;
    panel.removeAttribute("role");
    panel.removeAttribute("aria-labelledby");
    description.textContent = "Northstar 产品演示";
    video.addEventListener("error", () => {
      video.hidden = true;
      workbench.hidden = false;
      document.querySelector(".role-tabs").hidden = false;
      expandButton.hidden = false;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", `tab-${selectedRole}`);
      description.textContent = roles[selectedRole].description;
      document.querySelector("#video-error").hidden = false;
    });
  }
})();
