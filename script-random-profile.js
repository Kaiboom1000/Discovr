(function () {
  const core = window.DiscovrCore;
  const usersTable = core.config.airtable.tables.users;
  const postsTable = core.config.airtable.tables.posts;

  const session = core.getSession();
  const viewedId = core.getViewedProfile();
  if (!session || !viewedId) window.location.href = "profile.html";

  function renderProfile(user) {
    document.getElementById("profilepage").innerHTML = `
      <img class="profile-avatar" src="${core.toHtml(user.fields.avatar)}" alt="avatar" />
      <h2>${core.toHtml(user.fields.username)}</h2>
      <p class="muted">${core.toHtml(user.fields.about)}</p>
      <div class="profile-meta">
        <span>🎂 ${core.toHtml(user.fields.dob)}</span>
        <span>🧬 ${core.toHtml(user.fields.gender)}</span>
      </div>
    `;
  }

  function renderPosts(posts) {
    const target = document.getElementById("postpage");
    target.innerHTML = posts.length
      ? posts
          .map(
            (post) => `
      <article class="post-card glass-card">
        <img class="posts" src="${core.toHtml(post.fields.imageUrl)}" alt="post" />
        <h3 class="thumbnail-caption">${core.toHtml(post.fields.caption || "")}</h3>
        <p>❤️ ${Number(post.fields.likes || 0)}</p>
      </article>`
          )
          .join("")
      : "<p class='muted'>This user has no posts yet.</p>";
  }

  async function load() {
    core.showLoading(true);
    try {
      const [users, posts] = await Promise.all([core.listRecords(usersTable), core.listRecords(postsTable)]);
      const user = users.find((u) => u.id === viewedId);
      if (!user) return (window.location.href = "profile.html");
      renderProfile(user);
      renderPosts(posts.filter((p) => p.fields.userRecordId === viewedId));
    } catch (err) {
      alert(err.message);
    } finally {
      core.showLoading(false);
    }
  }

  document.getElementById("backBtn")?.addEventListener("click", () => {
    window.location.href = session.isAdmin ? "adminprofile.html" : "profile.html";
  });

  load();
})();
