import { NavLink } from 'react-router-dom';

const NavBar = () => (
  <nav className="nav" aria-label="Điều hướng chính">
    <NavLink end to="/">Trang chủ</NavLink>
    <NavLink to="/questions">Ngân hàng câu hỏi</NavLink>
    <NavLink to="/history">Lịch sử</NavLink>
  </nav>
);

export default NavBar;
