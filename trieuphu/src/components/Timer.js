const Timer = ({ seconds }) => (
  <div className={`timer ${seconds <= 10 ? 'timer-warning' : ''}`} role="timer" aria-live="off">
    Còn {seconds} giây
  </div>
);

export default Timer;
