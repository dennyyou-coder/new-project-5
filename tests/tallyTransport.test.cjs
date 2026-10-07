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
  const { TallyButton, TallyInlineEmbed } = load('components/LeadForms.tsx');
  return { events, listeners, refs, effects, modules, window, popup: () => popup,
    renderInline(props = {}) { si = ri = 0; return TallyInlineEmbed({ form: 'contact', ctaLocation: 'contact_general', sourcePage: '/contact', title: 'Inquiry', ...props }); },
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
  assert.match(source, /href="\/contact\?inquiry=expo_exhibitor#project-form"/);
  const contact = fs.readFileSync(path.join(root, 'components/ContactProjectInquiry.tsx'), 'utf8');
  assert.match(contact, /value: "expo_exhibitor"[^\n]+form: "wceExhibitor"/);
  assert.match(contact, /value: "expo_visitor"[^\n]+form: "wceVisitor"/);
});


test('inline contact preserves route context and counts only confirmed expected-frame submissions', () => {
  const h = harness();
  h.window.location.pathname = '/contact';
  h.window.location.search = '?inquiry=expo_exhibitor&utm_source=expo';
  const props = { form: 'wceExhibitor', ctaLocation: 'contact_expo_exhibitor', inquiryType: 'expo_exhibitor', inquiryIntent: 'exhibitor_interest' };
  let tree = h.renderInline(props);
  let frameNode = tree.props.children[0];
  let url = new URL(frameNode.props.src);
  assert.equal(url.pathname, '/embed/XxklMV');
  assert.equal(url.searchParams.get('source_page'), '/contact');
  assert.equal(url.searchParams.get('inquiry_type'), 'expo_exhibitor');
  const frame = {};
  h.refs[1].current = { contentWindow: frame };
  const cleanup = h.effects[0]();
  tree = h.renderInline(props);
  url = new URL(tree.props.children[0].props.src);
  assert.equal(url.searchParams.get('utm_source'), 'expo');
  assert.equal(url.searchParams.get('inquiry_intent'), 'exhibitor_interest');
  const send = (data, origin = 'https://tally.so', source = frame) => h.listeners.message({ data, origin, source });
  const submitted = JSON.stringify({ event: 'Tally.FormSubmitted', payload: { formId: 'XxklMV', id: 'contact-1', fields: ['private@example.com'] } });
  send(submitted, 'https://evil.example');
  send(submitted, 'https://tally.so', {});
  send('invalid JSON');
  send({ event: 'Tally.FormSubmitted', payload: { formId: 'different', id: 'record-1' } });
  send({ event: 'Tally.FormSubmitted', payload: { formId: 'XxklMV' } });
  assert.equal(h.events.length, 0);
  const loaded = { event: 'Tally.FormLoaded', payload: { formId: 'XxklMV' } };
  send(loaded); send(loaded); send(submitted); send(submitted);
  assert.deepEqual(h.events.map(e => e[1]), ['form_open', 'form_submit', 'form_success']);
  assert.equal(h.events.at(-1)[2].response_id, 'contact-1');
  assert.equal(h.events.at(-1)[2].inquiry_type, 'expo_exhibitor');
  assert(!JSON.stringify(h.events).includes('private@example.com'));
  const fallback = tree.props.children[1].props.children.find(item => item?.type === 'a');
  assert.equal(new URL(fallback.props.href).pathname, '/r/XxklMV');
  cleanup(); assert(!h.listeners.message);
});


for (const [form, inquiry] of [['wceExhibitor', 'expo_exhibitor'], ['wceVisitor', 'expo_visitor']]) {
  test(`${form}: widget failure keeps the same Expo intent in the Contact escape link`, async () => {
    const h = harness({ widget: false });
    await h.render(form).props.children[0].props.onClick();
    const dialog = h.render(form).props.children.find(x => x?.type === h.modules['./TallyFallbackDialog'].TallyFallbackDialog);
    assert(dialog);
    const url = new URL(dialog.props.contactUrl, 'https://worldcleanbiz.com');
    assert.equal(url.searchParams.get('inquiry'), inquiry);
    assert.equal(url.searchParams.get('intent'), 'expo');
    assert.equal(h.events.filter(e => e[1] === 'form_success').length, 0);
  });
}
