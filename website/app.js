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
