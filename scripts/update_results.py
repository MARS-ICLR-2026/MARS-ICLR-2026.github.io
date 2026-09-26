"""Synchronize the website's pi0.5 explorer from the manuscript appendix."""
from pathlib import Path
import json
import re
import sys

root = Path(__file__).resolve().parents[1]
source = Path(sys.argv[1]) if len(sys.argv) > 1 else root.parent / 'paper/sections/appendix.tex'
text = source.read_text()
start = text.index(r'\label{tab:vla-arena-full}')
table = text[start:text.index(r'\end{table}', start)]
pairs = {}
suite = None
for line in table.splitlines():
    match = re.search(r'\\multirow\{8\}\{\*\}\{([^}]+)\}', line)
    if match:
        suite = match[1]
        pairs[suite] = {}
    if suite and r'$\pi_{0.5}$' in line:
        cells = line.split('&')[2:]
        values = [float(re.search(r'\d+(?:\.\d+)?', cell)[0]) for cell in cells]
        assert len(values) == 6
        pairs[suite]['mars' if 'MARS' in line else 'base'] = values
assert len(pairs) == 5 and all(set(pair) == {'base', 'mars'} for pair in pairs.values())
results = {suite: [pair['base'][2*i:2*i+2] + pair['mars'][2*i:2*i+2] for i in range(3)] for suite, pair in pairs.items()}
(root / 'assets/results.js').write_text(
    '// Source: paper/sections/appendix.tex, Table tab:vla-arena-full.\n'
    '// Each row: base SR, base CC, MARS SR, MARS CC; levels L0, L1, L2.\n'
    'const RESULTS = ' + json.dumps(results, indent=2) + ';\n')
print('Synchronized 15 comparisons (60 values) from the manuscript.')
