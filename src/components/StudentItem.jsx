const StudentItem = ({ student, onDelete }) => {
  const { id, name, score, class: className } = student;

  const getResultLabel = () => {
    if (score >= 8) return 'Giỏi';
    if (score < 5) return 'Trượt';
    return 'Đạt';
  };

  const resultLabel = getResultLabel();

  return (
    <tr>
      <td>{id}</td>
      <td className="student-name">{name}</td>
      <td>{className}</td>
      <td>
        <span className={`score-badge score-${resultLabel.toLowerCase()}`}>
          {score.toFixed(1)}
        </span>
      </td>
      <td>{resultLabel}</td>
      <td>
        <button
          type="button"
          className="delete-button"
          onClick={() => onDelete(id)}
          aria-label={`Xóa sinh viên ${name}`}
        >
          Xóa
        </button>
      </td>
    </tr>
  );
};

export default StudentItem;
