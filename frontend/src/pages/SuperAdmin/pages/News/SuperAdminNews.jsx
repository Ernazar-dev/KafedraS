import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  Upload,
  message,
  Popconfirm,
  Space,
  Empty,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileImageOutlined,
  SearchOutlined,
  CalendarOutlined,
  UserOutlined,
} from "@ant-design/icons";
import api from "../../../../api/axios";
import { getImageUrl } from "../../../../api/imageUrl";

const { TextArea } = Input;

const SuperAdminNews = () => {
  const [news, setNews] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const res = await api.get("/news");
      setNews(res.data);
      setFiltered(res.data);
    } catch {
      message.error("Jańalıqlardı júklewde qátelik júz berdi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(
      news.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.content?.toLowerCase().includes(q)
      )
    );
  }, [search, news]);

  const showModal = () => {
    setEditMode(false);
    setEditingId(null);
    form.resetFields();
    setFileList([]);
    setIsModalOpen(true);
  };

  const handleEdit = (record) => {
    setEditMode(true);
    setEditingId(record.id);
    form.setFieldsValue({ title: record.title, content: record.content });
    setFileList(
      record.file
        ? [
            {
              uid: "-1",
              name: "Súwret",
              status: "done",
              url: getImageUrl(record.file),
            },
          ]
        : []
    );
    setIsModalOpen(true);
  };

  const onFinish = async (values) => {
    const data = new FormData();
    data.append("title", values.title);
    data.append("content", values.content);
    if (fileList[0]?.originFileObj)
      data.append("file", fileList[0].originFileObj);

    setSubmitLoading(true);
    try {
      if (editMode) {
        await api.put(`/news/${editingId}`, data);
        message.success("Jańalıq tabıslı jańalandı");
      } else {
        await api.post("/news", data);
        message.success("Jańalıq tabıslı qosıldı");
      }
      setIsModalOpen(false);
      fetchNews();
    } catch {
      message.error("Ámeldi orinlawda qátelik júz berdi.");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/news/${id}`);
      message.success("Jańalıq óshirildi");
      setNews((prev) => prev.filter((n) => n.id !== id));
    } catch {
      message.error("Óshiriwde qátelik júz berdi");
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4ff] p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-7 bg-[#02135e] rounded-full" />
            <h1 className="text-2xl font-bold text-[#02135e] tracking-tight">
              Jańalıqlar basqarması
            </h1>
          </div>
          <p className="text-slate-500 text-sm ml-3.5">
            Kafedra turmısındaǵı eń sońǵı xabarlar
          </p>
        </div>

        <button
          onClick={showModal}
          className="flex items-center gap-2 bg-[#02135e] hover:bg-[#03197a] text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors duration-200 shadow-sm self-start sm:self-auto"
        >
          <PlusOutlined />
          Jańalıq qosıw
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <div className="relative w-full sm:w-72">
          <SearchOutlined className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Jańalıq izlew..."
            className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-[#02135e]/40 focus:ring-2 focus:ring-[#02135e]/10 transition"
          />
        </div>
        <p className="text-xs text-slate-400 font-medium">
          Jámi:{" "}
          <span className="text-[#02135e] font-bold">{filtered.length}</span>{" "}
          dana jańalıq
        </p>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse"
            >
              <div className="h-44 bg-slate-200" />
              <div className="p-4 space-y-2">
                <div className="h-3 bg-slate-200 rounded w-1/3" />
                <div className="h-4 bg-slate-200 rounded w-4/5" />
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
            >
              {/* Image */}
              <div className="h-44 bg-slate-100 overflow-hidden">
                <img
                  src={
                    getImageUrl(item.file) ||
                    "https://via.placeholder.com/400x200?text=Rasm+yo%27q"
                  }
                  alt={item.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src =
                      "https://via.placeholder.com/400x200?text=Rasm+yo%27q";
                  }}
                />
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                  <CalendarOutlined />
                  <span>
                    {item.date
                      ? new Date(item.date).toLocaleDateString("uz-UZ")
                      : "—"}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-[#02135e] mb-1.5 line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-3 flex-1 leading-relaxed">
                  {item.content}
                </p>

                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
                  <UserOutlined />
                  <span className="italic">
                    {item.authorName || "Kafedra Admini"}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex border-t border-slate-100">
                <button
                  onClick={() => handleEdit(item)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-blue-600 hover:bg-blue-50 transition-colors duration-150"
                >
                  <EditOutlined />
                  Redaktorlaw
                </button>
                <div className="w-px bg-slate-100" />
                <Popconfirm
                  title="O'chirishni tasdiqlaysizmi?"
                  onConfirm={() => handleDelete(item.id)}
                  okText="Ha"
                  cancelText="Yo'q"
                  okButtonProps={{ danger: true }}
                >
                  <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-red-500 hover:bg-red-50 transition-colors duration-150">
                    <DeleteOutlined />
                    Óshiriw
                  </button>
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl flex items-center justify-center py-24 shadow-sm">
          <Empty
            description={
              <span className="text-slate-400">Házirshe jańalıqlar joq</span>
            }
          />
        </div>
      )}

      {/* Modal */}
      <Modal
        title={
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <div className="w-1 h-5 bg-[#02135e] rounded-full" />
            <span className="text-base font-bold text-[#02135e]">
              {editMode ? "Jańalıqtı redaktorlaw" : "Jańalıq qosıw"}
            </span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
        centered
        width={580}
        styles={{ body: { paddingTop: 16 } }}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="title"
            label={
              <span className="text-sm font-semibold text-slate-700">
                Atama
              </span>
            }
            rules={[{ required: true, message: "Atama kirgiziliwi shárt!" }]}
          >
            <Input
              placeholder="Jańalıq atamasın kirgiziń..."
              size="large"
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item
            name="content"
            label={
              <span className="text-sm font-semibold text-slate-700">
                Mazmun
              </span>
            }
            rules={[{ required: true, message: "Tekst kirgiziliwi shárt!" }]}
          >
            <TextArea
              rows={5}
              placeholder="Jańalıq tekstin tolıq jazıń..."
              className="rounded-xl"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-sm font-semibold text-slate-700">
                Súwret
              </span>
            }
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              maxCount={1}
            >
              {fileList.length < 1 && (
                <div className="flex flex-col items-center gap-1">
                  <FileImageOutlined className="text-2xl text-slate-400" />
                  <span className="text-xs text-slate-400">Súwret júklew</span>
                </div>
              )}
            </Upload>
            <p className="text-xs text-slate-400 mt-1">
              Usınıs etilgen: 800×450px
            </p>
          </Form.Item>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 mt-4">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
            >
              Biykarlaw
            </button>
            <button
              type="submit"
              disabled={submitLoading}
              onClick={() => form.submit()}
              className="px-6 py-2 text-sm font-semibold text-white bg-[#02135e] hover:bg-[#03197a] disabled:opacity-60 rounded-xl transition-colors"
            >
              {submitLoading
                ? "Saqlanbaqta..."
                : editMode
                ? "Saqlaw"
                : "Daǵazalaw"}
            </button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SuperAdminNews;
