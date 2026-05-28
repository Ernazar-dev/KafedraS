import API from "./axios";

// GET /works
export const fetchWorks = async ({
  category,
  year,
  month,
  quarter, // <-- kvartal qo'shildi
  page = 1,
  limit = 50,
}) => {
  const params = { category, page, limit };

  // Month filter
  if (month) {
    const [y, m] = month.split("-");
    params.year = y;
    params.month = m;
  }

  // Agar year filter faqat berilgan bo'lsa
  if (year && !month && !quarter) {
    params.year = year;
  }

  const res = await API.get("/works", { params });
  return res.data;
};

// GET /works/my
export const fetchMyWorks = async () => {
  const res = await API.get("/works/my");
  return res.data;
};

// GET /works/:id
export const fetchWorkById = async (id) => {
  const res = await API.get(`/works/${id}`);
  return res.data;
};

export const createWork = async (formData) => {
  const res = await API.post("/works", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const updateWork = async (id, formData) => {
  const res = await API.put(`/works/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const deleteWork = async (id) => {
  const res = await API.delete(`/works/${id}`);
  return res.data;
};

export const fetchWorkStats = async ({ category, year, month }) => {
  const params = { category, year, month };
  const res = await API.get("/works/stats", { params });
  return res.data.data;
};
