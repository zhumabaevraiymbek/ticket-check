import { useState, useEffect } from "react";

// ─── Read ui_locales from URL (sent by Viasat IFC portal) ────────────────────
function getInitialLang() {
  const params = new URLSearchParams(window.location.search);
  const locale = params.get("ui_locales") || "";
  const code = locale.split("-")[0].toLowerCase();
  if (code === "kk" || code === "kz") return "kz";
  if (code === "ru") return "ru";
  if (code === "en") return "en";
  return "ru"; // default
}
// ─────────────────────────────────────────────────────────────────────────────

// ─── API PLACEHOLDER ──────────────────────────────────────────────────────────
async function checkTicket({ ticketNumber, surname, ffpNumber }) {
  // TODO: replace with real API call
  // const res = await fetch("/api/check-ticket", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ ticketNumber, surname, ffpNumber }),
  // });
  // if (!res.ok) throw new Error("not_found");
  // return await res.json();

  await new Promise((r) => setTimeout(r, 1200));
  if (ticketNumber === "4651111111111" && surname.toUpperCase() === "TEST") {
    if (ffpNumber && ffpNumber.length === 9) {
      return { found: true, passengerName: "TEST USER", flight: "KC 931", date: "15 MAR 2026", from: "ALA", to: "NQZ" };
    }
    throw new Error("not_found");
  }
  if (ticketNumber === "9876543210" && surname.toUpperCase() === "IVANOV") {
    return { found: true, passengerName: "IVANOV IVAN", flight: "KC 931", date: "15 MAR 2026", from: "ALA", to: "NQZ" };
  }
  if (ffpNumber && ffpNumber.length === 9) {
    return { found: true, passengerName: surname.toUpperCase(), flight: "KC 932", date: "16 MAR 2026", from: "NQZ", to: "ALA" };
  }
  throw new Error("not_found");
}
// ─────────────────────────────────────────────────────────────────────────────

// ─── TRANSLATIONS ─────────────────────────────────────────────────────────────
const i18n = {
  ru: {
    title: "Проверка бронирования",
    subtitle: "Введите данные для поиска билета",
    ticketLabel: "Номер билета",
    ticketPlaceholder: "465-1231231222",
    ticketHint: "Только цифры, например: 465-1231231222",
    surnameLabel: "Фамилия",
    surnamePlaceholder: "Введите фамилию",
    surnameHint: "Латиницей, как указано в билете",
    submitBtn: "Проверить бронирование",
    checking: "Проверяем...",
    checkAnother: "Проверить другой билет",
    errorTitle: "Бронирование не найдено",
    errorHint: "Попробуйте ввести номер участника программы лояльности Nomad Club.",
    errorHintFinal: "Пожалуйста, свяжитесь с нами для уточнения данных.",
    ffpLabel: "Номер участника Nomad Club",
    ffpPlaceholder: "Введите 9-значный номер",
    ffpHint: "9-значный номер участника",
    successTitle: "Бронирование найдено!",
    passenger: "Пассажир",
    flight: "Рейс",
    date: "Дата",
    helpText: "Нужна помощь?",
    helpLink: "Свяжитесь с нами",
    footer: "© 2026 Air Astana",
  },
  kz: {
    title: "Брондауды тексеру",
    subtitle: "Билетті іздеу үшін деректерді енгізіңіз",
    ticketLabel: "Билет нөмірі",
    ticketPlaceholder: "465-1231231222",
    ticketHint: "Тек сандар, мысалы: 465-1231231222",
    surnameLabel: "Тегі",
    surnamePlaceholder: "Тегіңізді енгізіңіз",
    surnameHint: "Билетте көрсетілгендей, латын әріптерімен",
    submitBtn: "Брондауды тексеру",
    checking: "Тексерілуде...",
    checkAnother: "Басқа билетті тексеру",
    errorTitle: "Брондау табылмады",
    errorHint: "Nomad Club адалдық бағдарламасының мүше нөмірін енгізіп көріңіз.",
    errorHintFinal: "Деректерді нақтылау үшін бізбен хабарласыңыз.",
    ffpLabel: "Nomad Club мүшесінің нөмірі",
    ffpPlaceholder: "9 таңбалы нөмірді енгізіңіз",
    ffpHint: "9 таңбалы мүше нөмірі",
    successTitle: "Брондау табылды!",
    passenger: "Жолаушы",
    flight: "Рейс",
    date: "Күні",
    helpText: "Көмек керек пе?",
    helpLink: "Бізбен байланысыңыз",
    footer: "© 2026 Air Astana",
  },
  en: {
    title: "Booking Verification",
    subtitle: "Enter your details to find your ticket",
    ticketLabel: "Ticket Number",
    ticketPlaceholder: "465-1231231222",
    ticketHint: "Digits only, e.g.: 465-1231231222",
    surnameLabel: "Last Name",
    surnamePlaceholder: "Enter last name",
    surnameHint: "As shown on your ticket, in Latin letters",
    submitBtn: "Check Booking",
    checking: "Checking...",
    checkAnother: "Check Another Ticket",
    errorTitle: "Booking Not Found",
    errorHint: "Please enter your Nomad Club loyalty programme member number.",
    errorHintFinal: "Please contact us to clarify your details.",
    ffpLabel: "Nomad Club Member Number",
    ffpPlaceholder: "Enter 9-digit number",
    ffpHint: "9-digit member number",
    successTitle: "Booking Found!",
    passenger: "Passenger",
    flight: "Flight",
    date: "Date",
    helpText: "Need help?",
    helpLink: "Contact us",
    footer: "© 2026 Air Astana",
  },
};
// ─────────────────────────────────────────────────────────────────────────────

