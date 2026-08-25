import { format } from 'date-fns';
import { CATEGORY_COLORS, formatMoney } from '../constants';

export default function ExpenseList({ expenses, currency, onEdit, onDelete }) {
  if (!expenses.length) {
    return (
      <div className="card p-10 text-center">
        <p className="font-display text-lg mb-1">No entries yet</p>
        <p className="text-sm text-muted">Add your first expense or income to start the ledger.</p>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-hairline text-left text-muted text-xs uppercase tracking-wider">
            <th className="px-5 py-3 font-medium">Title</th>
            <th className="px-5 py-3 font-medium hidden sm:table-cell">Category</th>
            <th className="px-5 py-3 font-medium hidden md:table-cell">Date</th>
            <th className="px-5 py-3 font-medium text-right">Amount</th>
            <th className="px-5 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.map((exp) => (
            <tr key={exp._id} className="border-b border-hairline last:border-0 hover:bg-surfaceLight/50 transition">
              <td className="px-5 py-3.5">
                <p className="text-paper">{exp.title}</p>
                {exp.notes && <p className="text-xs text-muted mt-0.5">{exp.notes}</p>}
                <p className="text-xs text-muted mt-0.5 sm:hidden">{exp.category}</p>
              </td>
              <td className="px-5 py-3.5 hidden sm:table-cell">
                <span
                  className="text-xs px-2 py-1 rounded-full border"
                  style={{
                    color: CATEGORY_COLORS[exp.category],
                    borderColor: `${CATEGORY_COLORS[exp.category]}55`,
                    backgroundColor: `${CATEGORY_COLORS[exp.category]}15`,
                  }}
                >
                  {exp.category}
                </span>
              </td>
              <td className="px-5 py-3.5 text-muted hidden md:table-cell">
                {format(new Date(exp.date), 'dd MMM yyyy')}
              </td>
              <td className={`px-5 py-3.5 text-right amount ${exp.type === 'income' ? 'text-mint' : 'text-paper'}`}>
                {exp.type === 'income' ? '+' : '−'}{formatMoney(exp.amount, currency)}
              </td>
              <td className="px-5 py-3.5 text-right whitespace-nowrap">
                <button
                  onClick={() => onEdit(exp)}
                  className="text-muted hover:text-mint text-xs mr-3"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(exp._id)}
                  className="text-muted hover:text-rust text-xs"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
