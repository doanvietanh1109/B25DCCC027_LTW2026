import { useMemo, useState } from "react";
import StudentList from "./components/StudentList";

const initialStudents = [
  { id: 1, name: "Hoàng Tuấn Anh", score: 8, class: "D25CQCC03-B" },
  { id: 2, name: "Nguyễn Đức Duy", score: 7, class: "D25CQCC02-B" },
  { id: 3, name: "Phan Lạc Hưng", score: 6, class: "D25CQCC01-B" },
];

const App = () => {
  const [students, setStudents] = useState(initialStudents);
  const [filter, setFilter] = useState("all");
  const [formData, setFormData] = useState({
    name: "",
    score: "",
    className: "",
  });
  const [error, setError] = useState("");

  const { name, score, className } = formData;

  const handleInputChange = (event) => {
    const { name: fieldName, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [fieldName]: value,
    }));
  };

  const validateStudent = () => {
    const trimmedName = name.trim();
    const trimmedClassName = className.trim();
    const numericScore = Number(score);

    if (!trimmedName || !trimmedClassName || score === "") {
      return "Vui lòng nhập đầy đủ họ tên, điểm số và lớp.";
    }

    if (Number.isNaN(numericScore) || numericScore < 0 || numericScore > 10) {
      return "Điểm số phải là số hợp lệ trong khoảng từ 0 đến 10.";
    }

    return "";
  };

  const handleAddStudent = (event) => {
    event.preventDefault();

    const validationMessage = validateStudent();

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const nextId =
      students.length > 0 ? Math.max(...students.map(({ id }) => id)) + 1 : 1;

    const newStudent = {
      id: nextId,
      name: name.trim(),
      score: Number(score),
      class: className.trim(),
    };

    setStudents((currentStudents) => [...currentStudents, newStudent]);
    setFormData({ name: "", score: "", className: "" });
    setError("");
  };

  const handleDeleteStudent = (studentId) => {
    setStudents((currentStudents) =>
      currentStudents.filter(({ id }) => id !== studentId),
    );
  };

  const filteredStudents = useMemo(() => {
    if (filter === "excellent") {
      return students.filter(({ score: studentScore }) => studentScore >= 8);
    }

    if (filter === "failed") {
      return students.filter(({ score: studentScore }) => studentScore < 5);
    }

    return students;
  }, [students, filter]);

  const totalStudents = students.length;

  const averageScore =
    students.length > 0
      ? students.reduce(
          (total, { score: studentScore }) => total + studentScore,
          0,
        ) / students.length
      : 0;

  const filterDescription =
    filter === "excellent"
      ? "Sinh viên loại Giỏi (điểm từ 8 trở lên)"
      : filter === "failed"
        ? "Sinh viên trượt môn (điểm dưới 5)"
        : "Tất cả sinh viên";

  return (
    <main className="app-shell">
      <section className="hero-card">
        <div>
          <p className="eyebrow"></p>
          <h1>Quản lý Điểm Sinh viên</h1>
          <p className="hero-copy"></p>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <div>
            <span>Tổng sinh viên</span>
            <strong>{totalStudents}</strong>
          </div>
        </article>
        <article className="stat-card">
          <div>
            <span>Điểm trung bình</span>
            <strong>{averageScore.toFixed(2)}</strong>
          </div>
        </article>
      </section>

      <section className="content-card">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Thêm dữ liệu</p>
            <h2>Thêm sinh viên mới</h2>
          </div>
        </div>

        <form className="student-form" onSubmit={handleAddStudent}>
          <label>
            Họ tên
            <input
              type="text"
              name="name"
              value={name}
              onChange={handleInputChange}
              placeholder="Ví dụ: Đoàn Việt Anh"
            />
          </label>

          <label>
            Điểm số
            <input
              type="number"
              name="score"
              value={score}
              onChange={handleInputChange}
              min="0"
              max="10"
              step="0.1"
              placeholder="0 - 10"
            />
          </label>

          <label>
            Lớp
            <input
              type="text"
              name="className"
              value={className}
              onChange={handleInputChange}
              placeholder="Ví dụ: D25CQCC04-B"
            />
          </label>

          <button type="submit" className="primary-button">
            Thêm sinh viên
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}
      </section>

      <section className="content-card">
        <div className="list-toolbar">
          <div>
            <p className="eyebrow">Danh sách</p>
            <h2>{filterDescription}</h2>
          </div>

          <div
            className="filter-group"
            role="group"
            aria-label="Bộ lọc sinh viên"
          >
            <button
              type="button"
              className={
                filter === "all" ? "filter-button active" : "filter-button"
              }
              onClick={() => setFilter("all")}
            >
              Tất cả
            </button>
            <button
              type="button"
              className={
                filter === "excellent"
                  ? "filter-button active"
                  : "filter-button"
              }
              onClick={() => setFilter("excellent")}
            >
              Giỏi ≥ 8
            </button>
            <button
              type="button"
              className={
                filter === "failed" ? "filter-button active" : "filter-button"
              }
              onClick={() => setFilter("failed")}
            >
              Trượt &lt; 5
            </button>
          </div>
        </div>

        <StudentList
          students={filteredStudents}
          onDelete={handleDeleteStudent}
        />
      </section>

      <footer>
        {`Hiện đang hiển thị ${filteredStudents.length}/${totalStudents} sinh viên.`}
      </footer>
    </main>
  );
};

export default App;
