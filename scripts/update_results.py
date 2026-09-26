"""Extract all three appendix benchmark tables into the website explorer."""
from pathlib import Path
import hashlib
import json
import re
import sys
root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1]) if len(sys.argv)>1 else root.parent/'paper/sections/appendix.tex'
text = source.read_text()
models = ['π0.5','StarVLA-PI','StarVLA-GR00T','SmolVLA']
records=[]
for dataset,label in [('VLA-Arena','vla-arena'),('LIBERO-Safety','libero-safety'),('SafeLIBERO','safelibero')]:
    start=text.index('\\label{tab:'+label+'-full}')
    table=text[start:text.index(r'\end{table}',start)]
    suite=None; level=None
    for line in table.splitlines():
        match=re.search(r'\\multirow\{8\}\{\*\}\{([^}]+)\}',line)
        if match: suite=match[1]
        match=re.search(r'Difficulty Level (L\d)',line)
        if match: level=match[1]
        if '&' not in line: continue
        cells=[c.strip() for c in line.split('&')]
        method=cells[0] if dataset=='LIBERO-Safety' else cells[1]
        model='π0.5' if r'\pi_{0.5}' in method else next((m for m in models[1:] if method.startswith(m)),None)
        if model is None: continue
        numbers=cells[1:] if dataset=='LIBERO-Safety' else cells[2:]
        values=[float(re.search(r'\d+(?:\.\d+)?',c)[0]) for c in numbers]
        common=dict(dataset=dataset,model=model,method='mars' if 'MARS' in method else 'base')
        if dataset=='VLA-Arena':
            assert len(values)==6
            for i in range(3): records.append(dict(common,suite=suite,level=f'L{i}',metrics=dict(SR=values[2*i],CC=values[2*i+1])))
        elif dataset=='LIBERO-Safety':
            assert len(values)==4
            for name,value in zip(['AAG','HRI','Obstacle','Physical'],values): records.append(dict(common,suite=name,level=level,metrics=dict(SSR=value)))
        else:
            assert len(values)==3
            records.append(dict(common,suite=suite,level='I + II',metrics=dict(zip(['SR','SSR','CR'],values))))
assert len(records)==256
keys=[tuple(r[k] for k in ['dataset','model','suite','level','method']) for r in records]
assert len(set(keys))==len(keys)
for r in records:
    assert tuple(r[k] for k in ['dataset','model','suite','level'])+('mars' if r['method']=='base' else 'base',) in keys
output='// Generated from the three per-suite appendix tables.\nconst RESULTS = '+json.dumps(records,ensure_ascii=False,indent=2)+';\n'
(root/'assets/results.js').write_text(output)
# Version both scripts together so clients load matching data and rendering logic.
version=hashlib.sha256((output+(root/'assets/site.js').read_text()).encode()).hexdigest()[:12]
p=root/'index.html';html=p.read_text()
html=re.sub(r'assets/(results|site)\.js(?:\?v=[a-z0-9]+)?',lambda m:'assets/'+m[1]+'.js?v='+version,html)
p.write_text(html)
print(f'Synchronized {len(records)} rows across 3 datasets and 4 models.')
