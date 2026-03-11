import { useState, useRef, useEffect } from "react";

// ─── API PLACEHOLDER ──────────────────────────────────────────────────────────
// Замени эту функцию на реальный вызов когда будет готово API
async function checkTicket({ ticketNumber, surname, ffpNumber }) {
  // TODO: replace with real API call
  // const res = await fetch("/api/check-ticket", {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify({ ticketNumber, surname, ffpNumber }),
  // });
  // if (!res.ok) throw new Error("not_found");
  // return await res.json();

  // Simulation while API not ready:
  await new Promise((r) => setTimeout(r, 1200));
  // ticketNumber here is the raw digits without dash, e.g. "9876543210"
  if (ticketNumber === "4651111111111" && surname.toUpperCase() === "TEST") {
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

const NAVY = "#1E3A5F";
const GOLD = "#A68B5B";

function Spinner() {
  return (
    <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
      <circle cx="12" cy="12" r="10" strokeOpacity="0.3" />
      <path d="M12 2a10 10 0 0 1 10 10" />
    </svg>
  );
}

function AirAstanaLogo() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "center" }}>
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
        <path d="M18 3L3 10.5L18 18L33 10.5L18 3Z" fill={GOLD} />
        <path d="M3 18L18 25.5L33 18V25.5L18 33L3 25.5V18Z" fill={NAVY} />
      </svg>
      <span style={{ color: NAVY, fontWeight: 700, fontSize: 24, letterSpacing: "-0.5px", fontFamily: "'Sora', sans-serif" }}>
        air astana
      </span>
    </div>
  );
}

function TicketIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 5v2M15 11v2M15 17v2M5 5h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7a2 2 0 0 1 2-2z"/>
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

function CardIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="5" width="20" height="14" rx="2"/>
      <line x1="2" y1="10" x2="22" y2="10"/>
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
      <polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  );
}

function AlertIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}

function PlaneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
    </svg>
  );
}

// ─── FORMAT HELPERS ──────────────────────────────────────────────────────────
// "9876543210" → "987-6543210"
function formatTicketDisplay(digits) {
  if (digits.length <= 3) return digits;
  return digits.slice(0, 3) + "-" + digits.slice(3);
}

// Strips all non-digits, max 13 digits
function parseTicketInput(raw) {
  return raw.replace(/\D/g, "").slice(0, 13);
}

// Only latin letters + spaces, uppercase
function parseSurnameInput(raw) {
  return raw.replace(/[^a-zA-Z ]/g, "").toUpperCase().slice(0, 40);
}
// ─────────────────────────────────────────────────────────────────────────────

function InputField({ id, label, value, onChange, placeholder, hint, icon, type = "text", autoFocus = false, maxLength }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label htmlFor={id} style={{ display: "block", fontSize: 13, fontWeight: 600, color: NAVY, marginBottom: 6, letterSpacing: "0.01em" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <div style={{
          position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
          color: focused ? GOLD : "#9CA3AF", transition: "color 0.2s"
        }}>
          {icon}
        </div>
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: "100%",
            paddingLeft: 44,
            paddingRight: 16,
            paddingTop: 11,
            paddingBottom: 11,
            border: `1.5px solid ${focused ? NAVY : "#D1D5DB"}`,
            borderRadius: 8,
            outline: "none",
            background: "#FAFAFA",
            color: NAVY,
            fontSize: 15,
            fontFamily: "'Sora', sans-serif",
            transition: "border-color 0.2s, box-shadow 0.2s",
            boxShadow: focused ? `0 0 0 3px ${NAVY}15` : "none",
            boxSizing: "border-box",
          }}
        />
      </div>
      {hint && <p style={{ fontSize: 12, color: "#9CA3AF", marginTop: 5 }}>{hint}</p>}
    </div>
  );
}

