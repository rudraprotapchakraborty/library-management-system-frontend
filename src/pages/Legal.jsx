const pages = {
  privacy: {
    title: "Privacy Policy",
    updated: "November 2026",
    sections: [
      ["What we collect", "Your name, email address and, if you add one, a profile photo. If you sign in with Google we receive your name, email and profile picture from Google."],
      ["How we use it", "To sign you in, record the books you borrow and return, send one-time codes to confirm your email and reset your password, and let librarians see who has which books."],
      ["What is public", "Browsing the catalogue needs no account. Your loans are visible only to you and to librarians. Your email is never shown to other readers."],
      ["Where it is stored", "Accounts, books and loans are stored in a MongoDB database. Profile photos are hosted on an image service. Emails are sent through an email provider."],
      ["Your choices", "You can change your name, photo, email and password in Account settings, and delete your account at any time. Copies you still hold go back on the shelf."],
      ["Cookies and storage", "We keep your sign-in token and your light or dark theme choice in your browser storage. There are no advertising or tracking cookies."],
      ["Photos", "Book descriptions and cover images come from Wikipedia and Wikimedia Commons under their free licences."],
    ],
  },
  terms: {
    title: "Terms of Use",
    updated: "November 2026",
    sections: [
      ["Using Shelfwise", "Shelfwise is a personal project that demonstrates a library management system. By creating an account or signing in you agree to these terms."],
      ["Borrowing", "Borrow only what you intend to read, choose a realistic due date and return copies on time so others can read them. Loans here are for demonstration and carry no fees."],
      ["Accounts", "Keep your sign-in details to yourself. The shared test accounts are public and limited: they cannot change sign-in details or delete themselves."],
      ["Acceptable use", "Do not try to break, overload or gain unauthorised access to the service or to other people's data, and do not use automated tools to flood it with requests."],
      ["No warranty", "The service is provided as is. Data may be reset at any time, especially the sample catalogue and test accounts."],
      ["Changes", "We may update these terms. Continuing to use Shelfwise after a change means you accept the new version."],
    ],
  },
};

export default function Legal({ page }) {
  const doc = pages[page];
  return (
    <article className="frame max-w-3xl py-14">
      <span className="eyeline">Legal</span>
      <h1 className="display mt-4 text-[clamp(34px,5vw,56px)]">{doc.title}</h1>
      <p className="mt-3 text-sm text-muted">Last updated {doc.updated}</p>
      <div className="mt-10 space-y-8">
        {doc.sections.map(([heading, text]) => (
          <section key={heading}>
            <h2 className="text-lg font-bold tracking-tight">{heading}</h2>
            <p className="mt-2 leading-relaxed text-muted">{text}</p>
          </section>
        ))}
      </div>
    </article>
  );
}
