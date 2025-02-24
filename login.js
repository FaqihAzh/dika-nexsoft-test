document.addEventListener("DOMContentLoaded", () => {
  const elements = {
    form: document.getElementById("loginForm"),
    username: document.getElementById("username"),
    password: document.getElementById("password"),
    usernameError: document.getElementById("usernameError"),
    passwordError: document.getElementById("passwordError"),
    loginButton: document.getElementById("loginButton"),
    statusMessage: document.getElementById("statusMessage"),
    togglePassword: document.getElementById("togglePassword"),
  };

  const VALIDATION = {
    username: {
      minLength: 3,
      maxLength: 20,
      pattern: /^[a-zA-Z0-9_]+$/,
      messages: {
        required: "Username is required.",
        minLength: "Username must be at least 3 characters.",
        maxLength: "Username cannot exceed 20 characters.",
        pattern: "Username can only contain letters, numbers, and underscores.",
      },
    },
    password: {
      minLength: 8,
      maxLength: 50,
      pattern:
        /(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&+#^()\-_=\[\]{}|:;"'<>,.?\/])/,
      messages: {
        required: "Password is required.",
        minLength: "Password must be at least 8 characters.",
        maxLength: "Password cannot exceed 50 characters.",
        pattern:
          "Password must contain at least one letter, one number, and one special character.",
      },
    },
  };

  // API endpoints simulate
  const API = {
    login: "/api/login",
    dashboard: "/dashboard.html",
  };

  function initializeEventListeners() {
    elements.username.addEventListener("input", () =>
      validateField("username")
    );
    elements.password.addEventListener("input", () =>
      validateField("password")
    );
    elements.form.addEventListener("submit", handleFormSubmit);

    if (elements.togglePassword) {
      elements.togglePassword.addEventListener(
        "click",
        togglePasswordVisibility
      );
    }
  }

  function validateField(fieldName) {
    const field = elements[fieldName];
    const errorElement = elements[`${fieldName}Error`];
    const value = field.value.trim();
    const rules = VALIDATION[fieldName];

    let isValid = true;
    let errorMessage = "";

    if (!value) {
      errorMessage = rules.messages.required;
      isValid = false;
    } else if (value.length < rules.minLength) {
      errorMessage = rules.messages.minLength;
      isValid = false;
    } else if (value.length > rules.maxLength) {
      errorMessage = rules.messages.maxLength;
      isValid = false;
    } else if (!rules.pattern.test(value)) {
      errorMessage = rules.messages.pattern;
      isValid = false;
    }

    if (!isValid) {
      field.classList.add("input-error");

      // SECURITY: XSS
      errorElement.textContent = errorMessage;
      errorElement.style.display = "block";
    } else {
      field.classList.remove("input-error");
      errorElement.style.display = "none";

      // SECURITY: XSS
      errorElement.textContent = "";
    }

    return isValid;
  }

  async function handleFormSubmit(event) {
    // FORM SUBMISSION: Prevent reload with preventDefault
    event.preventDefault();

    resetFormErrors();

    const username = elements.username.value.trim();
    const password = elements.password.value.trim();

    // CLIENT-SIDE VALIDATION: Validate before sending to server
    const isUsernameValid = validateField("username");
    const isPasswordValid = validateField("password");

    if (!isUsernameValid || !isPasswordValid) {
      return;
    }

    try {
      setLoadingState(true);

      // AJAX REQUEST: Use Fetch API to send login request
      const response = await fetch(API.login, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await response.json();

      if (result.success) {
        showStatusMessage(
          result.message || "Login successful! Redirecting...",
          "success"
        );

        setTimeout(() => {
          window.location.href = API.dashboard;
        }, 1500);
      } else {
        showStatusMessage(
          result.message || "Login failed. Please try again.",
          "error"
        );
      }
    } catch (error) {
      console.error("Login error:", error);
      showStatusMessage(
        "A network error occurred. Please check your connection.",
        "error"
      );
    } finally {
      setLoadingState(false);
    }
  }

  function togglePasswordVisibility() {
    const passwordField = elements.password;
    const newType = passwordField.type === "password" ? "text" : "password";
    passwordField.type = newType;

    const iconContainer = elements.togglePassword.querySelector(".toggle-icon");

    while (iconContainer.firstChild) {
      iconContainer.removeChild(iconContainer.firstChild);
    }

    const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgEl.setAttribute("width", "20");
    svgEl.setAttribute("height", "20");
    svgEl.setAttribute("viewBox", "0 0 24 24");
    svgEl.setAttribute("fill", "none");
    svgEl.setAttribute("stroke", "currentColor");
    svgEl.setAttribute("stroke-width", "2");
    svgEl.setAttribute("stroke-linecap", "round");
    svgEl.setAttribute("stroke-linejoin", "round");

    if (newType === "password") {
      const pathEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      pathEl.setAttribute("d", "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z");

      const circleEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circleEl.setAttribute("cx", "12");
      circleEl.setAttribute("cy", "12");
      circleEl.setAttribute("r", "3");

      svgEl.appendChild(pathEl);
      svgEl.appendChild(circleEl);
    } else {
      const pathEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path"
      );
      pathEl.setAttribute(
        "d",
        "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"
      );

      const lineEl = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "line"
      );
      lineEl.setAttribute("x1", "1");
      lineEl.setAttribute("y1", "1");
      lineEl.setAttribute("x2", "23");
      lineEl.setAttribute("y2", "23");

      svgEl.appendChild(pathEl);
      svgEl.appendChild(lineEl);
    }

    iconContainer.appendChild(svgEl);
  }

  function setLoadingState(isLoading) {
    if (isLoading) {
      elements.loginButton.classList.add("loading");
      elements.loginButton.disabled = true;
    } else {
      elements.loginButton.classList.remove("loading");
      elements.loginButton.disabled = false;
    }
  }

  function resetFormErrors() {
    document.querySelectorAll(".field-error").forEach((el) => {
      el.style.display = "none";

      // SECURITY: XSS
      el.textContent = "";
    });

    document.querySelectorAll("input").forEach((input) => {
      input.classList.remove("input-error");
    });

    elements.statusMessage.style.display = "none";
  }

  function showStatusMessage(message, type = "error") {
    const statusElement = elements.statusMessage;

    statusElement.classList.remove("status-error", "status-success");

    statusElement.classList.add(`status-${type}`);

    statusElement.style.display = "block";

    // SECURITY: XSS
    statusElement.textContent = message;
  }

  initializeEventListeners();
});
