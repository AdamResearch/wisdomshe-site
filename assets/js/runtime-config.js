(function () {
  const isLocalPreview =
    window.location.protocol === "file:" ||
    ["127.0.0.1", "localhost"].includes(window.location.hostname);
  const localOrigin = "http://127.0.0.1:8801";
  const productionOrigin = "https://admin.wisdomshe.com";

  window.WISDOMSHE_CONFIG = Object.assign(
    {
      apiOrigin: isLocalPreview ? localOrigin : productionOrigin,
      adminOrigin: isLocalPreview ? localOrigin : productionOrigin,
    },
    window.WISDOMSHE_CONFIG || {}
  );
})();
