(function () {
  const core = window.DiscovrCore;
  const usersTable = core.config.airtable.tables.users;
  const postsTable = core.config.airtable.tables.posts;

  const session = core.getSession();
  const viewedId = core.getViewedProfile();
  if (!session || !session.isAdmin || !viewedId) window.location.href = "adminprofile.html";

  async function load() {
    core.showLoading(true);
    try {
      const [users, posts] = await Promise.all([core.listRecords(usersTable), core.listRecords(postsTable)]);
      const user = users.find((u) => u.id === viewedId);
      if (!user) return (window.location.href = "adminprofile.html");

      document.getElementById("profilepage").innerHTML = `
        <img class="profile-avatar" src="${core.toHtml(user.fields.avatar)}" alt="avatar" />
        <h2>${core.toHtml(user.fields.username)}</h2>
        <p class="muted">${core.toHtml(user.fields.about)}</p>
      `;

      const userPosts = posts.filter((p) => p.fields.userRecordId === viewedId);
      document.getElementById("postpage").innerHTML = userPosts.length
        ? userPosts
            .map(
              (post) => `
          <article class="post-card glass-card">
            <img class="posts" src="${core.toHtml(post.fields.imageUrl)}" alt="post" />
            <h3 class="thumbnail-caption">${core.toHtml(post.fields.caption || "")}</h3>
            <button class="danger" data-id="${post.id}">Delete</button>
          </article>`
            )
            .join("")
        : "<p class='muted'>No posts for this user.</p>";

      document.querySelectorAll("[data-id]").forEach((btn) => {
        btn.addEventListener("click", async () => {
          core.showLoading(true);
          try {
            await core.deleteRecord(postsTable, btn.dataset.id);
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

  document.getElementById("backBtn")?.addEventListener("click", () => (window.location.href = "adminprofile.html"));
  load();
})();
