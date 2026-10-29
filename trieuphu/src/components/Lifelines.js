const Lifelines = ({ used, disabled, onFifty, onAudience, onQuit }) => (
  <section className="lifelines" aria-label="Các quyền trợ giúp">
    <h3>Quyền trợ giúp</h3>
    <div className="lifeline-buttons">
      <button type="button" className="button secondary" disabled={disabled || used.fifty} onClick={onFifty}>
        50:50 {used.fifty ? '✓' : ''}
      </button>
      <button type="button" className="button secondary" disabled={disabled || used.audience} onClick={onAudience}>
        Hỏi khán giả {used.audience ? '✓' : ''}
      </button>
      <button type="button" className="button danger" disabled={disabled || used.quit} onClick={onQuit}>
        Dừng cuộc chơi
      </button>
    </div>
  </section>
);

export default Lifelines;
