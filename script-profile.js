(function () {
  const core = window.DiscovrCore;
  const usersTable = core.config.airtable.tables.users;
  const postsTable = core.config.airtable.tables.posts;

  const session = core.getSession();
  if (!session) window.location.href = "index.html";

  function signOut() {
    core.clearSession();
    window.location.href = "index.html";
  }

  function renderProfile(user) {
    const target = document.getElementById("profilepage");
    target.innerHTML = `
      <img class="profile-avatar" src="${core.toHtml(user.fields.avatar)}" alt="avatar" />
      <h2>${core.toHtml(user.fields.username)}</h2>
      <p class="muted">${core.toHtml(user.fields.about)}</p>
      <div class="profile-meta">
        <span>🎂 ${core.toHtml(user.fields.dob)}</span>
        <span>🧬 ${core.toHtml(user.fields.gender)}</span>
      </div>
    `;
  }

  function renderPosts(posts, usersById, isOwn = false) {
    const target = document.getElementById("postpage");
    if (!posts.length) {
      target.innerHTML = "<p class='muted'>No posts yet.</p>";
      return;
    }

    target.innerHTML = posts
      .map((post) => {
        const author = usersById.get(post.fields.userRecordId);
        const who = author ? author.fields.username : "Unknown";
        return `
          <article class="post-card glass-card">
            <img class="posts" src="${core.toHtml(post.fields.imageUrl)}" alt="post image" />
            <h3 class="thumbnail-caption">${core.toHtml(post.fields.caption || "")}</h3>
            <p class="muted">by ${core.toHtml(who)}</p>
            <p>❤️ ${Number(post.fields.likes || 0)}</p>
            ${isOwn ? `<button data-del="${post.id}" class="danger delete-post">Delete</button>` : ""}
          </article>
        `;
      })
      .join("");

    target.querySelectorAll(".delete-post").forEach((btn) => {
      btn.addEventListener("click", async () => {
        core.showLoading(true);
        try {
          await core.deleteRecord(postsTable, btn.dataset.del);
          await load();
        } catch (err) {
          alert(err.message);
        } finally {
          core.showLoading(false);
        }
      });
    });
  }

  async function searchProfile() {
    const value = (document.getElementById("searchVal").value || "").trim();
    if (!value) return;

    core.showLoading(true);
    try {
      const users = await core.listRecords(usersTable, `{username}='${value.replaceAll("'", "\\'")}'`);
      if (!users.length) {
        alert("No profile found.");
        return;
      }
      core.saveViewedProfile(users[0].id);
      window.location.href = "randomProfile.html";
    } catch (err) {
      alert(err.message);
    } finally {
      core.showLoading(false);
    }
  }

  async function uploadPost() {
    const imageUrl = (document.getElementById("newPostUrl").value || "").trim();
    const caption = (document.getElementById("pst-caption").value || "").trim();
    if (!imageUrl) return alert("Image URL is required.");

    core.showLoading(true);
    try {
      await core.createRecord(postsTable, {
        userRecordId: session.userRecordId,
        imageUrl,
        caption,
        likes: 0,
        createdAt: new Date().toISOString()
      });
      document.getElementById("composerDialog").close();
      await load();
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
      const currentUser = users.find((u) => u.id === session.userRecordId);
      if (!currentUser) return signOut();

      const usersById = new Map(users.map((u) => [u.id, u]));
      const ownPosts = posts
        .filter((p) => p.fields.userRecordId === session.userRecordId)
        .sort((a, b) => new Date(b.fields.createdAt || 0) - new Date(a.fields.createdAt || 0));

      renderProfile(currentUser);
      renderPosts(ownPosts, usersById, true);
    } catch (err) {
      alert(err.message);
    } finally {
      core.showLoading(false);
    }
  }

  document.getElementById("signOutBtn")?.addEventListener("click", signOut);
  document.getElementById("searchBtn")?.addEventListener("click", searchProfile);
  document.getElementById("openComposer")?.addEventListener("click", () => document.getElementById("composerDialog").showModal());
  document.getElementById("closeComposer")?.addEventListener("click", () => document.getElementById("composerDialog").close());
  document.getElementById("uploadBtn")?.addEventListener("click", uploadPost);

  load();
})();
