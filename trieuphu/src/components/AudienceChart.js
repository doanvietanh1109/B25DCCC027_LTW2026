import { LETTERS } from '../data';

const AudienceChart = ({ percentages }) => (
  <section className="audience-panel" aria-label="Kết quả hỏi khán giả">
    <h3>Kết quả hỏi khán giả</h3>
    {percentages.map((percent, index) => (
      <div className="audience-row" key={LETTERS[index]}>
        <span className="audience-label">{LETTERS[index]}: {percent}%</span>
        <div className="audience-track">
          <div className="audience-bar" style={{ width: `${percent}%` }} />
        </div>
      </div>
    ))}
  </section>
);

export default AudienceChart;
