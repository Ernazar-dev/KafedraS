import { useEffect, useState, useCallback, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import api from "../../api/axios";
import { getImageUrl, imgFallback } from "../../api/imageUrl";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaRegHeart,
  FaArrowRight,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";

const PLACEHOLDER = "https://via.placeholder.com/400x300?text=Rasm+yo%27q";

// Sanani formatlash uchun yordamchi funksiya
const formatDateTime = (dateStr) => {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}`;
};

export default function NewsSlider() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  useEffect(() => {
    api
      .get("/news")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setNews(
          data.map((item) => ({
            ...item,
            likes: item.likesCount ?? 0,
            isLiked: item.isLiked ?? false,
          }))
        );
      })
      .catch(() => setNews([]))
      .finally(() => setLoading(false));
  }, []);

  const handleLike = useCallback(
    async (id) => {
      const item = news.find((n) => n.id === id);
      if (!item) return;
      const wasLiked = item.isLiked;
      setNews((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                isLiked: !wasLiked,
                likes: wasLiked ? n.likes - 1 : n.likes + 1,
              }
            : n
        )
      );
      try {
        await api.post("/news/like", { newsId: id });
      } catch {
        setNews((prev) =>
          prev.map((n) =>
            n.id === id
              ? {
                  ...n,
                  isLiked: wasLiked,
                  likes: wasLiked ? n.likes + 1 : n.likes - 1,
                }
              : n
          )
        );
      }
    },
    [news]
  );

  if (loading)
    return (
      <div className="flex justify-center py-16 bg-[#f0f4ff]">
        <div className="w-8 h-8 border-4 border-[#02135e] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  if (news.length === 0) return null;

  return (
    <section className="py-14 bg-[#f0f4ff]">
      <div className="max-w-[1300px] mx-auto px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1.5 h-7 bg-[#02135e] rounded-full" />
              <h2 className="text-2xl font-extrabold text-[#02135e] m-0 tracking-tight">
                Sońǵı Jańalıqlar
              </h2>
            </div>
            <p className="text-slate-500 text-sm ml-3.5">
              Kafedra turmısınan eń jańa xabarlar
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/news"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-[#02135e] no-underline"
            >
              Barlıǵı <FaArrowRight className="text-xs" />
            </Link>
            <div className="flex gap-2">
              <button
                ref={prevRef}
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm"
              >
                <FaChevronLeft className="text-xs" />
              </button>
              <button
                ref={nextRef}
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm"
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          spaceBetween={20}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
        >
          {news.map((item) => (
            <SwiperSlide key={item.id} className="h-auto">
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col">
                <div className="aspect-video overflow-hidden bg-slate-100 relative">
                  <img
                    src={getImageUrl(item.file) || PLACEHOLDER}
                    alt={item.title}
                    loading="lazy"
                    onError={(e) => imgFallback(e)}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  {/* SANA TO'G'IRLANDI */}
                  {item.date && (
                    <span className="absolute bottom-2 left-2 text-xs font-medium bg-[#02135e]/80 text-white px-2.5 py-1 rounded-lg backdrop-blur-sm">
                      {formatDateTime(item.date)}
                    </span>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1 gap-3">
                  <Link
                    to={`/news/${item.id}`}
                    className="text-sm font-bold text-[#02135e] line-clamp-2 no-underline flex-1 leading-snug"
                  >
                    {item.title}
                  </Link>

                  {/* MATN FORMATI TO'G'IRLANDI */}
                  {item.content && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed whitespace-pre-line">
                      {item.content.replace(/<[^>]*>?/gm, "")}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <button
                      onClick={() => handleLike(item.id)}
                      className={`flex items-center gap-1.5 text-sm font-medium ${
                        item.isLiked ? "text-red-500" : "text-slate-400"
                      }`}
                    >
                      {item.isLiked ? <FaHeart /> : <FaRegHeart />}
                      <span className="text-xs">{item.likes}</span>
                    </button>
                    <Link
                      to={`/news/${item.id}`}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#02135e] bg-[#f0f4ff] px-3 py-1.5 rounded-lg no-underline"
                    >
                      Oqıw <FaArrowRight className="text-[10px]" />
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
