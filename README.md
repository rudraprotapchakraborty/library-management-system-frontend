<div align="center">

# 📚 Library Management System

**Library website: search the catalogue, borrow and return books, with a librarian dashboard.**

[**Live demo**](https://library-management-system-frontend-ten-chi.vercel.app/) · [Backend API](https://github.com/rudraprotapchakraborty/library-management-system-backend) · [Portfolio](https://rudraprotapchakraborty.com/projects)

![React](https://img.shields.io/badge/React-20232a?style=for-the-badge&logo=react&logoColor=61dafb) ![Vite](https://img.shields.io/badge/Vite-646cff?style=for-the-badge&logo=vite&logoColor=ffffff) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-0f172a?style=for-the-badge&logo=tailwindcss&logoColor=38bdf8) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=ffffff)

<a href="https://library-management-system-frontend-ten-chi.vercel.app/"><img src="https://i.ibb.co/842QNcJh/library-management-system.webp" alt="Library Management System: home page" width="880"></a>

</div>

> The web app of **Shelfwise**.
>
> - Catalogue search by title, author or ISBN with genre filters
> - Borrow copies with a due date and return them from a loans page
> - Librarian dashboard: books, borrowed-books summary, active loans and readers
> - Availability rules enforced on the server

A library management system with a React website and an Express API. Readers search the catalogue by title, author or ISBN, filter by genre, borrow copies with a due date and return them from their own loans page, where overdue books stand out. Librarians get a dashboard to add, edit and delete books, see the borrowed-books summary and every loan that is still out, and manage readers. Business rules are enforced on the server: a book with no copies left becomes unavailable, borrowing checks there are enough copies, and returning puts them back on the shelf. Sign-in works with email (confirmed by a one-time code) or Google, with password reset and an account settings page, and shared test accounts make the app easy to try. The catalogue is seeded with classics using descriptions and cover images from Wikipedia, and the interface supports light and dark themes.

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

Run the backend on port 5000 first; in development the dev server proxies `/api` to it. Production builds call https://library-management-system-backend-six.vercel.app/api unless `VITE_API_URL` says otherwise.

| Variable | Purpose |
| --- | --- |
| `GOOGLE_CLIENT_ID` | Google sign-in (public client id) |
| `VITE_API_URL` | API address when it is not proxied |

Demo logins: `admin@shelfwise.demo` (Librarian) and `reader@shelfwise.demo` (Reader), password `ShelfDemo#2026`, after `npm run seed` in the backend.

## Scripts

`npm run dev` · `npm run build` · `npm run preview`

Book descriptions and cover images come from Wikipedia and Wikimedia Commons under their free licences.

---

<div align="center">

Made by **[Rudra Protap Chakraborty](https://rudraprotapchakraborty.com)** · [Portfolio](https://rudraprotapchakraborty.com) · [GitHub](https://github.com/rudraprotapchakraborty)

</div>
