"""
Regenerates src/assets/fonts/bricolage-grotesque-latin-wght600-800-subset.woff2,
the heading font served on every page.

The stock fontsource latin file is ~41 KB. Headings only use weights 600-800
and the characters below, so the subset keeps the font budget in
.github/lighthouse/lighthouserc.json. If you add heading text with characters
outside DISPLAY_UNICODES, extend it here and in src/styles/fonts.ts, then rerun:

    pip install fonttools brotli
    python3 scripts/subset-display-font.py
"""
from pathlib import Path

from fontTools import subset
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / 'node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2'
OUT = ROOT / 'src/assets/fonts/bricolage-grotesque-latin-wght600-800-subset.woff2'

# Keep in sync with DISPLAY_RANGE in src/styles/fonts.ts.
DISPLAY_UNICODES = 'U+0020-007E,U+00A0-00FF,U+00B7,U+2013-2014,U+2018-201D,U+2022,U+2026,U+20AC,U+2192-2193,U+2197'

font = TTFont(SRC)
options = subset.Options()
options.layout_features = ['kern']
options.hinting = False
subsetter = subset.Subsetter(options)
subsetter.populate(unicodes=subset.parse_unicodes(DISPLAY_UNICODES))
subsetter.subset(font)
font = instancer.instantiateVariableFont(font, {'wght': (600, 800)})
font.flavor = 'woff2'
font.save(OUT)
print(f'{OUT.relative_to(ROOT)}: {OUT.stat().st_size} bytes')
