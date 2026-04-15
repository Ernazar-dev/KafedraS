import React, { useEffect, useState } from "react";
import api from "../../../../api/axios";
import { toggle2FA, fetchMe } from "../../../../api/users";
import { Link } from "react-router-dom";
import {
  SecurityScanOutlined,
  KeyOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ExportOutlined,
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Switch, Modal, Input, message, Spin } from "antd";

const STAT_CARDS = (stats) => [
  {
    title: "Studentler",
    value: stats.students,
    icon: <UserOutlined />,
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    accent: "border-l-blue-500",
  },
  {
    title: "Oqitiwshilar",
    value: stats.teachers,
    icon: <TeamOutlined />,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    accent: "border-l-emerald-500",
  },
  {
    title: "Pánler",
    value: stats.subjects,
    icon: <BookOutlined />,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    accent: "border-l-amber-500",
  },
  {
    title: "Jańalıqlar",
    value: stats.news,
    icon: <FileTextOutlined />,
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    accent: "border-l-violet-500",
  },
];

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    subjects: 0,
    news: 0,
  });
  const [loading, setLoading] = useState(true);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pin, setPin] = useState("");
  const [pinLoading, setPinLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [sR, tR, subR, nR, me] = await Promise.all([
          api.get("/students"),
          api.get("/teachers"),
          api.get("/subjects"),
          api.get("/news"),
          fetchMe(),
        ]);
        setStats({
          students: sR.data.length,
          teachers: tR.data.length,
          subjects: subR.data.length,
          news: nR.data.length,
        });
        setIs2FAEnabled(me.data.twoFactorEnabled);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handle2FAToggle = (checked) => {
    if (checked) {
      setIsModalVisible(true);
    } else {
      Modal.confirm({
        title: <span className="text-red-600 font-bold">2FA ni o'chirish</span>,
        content: "Ikki bosqichli kirishni o'chirmoqchimisiz?",
        okText: "O'chirish",
        okType: "danger",
        cancelText: "Bekor qilish",
        centered: true,
        onOk: async () => {
          try {
            await toggle2FA(false);
            setIs2FAEnabled(false);
            message.warning("2FA o'chirildi");
          } catch {
            message.error("Xatolik yuz berdi");
          }
        },
      });
    }
  };

  const handleSavePin = async () => {
    if (pin.length < 3)
      return message.error("Kod kamida 3 belgidan iborat bo'lishi kerak");
    setPinLoading(true);
    try {
      await toggle2FA(true, pin);
      setIs2FAEnabled(true);
      setIsModalVisible(false);
      setPin("");
      message.success("2FA faollashtirildi ✅");
    } catch {
      message.error("Xatolik yuz berdi");
    } finally {
      setPinLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center bg-[#f0f4ff]">
        <div className="flex flex-col items-center gap-3">
          <Spin size="large" />
          <p className="text-[#02135e]/60 text-sm font-medium">
            Yuklanmoqda...
          </p>
        </div>
      </div>
    );

  const cards = STAT_CARDS(stats);

  return (
    <div className="min-h-screen bg-[#f0f4ff] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-7 bg-[#02135e] rounded-full" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#02135e] tracking-tight">
              Admin Paneli
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm ml-3.5">
            Kafedra Boshqaruv Markazi
          </p>
        </div>
        <Link to="/" className="no-underline">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-red-500 hover:border-red-200 transition-all shadow-sm text-sm font-medium">
            <ExportOutlined />
            <span className="hidden sm:inline">Paneldan chiqish</span>
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
        {cards.map((card, i) => (
          <div
            key={i}
            className={`bg-white rounded-2xl p-4 sm:p-5 border-l-4 ${card.accent} shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}
          >
            <div
              className={`${card.iconBg} ${card.iconColor} w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-base mb-3`}
            >
              {card.icon}
            </div>
            <div className="text-xl sm:text-2xl font-bold text-[#02135e]">
              {card.value}
            </div>
            <div className="text-[10px] sm:text-xs font-medium text-slate-400 mt-0.5">
              {card.title}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Main placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 p-5 sm:p-8 min-h-[260px] shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-1 h-5 bg-[#02135e] rounded-full" />
            <h2 className="text-sm font-bold text-[#02135e]">
              Boshqaruv markazi
            </h2>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <p className="text-slate-300 text-sm font-bold uppercase tracking-widest">
              Sahifa Tayyor
            </p>
          </div>
        </div>

        {/* 2FA Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 sm:p-6 shadow-sm self-start">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <SecurityScanOutlined style={{ fontSize: 22 }} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#02135e]">Xavfsizlik</h3>
              <p className="text-xs text-slate-400">2-bosqichli kirish (2FA)</p>
            </div>
          </div>

          <div className="bg-[#f8fafc] rounded-xl border border-slate-100 p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                2FA Himoyasi
              </span>
              <Switch checked={is2FAEnabled} onChange={handle2FAToggle} />
            </div>

            <span
              className={`inline-flex items-center gap-1.5 w-fit text-xs font-bold px-3 py-1.5 rounded-lg ${
                is2FAEnabled
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full ${is2FAEnabled ? "bg-emerald-500 animate-pulse" : "bg-slate-400"}`}
              />
              {is2FAEnabled ? "FAOLLASHTIRILGAN" : "O'CHIRILGAN"}
            </span>

            <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-200 pt-3 italic">
              Tizimga kirishda qo'shimcha maxfiy kod so'ralishi uchun ushbu
              funksiyani yoqing.
            </p>
          </div>
        </div>
      </div>

      {/* PIN Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-[#02135e] rounded-full" />
            <span className="text-sm font-bold text-[#02135e]">
              Yangi xavfsizlik kodi
            </span>
          </div>
        }
        open={isModalVisible}
        onOk={handleSavePin}
        onCancel={() => {
          setIsModalVisible(false);
          setPin("");
        }}
        okText={pinLoading ? "Saqlanmoqda..." : "Saqlash"}
        cancelText="Bekor qilish"
        okButtonProps={{
          disabled: pinLoading,
          style: { background: "#02135e", borderColor: "#02135e" },
        }}
        centered
      >
        <div className="py-4 flex flex-col gap-3">
          <p className="text-sm text-slate-500">
            Akkaunt xavfsizligi uchun kamida 3 belgidan iborat shaxsiy kodni
            kiriting:
          </p>
          <Input.Password
            placeholder="••••••"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            onPressEnter={handleSavePin}
            size="large"
            className="rounded-xl"
            prefix={<KeyOutlined className="text-slate-400" />}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </div>
      </Modal>
    </div>
  );
}
