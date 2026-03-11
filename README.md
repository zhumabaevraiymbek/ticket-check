# Air Astana — Ticket Check

Страница проверки бронирования Air Astana.

## Стек

- React 18
- Vite 5
- Google Fonts (Sora)

## Запуск

```bash
npm install
npm run dev
```

Откроется на `http://localhost:5173`

## Сборка

```bash
npm run build
```

## Тестовые данные

| Номер билета    | Фамилия | Результат                        |
|-----------------|---------|----------------------------------|
| 465-1111111111  | TEST    | Ошибка → появляется поле FFP     |
| 987-6543210     | IVANOV  | Успех                            |

Для FFP поля: любые 9 цифр → успех.

## Подключение API

В файле `src/App.jsx` найди функцию `checkTicket()` и замени заглушку на реальный fetch:

```js
async function checkTicket({ ticketNumber, surname, ffpNumber }) {
  const res = await fetch("/api/check-ticket", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ticketNumber, surname, ffpNumber }),
  });
  if (!res.ok) throw new Error("not_found");
  return await res.json();
}
```
