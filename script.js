const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".navigation");
if (toggle && nav) {
  const closeNavigation = returnFocus => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  });
  nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => closeNavigation(false)));
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && nav.classList.contains("open")) closeNavigation(true);
  });
  document.addEventListener("click", event => {
    if (nav.classList.contains("open") && !nav.contains(event.target) && !toggle.contains(event.target)) {
      closeNavigation(false);
    }
  });
}

const floatingWhatsApp = document.querySelector(".floating-whatsapp");
const contactSection = document.getElementById("contact");
if (floatingWhatsApp && contactSection && "IntersectionObserver" in window) {
  const contactObserver = new IntersectionObserver(([entry]) => {
    floatingWhatsApp.classList.toggle("is-hidden", entry.isIntersecting);
  }, { threshold: 0.1 });
  contactObserver.observe(contactSection);
}

document.querySelectorAll(".solution-filter").forEach(button => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll(".solution-filter").forEach(filterButton => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    document.querySelectorAll(".solution-card").forEach(card => {
      card.hidden = filter !== "all" && card.dataset.category !== filter;
    });
  });
});

document.querySelectorAll("[data-enquiry-service]").forEach(link => {
  link.addEventListener("click", () => {
    const serviceSelect = document.getElementById("enquiry-service");
    if (serviceSelect) {
      serviceSelect.value = link.dataset.enquiryService;
      serviceSelect.dispatchEvent(new Event("change", { bubbles: true }));
    }
  });
});

const enquiryForm = document.getElementById("enquiry-form");
if (enquiryForm) {
  const nameField = document.getElementById("enquiry-name");
  const serviceField = document.getElementById("enquiry-service");
  const messageField = document.getElementById("enquiry-message");
  const messageCount = document.getElementById("message-count");
  const serviceGuidance = document.getElementById("service-guidance");
  const servicePrompts = {
    "CCTV surveillance": {
      guidance: "Helpful details: property type, areas to cover, and whether you need remote viewing.",
      placeholder: "e.g. I need cameras for a two-storey home and would like to view them remotely."
    },
    "Access control": {
      guidance: "Helpful details: the type of entry point, number of doors, and who needs access.",
      placeholder: "e.g. I need a smart lock for an office entrance used by a small team."
    },
    "Vehicle security": {
      guidance: "Helpful details: vehicle type, how it is used, and whether you need a dashcam or tracking.",
      placeholder: "e.g. I would like GPS tracking for a delivery vehicle."
    },
    "Smart living": {
      guidance: "Helpful details: the rooms or devices you want to connect, and what you want to automate.",
      placeholder: "e.g. I want to control living-room lights from my phone."
    },
    Networking: {
      guidance: "Helpful details: the size of your space, where the connection is weak, and your internet provider.",
      placeholder: "e.g. Wi-Fi is weak in two bedrooms at the far end of my home."
    },
    "Installation and technical support": {
      guidance: "Helpful details: the equipment you have, what you need installed, or the issue you are experiencing.",
      placeholder: "e.g. I need help configuring my existing camera system for remote viewing."
    },
    "More than one service": {
      guidance: "Mention the services you have in mind and any details that apply to your space or vehicles.",
      placeholder: "e.g. I am planning CCTV and Wi-Fi for a small shop."
    }
  };
  const updateServiceGuidance = () => {
    if (!serviceField || !messageField || !serviceGuidance) return;
    const prompt = servicePrompts[serviceField.value];
    serviceGuidance.textContent = prompt
      ? prompt.guidance
      : "Choose a service to see what details can help us advise you.";
    messageField.placeholder = prompt
      ? prompt.placeholder
      : "Tell us what you need help with. There’s no need to have all the details figured out.";
  };
  const updateMessageCount = () => {
    if (messageField && messageCount) {
      messageCount.textContent = `${messageField.value.length} / 1000`;
    }
  };

  if (serviceField) serviceField.addEventListener("change", updateServiceGuidance);
  updateServiceGuidance();
  [nameField, messageField].forEach(field => {
    if (field) field.addEventListener("input", () => field.setCustomValidity(""));
  });
  if (messageField) messageField.addEventListener("input", updateMessageCount);
  updateMessageCount();

  enquiryForm.addEventListener("submit", event => {
    event.preventDefault();
    if (nameField) {
      nameField.setCustomValidity(nameField.value.trim() ? "" : "Please enter your name.");
    }
    if (messageField) {
      messageField.setCustomValidity(
        messageField.value.trim().length >= 12 ? "" : "Please share at least 12 characters about your requirements."
      );
    }
    if (!enquiryForm.reportValidity()) return;

    const formData = new FormData(enquiryForm);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    const service = String(formData.get("service") || "").trim();
    const location = String(formData.get("location") || "").trim();
    const requirements = String(formData.get("message") || "").trim();
    const message = [
      "Hello GridHub Cam Technologies, I'd like to make an enquiry.",
      `Name: ${name}`,
      phone ? `Phone: ${phone}` : "",
      `Service: ${service}`,
      location ? `Location: ${location}` : "",
      `Requirements: ${requirements}`
    ].filter(Boolean).join("\n");
    const whatsappUrl = `https://wa.me/254706230252?text=${encodeURIComponent(message)}`;
    const status = document.getElementById("form-status");
    const fallback = document.getElementById("whatsapp-fallback");
    if (status) status.textContent = "";
    if (fallback) fallback.hidden = true;
    const whatsappWindow = window.open(whatsappUrl, "_blank");

    if (whatsappWindow) {
      whatsappWindow.opener = null;
      if (status) status.textContent = "WhatsApp is open with your enquiry. Review the message and send it when ready.";
    } else {
      if (status) status.textContent = "Your browser blocked the new tab. Use the link below to continue.";
      if (fallback) {
        fallback.href = whatsappUrl;
        fallback.hidden = false;
      }
    }
  });
}

const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
