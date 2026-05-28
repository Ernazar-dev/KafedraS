import React from "react";
import WorkList from "../../../../components/AdminPanel/WorkList";
import WorkStats from "../../../../components/AdminPanel/WorkStats";
import { IoExitOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

const AdminWorks = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth() + 1;

  return (
    <div className="min-h-screen bg-[#f0f4ff] p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-7">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-7 bg-[#02135e] rounded-full" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#02135e] tracking-tight">
              Ilimiy islerdi basqarıw
            </h1>
          </div>
          <p className="text-slate-500 text-xs sm:text-sm ml-3.5">
            Admin panel
          </p>
        </div>

        <Link
          to="/"
          className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 px-3 sm:px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm no-underline"
        >
          <IoExitOutline className="text-lg" />
          <span className="hidden sm:inline">Saytqa ótiw</span>
        </Link>
      </div>

      <WorkStats category="maqalalar" year={currentYear} month={currentMonth} />
      <WorkList />
    </div>
  );
};

export default AdminWorks;
