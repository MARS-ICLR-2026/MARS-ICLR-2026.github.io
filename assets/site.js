'use strict';

const suite = document.querySelector('#suite');
const level = document.querySelector('#level');
const display = document.querySelector('#result-display');

function metricChart(title, base, mars, success) {
  const maximum = success ? 100 : Math.max(base, mars, 0.001);
  const unit = success ? '%' : '';
  const hint = success ? 'HIGHER IS BETTER ↑' : 'LOWER IS BETTER ↓';
  const row = (name, value, style) => `<div class="bar-row"><span>${name}</span><div class="bar-track"><div class="bar ${style}" style="width:${value / maximum * 100}%"></div></div><strong>${value}${unit}</strong></div>`;
  return `<div class="metric-chart"><h4>${title}<span>${hint}</span></h4>${row('π<sub>0.5</sub>', base, 'baseline')}${row('+ MARS', mars, 'mars')}</div>`;
}

function updateResults() {
  const [baseSR, baseCC, marsSR, marsCC] = RESULTS[suite.value][Number(level.value)];
  const verb = (before, after) => after > before ? 'rises' : after < before ? 'falls' : 'is unchanged';
  const change = (before, after, unit = '') => before === after ? `at ${before}${unit}` : `from ${before}${unit} to ${after}${unit}`;
  display.innerHTML = `<div class="chart-grid">${metricChart('Success rate', baseSR, marsSR, true)}${metricChart('Cumulative cost', baseCC, marsCC, false)}</div><p class="result-note">${suite.value} · L${level.value}: success ${verb(baseSR, marsSR)} ${change(baseSR, marsSR, '%')}, while cumulative cost ${verb(baseCC, marsCC)} ${change(baseCC, marsCC)}.</p>`;
}
suite.addEventListener('change', updateResults);
level.addEventListener('change', updateResults);
updateResults();

const dialog = document.querySelector('#figure-dialog');
const openFigure = document.querySelector('#open-framework');
document.querySelector('#close-framework').addEventListener('click', () => dialog.close());
openFigure.addEventListener('click', () => dialog.showModal());
dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }
});
dialog.addEventListener('close', () => openFigure.focus({preventScroll: true}));
