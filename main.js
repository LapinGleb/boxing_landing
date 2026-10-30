(function () {
  var header = document.getElementById("header");
  var nav = document.getElementById("nav");
  var burger = document.getElementById("burger");

  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
  }

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  function closeNav() {
    nav.classList.remove("nav--open");
    header.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    burger.setAttribute("aria-label", "Открыть меню");
    document.body.classList.remove("is-locked");
  }

  function toggleNav() {
    var open = !nav.classList.contains("nav--open");
    nav.classList.toggle("nav--open", open);
    header.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
    burger.setAttribute("aria-label", open ? "Закрыть меню" : "Открыть меню");
    document.body.classList.toggle("is-locked", open);
  }

  burger.addEventListener("click", toggleNav);

  nav.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (nav.classList.contains("nav--open")) closeNav();
    });
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeNav();
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 920) closeNav();
  });

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduceMotion && "IntersectionObserver" in window) {
    document.documentElement.classList.add("is-animatable");

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    document.querySelectorAll(".reveal").forEach(function (element) {
      observer.observe(element);
    });

    setTimeout(function () {
      if (!document.querySelector(".reveal.is-visible")) {
        document.querySelectorAll(".reveal").forEach(function (element) {
          element.classList.add("is-visible");
        });
      }
    }, 1200);
  }

  var form = document.getElementById("signup-form");
  var formError = document.getElementById("form-error");
  var telegramButton = document.getElementById("telegram-send");
  var WHATSAPP_NUMBER = "79000000000";
  var TELEGRAM_URL = "https://t.me/sistema_boxing";

  function field(name) {
    return form.elements.namedItem(name);
  }

  function buildMessage() {
    var lines = [
      "Заявка с сайта «Система»",
      "",
      "Имя: " + field("name").value.trim(),
      "Телефон: " + field("phone").value.trim(),
      "Формат: " + field("format").value,
    ];

    var comment = field("comment").value.trim();
    if (comment) lines.push("Комментарий: " + comment);

    return lines.join("\n");
  }

  function validate() {
    var name = field("name").value.trim();
    var digits = field("phone").value.replace(/\D/g, "");

    if (!name) {
      formError.textContent = "Укажите имя — так понятнее, к кому обращаться.";
      formError.hidden = false;
      field("name").focus();
      return false;
    }

    if (digits.length < 10) {
      formError.textContent = "Укажите телефон — минимум 10 цифр.";
      formError.hidden = false;
      field("phone").focus();
      return false;
    }

    formError.hidden = true;
    return true;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!validate()) return;

    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(buildMessage());
    window.open(url, "_blank", "noopener");
  });

  telegramButton.addEventListener("click", function () {
    if (!validate()) return;

    var message = buildMessage();

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(message).catch(function () {});
    }

    window.open(TELEGRAM_URL, "_blank", "noopener");

    telegramButton.textContent = "Текст скопирован — вставьте в чат";
    setTimeout(function () {
      telegramButton.textContent = "Отправить в Telegram";
    }, 5000);
  });

  form.addEventListener("input", function () {
    if (!formError.hidden) formError.hidden = true;
  });
})();
