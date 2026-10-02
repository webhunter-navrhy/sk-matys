"""Zostaví index.html + style.css s cache bustingom (?v=hash). Texty sú z pôvodného webu profiomietky.sk (podklady/stary-web, archive.org)."""
import hashlib
from pathlib import Path
from PIL import Image
D = Path(__file__).parent

MARQUEE = ['Strojové omietky', 'Sádrové gletované omietky', 'Vápenocementové omietky', 'Rodinné domy', 'Trnavský kraj', 'Bratislavský kraj']
# zo stránky Cenník na profiomietky.sk („V cene je zahrnuté“)
V_CENE = ['Práca a materiál', 'Osadenie dilatačných a APU líšt', 'Osadenie rohových líšt', 'Zakrytie okien fóliou', 'Sieťkovanie spojov', 'Penetrovanie']
# (súbor, popis, veľkosť v mriežke: b = 2×2, w = široká, t = vysoká, '' = 1×1)
GALERIA = [
    ('g-rebrik', 'Omietanie interiéru', 'b'),
    ('g-rozrobene', 'Rozrobená stena', 't'),
    ('hladidlo', 'Zahladzovanie', ''),
    ('g-schody', 'Hotové steny a schodisko', ''),
    ('g-stolicka', 'Hladká sádrová stena', 't'),
    ('g-hruba', 'Hrubá stavba pred omietkami', 'w'),
    ('kraj', 'Štruktúra omietky', ''),
    ('g-izba', 'Hotová izba', 'w'),
    ('g-obyvacka', 'Zariadená obývačka', ''),
]

marquee = ''.join(f'<span>{t}</span><b>✦</b>' for t in MARQUEE) * 2
v_cene = ''.join(f'<li class="rv">{t}</li>' for t in V_CENE)
def fig(n, popis, k):
    w, h = Image.open(D / 'img' / f'{n}.jpg').size
    cls = 'bi' + (f' bi--{k}' if k else '')
    return f'      <figure class="{cls}" data-full="img/{n}.jpg"><img src="img/{n}.jpg" alt="{popis} (ilustračné foto)" loading="lazy" width="{w}" height="{h}"><figcaption>{popis}</figcaption></figure>'
galeria = '\n' + '\n'.join(fig(*g) for g in GALERIA) + '\n    '

css = (D / 'fonts/fonts.css').read_text() + '\n' + (D / 'style.src.css').read_text()
(D / 'style.css').write_text(css)
h = lambda b: hashlib.md5(b).hexdigest()[:8]
html = (D / 'src.html').read_text()
for k, v in dict(marquee=marquee, v_cene=v_cene, galeria=galeria).items():
    html = html.replace('{{' + k + '}}', v)
html = html.replace('{{css}}', h(css.encode())).replace('{{js}}', h((D / 'main.js').read_bytes()))
assert '{{' not in html
(D / 'index.html').write_text(html)
print('ok')
