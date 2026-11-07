/** Decorative bookshelf shown beside the sign-up forms (desktop only). */
const SHELVES = [
  [["#1f6b57", 150], ["#6fd0b0", 120], ["#16231f", 165], ["#9ae3ca", 135], ["#1f6b57", 155], ["#c9a24b", 125], ["#16231f", 145]],
  [["#c9a24b", 130], ["#1f6b57", 160], ["#9ae3ca", 120], ["#16231f", 150], ["#6fd0b0", 140], ["#1f6b57", 125]],
  [["#16231f", 140], ["#6fd0b0", 155], ["#c9a24b", 120], ["#1f6b57", 150], ["#9ae3ca", 135], ["#16231f", 160], ["#6fd0b0", 120]],
];

export default function BookArt() {
  return (
    <div aria-hidden className="grid-panel overflow-hidden rounded-[28px] border border-line p-8 sm:p-10">
      <p className="eyeline">Today at the library</p>
      <div className="mt-6 space-y-5">
        {SHELVES.map((row, r) => (
          <div key={r} className="flex items-end gap-1.5 border-b-[6px] border-ink/80 pb-0">
            {row.map(([color, h], i) => (
              <span
                key={i}
                className="float-a block rounded-t-[3px]"
                style={{ background: color, height: h * 0.6, width: 22 + ((i * 7 + r * 5) % 4) * 6, animationDelay: `${(i + r) * -0.7}s` }}
              />
            ))}
          </div>
        ))}
      </div>
      <p className="display mt-8 text-3xl">
        Borrow, return, <span className="accent">repeat.</span>
      </p>
    </div>
  );
}
