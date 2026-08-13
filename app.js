(function () {
  "use strict";

  // =========================================================
  // NAVIGATION
  // =========================================================

  const buttons = document.querySelectorAll(".control");

  const sections = document.querySelectorAll("header[id], section[id]");

  let isNavigating = false;
  let navigationTimer;

  // ---------------------------------------------------------
  // Set active navigation button
  // ---------------------------------------------------------

  function setActiveButton(id) {
    buttons.forEach((button) => {
      button.classList.remove("active-btn");
    });

    const activeButton = document.querySelector(`.control[data-id="${id}"]`);

    if (activeButton) {
      activeButton.classList.add("active-btn");
    }
  }

  // ---------------------------------------------------------
  // Navigation button click
  // ---------------------------------------------------------

  buttons.forEach((button) => {
    button.addEventListener("click", function () {
      const targetId = this.dataset.id;
      const targetSection = document.getElementById(targetId);

      if (!targetSection) {
        return;
      }

      // Immediately activate the clicked button
      setActiveButton(targetId);

      // Stop observer from changing active button
      // while smooth scrolling is happening
      isNavigating = true;

      clearTimeout(navigationTimer);

      const headerOffset = 20;

      const targetPosition =
        targetSection.getBoundingClientRect().top +
        window.pageYOffset -
        headerOffset;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });

      // Wait until the smooth scrolling is finished
      navigationTimer = setTimeout(() => {
        isNavigating = false;

        // Make sure the correct button remains active
        setActiveButton(targetId);
      }, 1000);
    });
  });

  // =========================================================
  // DETECT CURRENT SECTION WHILE MANUALLY SCROLLING
  // =========================================================

  const observerOptions = {
    root: null,

    // This creates a comfortable detection area
    // instead of waiting for 50% of the section.
    rootMargin: "-20% 0px -60% 0px",

    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    // Don't allow observer to fight with button navigation
    if (isNavigating) {
      return;
    }

    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setActiveButton(entry.target.id);
      }
    });
  }, observerOptions);

  // Observe all sections
  sections.forEach((section) => {
    sectionObserver.observe(section);
  });

  // =========================================================
  // THEME BUTTON
  // =========================================================

  const themeButton = document.querySelector(".theme-btn");

  if (themeButton) {
    themeButton.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
    });
  }

  // =========================================================
  // CONTACT FORM
  // =========================================================

  const form = document.querySelector(".contact-form");

  if (form) {
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const subject = document.getElementById("sub");
    const message = document.getElementById("msg");

    const nameError = document.getElementById("nameError");
    const emailError = document.getElementById("emailError");
    const subError = document.getElementById("subError");
    const msgError = document.getElementById("msgError");

    const nameRegex = /^[A-Za-z\s]+$/;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

    // =====================================================
    // NAME VALIDATION
    // =====================================================

    if (name) {
      name.addEventListener("focus", () => {
        if (nameError) {
          nameError.style.display = "none";
        }
      });

      name.addEventListener("focusout", () => {
        if (!name.value.trim() || !nameRegex.test(name.value)) {
          if (nameError) {
            nameError.textContent = "Enter a valid Name";

            nameError.style.display = "block";
          }
        }
      });
    }

    // =====================================================
    // EMAIL VALIDATION
    // =====================================================

    if (email) {
      email.addEventListener("focus", () => {
        if (emailError) {
          emailError.style.display = "none";
        }
      });

      email.addEventListener("focusout", () => {
        if (!email.value.trim() || !emailRegex.test(email.value)) {
          if (emailError) {
            emailError.textContent = "Enter a valid Email";

            emailError.style.display = "block";
          }
        }
      });
    }

    // =====================================================
    // SUBJECT VALIDATION
    // =====================================================

    if (subject) {
      subject.addEventListener("focus", () => {
        if (subError) {
          subError.style.display = "none";
        }
      });

      subject.addEventListener("focusout", () => {
        if (!subject.value.trim()) {
          if (subError) {
            subError.textContent = "Enter a Subject";

            subError.style.display = "block";
          }
        }
      });
    }

    // =====================================================
    // MESSAGE VALIDATION
    // =====================================================

    if (message) {
      message.addEventListener("focus", () => {
        if (msgError) {
          msgError.style.display = "none";
        }
      });

      message.addEventListener("focusout", () => {
        if (!message.value.trim()) {
          if (msgError) {
            msgError.textContent = "Enter a message";

            msgError.style.display = "block";
          }
        }
      });
    }

    // =====================================================
    // FORM SUBMISSION
    // =====================================================

    form.addEventListener("submit", async function (event) {
      event.preventDefault();

      let isValid = true;

      // -------------------------------------------------
      // Validate name
      // -------------------------------------------------

      if (name && (!name.value.trim() || !nameRegex.test(name.value))) {
        if (nameError) {
          nameError.textContent = "Enter a valid Name";

          nameError.style.display = "block";
        }

        isValid = false;
      }

      // -------------------------------------------------
      // Validate email
      // -------------------------------------------------

      if (email && (!email.value.trim() || !emailRegex.test(email.value))) {
        if (emailError) {
          emailError.textContent = "Enter a valid Email";

          emailError.style.display = "block";
        }

        isValid = false;
      }

      // -------------------------------------------------
      // Validate subject
      // -------------------------------------------------

      if (subject && !subject.value.trim()) {
        if (subError) {
          subError.textContent = "Enter a Subject";

          subError.style.display = "block";
        }

        isValid = false;
      }

      // -------------------------------------------------
      // Validate message
      // -------------------------------------------------

      if (message && !message.value.trim()) {
        if (msgError) {
          msgError.textContent = "Enter a message";

          msgError.style.display = "block";
        }

        isValid = false;
      }

      if (!isValid) {
        return;
      }

      // -------------------------------------------------
      // Submit form
      // -------------------------------------------------

      const formData = new FormData(form);

      const object = Object.fromEntries(formData.entries());

      const json = JSON.stringify(object);

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",

          headers: {
            "Content-Type": "application/json",

            Accept: "application/json",
          },

          body: json,
        });

        if (response.status === 200) {
          window.location.href = "success.html";
        } else {
          const result = await response.json();

          alert(result.message || "Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Form submission error:", error);

        alert(
          "Unable to send your message. Please check your internet connection and try again.",
        );
      }
    });
  }
})();