// ─── Brand tokens (updated per guidelines) ────────────────────────────────────
const NAVY = "#13235C";
const GOLD = "#8D7036";
const BG   = "#EEEEF0";
// ─────────────────────────────────────────────────────────────────────────────

function formatTicketDisplay(digits) {
  if (digits.length <= 3) return digits;
  return digits.slice(0, 3) + "-" + digits.slice(3);
}
function parseTicketInput(raw) {
  return raw.replace(/\D/g, "").slice(0, 13);
}
function parseSurnameInput(raw) {
  return raw.replace(/[^a-zA-Z ]/g, "").toUpperCase().slice(0, 40);
}

// ─── SVG Logos (inline from Figma exports) ────────────────────────────────────
function AirAstanaLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, justifyContent: "center" }}>
      {/* Vector mark */}
      <svg height="40" viewBox="0 0 139 172" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M133.158 129.057C136.849 124.654 139 118.9 139 112.721C139 106.932 137.029 101.57 133.767 97.308C130.649 93.1883 125.666 90.4893 120.111 90.4893C112.153 90.4893 105.451 95.9229 103.551 103.31C103.264 104.34 103.085 105.37 103.049 106.4C103.049 106.577 103.049 106.79 103.049 106.968C103.049 107.039 103.049 107.145 103.049 107.216C103.049 107.216 103.049 107.252 103.049 107.287C103.049 110.377 105.522 112.863 108.605 112.863C111.15 112.863 113.3 111.158 113.946 108.814C114.089 108.353 114.161 107.891 114.161 107.394C114.232 106.328 114.161 105.228 114.447 104.162C114.698 103.274 115.415 102.173 116.275 101.605C117.064 101.072 117.996 100.646 119.035 100.646C126.813 100.646 130.111 115.527 120.899 122.913C118.032 125.186 114.196 127.317 108.605 127.317C97.3502 127.317 88.5328 118.403 88.5328 107.358C88.5328 103.914 89.393 100.575 91.0059 97.6986C91.6511 96.5622 93.1565 94.5734 93.1565 94.5734C83.4072 96.0295 75.45 96.9883 68.4247 92.7267C65.8798 91.1996 63.4067 89.0332 61.0769 85.766C63.4067 82.4632 65.8798 80.3323 68.4247 78.8052C75.45 74.5436 83.4072 75.5024 93.1565 76.9585C93.1565 76.9585 91.6511 74.9342 91.0059 73.8333C89.393 70.9567 88.5328 67.6184 88.5328 64.1735C88.5328 53.1287 97.3502 44.2147 108.605 44.2147C114.196 44.2147 118.032 46.3456 120.899 48.6185C130.111 55.9698 126.813 70.8857 119.035 70.8857C117.996 70.8857 117.064 70.4595 116.275 69.9268C115.415 69.3586 114.698 68.2576 114.447 67.3698C114.161 66.3399 114.232 65.2034 114.161 64.138C114.161 63.6408 114.089 63.1791 113.946 62.7175C113.265 60.3735 111.15 58.6689 108.605 58.6689C105.522 58.6689 103.049 61.1549 103.049 64.2446C103.049 64.2446 103.049 64.2801 103.049 64.3156C103.049 64.3866 103.049 64.4932 103.049 64.5642C103.049 64.7773 103.049 64.9548 103.049 65.1324C103.049 66.1623 103.264 67.1922 103.551 68.2221C105.487 75.609 112.153 81.0426 120.111 81.0426C125.702 81.0426 130.649 78.3791 133.767 74.2239C137.064 69.9623 139 64.5997 139 58.8109C139 52.6315 136.849 46.8783 133.158 42.4746C130.254 39.0297 126.383 36.3662 122.01 34.9101H122.082C131.975 27.7363 138.462 16.0878 138.462 2.91214C138.462 1.91775 138.427 0.958874 138.355 0L0 85.8015L138.355 171.532C138.427 170.573 138.462 169.614 138.462 168.62C138.462 155.444 132.011 143.796 122.082 136.657H122.01C126.383 135.13 130.218 132.502 133.158 129.057Z" fill="#A48C5D"/>
      </svg>
      {/* "airnet" wordmark */}
      <svg height="24" viewBox="0 0 337 95" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M51.2419 89.6417C45.6856 92.4816 37.166 94.4571 27.1646 94.4571C9.63138 94.4571 0.000459334 87.4192 0.000459334 73.8371C0.000459334 57.5386 16.1755 51.7354 37.166 49.7598V46.179C37.166 38.4002 32.8444 34.943 24.4482 34.943C18.5215 34.943 11.8539 36.7951 7.16192 39.1411L3.82813 30.251C10.0018 27.4111 18.398 25.1886 26.3003 25.1886C41.611 25.1886 51.2419 32.1031 51.2419 48.1546V89.6417ZM37.166 84.0854V57.0447C22.3491 58.6499 14.1999 63.0949 14.1999 73.3432C14.1999 81.4924 19.0154 85.9375 28.1524 85.9375C31.6096 85.9375 35.0669 85.1966 37.166 84.0854ZM83.6575 7.65535C83.6575 11.8534 79.8299 15.1872 75.2614 15.1872C70.6928 15.1872 66.8652 11.8534 66.8652 7.65535C66.8652 3.45726 70.6928 1.92878e-06 75.2614 1.92878e-06C79.8299 1.92878e-06 83.6575 3.45726 83.6575 7.65535ZM82.7932 93.0989H67.7295V26.5468H82.7932V93.0989ZM131.413 25.6825L128.326 36.4246C126.35 35.5603 123.881 35.0664 121.535 35.0664C118.819 35.0664 116.102 35.5603 114.373 36.4246V93.0989H99.3097V30.004C105.236 27.1641 113.509 25.312 124.251 25.312C126.968 25.312 130.178 25.559 131.413 25.6825ZM224.498 93.0989H209.434V47.5373C209.434 38.8941 205.977 34.696 196.717 34.696C193.013 34.696 189.802 35.1899 186.962 36.4246V93.0989H171.899V30.1275C178.813 27.1641 187.456 25.312 196.717 25.312C216.102 25.312 224.498 33.4613 224.498 47.6607V93.0989ZM293.725 59.2672L252.732 65.3174C253.843 76.9239 260.388 83.8384 271.377 83.8384C277.427 83.8384 283.971 82.1098 287.799 80.0108L291.379 89.6417C285.947 92.4816 277.674 94.4571 269.278 94.4571C249.151 94.4571 238.039 80.5047 238.039 59.6376C238.039 38.7706 248.658 25.1886 266.685 25.1886C283.971 25.1886 293.725 36.5481 293.725 57.2917V59.2672ZM279.279 53.3405C279.155 41.2401 275.204 34.2021 266.191 34.2021C256.683 34.2021 251.868 43.2157 251.868 56.3039V57.6621L279.279 53.3405ZM336.464 92.4816C334.488 93.4694 331.648 93.9633 328.314 93.9633C317.202 93.9633 310.534 87.2957 310.534 75.5657V36.0542H303.126V26.5468H310.534V11.8534L325.598 7.65535V26.5468H336.464V36.0542H325.598V75.5657C325.598 80.6281 328.067 83.5915 332.759 83.5915C334.118 83.5915 335.352 83.3445 336.464 82.9741V92.4816Z" fill="#13235C"/>
      </svg>
    </div>
  );
}

