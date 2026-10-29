import { Outlet } from 'react-router-dom';
import NavBar from './NavBar';

const Layout = ({ loading, error }) => (
  <>
    <header className="header">
      <div className="header-inner">
        <div className="brand"><span className="brand-icon">◆</span> AI LÀ TRIỆU PHÚ <span className="brand-label">LTW 2026</span></div>
        <NavBar />
      </div>
    </header>
    <main className="container">
      {loading ? <p className="notice">Đang tải câu hỏi...</p> :
        error ? <p className="notice error">Không tải được câu hỏi.</p> :
          <Outlet />}
    </main>
    <footer className="footer">Ai là triệu phú · Phiên bản Lập trình Web</footer>
  </>
);

export default Layout;
