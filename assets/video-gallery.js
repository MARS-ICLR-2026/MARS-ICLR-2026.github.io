'use strict';
for (const card of document.querySelectorAll('.rollout')) {
  const videos = [...card.querySelectorAll('video')];
  const status = card.querySelector('.playback-status');
  const pause = () => videos.forEach(video => video.pause());
  card.querySelector('.play-pair').addEventListener('click', async () => {
    for (const other of document.querySelectorAll('.rollout video')) if (!videos.includes(other)) other.pause();
    const time = videos[0].ended ? 0 : videos[0].currentTime;
    videos.forEach(video => { video.currentTime = time; });
    const results = await Promise.allSettled(videos.map(video => video.play()));
    status.textContent = results.some(result => result.status === 'rejected') ? 'Playback could not start. Use the individual video controls to retry.' : '';
    if (results.some(result => result.status === 'rejected')) pause();
  });
  card.querySelector('.pause-pair').addEventListener('click', pause);
  card.querySelector('.restart-pair').addEventListener('click', () => {
    pause(); videos.forEach(video => { video.currentTime = 0; }); status.textContent = '';
  });
  for (const video of videos) video.addEventListener('error', () => {
    status.textContent = 'This video could not be loaded. Please retry using the player controls.';
  });
  const select = card.querySelector('.episode-select');
  if (select) select.addEventListener('change', () => {
    pause(); status.textContent = '';
    const episode = VIDEO_EPISODES[select.dataset.key][Number(select.value)];
    for (const video of videos) { video.src = episode[video.dataset.view]; video.poster = episode[video.dataset.view].replace(/\.mp4$/, ".jpg"); video.load(); }
  });
}
