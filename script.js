// Número de WhatsApp de la clínica: código de país + número, sin espacios ni símbolos.
// Reemplázalo por el número real.
const WHATSAPP_NUMBER = "520000000000";

const form = document.getElementById("booking-form");
const errorBox = document.getElementById("form-error");
const success = document.getElementById("form-success");
const successTitle = document.getElementById("success-title");
const summary = document.getElementById("summary");
const stamp = success.querySelector(".stamp--success");
const waLink = document.getElementById("wa-link");
const dateInput = document.getElementById("fecha");
const serviceSelect = document.getElementById("servicio");
const nameInput = document.getElementById("nombre");

document.getElementById("year").textContent = new Date().getFullYear();
document.getElementById("wa-direct").href = `https://wa.me/${WHATSAPP_NUMBER}`;

// No permitir fechas pasadas
const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
dateInput.min = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

function parseDate(value) {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDate(value) {
  return parseDate(value).toLocaleDateString("es-MX", { weekday: "long", day: "numeric", month: "long" });
}

function validate(data) {
  if (!data.nombre || !data.telefono || !data.servicio || !data.fecha || !data.hora) {
    return "Completa todos los renglones para continuar.";
  }
  if (data.telefono.replace(/\D/g, "").length < 10) {
    return "Escribe un teléfono de al menos 10 dígitos.";
  }
  if (data.fecha < dateInput.min) {
    return "Elige un día a partir de hoy.";
  }
  if (parseDate(data.fecha).getDay() === 0) {
    return "Los domingos está cerrado. Elige otro día.";
  }
  return "";
}

function showForm() {
  success.hidden = true;
  form.hidden = false;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, v.trim()]));

  form.querySelectorAll("input, select").forEach((field) => {
    field.closest(".line").classList.toggle("is-invalid", !field.value.trim());
  });

  const error = validate(data);
  errorBox.textContent = error;
  if (error) return;

  const rows = [
    ["Paciente", data.nombre],
    ["Teléfono", data.telefono],
    ["Tratamiento", data.servicio],
    ["Día", formatDate(data.fecha)],
    ["Hora", data.hora],
  ];

  summary.replaceChildren(...rows.map(([label, value]) => {
    const row = document.createElement("div");
    const dt = document.createElement("dt");
    const dd = document.createElement("dd");
    dt.textContent = label;
    dd.textContent = value;
    row.append(dt, dd);
    return row;
  }));

  const message =
    "Hola, Sonrisa Imperial. Me gustaría agendar una cita:\n\n" +
    rows.map(([label, value]) => `• ${label}: ${value}`).join("\n");

  waLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  form.hidden = true;
  success.hidden = false;

  // Sellar la tarjeta y llevar el foco al resumen
  stamp.classList.remove("is-pressed");
  void stamp.offsetWidth;
  stamp.classList.add("is-pressed");
  successTitle.focus();
});

form.addEventListener("input", (event) => {
  event.target.closest(".line")?.classList.remove("is-invalid");
  errorBox.textContent = "";
});

document.getElementById("edit-booking").addEventListener("click", () => {
  showForm();
  nameInput.focus();
});

// Agendar desde un servicio: lo deja elegido en la tarjeta
document.querySelectorAll("[data-service]").forEach((link) => {
  link.addEventListener("click", () => {
    showForm();
    serviceSelect.value = link.dataset.service;
    serviceSelect.closest(".line").classList.remove("is-invalid");
    setTimeout(() => nameInput.focus({ preventScroll: true }), 400);
  });
});
