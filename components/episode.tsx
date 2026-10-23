/*
 * The episode rule that opens every band: the card number in Mincho, a wave of 〜
 * with a signal running along it, the code at the far end.
 */
export default function Episode({ n, code, tone = "text-bone" }: { n: string; code: string; tone?: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className={`mincho shrink-0 text-[15px] tracking-[.24em] ${tone}`}>{n}</span>
      <span aria-hidden="true" className="relative h-[16px] min-w-0 flex-1 overflow-hidden">
        <span className="signal absolute inset-0 whitespace-nowrap text-[15px] leading-none tracking-[-.12em]">{"〜".repeat(160)}</span>
      </span>
      <span className="mono shrink-0 text-faint">EPISODE:{code}</span>
    </div>
  );
}
