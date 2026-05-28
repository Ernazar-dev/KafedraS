import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function StatsChart({ type = "line", data, options, title }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      {/* Chart header */}
      {title && (
        <div className="flex items-center gap-2 mb-5">
          <span className="w-1 h-5 bg-[#02135e] rounded-full inline-block" />
          <h3 className="text-[15px] font-bold text-[#02135e]">{title}</h3>
        </div>
      )}

      {/* Chart */}
      <div className="relative">
        {type === "line" ? (
          <Line data={data} options={options} />
        ) : (
          <Bar data={data} options={options} />
        )}
      </div>
    </div>
  );
}
