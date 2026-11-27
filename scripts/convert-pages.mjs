/**
 * One-off migration helper.
 *
 * Converts the legacy static HTML pages into React JSX and translates the
 * legacy stylesheet rules into Tailwind utility classes that are written
 * directly onto the generated elements.
 *
 * Run with:  node scripts/convert-pages.mjs
 * Requires (dev only): parse5, postcss
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'parse5';
import postcss from 'postcss';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'src', 'pages', 'generated');
fs.mkdirSync(OUT, { recursive: true });

/* ------------------------------------------------------------------ */
/* CSS declaration -> Tailwind utility                                 */
/* ------------------------------------------------------------------ */

const SIMPLE = {
  display: {
    none: 'hidden', block: 'block', inline: 'inline', 'inline-block': 'inline-block',
    flex: 'flex', 'inline-flex': 'inline-flex', table: 'table', 'table-cell': 'table-cell',
  },
  position: { absolute: 'absolute', fixed: 'fixed', relative: 'relative', static: 'static', sticky: 'sticky' },
  float: { left: 'float-left', right: 'float-right', none: 'float-none' },
  clear: { both: 'clear-both', left: 'clear-left', right: 'clear-right' },
  overflow: { hidden: 'overflow-hidden', visible: 'overflow-visible', scroll: 'overflow-scroll', auto: 'overflow-auto' },
  'overflow-x': { hidden: 'overflow-x-hidden', visible: 'overflow-x-visible', scroll: 'overflow-x-scroll', auto: 'overflow-x-auto' },
  'overflow-y': { hidden: 'overflow-y-hidden', visible: 'overflow-y-visible', scroll: 'overflow-y-scroll', auto: 'overflow-y-auto' },
  'user-select': { none: 'select-none', text: 'select-text', all: 'select-all', auto: 'select-auto' },
  'background-repeat': { 'no-repeat': 'bg-no-repeat', repeat: 'bg-repeat', 'repeat-x': 'bg-repeat-x', 'repeat-y': 'bg-repeat-y' },
  'text-decoration': { none: 'no-underline', underline: 'underline' },
  'text-align': { left: 'text-left', center: 'text-center', right: 'text-right', justify: 'text-justify' },
  'vertical-align': { middle: 'align-middle', top: 'align-top', bottom: 'align-bottom' },
  'font-weight': { bold: 'font-bold', normal: 'font-normal', 300: 'font-light', 400: 'font-normal', 700: 'font-bold' },
  'font-style': { normal: 'font-normal', italic: 'italic' },
  'text-transform': { uppercase: 'uppercase', lowercase: 'lowercase', capitalize: 'capitalize' },
  'white-space': { nowrap: 'whitespace-nowrap', normal: 'whitespace-normal' },
};

const SIZE = {
  width: 'w', 'min-width': 'min-w', 'max-width': 'max-w',
  height: 'h', 'min-height': 'min-h', 'max-height': 'max-h',
  top: 'top', right: 'right', bottom: 'bottom', left: 'left',
  'margin-top': 'mt', 'margin-right': 'mr', 'margin-bottom': 'mb', 'margin-left': 'ml',
  'padding-top': 'pt', 'padding-right': 'pr', 'padding-bottom': 'pb', 'padding-left': 'pl',
  'font-size': 'text', 'line-height': 'leading', 'letter-spacing': 'tracking',
  'z-index': 'z', opacity: 'opacity', 'border-radius': 'rounded',
  'border-width': 'border', 'border-top-width': 'border-t', 'border-right-width': 'border-r',
  'border-bottom-width': 'border-b', 'border-left-width': 'border-l',
};

const COLOR = {
  color: 'text', 'background-color': 'bg', 'border-color': 'border',
  'border-top-color': 'border-t', 'border-right-color': 'border-r',
  'border-bottom-color': 'border-b', 'border-left-color': 'border-l',
};

const esc = (v) => v.replace(/\s+/g, '_');

