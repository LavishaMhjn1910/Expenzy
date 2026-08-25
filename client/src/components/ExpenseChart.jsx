import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from 'recharts';
import { CATEGORY_COLORS, formatMoney } from '../constants';

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function CustomTooltip({ active, payload, currency }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-hairline rounded-lg px-3 py-2 text-xs shadow-card">
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color || p.fill }}>
          {p.name}: <span className="amount">{formatMoney(p.value, currency)}</span>
        </p>
      ))}
    </div>
  );
}

export function CategoryPie({ data, currency }) {
  if (!data.length) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-muted">
        No spending recorded this month yet.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="_id"
          innerRadius={60}
          outerRadius={95}
          paddingAngle={2}
        >
          {data.map((entry) => (
            <Cell key={entry._id} fill={CATEGORY_COLORS[entry._id] || '#9CAA9F'} stroke="#0E1B18" strokeWidth={2} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip currency={currency} />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export function MonthlyTrend({ data, currency }) {
  const map = {};
  data.forEach((d) => {
    const key = `${d._id.year}-${d._id.month}`;
    if (!map[key]) {
      map[key] = { key, label: `${MONTH_LABELS[d._id.month - 1]} '${String(d._id.year).slice(2)}`, expense: 0, income: 0 };
    }
    map[key][d._id.type] = d.total;
  });
  const chartData = Object.values(map).sort((a, b) => a.key.localeCompare(b.key));

  if (!chartData.length) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-muted">
        Add entries to see your trend over time.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
        <CartesianGrid stroke="#274238" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey="label" stroke="#9CAA9F" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#9CAA9F" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip currency={currency} />} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Line type="monotone" dataKey="expense" name="Expense" stroke="#C4593B" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="income" name="Income" stroke="#52B788" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}
