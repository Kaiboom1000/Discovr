(function () {
  const core = window.DiscovrCore;
  const usersTable = core.config.airtable.tables.users;
  const postsTable = core.config.airtable.tables.posts;

  const session = core.getSession();
  if (!session || !session.isAdmin) window.location.href = "index.html";

  async function loadUsers() {
    core.showLoading(true);
    try {
      const users = await core.listRecords(usersTable);
      const body = document.getElementById("stationeryData");
      body.innerHTML = users
        .map(
          (user) => `
          <tr>
            <td>${core.toHtml(user.fields.username || "")}</td>
            <td><img src="${core.toHtml(user.fields.avatar || "https://picsum.photos/80")}" alt="avatar" /></td>
            <td>${core.toHtml(user.fields.postCount || "0")}</td>
            <td>
              <button class="danger" data-id="${user.id}">Delete User</button>
            </td>
          </tr>
        `
        )
        .join("");

      body.querySelectorAll("[data-id]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          if (!confirm("Delete this user and all their posts?")) return;
          await deleteUser(btn.dataset.id);
        });
      });
    } catch (err) {
      alert(err.message);
    } finally {
      core.showLoading(false);
    }
  }

  async function deleteUser(userRecordId) {
    core.showLoading(true);
    try {
      const posts = await core.listRecords(postsTable, `{userRecordId}='${userRecordId}'`);
      for (const post of posts) {
        await core.deleteRecord(postsTable, post.id);
      }
      await core.deleteRecord(usersTable, userRecordId);
      await loadUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      core.showLoading(false);
    }
  }

  async function addDemoUser() {
    core.showLoading(true);
    try {
      const stamp = Date.now();
      await core.createRecord(usersTable, {
        username: `demo_${stamp}`,
        password: "demo1234",
        avatar: "https://picsum.photos/seed/discovr-demo/300",
        about: "Demo account created by admin panel",
        dob: "2000-01-01",
        gender: "other",
        isAdmin: false
      });
      await loadUsers();
    } catch (err) {
      alert(err.message);
    } finally {
      core.showLoading(false);
    }
  }

  document.getElementById("createDemoBtn")?.addEventListener("click", addDemoUser);
  document.getElementById("backBtn")?.addEventListener("click", () => (window.location.href = "adminprofile.html"));

  loadUsers();
})();