function FlightResult({ data }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)",
      border: "1.5px solid #86EFAC",
      borderRadius: 12,
      padding: "16px 20px",
      animation: "slideDown 0.3s ease",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <CheckIcon />
        <span style={{ color: "#15803D", fontWeight: 700, fontSize: 15 }}>Бронирование найдено!</span>
      </div>
      <div style={{
        background: "white",
        borderRadius: 10,
        padding: "14px 16px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}>
        <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 4 }}>Пассажир</div>
        <div style={{ fontSize: 15, fontWeight: 700, color: NAVY, marginBottom: 12 }}>{data.passengerName}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 20, fontWeight: 800, color: NAVY, letterSpacing: "-0.5px" }}>{data.from}</span>
          <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
            <span style={{ color: GOLD }}><PlaneIcon /></span>
            <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
          </div>
          <span style={{ fontSize: 20, fontWeight: 800, color: NAVY, letterSpacing: "-0.5px" }}>{data.to}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
          <div>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>Рейс</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{data.flight}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, color: "#9CA3AF" }}>Дата</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: NAVY }}>{data.date}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TicketCheckPage() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [surname, setSurname] = useState("");
  const [ffpNumber, setFfpNumber] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | error | success
  const [result, setResult] = useState(null);
  const [attempts, setAttempts] = useState(0);

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
    setTicketNumber("");
    setSurname("");
    setFfpNumber("");
    setStatus("idle");
    setResult(null);
    setAttempts(0);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&display=swap');
        @keyframes slideDown { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Sora', sans-serif; }
        input::placeholder { color: #C4C9D4; }
        .submit-btn:hover { background: #8B7449 !important; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(166,139,91,0.4) !important; }
        .submit-btn:active { transform: translateY(0); }
        .submit-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none !important; }
        .link:hover { text-decoration: underline; }
      `}</style>
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #EEF2F7 0%, #F5F5F5 50%, #EDF0F5 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "32px 16px",
        fontFamily: "'Sora', sans-serif",
      }}>
        <div style={{ width: "100%", maxWidth: 420 }}>

          {/* Logo */}
          <div style={{ marginBottom: 28 }}>
            <AirAstanaLogo />
          </div>

          {/* Card */}
          <div style={{
            background: "white",
            borderRadius: 16,
            boxShadow: "0 4px 32px rgba(30,58,95,0.10), 0 1px 4px rgba(0,0,0,0.06)",
            overflow: "hidden",
          }}>
            {/* Header */}
            <div style={{
              background: `linear-gradient(135deg, ${NAVY} 0%, #2A4F7F 100%)`,
              padding: "24px 28px",
              position: "relative",
              overflow: "hidden",
            }}>
              {/* decorative circles */}
              <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, borderRadius: "50%", background: "rgba(255,255,255,0.05)" }} />
              <div style={{ position: "absolute", bottom: -30, right: 40, width: 80, height: 80, borderRadius: "50%", background: "rgba(166,139,91,0.15)" }} />
              <h1 style={{ color: "white", fontSize: 20, fontWeight: 700, letterSpacing: "-0.3px", position: "relative" }}>
                Проверка бронирования
              </h1>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, marginTop: 4, position: "relative" }}>
                Введите данные для поиска билета
              </p>
            </div>

            {/* Form body */}
            <div style={{ padding: "28px 28px 24px" }}>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>

                <InputField
                  id="ticketNumber"
                  label="Номер билета"
                  value={formatTicketDisplay(ticketNumber)}
                  onChange={(e) => setTicketNumber(parseTicketInput(e.target.value))}
                  placeholder="465-1231231222"
                  hint="Только цифры, например: 465-1231231222"
                  icon={<TicketIcon />}
                  maxLength={17}
                />

                <InputField
                  id="surname"
                  label="Фамилия"
                  value={surname}
                  onChange={(e) => setSurname(parseSurnameInput(e.target.value))}
                  placeholder="Введите фамилию"
                  hint="Латиницей, как указано в билете"
                  icon={<UserIcon />}
                />

                {/* FFP поле — появляется при ошибке */}
                {status === "error" && (
                  <div style={{ animation: "slideDown 0.3s ease" }}>
                    <div style={{
                      background: "#FEF2F2",
                      border: "1.5px solid #FCA5A5",
                      borderRadius: 10,
                      padding: "12px 16px",
                      display: "flex",
                      gap: 10,
                      alignItems: "flex-start",
                      marginBottom: 14,
                    }}>
                      <AlertIcon />
                      <div>
                        <p style={{ fontSize: 13, color: "#DC2626", fontWeight: 600 }}>Бронирование не найдено</p>
                        <p style={{ fontSize: 12, color: "#991B1B", marginTop: 3, lineHeight: 1.5 }}>
                          {attempts >= 2
                            ? "Пожалуйста, свяжитесь с нами для уточнения данных."
                            : "Попробуйте ввести номер участника программы лояльности Nomad Club."}
                        </p>
                      </div>
                    </div>

                    {attempts < 3 && (
                      <InputField
                        id="ffpNumber"
                        label="Номер участника Nomad Club"
                        value={ffpNumber}
                        onChange={(e) => setFfpNumber(e.target.value.replace(/\D/g, "").slice(0, 9))}
                        placeholder="Введите 9-значный номер"
                        hint="9-значный номер участника"
                        icon={<CardIcon />}
                        maxLength={9}
                        autoFocus
                      />
                    )}
                  </div>
                )}

                {/* Результат */}
                {status === "success" && result && (
                  <FlightResult data={result} />
                )}

                {/* Кнопки */}
                {status !== "success" ? (
                  <button
                    type="submit"
                    disabled={status === "loading" || !ticketNumber || !surname}
                    className="submit-btn"
                    style={{
                      width: "100%",
                      background: GOLD,
                      color: "white",
                      border: "none",
                      borderRadius: 10,
                      padding: "13px 24px",
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "'Sora', sans-serif",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 10,
                      transition: "all 0.2s",
                      boxShadow: "0 2px 12px rgba(166,139,91,0.25)",
                      marginTop: 4,
                    }}
                  >
                    {status === "loading" ? (
                      <><Spinner /> Проверяем...</>
                    ) : (
                      "Проверить бронирование"
                    )}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleReset}
                    style={{
                      width: "100%",
                      background: "transparent",
                      color: NAVY,
                      border: `1.5px solid ${NAVY}30`,
                      borderRadius: 10,
                      padding: "12px 24px",
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: "pointer",
                      fontFamily: "'Sora', sans-serif",
                      marginTop: 4,
                    }}
                  >
                    Проверить другой билет
                  </button>
                )}
              </form>

              {/* Footer link */}
              <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid #F0F0F0", textAlign: "center" }}>
                <p style={{ fontSize: 12, color: "#9CA3AF" }}>
                  Нужна помощь?{" "}
                  <a href="#" className="link" style={{ color: NAVY, fontWeight: 600, textDecoration: "none" }}>
                    Свяжитесь с нами
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <p style={{ textAlign: "center", fontSize: 11, color: "#B0B7C3", marginTop: 20 }}>
            © 2026 Air Astana. Все права защищены.
          </p>
        </div>
      </div>
    </>
  );
}
