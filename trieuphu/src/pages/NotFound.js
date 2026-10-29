import { Link } from 'react-router-dom';

const NotFound = () => (
  <section className="panel center">
    <h1>404 - Không tìm thấy trang</h1>
    <Link className="button" to="/">Về trang chủ</Link>
  </section>
);

export default NotFound;
