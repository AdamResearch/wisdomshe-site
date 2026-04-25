(function () {
  const runtime = window.STRATEGIC_OFFICE_RUNTIME || {};
  const apiRoot = (window.STRATEGIC_OFFICE_API_ROOT || runtime.apiBaseUrl || "").replace(/\/$/, "");

  async function submitForm(form) {
    const statusNode = form.querySelector("[data-form-status]");
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.kind = form.dataset.kind || "diagnostic";
    payload.source_page = window.location.pathname;

    if (!apiRoot) {
      const drafts = JSON.parse(localStorage.getItem("strategicOfficeDrafts") || "[]");
      drafts.push({
        created_at: new Date().toISOString(),
        payload
      });
      localStorage.setItem("strategicOfficeDrafts", JSON.stringify(drafts));
      statusNode.textContent = "公开站已经打开，但后台 API 地址还没有配置。草稿已保存在当前浏览器，你也可以直接通过邮箱或 WhatsApp 继续。";
      statusNode.className = "status-note error";
      return;
    }

    statusNode.textContent = `正在提交到 ${apiRoot}/api/applications`;
    statusNode.className = "status-note";

    try {
      const response = await fetch(`${apiRoot}/api/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "提交失败");
      }
      statusNode.textContent = `提交成功，系统编号 ${result.application.code}。你现在可以继续通过邮箱或 WhatsApp 完成后续沟通。`;
      form.reset();
      return;
    } catch (error) {
      const drafts = JSON.parse(localStorage.getItem("strategicOfficeDrafts") || "[]");
      drafts.push({
        created_at: new Date().toISOString(),
        payload
      });
      localStorage.setItem("strategicOfficeDrafts", JSON.stringify(drafts));
      statusNode.textContent = "后台暂未连通，草稿已保存在当前浏览器。你可以直接把内容发到 adam@wisdomshe.com 或 WhatsApp 继续。";
      statusNode.className = "status-note error";
      console.error(error);
    }
  }

  document.querySelectorAll("[data-office-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      submitForm(form);
    });
  });
})();
