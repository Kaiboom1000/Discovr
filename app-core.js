(function () {
  const config = window.DISCOVR_CONFIG;

  function assertConfigured() {
    const badBase = config.airtable.baseId.startsWith("REPLACE_WITH");
    const badToken = config.airtable.token.startsWith("REPLACE_WITH");
    if (badBase || badToken) {
      throw new Error("Configure airtable-config.js before using Discovr.");
    }
  }

  function apiUrl(tableName, query = "") {
    return `https://api.airtable.com/v0/${config.airtable.baseId}/${encodeURIComponent(tableName)}${query}`;
  }

  async function request(tableName, method = "GET", body = null, query = "") {
    assertConfigured();
    const response = await fetch(apiUrl(tableName, query), {
      method,
      headers: {
        Authorization: `Bearer ${config.airtable.token}`,
        "Content-Type": "application/json"
      },
      body: body ? JSON.stringify(body) : undefined
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Airtable error (${response.status}): ${text}`);
    }

    return response.status === 204 ? null : response.json();
  }

  async function listRecords(tableName, formula = "") {
    const query = formula ? `?filterByFormula=${encodeURIComponent(formula)}` : "";
    const data = await request(tableName, "GET", null, query);
    return data.records || [];
  }

  async function createRecord(tableName, fields) {
    const data = await request(tableName, "POST", { records: [{ fields }] });
    return data.records[0];
  }

  async function updateRecord(tableName, recordId, fields) {
    const data = await request(tableName, "PATCH", { records: [{ id: recordId, fields }] });
    return data.records[0];
  }

  async function deleteRecord(tableName, recordId) {
    return request(`${tableName}/${recordId}`, "DELETE");
  }

  function showLoading(show) {
    const el = document.getElementById("loading");
    if (!el) return;
    el.style.display = show ? "flex" : "none";
  }

  function setSession(sessionObj) {
    localStorage.setItem(config.storageKeys.session, JSON.stringify(sessionObj));
  }

  function getSession() {
    const raw = localStorage.getItem(config.storageKeys.session);
    return raw ? JSON.parse(raw) : null;
  }

  function clearSession() {
    localStorage.removeItem(config.storageKeys.session);
  }

  function saveViewedProfile(userRecordId) {
    localStorage.setItem(config.storageKeys.viewedProfileId, userRecordId);
  }

  function getViewedProfile() {
    return localStorage.getItem(config.storageKeys.viewedProfileId);
  }

  function isAdminUser(user) {
    return config.adminUsernames.includes((user.fields.username || "").toLowerCase());
  }

  function toHtml(str) {
    return String(str || "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  window.DiscovrCore = {
    config,
    listRecords,
    createRecord,
    updateRecord,
    deleteRecord,
    showLoading,
    setSession,
    getSession,
    clearSession,
    saveViewedProfile,
    getViewedProfile,
    isAdminUser,
    toHtml
  };
})();