function utilities(prop, rawValue) {
  const important = /!\s*$/.test(rawValue.trim());
  let value = rawValue.trim().replace(/!\s*$/, '').trim();
  let util = null;

  if (SIMPLE[prop] && SIMPLE[prop][value]) util = SIMPLE[prop][value];

  if (!util && prop === 'margin' && /^0\s+auto$/.test(value)) util = 'mx-auto';
  if (!util && prop === 'margin' && value === '0px') util = 'm-0';
  if (!util && prop === 'padding' && value === '0px') util = 'p-0';
  if (!util && prop === 'margin' && /^(\S+)\s+(\S+)$/.test(value)) {
    const [, v, h] = value.match(/^(\S+)\s+(\S+)$/);
    util = `my-[${esc(v)}] mx-[${esc(h)}]`;
  }
  if (!util && (prop === 'margin' || prop === 'padding')) {
    const prefix = prop === 'margin' ? 'm' : 'p';
    const parts = value.split(/\s+/);
    if (parts.length === 4) util = `${prefix}t-[${esc(parts[0])}] ${prefix}r-[${esc(parts[1])}] ${prefix}b-[${esc(parts[2])}] ${prefix}l-[${esc(parts[3])}]`;
    if (parts.length === 3) util = `${prefix}t-[${esc(parts[0])}] ${prefix}x-[${esc(parts[1])}] ${prefix}b-[${esc(parts[2])}]`;
  }

  if (!util && SIZE[prop]) {
    if (value === '100%') util = `${SIZE[prop]}-full`;
    else util = `${SIZE[prop]}-[${esc(value)}]`;
  }

  if (!util && COLOR[prop]) {
    if (value === 'transparent') util = `${COLOR[prop]}-transparent`;
    else if (/^#fff(?:fff)?$/i.test(value)) util = `${COLOR[prop]}-white`;
    else util = `${COLOR[prop]}-[${esc(value)}]`;
  }

  if (!util && prop === 'font-family' && /oswald/i.test(value)) util = 'font-oswald';
  if (!util && prop === 'cursor') util = `cursor-${value}`;
  if (!util && prop === 'background-image') {
    const m = value.match(/^url\(['"]?(.*?)['"]?\)$/);
    util = m ? `bg-[url('${m[1].replace(/^\.\.\//, '/').replace(/^fonts\//, '/fonts/').replace(/^assets\//, '/assets/')}')]` : `[background-image:${esc(value)}]`;
  }
  if (!util && prop === 'background-size') util = `bg-[length:${esc(value)}]`;
  if (!util && prop === 'background-position') util = `bg-[position:${esc(value)}]`;
  if (!util && prop === 'background') util = `[background:${esc(value)}]`;
  if (!util && prop === 'box-shadow') util = `shadow-[${esc(value)}]`;
  if (!util && prop === 'transition-duration') {
    const s = parseFloat(value);
    util = `duration-${Math.round(s * 1000)}`;
  }
  if (!util && prop === 'transition-timing-function') util = `[transition-timing-function:${esc(value)}]`;
  if (!util && prop === 'transform' && /translateZ\(0\)/.test(value)) util = 'transform-gpu';
  if (!util && prop === '-webkit-transform' && /translateZ\(0\)/.test(value)) util = 'transform-gpu';

  // Any property we could not map becomes a Tailwind arbitrary property.
  if (!util) {
    if (/^-webkit-|^user-drag|^filter:|^z-index/i.test(prop)) return [];
    util = `[${prop}:${esc(value)}]`;
  }

  return util.split(' ').map((u) => (important ? `${u}!` : u));
}

/* ------------------------------------------------------------------ */
/* Build class -> utilities maps from stylesheets                      */
/* ------------------------------------------------------------------ */

function buildMaps(files) {
  const classMap = new Map();
  const idMap = new Map();
  const add = (map, key, utils) => {
    if (!map.has(key)) map.set(key, []);
    for (const u of utils) if (!map.get(key).includes(u)) map.get(key).push(u);
  };

  for (const file of files) {
    const css = fs.readFileSync(path.join(ROOT, file), 'utf8');
    const root = postcss.parse(css);
    root.walkRules((rule) => {
      const sel = rule.selector.trim();
      if (!/^\.[\w-]+$/.test(sel) && !/^#[\w-]+$/.test(sel)) return;
      const isId = sel.startsWith('#');
      const key = sel.slice(1);
      for (const decl of rule.nodes) {
        if (decl.type !== 'decl') continue;
        const utils = utilities(decl.prop, decl.value);
        add(isId ? idMap : classMap, key, utils);
      }
    });
  }
  return { classMap, idMap };
}

/* ------------------------------------------------------------------ */
/* HTML -> JSX                                                        */
/* ------------------------------------------------------------------ */

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
const SKIP_IDS = new Set(['thankyou', 'termsofservice', 'reject', 'choose', 'form-frame', 'link-to-form']);
const SKIP_CLASSES = new Set(['loading', 'submit-loading', 'rotateyourdevice', 'rotateyourdevice2']);
const DROP_ATTRS = new Set(['onload', 'onclick', 'data-toggle', 'data-target', 'data-dismiss', 'aria-expanded', 'aria-labelledby', 'role', 'tabindex', 'type', 'width', 'height', 'scrolling', 'autocomplete']);
const BOOL_ATTRS = new Set(['checked', 'disabled', 'multiple', 'selected', 'readonly', 'required', 'autoplay', 'controls', 'loop', 'muted']);

function wrap(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
}

function textWrap(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
}

function attrName(name) {
  return name === 'class' ? 'className' : name === 'for' ? 'htmlFor' : name === 'tabindex' ? 'tabIndex' : name;
}

function normalizeUrl(value) {
  return value.replace(/^(assets|fonts|img)\//, '/$1/');
}

function serializeChildren(node, ctx, insideSkrollable, indent) {
  const out = [];
  for (const child of node.childNodes || []) out.push(...serializeNode(child, ctx, insideSkrollable, indent));
  return out;
}

function serializeNode(node, ctx, insideSkrollable, indent) {
  const pad = '  '.repeat(indent);
  if (node.nodeName === '#comment') return [];
  if (node.nodeName === '#text') {
    const t = textWrap(node.value);
    if (!t.trim()) return [];
    return [`${pad}${t}`];
  }
  if (node.tagName === 'script' || node.tagName === 'link' || node.tagName === 'meta' || node.tagName === 'title') return [];

  const attrs = node.attrs || [];
  const attrObj = Object.fromEntries(attrs.map((a) => [a.name, a.value]));
  const classes = (attrObj.class || '').split(/\s+/).filter(Boolean);
  if (classes.some((c) => SKIP_CLASSES.has(c))) return [];
  if (SKIP_IDS.has(attrObj.id)) return [];

  const utils = [];
  for (const c of classes) for (const u of ctx.classMap.get(c) || []) if (!utils.includes(u)) utils.push(u);
  if (attrObj.id) for (const u of ctx.idMap.get(attrObj.id) || []) if (!utils.includes(u)) utils.push(u);

  // Legacy site relies on skrollr adding the `skrollable` class at runtime;
  // fixed-positioning.css then makes first-level skrollables fixed and nested
  // ones absolute. Express that directly with Tailwind.
  const hasFrames = attrs.some((a) => /^data-[\d.]+(?:p)?$/i.test(a.name) || a.name === 'data-end');
  const addUtils = (list) => { for (const u of list) if (!utils.includes(u)) utils.push(u); };
  if (hasFrames || classes.includes('skrollable')) {
    addUtils(insideSkrollable ? ['absolute'] : ['fixed', 'z-[100]']);
  }

  // Tailwind variants for the few orientation-dependent rules.
  if (classes.includes('hide-on-desktop')) addUtils(['hidden', 'portrait:block']);
  if (classes.includes('rotateyourdevice') || classes.includes('rotateyourdevice2')) addUtils(['hidden', 'portrait:block']);

  const finalClasses = [...classes.filter((c) => !SKIP_CLASSES.has(c)), ...utils];

  const props = [];
  props.push(`className="${wrap(finalClasses.join(' '))}"`);
  if (attrObj.id) props.push(`id="${wrap(attrObj.id)}"`);
  const scene = classes.find((c) => /^scene-\d+$/.test(c));
  if (scene) props.push(`data-scene="${scene.split('-')[1]}"`);

  for (const a of attrs) {
    if (!/^[A-Za-z_:][A-Za-z0-9_:.-]*$/.test(a.name)) continue;
    if (a.name === 'class' || a.name === 'id' || DROP_ATTRS.has(a.name) || a.name.startsWith('on')) continue;
    if (a.name === 'style') {
      const decls = a.value.split(';').map((s) => s.trim()).filter(Boolean).map((s) => {
        const i = s.indexOf(':');
        const key = s.slice(0, i).trim().replace(/-([a-z])/g, (_, c) => c.toUpperCase());
        const val = s.slice(i + 1).trim().replace(/['"]/g, '');
        return `${key}: '${val}'`;
      });
      props.push(`style={{ ${decls.join(', ')} }}`);
    } else if (BOOL_ATTRS.has(a.name)) {
      props.push(`${attrName(a.name)}={true}`);
    } else {
      props.push(`${attrName(a.name)}="${wrap(normalizeUrl(a.value))}"`);
    }
  }

  const tag = node.tagName;
  const children = serializeChildren(node, ctx, insideSkrollable || hasFrames, indent + 1);
  const open = `<${tag}\n${'  '.repeat(indent + 1)}${props.join('\n' + '  '.repeat(indent + 1))}\n${pad}>`;

  if (VOID.has(tag)) return [`${pad}<${tag} ${props.join(' ')} />`];
  if (children.length === 0) return [`${pad}<${tag} ${props.join(' ')} />`];
  return [open, ...children, `${pad}</${tag}>`];
}

function convert(file, cssFiles, componentName, extras = {}) {
  const html = fs.readFileSync(path.join(ROOT, file), 'utf8');
  const doc = parse(html);
  const htmlNode = doc.childNodes.find((n) => n.tagName === 'html');
  const body = htmlNode.childNodes.find((n) => n.tagName === 'body');
  const ctx = buildMaps(cssFiles);
  const lines = serializeChildren(body, ctx, false, 0);
  let jsx = lines.join('\n');

  if (extras.replaceForm) {
    jsx = jsx.replace(
      /<div\s+className="[^"]*\bform\b[^"]*"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/,
      (m) => m.replace(/<img[^>]*\/>/g, m.includes('Signup') ? '' : '').replace(/<a[\s\S]*?<\/a>/g, ''),
    );
  }

  const source = `/* Auto-generated by scripts/convert-pages.mjs from ${file}.\n` +
    ` * Styling is expressed entirely with Tailwind utility classes.\n` +
    ` * Scroll frames (data-*) are consumed by the skrollr instance in hooks/useExperience.js.\n */\n` +
    `export default function ${componentName}(props) {\n` +
    `  return (\n${jsx}\n  );\n}\n`;
  fs.writeFileSync(path.join(OUT, `${componentName}.jsx`), source);
  console.log(`wrote ${componentName}.jsx (${jsx.split('\n').length} lines)`);
}

convert('legacy/new-lawyer.html', ['legacy/css/newlawyer.css', 'legacy/css/default.css', 'legacy/css/fixed-positioning.css'], 'NewLawyerScene');
convert('legacy/practicing-lawyer.html', ['legacy/css/practicinglawyer.css', 'legacy/css/default.css', 'legacy/css/fixed-positioning.css'], 'PracticingLawyerScene');
