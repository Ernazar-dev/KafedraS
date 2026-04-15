import React, { useEffect, useState } from "react";
import axios from "../../api/axios";

const WorkStats = ({ category, year, month }) => {
  const [statsData, setStatsData] = useState([]);

  useEffect(() => {
    if (category && year && month) {
      axios
        .get("/works/stats", { params: { category, year, month } })
        .then((res) => setStatsData(res.data.data || []))
        .catch((err) => console.error(err));
    }
  }, [category, year, month]);

  return (
    <div className="bg-gradient-to-br from-[#02135e] to-[#0a2a8a] rounded-2xl p-5 sm:p-6 mb-6 text-white">
      <div className="flex items-center gap-3 mb-4">
        <span className="w-1 h-5 bg-white/40 rounded-full inline-block" />
        <h3 className="text-[15px] font-bold tracking-wide">
          {month}/{year} — Statistika
          <span className="ml-2 text-white/60 font-normal capitalize">
            ({category})
          </span>
        </h3>
      </div>

      {statsData.length === 0 ? (
        <p className="text-white/60 text-[13px]">
          {month}/{year} dawiri ushın maǵlıwmat joq.
        </p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {statsData.map((d) => (
            <div
              key={d.day}
              className="flex flex-col items-center bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl px-3 py-2 min-w-[60px] transition-colors duration-150"
            >
              <span className="text-[11px] text-white/60 font-medium">
                {d.day}-kuni
              </span>
              <span className="text-[18px] font-extrabold leading-tight">
                {d.count}
              </span>
              <span className="text-[10px] text-white/50">ta</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WorkStats;
