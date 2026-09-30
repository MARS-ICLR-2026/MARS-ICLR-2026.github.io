"""Build anonymous web media from a supplied final directory. Run: python3 scripts/update_videos.py INPUT"""
from pathlib import Path
import sys,re,json,subprocess,html
root=Path(__file__).resolve().parents[1];source=Path(sys.argv[1]);dest=root/'assets/videos/final'
tasks=[('affordance','Affordance-aware grasping','Affordance-aware grasping'),('obstacle','Obstacle avoidance','Obstacle avoidance'),('hazard','Hazard avoidance','pickupfruit'),('cautious','Cautious grasp','pickupscrewdriver')]
platforms=[('cr16','Dobot CR-10'),('a1x','Galaxea A1X')]
data={};provenance=[]
def run(args):subprocess.run(['ffmpeg','-v','error','-y']+args,check=True)
for platform,label in platforms:
 for task,title,prefix in tasks:
  for outcome in (['success'] if task=='affordance' else ['success','failure']):data[f'{platform}:{task}:{outcome}']=[]
  for folder in sorted((source/platform).glob(prefix+'*'),key=lambda p:(len(p.name),p.name)):
   if not folder.is_dir() or folder.name.endswith('-old'):continue
   match=re.search(r'-(0|1)$',folder.name)
   outcome=('success' if match[1]=='1' else 'failure') if match else 'success'
   # Explicit user correction: this unhyphenated A1X recording is a failure.
   if platform=='a1x' and folder.name=='pickupscrewdriver0':outcome='failure'
   key=f'{platform}:{task}:{outcome}';idx=len(data[key])+1;entry={}
   # Prefer the explicitly trimmed derivative, when present; never duplicate it.
   clipdir=folder/'trimmed_16s' if (folder/'trimmed_16s').is_dir() else folder
   for view in ['front','wrist']:
    src=clipdir/f'cam_{view}.mp4';assert src.is_file(),src
    out=dest/platform/task/outcome/f'{idx:02d}-{view}.mp4';out.parent.mkdir(parents=True,exist_ok=True)
    run(['-i',str(src),'-map','0:v:0','-c','copy','-map_metadata','-1','-map_chapters','-1','-movflags','+faststart',str(out)])
    run(['-ss','0','-i',str(out),'-frames:v','1','-vf','scale=480:-2','-q:v','4',str(out.with_suffix('.jpg'))])
    entry[view]=out.relative_to(root).as_posix()
   data[key].append(entry);provenance.append({'platform':platform,'task':task,'outcome':outcome,'source':clipdir.relative_to(source).as_posix(),'episode':idx})
data['placeholder']={v:f'assets/videos/placeholder/{v}.mp4' for v in ['front','wrist']}
(root/'assets/videos.js').write_text('const VIDEO_EPISODES = '+json.dumps(data,indent=2)+';\n')
(root/'assets/video-sources.json').write_text(json.dumps(provenance,indent=2)+'\n')
parts=['<section class="video-band" id="video" aria-labelledby="video-title" tabindex="-1"><div class="wrap"><p class="eyebrow">05 / WATCH MARS</p><h2 id="video-title">Real-world rollouts</h2><p class="gallery-intro">Four task families on Dobot CR-10 and Galaxea A1X, with paired front / wrist views. Success and failure follow the supplied recording labels. Affordance-aware grasping clips are successful training demonstrations, not held-out evaluation results.</p>']
for task,title,prefix in tasks:
 parts.append(f'<section class="video-task" aria-labelledby="video-{task}"><h3 id="video-{task}">{title}</h3>')
 if task=='affordance':parts.append('<p class="clip-note">Successful training demonstrations of the pick-and-place subtasks used in the other three task families.</p><div class="platform-pair">')
 if task=='cautious':parts.append('<p class="clip-note">Grasp the screwdriver by its handle and place it in the box.</p>')
 for platform,label in platforms:
  if task=='affordance':parts.append('<div class="platform-column">')
  parts.append(f'<h4 class="platform-label" data-platform="{platform}">{label}</h4><div class="outcome-grid">')
  for outcome in (['success'] if task=='affordance' else ['success','failure']):
   key=f'{platform}:{task}:{outcome}';episodes=data[key];clips=episodes[0] if episodes else data['placeholder']
   status=outcome.capitalize()+(' · Training data' if task=='affordance' and episodes else '') if episodes else outcome.capitalize()+' slot · Placeholder'
   parts.append(f'<article class="rollout" data-rollout="{platform}-{task}-{outcome}"><div class="rollout-header"><h5>{status}</h5>')
   if len(episodes)>1:
    parts.append(f'<label>Episode <select class="episode-select" data-key="{key}" aria-label="{label} {title} {outcome} episode">'+''.join(f'<option value="{i}">{i+1:02d} / {len(episodes):02d}</option>' for i in range(len(episodes)))+'</select></label>')
   parts.append('</div><div class="camera-grid">')
   for view in ['front','wrist']:
    parts.append(f'<figure><figcaption>{view.capitalize()}</figcaption><video controls muted playsinline preload="none" data-view="{view}" aria-label="{label}, {title}, {status}, {view} view" poster="{clips[view][:-4]}.jpg" src="{clips[view]}">Your browser does not support MP4 video.</video></figure>')
   parts.append('</div><div class="playback-controls"><button type="button" class="play-pair">Play both views</button><button type="button" class="pause-pair">Pause both</button><button type="button" class="restart-pair">Reset both</button></div><p class="playback-status" aria-live="polite"></p>')
   note=('Successful training demonstration.' if task=='affordance' else 'Recorded '+outcome+' example.') if episodes else 'Candle-task placeholder. No matching '+outcome+' recording is available.'
   parts.append(f'<p class="clip-note">{note}</p></article>')
  parts.append('</div>')
  if task=='affordance':parts.append('</div>')
 if task=='affordance':parts.append('</div>')
 parts.append('</section>')
parts.append('</div></section>')
p=root/'index.html';s=p.read_text();start=s.index('    <section class="video-band"');end=s.index('\n    <section class="section wrap oracle-section"',start) if 'class="section wrap oracle-section"' in s else s.index('\n  </main>',start);p.write_text(s[:start]+'    '+''.join(parts)+s[end:])
print(json.dumps({k:len(v) for k,v in data.items() if k!='placeholder'},indent=2))
