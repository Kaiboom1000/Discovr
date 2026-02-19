(function () {
  const core = window.DiscovrCore;
  const usersTable = core.config.airtable.tables.users;
  const postsTable = core.config.airtable.tables.posts;

  const session = core.getSession();
  if (!session || !session.isAdmin) window.location.href = "index.html";

  function signOut() {
    core.clearSession();
    window.location.href = "index.html";
  }

  async function searchProfile() {
    const value = (document.getElementById("searchVal").value || "").trim();
    if (!value) return;
    core.showLoading(true);
    try {
      const users = await core.listRecords(usersTable, `{username}='${value.replaceAll("'", "\\'")}'`);
      if (!users.length) return alert("No user found.");
      core.saveViewedProfile(users[0].id);
      window.location.href = "adminrandomProfile.html";
    } catch (err) {
      alert(err.message);
    } finally {
      core.showLoading(false);
    }
  }

  async function load() {
    core.showLoading(true);
    try {
      const [users, posts] = await Promise.all([core.listRecords(usersTable), core.listRecords(postsTable)]);
      const me = users.find((u) => u.id === session.userRecordId);
      document.getElementById("profilepage").innerHTML = `
        <h2>Admin: ${core.toHtml(me?.fields.username || "")}</h2>
        <p class="muted">You can review all platform posts here.</p>
      `;

      document.getElementById("postpage").innerHTML = posts
        .map((post) => {
          const owner = users.find((u) => u.id === post.fields.userRecordId);
          return `
            <article class="post-card glass-card">
              <img class="posts" src="${core.toHtml(post.fields.imageUrl)}" alt="post" />
              <h3 class="thumbnail-caption">${core.toHtml(post.fields.caption || "")}</h3>
              <p class="muted">by ${core.toHtml(owner?.fields.username || "Unknown")}</p>
              <button class="danger" data-post-id="${post.id}">Delete Post</button>
            </article>
          `;
        })
        .join("");

      document.querySelectorAll("[data-post-id]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          core.showLoading(true);
          try {
            await core.deleteRecord(postsTable, btn.dataset.postId);
            await load();
          } catch (err) {
            alert(err.message);
          } finally {
            core.showLoading(false);
          }
        });
      });
    } catch (err) {
      alert(err.message);
    } finally {
      core.showLoading(false);
    }
  }

  document.getElementById("openTable")?.addEventListener("click", () => (window.location.href = "admintabledelete.html"));
  document.getElementById("searchBtn")?.addEventListener("click", searchProfile);
  document.getElementById("signOutBtn")?.addEventListener("click", signOut);

  load();
})();
