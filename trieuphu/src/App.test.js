import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import App from './App';

jest.mock('axios');

const mockQuestions = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  level: Math.floor(index / 10) + 1,
  question: `Câu hỏi thử nghiệm ${index + 1}?`,
  options: ['Phương án một', 'Phương án hai', 'Phương án ba', 'Phương án bốn'],
  answer: 1,
}));

const renderApp = () => render(<BrowserRouter><App /></BrowserRouter>);

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, '', '/');
  axios.get.mockResolvedValue({ data: mockQuestions });
});

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
});

test('trang chủ tải câu hỏi từ API và không cho bắt đầu khi tên trống', async () => {
  renderApp();
  expect(await screen.findByRole('heading', { name: 'Ai là triệu phú' })).toBeInTheDocument();
  await waitFor(() => expect(axios.get).toHaveBeenCalledWith(
    '/data/questions.json', expect.objectContaining({ signal: expect.anything() })
  ));
  const start = screen.getByRole('button', { name: 'Bắt đầu chơi' });
  expect(start).toBeDisabled();
  fireEvent.change(screen.getByLabelText('Tên người chơi'), { target: { value: 'An' } });
  expect(start).not.toBeDisabled();
});

test('ngân hàng hiển thị 30 câu và lọc được theo độ khó, từ khóa', async () => {
  window.history.replaceState({}, '', '/questions');
  renderApp();
  expect(await screen.findByText('Có 30 câu hỏi')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Mức độ'), { target: { value: '3' } });
  expect(screen.getByText('Có 10 câu hỏi')).toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText('Nhập từ khóa...'), { target: { value: 'câu hỏi thử nghiệm 21' } });
  expect(screen.getByText('Có 1 câu hỏi')).toBeInTheDocument();
});

test('không thể mở /play trực tiếp khi chưa nhập tên', async () => {
  window.history.replaceState({}, '', '/play');
  renderApp();
  expect(await screen.findByRole('heading', { name: 'Ai là triệu phú' })).toBeInTheDocument();
  expect(window.location.pathname).toBe('/');
});

test('vào game có 15 câu và gọi người thân phản hồi sau 3 giây', async () => {
  renderApp();
  await screen.findByRole('heading', { name: 'Ai là triệu phú' });
  fireEvent.change(screen.getByLabelText('Tên người chơi'), { target: { value: 'An' } });
  fireEvent.click(screen.getByRole('button', { name: 'Bắt đầu chơi' }));
  expect(await screen.findByText('CÂU HỎI 1/15')).toBeInTheDocument();
  expect(screen.getByText('Còn 30 giây')).toBeInTheDocument();

  // Bật fake timers sau khi các request/render async đã hoàn tất.
  jest.useFakeTimers();
  const phone = screen.getByRole('button', { name: /Gọi điện cho người thân/ });
  fireEvent.click(phone);
  expect(phone).toBeDisabled();
  expect(screen.getByText(/Đang kết nối với người thân/)).toBeInTheDocument();
  act(() => { jest.advanceTimersByTime(2999); });
  expect(screen.getByText(/Đang kết nối với người thân/)).toBeInTheDocument();
  act(() => { jest.advanceTimersByTime(1); });
  expect(screen.getByText(/Người thân gợi ý:/)).toBeInTheDocument();
});
