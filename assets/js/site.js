(function () {
  const config = window.WISDOMSHE_CONFIG || {};
  const apiOrigin = (config.apiOrigin || "").replace(/\/$/, "");
  const workerEndpoint = (config.workerEndpoint || "").replace(/\/$/, "");
  const adminOrigin = (config.adminOrigin || "").replace(/\/$/, "");
  const sameOriginApi = config.sameOriginApi !== false && window.location.protocol.startsWith("http");
  const apiBases = Array.from(new Set([
    apiOrigin,
    sameOriginApi ? window.location.origin : ""
  ].filter(Boolean)));
  const requestTimeoutMs = Number(config.requestTimeoutMs || 8000);
  const lineInput = document.getElementById("business-line-input");
  const lineSwitches = document.querySelectorAll("[data-line-switch]");
  const tabButtons = document.querySelectorAll("[data-business-tab]");
  const panels = document.querySelectorAll("[data-business-panel]");
  const form = document.getElementById("lead-form");
  const statusNode = document.getElementById("form-status");

  function setLine(line) {
    if (!lineInput) return;
    lineInput.value = line;
    lineSwitches.forEach((button) => button.classList.toggle("is-active", button.dataset.lineSwitch === line));
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

  function lineFromHash() {
    const hash = window.location.hash;
    if (hash === "#portfolio" || hash === "#portfolio-line" || hash === "#capital") return "capital";
    return "industry";
  }

  function setStatus(message, kind) {
    if (!statusNode) return;
    statusNode.textContent = message;
    statusNode.classList.remove("is-error", "is-success");
    if (kind) statusNode.classList.add(kind);
  }

  function buildFallback(contact, budget, details, line) {
    const subject = encodeURIComponent("wisdomshe.com 新需求");
    const body = encodeURIComponent([
      "业务方向：" + (line === "capital" ? "投资组合管理与香港功能地产" : "医药项目与实业 IP"),
      "联系方式：" + contact,
      "预算：" + budget,
      "",
      "问题与解决方案：",
      details
    ].join("\n"));
    return "mailto:adam@wisdomshe.com?subject=" + subject + "&body=" + body;
  }

  async function postJson(url, payload) {
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), requestTimeoutMs);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      signal: controller.signal,
      body: JSON.stringify(payload)
    }).finally(() => window.clearTimeout(timeoutId));
    const result = await response.json().catch(() => ({}));
    if (!response.ok || !result.success) throw new Error(result.error || `HTTP ${response.status}`);
    return result;
  }

  async function submitToBackends(payload) {
    const errors = [];
    for (const base of apiBases) {
      try {
        const result = await postJson(`${base}/api/applications`, payload);
        return { source: "admin", code: result.application?.code || result.code || "已记录" };
      } catch (error) {
        errors.push(`admin(${base}): ${error.name === "AbortError" ? "连接超时" : error.message}`);
      }
    }
    if (workerEndpoint) {
      try {
        const result = await postJson(`${workerEndpoint}/submit`, payload);
        return { source: "worker", code: result.application?.code || result.code || "已记录" };
      } catch (error) {
        errors.push(`worker: ${error.message}`);
      }
    }
    throw new Error(errors.join("；") || "后台未配置");
  }

  lineSwitches.forEach((button) => button.addEventListener("click", () => setLine(button.dataset.lineSwitch)));
  tabButtons.forEach((button) => button.addEventListener("click", () => setLine(button.dataset.businessTab)));
  document.querySelectorAll("[data-jump-line]").forEach((node) => {
    node.addEventListener("click", () => setLine(node.dataset.jumpLine));
  });
  window.addEventListener("hashchange", () => setLine(lineFromHash()));
  setLine(lineFromHash());
  window.addEventListener("load", () => {
    if (window.location.hash === "#portfolio-line" || window.location.hash === "#industry-line") {
      document.getElementById("business-intro")?.scrollIntoView({ block: "start" });
    }
  });

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
        kind: businessLine === "capital" ? "portfolio" : "diagnostic",
        name: applicantName,
        applicant_name: applicantName,
        phone: contactMethod,
        contact_method: contactMethod,
        email: contactMethod.includes("@") ? contactMethod : "",
        company: "",
        budget_band: budgetBand,
        business_line: businessLine,
        current_issue: currentIssue,
        service_interest: currentIssue,
        source_page: window.location.pathname + window.location.hash,
        project_stage: "website-intake"
      };

      setStatus("正在提交到公司后台。", "");
      try {
        const result = await submitToBackends(payload);
        setStatus(`需求已进入后台，编号 ${result.code}。`, "is-success");
        form.reset();
        setLine(businessLine);
      } catch (error) {
        setStatus("后台暂时未接通，已转为邮件方案。", "is-error");
        window.location.href = buildFallback(contactMethod, budgetBand, currentIssue, businessLine);
      }
    });
  }

  document.querySelectorAll(".nav-link-live-admin").forEach((node) => {
    node.setAttribute("href", adminOrigin ? `${adminOrigin}/login` : "admin/");
  });
})();