function Spinner() {
  return (
    <svg style={{ animation: "spin 0.8s linear infinite" }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z" />
    </svg>
  );
}
function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
    </svg>
  );
}
function CardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2" /><line x1="2" y1="10" x2="22" y2="10" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}
function PlaneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
    </svg>
  );
}

function LangSwitcher({ lang, setLang }) {
  const langs = [
    { code: "kz", label: "ҚАЗ" },
    { code: "ru", label: "РУС" },
    { code: "en", label: "ENG" },
  ];
  return (
    <div style={{ display: "flex", gap: 4, background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: 3 }}>
      {langs.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => setLang(l.code)}
          style={{
            background: lang === l.code ? "white" : "transparent",
            color: lang === l.code ? NAVY : "rgba(255,255,255,0.8)",
            border: "none", borderRadius: 6, padding: "4px 10px",
            fontSize: 11, fontWeight: 700, cursor: "pointer",
            fontFamily: "'DaxPro', sans-serif", letterSpacing: "0.04em",
            transition: "all 0.18s",
            boxShadow: lang === l.code ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}

function InputField({ id, label, value, onChange, placeholder, hint, icon, autoFocus = false, maxLength }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label htmlFor={id} style={{ display: "block", fontSize: 13, fontWeight: 500, color: NAVY, marginBottom: 6, fontFamily: "'DaxPro-Medium', sans-serif" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <div style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: focused ? GOLD : "#9CA3AF", transition: "color 0.2s" }}>
          {icon}
        </div>
        <input
          id={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%", paddingLeft: 44, paddingRight: 16, paddingTop: 11, paddingBottom: 11,
            border: `1.5px solid ${focused ? NAVY : "#D1D5DB"}`, borderRadius: 8, outline: "none",
            background: "white", color: NAVY, fontSize: 15,
            fontFamily: "'DaxPro', sans-serif",
            transition: "border-color 0.2s, box-shadow 0.2s",
            boxShadow: focused ? `0 0 0 3px ${NAVY}15` : "none",
            boxSizing: "border-box",
          }}
        />
      </div>
      {hint && <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 5, fontFamily: "'DaxPro', sans-serif" }}>{hint}</p>}
    </div>
  );
}

