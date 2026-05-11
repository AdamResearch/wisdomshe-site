(function () {
  const config = window.WISDOMSHE_CONFIG || {};
  const apiOrigin = config.apiOrigin || "";
  const adminOrigin = config.adminOrigin || "";

  const lineInput = document.getElementById("business-line-input");
  const lineSwitches = document.querySelectorAll("[data-line-switch]");
  const tabButtons = document.querySelectorAll("[data-business-tab]");
  const panels = document.querySelectorAll("[data-business-panel]");
  const form = document.getElementById("lead-form");
  const statusNode = document.getElementById("form-status");

  function setLine(line) {
    if (!lineInput) return;
    lineInput.value = line;

    lineSwitches.forEach((button) => {
      const active = button.dataset.lineSwitch === line;
      button.classList.toggle("is-active", active);
    });

    tabButtons.forEach((button) => {
      const active = button.dataset.businessTab === line;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });

    panels.forEach((panel) => {
      const active = panel.dataset.businessPanel === line;
      panel.classList.toggle("is-active", active);
      panel.hidden = !active;
    });
  }

  lineSwitches.forEach((button) => {
    button.addEventListener("click", () => setLine(button.dataset.lineSwitch));
  });

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setLine(button.dataset.businessTab);
      const formAnchor = document.getElementById("intake-form");
      if (formAnchor) formAnchor.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const hash = window.location.hash;
  if (hash === "#portfolio" || hash === "#portfolio-line") {
    setLine("capital");
  } else {
    setLine("industry");
  }

  function setStatus(message, kind) {
    if (!statusNode) return;
    statusNode.textContent = message;
    statusNode.classList.remove("is-error", "is-success");
    if (kind) statusNode.classList.add(kind);
  }

  function buildFallback(contact, budget, details, line) {
    const subject = encodeURIComponent("wisdomshe.com 新需求");
    const body = encodeURIComponent(
      [
        "业务方向：" + (line === "capital" ? "投资组合管理与香港功能地产" : "医药项目与实业 IP"),
        "联系方式：" + contact,
        "预算：" + budget,
        "",
        "问题与想要的解决方案：",
        details
      ].join("\n")
    );
    return "mailto:adam@wisdomshe.com?subject=" + subject + "&body=" + body;
  }

  if (form) {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const applicantName = document.getElementById("applicant-name").value.trim();
      const contactMethod = document.getElementById("contact-method").value.trim();
      const budgetBand = document.getElementById("budget-band").value.trim();
      const currentIssue = document.getElementById("current-issue").value.trim();
      const businessLine = lineInput.value || "industry";

      if (!applicantName || !contactMethod || !currentIssue) {
        setStatus("请至少填写称呼、联系方式和问题说明。", "is-error");
        return;
      }

      const payload = {
        applicant_name: applicantName,
        phone_or_whatsapp: contactMethod,
        email: contactMethod.includes("@") ? contactMethod : "",
        budget_band: budgetBand,
        business_line: businessLine,
        current_issue: currentIssue,
        service_interest: currentIssue,
        source_page: window.location.href,
        project_stage: "website-intake"
      };

      setStatus("正在提交到公司后台。");

      if (!apiOrigin) {
        setStatus("线上后台未配置，已为你准备邮箱兜底。", "is-error");
        window.location.href = buildFallback(contactMethod, budgetBand, currentIssue, businessLine);
        return;
      }

      try {
        const response = await fetch(apiOrigin + "/api/applications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          throw new Error("HTTP " + response.status);
        }

        setStatus("需求已进入公司后台，后续会按业务线分流处理。", "is-success");
        form.reset();
        setLine(businessLine);
      } catch (error) {
        setStatus("线上后台暂时未接通，请先改走 WhatsApp 或邮箱。", "is-error");
        const fallback = buildFallback(contactMethod, budgetBand, currentIssue, businessLine);
        window.setTimeout(() => {
          window.location.href = fallback;
        }, 400);
      }
    });
  }

  document.querySelectorAll(".nav-link-live-admin").forEach((node) => {
    if (adminOrigin) {
      node.setAttribute("href", adminOrigin.replace(/\/$/, "") + "/login");
    }
  });
})();
