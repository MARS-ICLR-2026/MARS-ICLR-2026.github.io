'use strict';
(() => {
  const byId = id => document.getElementById(id);
  const player = byId('oracle-player');
  const fields = ['model', 'dataset', 'suite', 'protocol'];
  const modelNames = {'π0.5':'π0.5','starvla_qwenpi':'StarVLA-PI','starvla_qwengroot':'StarVLA-GR00T','smolvla':'SmolVLA'};
  let filtered = [], page = 0, selected = null;
  const pageSize = 12;
  const name = row => modelNames[row.model] || row.model;
  function active() {
    if (!selected) return;
    let text = 'Target instruction: ' + selected.prompt;
    if (selected.protocol === 'prepared') {
      if (selected.prep_frames === null) text = 'Stage timing unavailable. Target instruction: ' + selected.prompt;
      else if (player.currentTime < selected.prep_frames / 20) text = 'Preparation: ' + selected.preparation_prompt;
    }
    if (byId('oracle-active').textContent !== text) byId('oracle-active').textContent = text;
  }
  function choose(row) {
    selected = row;
    player.pause();
    player.src = row.video;
    player.poster = row.poster;
    const track = document.createElement('track');
    track.kind = 'captions'; track.label = 'Execution stages'; track.srclang = 'en'; track.src = row.captions;
    player.replaceChildren(track); player.load();
    byId('oracle-error').textContent = '';
    byId('oracle-details').textContent = `${name(row)} · ${row.dataset} · ${row.suite} · L${row.level} · Episode ${row.episode}\nProtocol: ${row.protocol} · Source outcome: success\nTarget: ${row.prompt}` + (row.preparation_prompt ? `\nPreparation: ${row.preparation_prompt}` : '');
    active();
    for (const button of byId('oracle-list').querySelectorAll('button')) button.setAttribute('aria-pressed', String(button.dataset.clip === row.video));
  }
  function draw() {
    const list = byId('oracle-list'); list.replaceChildren();
    for (const row of filtered.slice(page * pageSize, (page + 1) * pageSize)) {
      const button = document.createElement('button'); button.type = 'button'; button.dataset.clip = row.video;
      button.textContent = `${name(row)} · ${row.dataset} · L${row.level}\n${row.prompt}\n${row.suite} · ${row.protocol} · Episode ${row.episode}`;
      button.setAttribute('aria-pressed', String(selected?.video === row.video));
      button.addEventListener('click', () => choose(row)); list.append(button);
    }
    byId('oracle-count').textContent = `${filtered.length} matching successful clips / ${ORACLE_VIDEOS.length} total`;
    byId('oracle-page').textContent = filtered.length ? `${page+1} / ${Math.ceil(filtered.length/pageSize)}` : '0 / 0';
    byId('oracle-prev').disabled = page === 0;
    byId('oracle-next').disabled = (page+1)*pageSize >= filtered.length;
  }
  function filter() {
    const query = byId('oracle-query').value.trim().toLowerCase();
    filtered = ORACLE_VIDEOS.filter(row => fields.every(field => !byId('oracle-'+field).value || row[field] === byId('oracle-'+field).value) && [row.prompt,row.preparation_prompt,row.suite].join(' ').toLowerCase().includes(query));
    page = 0;
    if (!filtered.some(row => row.video === selected?.video)) {
      if (filtered.length) choose(filtered[0]);
      else {
        selected = null; player.pause(); player.removeAttribute('src'); player.removeAttribute('poster'); player.replaceChildren(); player.load();
        byId('oracle-active').textContent = 'No matching clips. Adjust the filters.';
        byId('oracle-details').textContent = ''; byId('oracle-error').textContent = '';
      }
    }
    draw();
  }
  for (const field of fields) {
    const select = byId('oracle-'+field);
    for (const value of [...new Set(ORACLE_VIDEOS.map(row => row[field]))].sort()) select.add(new Option(field === 'model' ? modelNames[value] || value : value,value));
    select.addEventListener('change',filter);
  }
  byId('oracle-query').addEventListener('input',filter);
  byId('oracle-prev').addEventListener('click',()=>{page--;draw();});
  byId('oracle-next').addEventListener('click',()=>{page++;draw();});
  player.addEventListener('timeupdate',active); player.addEventListener('seeked',active);
  player.addEventListener('play',()=>{for(const video of document.querySelectorAll('video')) if(video!==player)video.pause();});
  player.addEventListener('error',()=>{if(selected)byId('oracle-error').textContent='Video could not be loaded. Select the clip again to retry.';});
  filter();
})();
