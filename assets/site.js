'use strict';
const dataset = document.querySelector('#result-dataset');
const model = document.querySelector('#result-model');
const suite = document.querySelector('#suite');
const level = document.querySelector('#level');
const display = document.querySelector('#result-display');
const metricNames = {SR:'Success rate', SSR:'Safe success rate', CC:'Cumulative cost', CR:'Collision rate'};
function options(select, values, preferred) {
  const previous = preferred || select.value;
  select.replaceChildren(...values.map(v => new Option(v, v)));
  if (values.includes(previous)) select.value = previous;
}
function metricChart(metric, base, mars) {
  const percentage = metric !== 'CC';
  const maximum = percentage ? 100 : Math.max(base, mars, 0.001);
  const unit = percentage ? '%' : '';
  const hint = ['SR','SSR'].includes(metric) ? 'HIGHER IS BETTER ↑' : 'LOWER IS BETTER ↓';
  const row = (name, value, style) => `<div class="bar-row"><span>${name}</span><div class="bar-track"><div class="bar ${style}" style="width:${value / maximum * 100}%"></div></div><strong>${value}${unit}</strong></div>`;
  return `<div class="metric-chart"><h4>${metricNames[metric]}<span>${hint}</span></h4>${row('Base',base,'baseline')}${row('+ MARS',mars,'mars')}</div>`;
}
function updateResults() {
  const rows = RESULTS.filter(r => r.dataset===dataset.value && r.model===model.value && r.suite===suite.value && r.level===level.value);
  const base = rows.find(r=>r.method==='base').metrics;
  const mars = rows.find(r=>r.method==='mars').metrics;
  document.querySelector('#result-baseline-name').textContent = model.value;
  document.querySelector('#result-mars-name').textContent = model.value + ' + MARS';
  display.innerHTML = `<div class="chart-grid">${Object.keys(base).map(m=>metricChart(m,base[m],mars[m])).join('')}</div><p class="result-note">${dataset.value} · ${model.value} · ${suite.value} · ${level.value}: ${Object.keys(base).map(m=>m+' '+base[m]+' → '+mars[m]).join('; ')}.</p>`;
}
function updateLevels() {
  options(level,[...new Set(RESULTS.filter(r=>r.dataset===dataset.value && r.model===model.value && r.suite===suite.value).map(r=>r.level))]);
  level.disabled = level.options.length===1;
  updateResults();
}
function updateSuites(preferred) {
  options(suite,[...new Set(RESULTS.filter(r=>r.dataset===dataset.value && r.model===model.value).map(r=>r.suite))],preferred);
  updateLevels();
}
options(dataset,[...new Set(RESULTS.map(r=>r.dataset))]);
options(model,[...new Set(RESULTS.map(r=>r.model))]);
dataset.addEventListener('change',()=>updateSuites());
model.addEventListener('change',()=>updateSuites());
suite.addEventListener('change',updateLevels);
level.addEventListener('change',updateResults);
updateSuites('HazardAvoidance');

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
