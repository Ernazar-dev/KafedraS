import { useNavigate } from "react-router-dom";
import { Modal, message } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { logoutUser } from "../../api/auth";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Modal.confirm({
      title: "Sistemadan shıǵıw",
      content: "Shınında da shıqpaqshısızba?",
      okText: "Shıǵıw",
      okType: "danger",
      cancelText: "biykarlaw",
      centered: true, // Markazda chiqishi uchun
      // ⚠️ MUHIM QISM:
      getContainer: () => document.body,
      // Bu buyruq modalni sidebar ichidan sug'urib olib,
      // butun ekran (body) ustiga joylashtiradi.

      onOk: async () => {
        try {
          await logoutUser();
        } catch (err) {
          console.error("Logout API error:", err);
        }
        localStorage.clear();
        sessionStorage.clear();
        message.success("Sistemadan shıǵıldı");
        navigate("/login");
      },
    });
  };

  return (
    <div
      onClick={handleLogout}
       className="flex items-center gap-2 w-full h-full text-[15px] font-medium"
    >
      <LogoutOutlined />
      <span>Shıǵıw</span>
    </div>
  );
};

export default Logout;