function FlightResult({ data, t }) {
  return (
    <div style={{ background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)", border: "1.5px solid #86EFAC", borderRadius: 12, padding: "16px 20px", animation: "slideDown 0.3s ease" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <CheckIcon />
        <span style={{ color: "#15803D", fontWeight: 700, fontSize: 15, fontFamily: "'DaxPro-Bold', sans-serif" }}>{t.successTitle}</span>
      </div>
      <div style={{ background: "white", borderRadius: 10, padding: "14px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4, fontFamily: "'DaxPro', sans-serif" }}>{t.passenger}</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 12, fontFamily: "'DaxPro-Bold', sans-serif" }}>{data.passengerName}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: NAVY, letterSpacing: "-0.5px", fontFamily: "'DaxPro-Bold', sans-serif" }}>{data.from}</span>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
            <span style={{ color: GOLD }}><PlaneIcon /></span>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: NAVY, letterSpacing: "-0.5px", fontFamily: "'DaxPro-Bold', sans-serif" }}>{data.to}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
          <div>
            <div style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "'DaxPro', sans-serif" }}>{t.flight}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: NAVY, fontFamily: "'DaxPro-Medium', sans-serif" }}>{data.flight}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "'DaxPro', sans-serif" }}>{t.date}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: NAVY, fontFamily: "'DaxPro-Medium', sans-serif" }}>{data.date}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState(getInitialLang);
  const [ticketNumber, setTicketNumber] = useState("");
  const [surname, setSurname] = useState("");
  const [ffpNumber, setFfpNumber] = useState("");
  const [status, setStatus] = useState("idle");
  const [result, setResult] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const t = i18n[lang];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setResult(null);
    try {
      const data = await checkTicket({ ticketNumber, surname, ffpNumber });
      setResult(data);
      setStatus("success");
      setAttempts(0);
    } catch {
      setStatus("error");
      setAttempts((a) => a + 1);
    }
  };

  const handleReset = () => {
    setTicketNumber(""); setSurname(""); setFfpNumber("");
    setStatus("idle"); setResult(null); setAttempts(0);
  };

  return (
    <>
      <style>{`
        @font-face {
          font-family: 'DaxPro';
          src: url('/fonts/DaxPro.otf') format('opentype');
          font-weight: 400;
        }
        @font-face {
          font-family: 'DaxPro-Medium';
          src: url('/fonts/DaxPro-Medium.otf') format('opentype');
          font-weight: 500;
        }
        @font-face {
          font-family: 'DaxPro-Bold';
          src: url('/fonts/DaxPro-Bold.otf') format('opentype');
          font-weight: 700;
        }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DaxPro', sans-serif; background: ${BG}; }
        input::placeholder { color: #9A9A9A; font-family: 'DaxPro', sans-serif; }
        .submit-btn:hover:not(:disabled) { background: #7A6030 !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(141,112,54,0.4) !important; }
        .submit-btn:active:not(:disabled) { transform: translateY(0) !important; }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .link:hover { text-decoration: underline; }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: BG,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "32px 16px", fontFamily: "'DaxPro', sans-serif",
      }}>
        <div style={{ width: "100%", maxWidth: 440 }}>

          {/* Logo */}
          <div style={{ marginBottom: 28 }}>
            <AirAstanaLogo />
          </div>

          {/* Card */}
          <div style={{ background: "white", borderRadius: 12, boxShadow: "0 4px 24px rgba(19,35,92,0.08), 0 1px 4px rgba(0,0,0,0.04)", overflow: "hidden" }}>

            {/* Header */}
            <div style={{ background: NAVY, padding: "20px 24px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
              <div style={{ position: "absolute", bottom: -30, right: 40, width: 80, height: 80, borderRadius: "50%", background: "rgba(141,112,54,0.15)" }} />
              <div style={{ position: "relative", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <h1 style={{ color: "white", fontSize: 20, fontWeight: 700, fontFamily: "'DaxPro-Bold', sans-serif", lineHeight: 1.3 }}>{t.title}</h1>
                  <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4, fontFamily: "'DaxPro', sans-serif" }}>{t.subtitle}</p>
                </div>
                <LangSwitcher lang={lang} setLang={setLang} />
              </div>
            </div>

            {/* Form */}
            <div style={{ padding: "28px 28px 24px" }}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                <InputField
                  id="ticketNumber"
                  label={t.ticketLabel}
                  value={formatTicketDisplay(ticketNumber)}
                  onChange={(e) => setTicketNumber(parseTicketInput(e.target.value))}
                  placeholder={t.ticketPlaceholder}
                  hint={t.ticketHint}
                  icon={<TicketIcon />}
                  maxLength={17}
                />

                <InputField
                  id="surname"
                  label={t.surnameLabel}
                  value={surname}
                  onChange={(e) => setSurname(parseSurnameInput(e.target.value))}
                  placeholder={t.surnamePlaceholder}
                  hint={t.surnameHint}
                  icon={<UserIcon />}
                />

                {status === "error" && (
                  <div style={{ animation: "slideDown 0.3s ease" }}>
                    <div style={{ background: "#FEF2F2", border: "1.5px solid #FCA5A5", borderRadius: 10, padding: "12px 16px", display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 14 }}>
                      <AlertIcon />
                      <div>
                        <p style={{ fontSize: 13, color: "#DC2626", fontWeight: 600, fontFamily: "'DaxPro-Bold', sans-serif" }}>{t.errorTitle}</p>
                        <p style={{ fontSize: 12, color: "#991B1B", marginTop: 3, lineHeight: 1.5, fontFamily: "'DaxPro', sans-serif" }}>
                          {attempts >= 2 ? t.errorHintFinal : t.errorHint}
                        </p>
                      </div>
                    </div>
                    {attempts < 3 && (
                      <InputField
                        id="ffpNumber"
                        label={t.ffpLabel}
                        value={ffpNumber}
                        onChange={(e) => setFfpNumber(e.target.value.replace(/\D/g, "").slice(0, 9))}
                        placeholder={t.ffpPlaceholder}
                        hint={t.ffpHint}
                        icon={<CardIcon />}
                        maxLength={9}
                        autoFocus
                      />
                    )}
                  </div>
                )}

                {status === "success" && result && <FlightResult data={result} t={t} />}

                {status !== "success" ? (
                  <button
                    type="submit"
                    disabled={status === "loading" || !ticketNumber || !surname}
                    className="submit-btn"
                    style={{
                      width: "100%", background: GOLD, color: "white", border: "none", borderRadius: 8,
                      padding: "13px 24px", fontSize: 15, fontWeight: 700, cursor: "pointer",
                      fontFamily: "'DaxPro-Bold', sans-serif", display: "flex", alignItems: "center",
                      justifyContent: "center", gap: 10, transition: "all 0.2s",
                      boxShadow: "0 2px 12px rgba(141,112,54,0.25)", marginTop: 4,
                    }}
                  >
                    {status === "loading" ? <><Spinner /> {t.checking}</> : t.submitBtn}
                  </button>
                ) : (
                  <button type="button" onClick={handleReset} style={{
                    width: "100%", background: "transparent", color: NAVY,
                    border: `1.5px solid ${NAVY}30`, borderRadius: 8, padding: "12px 24px",
                    fontSize: 14, fontWeight: 600, cursor: "pointer",
                    fontFamily: "'DaxPro-Medium', sans-serif", marginTop: 4,
                  }}>
                    {t.checkAnother}
                  </button>
                )}
              </form>

              <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid #F0F0F0", textAlign: "center" }}>
                <p style={{ fontSize: 12, color: "#9CA3AF", fontFamily: "'DaxPro', sans-serif" }}>
                  {t.helpText}{" "}
                  <a href="#" className="link" style={{ color: NAVY, fontWeight: 600, textDecoration: "none", fontFamily: "'DaxPro-Medium', sans-serif" }}>{t.helpLink}</a>
                </p>
              </div>
            </div>
          </div>

          <p style={{ textAlign: "center", fontSize: 12, color: "#9A9A9A", marginTop: 20, fontFamily: "'DaxPro', sans-serif" }}>{t.footer}</p>
        </div>
      </div>
    </>
  );
}
