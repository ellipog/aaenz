/*
 * A readout: label, then value — no ruled table, the rows step in one after
 * another like a line of verse running down the page.
 */
export default function Leaders({
  rows,
  className = "mt-8",
}: {
  rows: [en: string, value: string, tone?: string][];
  className?: string;
}) {
  return (
    <ul className={`mono m-0 list-none space-y-2 p-0 ${className}`}>
      {rows.map(([en, value, tone = "text-bone"], i) => (
        <li className="flex flex-wrap items-baseline gap-x-3" key={en} style={{ paddingLeft: `${i * 1.4}em` }}>
          <span className="text-faint">{en}</span>
          <span aria-hidden="true" className="text-red/80">
            〜
          </span>
          <span className={tone}>{value}</span>
        </li>
      ))}
    </ul>
  );
}
