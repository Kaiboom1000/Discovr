(function () {
  const core = window.DiscovrCore;
  const usersTable = core.config.airtable.tables.users;

  async function login(isAdminPath) {
    const username = (document.getElementById("username")?.value || "").trim();
    const password = document.getElementById("password")?.value || "";
    const error = document.getElementById("error-loginfail");

    if (!username || !password) {
      if (error) error.textContent = "Username and password are required.";
      return;
    }

    core.showLoading(true);
    try {
      const users = await core.listRecords(usersTable, `{username}='${username.replaceAll("'", "\\'")}'`);
      const user = users.find((u) => u.fields.password === password);

      if (!user) {
        if (error) error.textContent = "Invalid credentials.";
        return;
      }

      const isAdmin = core.isAdminUser(user);
      if (isAdminPath && !isAdmin) {
        if (error) error.textContent = "This account is not an admin.";
        return;
      }

      core.setSession({ userRecordId: user.id, username: user.fields.username, isAdmin });
      window.location.href = isAdminPath ? "adminprofile.html" : "profile.html";
    } catch (err) {
      if (error) error.textContent = err.message;
    } finally {
      core.showLoading(false);
    }
  }

  async function checkUsername() {
    const username = (document.getElementById("user-name")?.value || "").trim();
    const error = document.getElementById("error-signupfail");
    if (!username) {
      if (error) error.textContent = "Enter a username first.";
      return;
    }

    core.showLoading(true);
    try {
      const users = await core.listRecords(usersTable, `{username}='${username.replaceAll("'", "\\'")}'`);
      if (error) {
        error.textContent = users.length ? "Username is already taken." : "Username is available.";
      }
    } catch (err) {
      if (error) error.textContent = err.message;
    } finally {
      core.showLoading(false);
    }
  }

  async function signUp() {
    const username = (document.getElementById("user-name")?.value || "").trim();
    const password = document.getElementById("user-password")?.value || "";
    const avatar = (document.getElementById("avatar-url")?.value || "").trim();
    const about = (document.getElementById("aboutMe")?.value || "").trim();
    const dob = document.getElementById("BDate")?.value || "";
    const gender = document.querySelector('input[name="gender"]:checked')?.value || "";
    const error = document.getElementById("error-signupfail");

    if (!username || !password || !avatar || !about || !dob || !gender) {
      if (error) error.textContent = "Please fill every field.";
      return;
    }

    core.showLoading(true);
    try {
      const existing = await core.listRecords(usersTable, `{username}='${username.replaceAll("'", "\\'")}'`);
      if (existing.length) {
        if (error) error.textContent = "Username already exists.";
        return;
      }

      await core.createRecord(usersTable, {
        username,
        password,
        avatar,
        about,
        dob,
        gender,
        isAdmin: false
      });

      window.location.href = "index.html";
    } catch (err) {
      if (error) error.textContent = err.message;
    } finally {
      core.showLoading(false);
    }
  }

  document.getElementById("loginBtn")?.addEventListener("click", () => login(false));
  document.getElementById("adminLoginBtn")?.addEventListener("click", () => login(true));
  document.getElementById("check")?.addEventListener("click", checkUsername);
  document.getElementById("signup")?.addEventListener("click", signUp);
})();
