const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const test = require('node:test');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');

function harness({ widget = true } = {}) {
  const events = [], listeners = {}, states = [], refs = [], effects = [];
  let si = 0, ri = 0, popup;
  const react = {
    useState(v) { const i = si++; if (!(i in states)) states[i] = typeof v === 'function' ? v() : v; return [states[i], v => states[i] = v]; },
    useRef(v) { const i = ri++; return refs[i] ||= { current: v }; },
    useEffect(f) { effects.push(f); }
  };
  const jsx = { jsx: (type, props) => ({ type, props }), jsxs: (type, props) => ({ type, props }) };
  const window = {
    location: { pathname: '/sourcing', search: '?utm_source=qa' },
    setTimeout() { return 1; }, clearTimeout() {},
    addEventListener(name, fn) { listeners[name] = fn; }, removeEventListener(name) { delete listeners[name]; },
    open() { throw Error('Fallback must not open an untracked tab'); },
    gtag(...args) { events.push(args); }
  };
  if (widget) window.Tally = { openPopup(id, options) { popup = { id, options }; } };
  const document = {
    documentElement: { lang: 'en' }, body: {}, querySelector() { return null; },
    createElement() { return { addEventListener(event, callback) { if (event === 'error') queueMicrotask(callback); } }; },
    head: { append() {} }
  };
  const modules = { react, 'react/jsx-runtime': jsx, 'react-dom': { createPortal: value => value }, 'next/link': () => null, './TallyFallbackDialog.module.css': { default: {} } };
  function load(file) {
    const exports = {};
    let source = fs.readFileSync(path.join(root, file), 'utf8');
    if (file === 'components/LeadForms.tsx' && process.env.WCB_BASELINE_LEAD_SOURCE) source = fs.readFileSync(process.env.WCB_BASELINE_LEAD_SOURCE, 'utf8');
    const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } }).outputText;
    vm.runInNewContext(code, { exports, require: name => { assert(name in modules, name); return modules[name]; }, window, document, URL, URLSearchParams, console });
    return exports;
  }
  modules['@/lib/leadTracking'] = load('lib/leadTracking.ts');
  modules['@/lib/tallySubmission'] = load('lib/tallySubmission.ts');
  modules['@/lib/tallyForms'] = load('lib/tallyForms.ts');
  modules['./TallyFallbackDialog'] = load('components/TallyFallbackDialog.tsx');
  const { TallyButton } = load('components/LeadForms.tsx');
  return { events, listeners, refs, effects, modules, popup: () => popup,
    render(form = 'sourcing') { si = ri = 0; return TallyButton({ form, ctaLocation: 'qa', children: 'Open' }); },
    renderDialog(props) { si = ri = 0; return modules['./TallyFallbackDialog'].TallyFallbackDialog(props); }
  };
}

for (const form of ['sourcing', 'wceVisitor', 'wceExhibitor', 'newsletter']) {
  test(`${form}: counts confirmed submissions once, preserves ID, excludes answers`, async () => {
    const h = harness(); const button = h.render(form).props.children[0];
    await button.props.onClick(); h.popup().options.onOpen();
    assert.deepEqual(h.events.map(e => e[1]), ['cta_click', 'form_open']);
    const payload = { id: 'submission-1', fields: [{ answer: 'private@example.com' }] };
    h.popup().options.onSubmit(payload); h.popup().options.onSubmit(payload);
    assert.deepEqual(h.events.map(e => e[1]), ['cta_click', 'form_open', 'form_submit', 'form_success']);
    assert.equal(h.events.at(-1)[2].response_id, 'submission-1');
    assert(!JSON.stringify(h.events).includes('private@example.com'));
    await h.render(form).props.children[0].props.onClick(); h.popup().options.onSubmit(payload);
    assert.equal(h.events.filter(e => e[1] === 'form_success').length, 1);
  });
}

test('widget failure stays on page with attribution, no false popup error or success', async () => {
  const h = harness({ widget: false });
  await h.render().props.children[0].props.onClick();
  const fallback = h.render().props.children.find(x => x?.type === h.modules['./TallyFallbackDialog'].TallyFallbackDialog);
  assert(fallback, 'Fallback dialog must be rendered');
  assert.equal(fallback.props.attribution.utm_source, 'qa');
  assert.deepEqual(h.events.map(e => e[1]), ['cta_click']);
  fallback.props.onOpen(); fallback.props.onSubmit({ id: 'fallback-1' }); fallback.props.onSubmit({ id: 'fallback-1' });
  assert.deepEqual(h.events.map(e => e[1]), ['cta_click', 'form_open', 'form_submit', 'form_success']);
  assert.equal(h.events[1][2].open_method, 'fallback');
});

test('fallback accepts only the expected Tally frame and form, parses strings safely', () => {
  const h = harness(); let opens = 0; const submits = [], frame = {};
  h.renderDialog({ formId: 'form-1', attribution: {}, contactUrl: '/contact', onClose() {}, onOpen() { opens++; }, onSubmit(p) { submits.push(p); } });
  h.refs[0].current = { showModal() {}, close() {} }; h.refs[1].current = { contentWindow: frame };
  const cleanup = h.effects[0]();
  const send = (data, origin = 'https://tally.so', source = frame) => h.listeners.message({ data, origin, source });
  const success = JSON.stringify({ event: 'Tally.FormSubmitted', payload: { formId: 'form-1', id: 'record-1', fields: ['private'] } });
  send(success, 'https://evil.example'); send(success, 'https://tally.so', {}); send('invalid JSON');
  send({ event: 'Tally.FormSubmitted', payload: { formId: 'another-form', id: 'record-1' } });
  send({ event: 'Tally.FormSubmitted', payload: { formId: 'form-1' } });
  assert.equal(submits.length, 0);
  const loaded = JSON.stringify({ event: 'Tally.FormLoaded', payload: { formId: 'form-1' } });
  send(loaded); send(loaded); assert.equal(opens, 1);
  send(success); assert.equal(submits.length, 1); assert.equal(submits[0].id, 'record-1');
  assert(!JSON.stringify(submits).includes('private')); cleanup(); assert(!h.listeners.message);
});

test('exhibitor CTA uses the independent exhibitor form', () => {
  const source = fs.readFileSync(path.join(root, 'app/wcb-expo/page.tsx'), 'utf8');
  assert.match(source, /ctaLocation="wcb_expo_exhibitor_interest"\s+form="wceExhibitor"/);
});
