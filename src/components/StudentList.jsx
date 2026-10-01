import StudentItem from './StudentItem';

const StudentList = ({ students, onDelete }) => {
  if (students.length === 0) {
    return (
      <div className="empty-state">
        Không có sinh viên nào phù hợp với bộ lọc hiện tại.
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Họ tên</th>
            <th>Lớp</th>
            <th>Điểm</th>
            <th>Xếp loại</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <StudentItem
              key={student.id}
              student={student}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
