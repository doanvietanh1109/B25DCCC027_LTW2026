import { MILESTONES, PRIZES, formatMoney } from '../data';

const MoneyLadder = ({ currentQuestion }) => (
  <aside className="ladder" aria-label="Thang tiền thưởng">
    <h3>Thang tiền thưởng</h3>
    {[...PRIZES].reverse().map((prize, reverseIndex) => {
      const number = PRIZES.length - reverseIndex;
      const milestone = MILESTONES.includes(number);
      return (
        <div key={number} className={`ladder-step ${currentQuestion === number ? 'ladder-current' : ''} ${milestone ? 'ladder-milestone' : ''}`}>
          <span>Câu {number}</span><span>{formatMoney(prize)}</span>
        </div>
      );
    })}
  </aside>
);

export default MoneyLadder;
