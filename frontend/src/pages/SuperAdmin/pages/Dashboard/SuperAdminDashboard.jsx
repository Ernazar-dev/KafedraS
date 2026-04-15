import React, { useEffect, useState } from "react";
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  FileTextOutlined,
  RobotOutlined,
  LoginOutlined,
  SecurityScanOutlined,
  KeyOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ExportOutlined,
} from "@ant-design/icons";
import { Spin, Empty, Switch, Modal, Input, message } from "antd";
import StatsChart from "../../../../components/Dashboard/StatsChart";
import {
  fetchStatsOverview,
  fetchAIStats,
  fetchLoginStats,
} from "../../../../api/stats";
import { toggle2FA, fetchMe } from "../../../../api/users";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [stats, setStats] = useState({});
  const [aiStats, setAIStats] = useState({ total: 0, byDay: [] });
  const [loginStats, setLoginStats] = useState({ daily: [], total: 0 });
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [pin, setPin] = useState("");
  const [pinLoading, setPinLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [overview, ai, logins, me] = await Promise.all([
          fetchStatsOverview(),
          fetchAIStats(),
          fetchLoginStats(),
          fetchMe(),
        ]);
        setStats(overview);
        setAIStats(ai);
        setLoginStats(logins);
        setIs2FAEnabled(me.data.twoFactorEnabled);
        const labels = ai.byDay?.map((d) => d.date) || [];
        setChartData({
          labels,
          datasets: [
            {
              label: "AI Chatlar",
              data: ai.byDay?.map((d) => d.count) || [],
              borderColor: "#6366f1",
              backgroundColor: "rgba(99,102,241,0.07)",
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "#6366f1",
              pointRadius: 4,
            },
            {
              label: "Kirishlar",
              data: logins.daily?.map((d) => d.count) || [],
              borderColor: "#06b6d4",
              backgroundColor: "rgba(6,182,212,0.07)",
              tension: 0.4,
              fill: true,
              pointBackgroundColor: "#06b6d4",
              pointRadius: 4,
            },
          ],
        });
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handle2FAToggle = (checked) => {
    if (checked) {
      setIsModalVisible(true);
    } else {
      Modal.confirm({
        title: <span className="text-red-600 font-bold">2FA nı óshiriw</span>,
        content:
          "Eki basqıshlı kiriwdi óshirmekshimisiz? Bul akkaunt qáwipsizligin tómenletedi.",
        okText: "Óshiriw",
        okType: "danger",
        cancelText: "Biykarlaw",
        centered: true,
        onOk: async () => {
          try {
            await toggle2FA(false);
            setIs2FAEnabled(false);
            message.warning("2FA óshirildi");
          } catch {
            message.error("Qátelik júz berdi");
          }
        },
      });
    }
  };

  const handleSavePin = async () => {
    if (pin.length < 3)
      return message.error("Kod keminde 3 belgiden ibarat bolıwı kerek");
    setPinLoading(true);
    try {
      await toggle2FA(true, pin);
      setIs2FAEnabled(true);
      setIsModalVisible(false);
      setPin("");
      message.success("Qáwipsizlik kodı ornatıldı ✅");
    } catch {
      message.error("Qátelik júz berdi");
    } finally {
      setPinLoading(false);
    }
  };

  const statCards = [
    {
      title: "Studentler",
      value: stats.students || 0,
      icon: <UserOutlined />,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      accent: "border-l-blue-500",
    },
    {
      title: "Oqıtıwshılar",
      value: stats.teachers || 0,
      icon: <TeamOutlined />,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      accent: "border-l-amber-500",
    },
    {
      title: "Pánler",
      value: stats.subjects || 0,
      icon: <BookOutlined />,
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      accent: "border-l-emerald-500",
    },
    {
      title: "Jańalıqlar",
      value: stats.news || 0,
      icon: <FileTextOutlined />,
      iconBg: "bg-rose-100",
      iconColor: "text-rose-600",
      accent: "border-l-rose-500",
    },
    {
      title: "AI Chatlar",
      value: aiStats.total || 0,
      icon: <RobotOutlined />,
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
      accent: "border-l-violet-500",
    },
    {
      title: "Kiriwler",
      value: loginStats.total || 0,
      icon: <LoginOutlined />,
      iconBg: "bg-cyan-100",
      iconColor: "text-cyan-600",
      accent: "border-l-cyan-500",
    },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#f0f4ff]">
        <div className="flex flex-col items-center gap-3">
          <Spin size="large" />
          <p className="text-[#02135e]/60 text-sm font-medium">
            Júklenip atır...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f4ff] p-4 sm:p-6 lg:p-8">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-7 bg-[#02135e] rounded-full" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#02135e] tracking-tight">
              SuperAdmin Paneli
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm ml-3.5">
            Basqarıw hám monitoring orayı
          </p>
        </div>
        <Link to="/" className="no-underline">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-red-500 hover:border-red-200 transition-all shadow-sm text-sm font-medium">
            <ExportOutlined />
            <span className="hidden sm:inline">Panelden shıǵıw</span>
          </button>
        </Link>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 mb-6">
        {statCards.map((card, i) => (
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
              {card.value.toLocaleString()}
            </div>
            <div className="text-[10px] sm:text-xs font-medium text-slate-400 mt-0.5">
              {card.title}
            </div>
          </div>
        ))}
      </div>

      {/* ── Chart + 2FA ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-[#02135e] rounded-full" />
                <h2 className="text-sm font-bold text-[#02135e]">
                  Sistema aktivligi
                </h2>
              </div>
              <p className="text-xs text-slate-400 mt-0.5 ml-3">
                AI chatlar hám kiriwler dinamikası
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-500 inline-block" />{" "}
                AI Chatlar
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-500 inline-block" />{" "}
                Kiriwler
              </div>
            </div>
          </div>

          <div className="h-[260px] sm:h-[320px]">
            {chartData.labels?.length ? (
              <StatsChart
                type="line"
                data={chartData}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: "#02135e",
                      titleColor: "#fff",
                      bodyColor: "rgba(255,255,255,0.8)",
                      padding: 12,
                      cornerRadius: 10,
                    },
                  },
                  scales: {
                    x: {
                      grid: { display: false },
                      border: { display: false },
                      ticks: { color: "#94a3b8", font: { size: 11 } },
                    },
                    y: {
                      grid: { color: "rgba(0,0,0,0.04)" },
                      border: { display: false },
                      ticks: { color: "#94a3b8", font: { size: 11 } },
                    },
                  },
                }}
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <Empty
                  description={
                    <span className="text-slate-400 text-sm">
                      Maǵlıwmat joq
                    </span>
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* 2FA Card */}
        <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
              <SecurityScanOutlined style={{ fontSize: 22 }} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#02135e]">Qáwipsizlik</h3>
              <p className="text-xs text-slate-400">2 basqıshlı kiriw (2FA)</p>
            </div>
          </div>

          <div className="bg-[#f8fafc] rounded-xl border border-slate-100 p-4 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                2FA Qorǵawı
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
                className={`w-1.5 h-1.5 rounded-full ${
                  is2FAEnabled ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`}
              />
              {is2FAEnabled ? "Aktivlestirilgen" : "Óshirilgen"}
            </span>

            <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-200 pt-3 italic">
              2FA iske túskende sistemaǵa kiriw ushın jeke parolińiz talap
              etiledi.
            </p>
          </div>
        </div>
      </div>

      {/* ── PIN Modal ── */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-[#02135e] rounded-full" />
            <span className="text-sm font-bold text-[#02135e]">
              Qáwipsizlik kodın ornatıw
            </span>
          </div>
        }
        open={isModalVisible}
        onOk={handleSavePin}
        onCancel={() => {
          setIsModalVisible(false);
          setPin("");
        }}
        okText={pinLoading ? "Saqlanbaqta..." : "Saqlaw"}
        cancelText="Biykarlaw"
        okButtonProps={{
          disabled: pinLoading,
          style: { background: "#02135e", borderColor: "#02135e" },
        }}
        centered
      >
        <div className="py-4 flex flex-col gap-3">
          <p className="text-sm text-slate-500">
            Sistemaǵa kiriwde paydalanıw ushın paroldi kirgiziń (keminde 3
            belgi):
          </p>
          <Input.Password
            placeholder="Kodıńızdı kirgiziń..."
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
