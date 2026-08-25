import { formatMoney } from '../constants';

export default function LedgerTape({ items = [], currency }) {
  if (!items.length) return null;

  return (
    <div className="mx-1.5 mb-8">
      <div className="ledger-tape rounded-lg overflow-x-auto">
        <div className="flex">
          {items.map((item) => (
            <div
              key={item._id}
              className="shrink-0 w-[79px] py-3 flex flex-col items-center justify-center gap-1"
              title={`${item.title} — ${formatMoney(item.amount, currency)}`}
            >
              <span
                className={`text-[10px] font-mono ${
                  item.type === 'income' ? 'text-mint' : 'text-rust'
                }`}
              >
                {item.type === 'income' ? '+' : '−'}
              </span>
              <span className="amount text-[11px] leading-tight px-1 text-center truncate w-full">
                {formatMoney(item.amount, currency).replace(/\.\d{2}$/, '')}
              </span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[11px] text-muted text-center mt-2 tracking-wide uppercase">
        Latest entries on the tape
      </p>
    </div>
  );
}
