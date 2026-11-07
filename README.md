# Shelfwise · Library Management System (frontend)

The website for **Shelfwise**, a library management system. Readers browse the catalogue, borrow books and return them; librarians add titles, watch the shelves and see who has what. Built with **React 19**, **Vite**, **Tailwind CSS 4** and React Router. It talks to [library-management-system-backend](https://github.com/rudraprotapchakraborty/library-management-system-backend).

This is an upgrade of a small RTK Query assignment: same books-and-borrowing idea, now with accounts, roles and a redesigned interface.

## Features

- **Catalogue** – search by title, author or ISBN, filter by genre, sort, show only available books, paging, cover images.
- **Borrow** – choose copies and a due date on the book page; the shelf count updates immediately.
- **My loans** – what is on loan, due soon or overdue, return in one tap (with a confirmation dialog), and a history.
- **Librarian dashboard** – library numbers, add / edit / delete books, the borrowed-books summary, every active loan, and reader management (block, promote, delete).
- **Accounts** – email + one-time code, password reset, Google sign-in, settings (photo, name, email, password, delete account).
- **Test accounts** – the sign-in page lists a Librarian and a Reader with one-tap fill.
- **UI** – design tokens (`--paper --surface --ink --muted --line --brand --brand-soft --on-brand`), class-based light/dark mode, DM Sans + Instrument Serif, scroll-reveal sections, skeleton loaders, `react-hot-toast` toasts, a portal-based confirm dialog, favicon set and a mobile-first layout.

## Getting started

```bash
npm install
cp .env.example .env     # set GOOGLE_CLIENT_ID
npm run dev              # http://localhost:3000
```

Run the backend on port 5000 first; in development the dev server proxies `/api` to it. Production builds read the API address from `VITE_API_URL`.

| Variable | Purpose |
| --- | --- |
| `GOOGLE_CLIENT_ID` | Google sign-in (public client id) |
| `VITE_API_URL` | API address when it is not proxied |

Demo logins: `admin@shelfwise.demo` (Librarian) and `reader@shelfwise.demo` (Reader), password `ShelfDemo#2026`, after `npm run seed` in the backend.

## Scripts

`npm run dev` · `npm run build` · `npm run preview`

Book descriptions and cover images come from Wikipedia and Wikimedia Commons under their free licences.
