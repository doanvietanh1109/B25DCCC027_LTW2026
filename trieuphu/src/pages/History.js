import { formatMoney } from '../data';

const History = ({ history, onClear }) => {
  const sorted = [...history].sort((a, b) => b.prize - a.prize);
  const highest = history.reduce((max, item) => Math.max(max, item.prize), 0);
  const total = history.reduce((sum, item) => sum + item.prize, 0);

  return (
    <section className="panel">
      <p className="eyebrow">THỐNG KÊ NGƯỜI CHƠI</p>
      <h1>Lịch sử các lượt chơi</h1>
      <div className="stats">
        <div className="stat"><span>Số lượt chơi:</span><strong>{history.length}</strong></div>
        <div className="stat"><span>Tiền thưởng cao nhất:</span><strong>{formatMoney(highest)}</strong></div>
        <div className="stat"><span>Tổng tiền thưởng:</span><strong>{formatMoney(total)}</strong></div>
      </div>
      {history.length === 0 ? (
        <p className="notice">Chưa có lượt chơi nào.</p>
      ) : (
        <>
          <div className="history-toolbar">
            <p className="count">Có {history.length} lượt chơi được lưu.</p>
            <button className="button danger" onClick={onClear}>Xóa lịch sử</button>
          </div>
          <div className="table-scroll">
            <table>
              <thead><tr><th>Người chơi</th><th>Số câu đúng</th><th>Tiền thưởng</th><th>Thời gian</th></tr></thead>
              <tbody>
                {sorted.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.correctCount}</td>
                    <td><strong>{formatMoney(item.prize)}</strong></td>
                    <td>{item.playedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
};

export default History;
