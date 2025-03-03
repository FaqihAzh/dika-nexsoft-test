document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorMessage = document.getElementById("errorMessage");

  form.addEventListener("submit", async (event) => {
    // Prevent reload with preventDefault
    event.preventDefault();

    // Validate before sending to server
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      errorMessage.textContent = "Username dan password wajib diisi!";
      return;
    }

    // API endpoints simulate
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        errorMessage.textContent = result.message || "Terjadi kesalahan";
        return;
      }

      window.location.href = "/dashboard.html";
    } catch (error) {
      errorMessage.textContent = error.message || "Terjadi kesalahan";
    }
  });
});
