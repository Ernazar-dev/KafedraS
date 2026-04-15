import api from "./axios";

export const fetchStatsOverview = async () => {
  try {
    const res = await api.get("/stats/overview");
    return res.data;
  } catch (err) {
    console.error("Overview stats error:", err);
    return {};
  }
};

export const fetchAIStats = async () => {
  try {
    const res = await api.get("/stats/ai");
    const byDay = Array.isArray(res.data.byDay)
      ? res.data.byDay.map((d) => ({ date: d.date, count: Number(d.count) }))
      : [];
    return { total: Number(res.data.total) || 0, byDay };
  } catch (err) {
    console.error("AI stats error:", err);
    return { total: 0, byDay: [] };
  }
};

export const fetchLoginStats = async () => {
  try {
    const res = await api.get("/stats/logins");
    return { daily: res.data.byDay || [] };
  } catch (err) {
    console.error("Login stats error:", err);
    return { daily: [] };
  }
};
