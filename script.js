// Número de WhatsApp de la clínica: código de país + número, sin espacios ni símbolos.
// Reemplázalo por el número real.
const WHATSAPP_NUMBER = "520000000000";

const form = document.getElementById("booking-form");
const errorBox = document.getElementById("form-error");
const success = document.getElementById("form-success");
const summary = document.getElementById("summary");
const waLink = document.getElementById("wa-link");
const dateInput = document.getElementById("fecha");

document.getElementById("year").textContent = new Date().getFullYear();

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
    return "Completa todos los campos para continuar.";
  }
  if (data.telefono.replace(/\D/g, "").length < 10) {
    return "Escribe un teléfono de al menos 10 dígitos.";
  }
  if (data.fecha < dateInput.min) {
    return "Elige una fecha a partir de hoy.";
  }
  if (parseDate(data.fecha).getDay() === 0) {
    return "Los domingos está cerrado. Elige otro día.";
  }
  return "";
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, v.trim()]));

  form.querySelectorAll("input, select").forEach((field) => {
    field.classList.toggle("is-invalid", !field.value.trim());
  });

  const error = validate(data);
  errorBox.textContent = error;
  if (error) return;

  const rows = [
    ["Nombre", data.nombre],
    ["Teléfono", data.telefono],
    ["Servicio", data.servicio],
    ["Fecha", formatDate(data.fecha)],
    ["Horario", data.hora],
  ];

  summary.replaceChildren(...rows.map(([label, value]) => {
    const li = document.createElement("li");
    const a = document.createElement("span");
    const b = document.createElement("span");
    a.textContent = label;
    b.textContent = value;
    li.append(a, b);
    return li;
  }));

  const message =
    "Hola, Sonrisa Imperial. Me gustaría agendar una cita:\n\n" +
    rows.map(([label, value]) => `• ${label}: ${value}`).join("\n");

  waLink.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  form.hidden = true;
  success.hidden = false;
});

form.addEventListener("input", (event) => {
  event.target.classList.remove("is-invalid");
  errorBox.textContent = "";
});

document.getElementById("edit-booking").addEventListener("click", () => {
  success.hidden = true;
  form.hidden = false;
});
