import React from 'react';

/* Article-aware typewriter. The "a"/"an"/none article is typed and deleted in muted text right
   along with the descriptor, so a descriptor can opt out of an article entirely
   (noArticleDescriptors) without any special-casing beyond this one function. */
function needsAn(word) {
  const isInitialism = /^[A-Z]\.?[A-Z]/.test(word);
  return isInitialism ? /^[AEFHILMNORSX]/.test(word) && !/^U/.test(word) : /^[aeiou]/i.test(word);
}

function articleFor(word, noArticleSet) {
  if (noArticleSet.has(word)) return '';
  return needsAn(word) ? 'an' : 'a';
}

export function TypedIntro({
  greeting = 'Hi! My name is Abby.',
  lead = 'I am',
  descriptors = ['engineer', 'synesthete'],
  noArticleDescriptors = [],
  holdMs = 2200,
  style
}) {
  const noArticleSet = React.useMemo(() => new Set(noArticleDescriptors), [noArticleDescriptors]);
  const [w, setW] = React.useState(0);
  const [chars, setChars] = React.useState(0);
  const deleting = React.useRef(false);
  const timer = React.useRef(null);

  const seq = React.useCallback(
    (i) => {
      const word = descriptors[i % descriptors.length];
      const art = articleFor(word, noArticleSet);
      // No leading space here — the space between "I am" and this sequence is a literal {' '} in
      // the JSX below, so a no-article word doesn't end up with a double space.
      return (art ? art + ' ' : '') + word + '.';
    },
    [descriptors, noArticleSet]
  );

  React.useEffect(() => {
    const full = seq(w).length;
    const next = () => {
      if (!deleting.current) {
        if (chars < full) timer.current = setTimeout(() => setChars((c) => c + 1), 42 + Math.random() * 46);
        else {
          deleting.current = true;
          timer.current = setTimeout(() => setChars((c) => c - 1), holdMs);
        }
      } else if (chars > 0) {
        timer.current = setTimeout(() => setChars((c) => c - 1), 24);
      } else {
        deleting.current = false;
        timer.current = setTimeout(() => setW((v) => (v + 1) % descriptors.length), 320);
      }
    };
    next();
    return () => clearTimeout(timer.current);
  }, [w, chars, holdMs, seq, descriptors.length]);

  const full = seq(w);
  const g = articleFor(descriptors[w % descriptors.length], noArticleSet).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', ...style }}>
      <h1 style={{
        margin: 0,
        fontFamily: 'var(--font-display)',
        fontWeight: 'var(--weight-display-max)',
        fontSize: 'var(--size-hero)',
        lineHeight: 'var(--leading-hero)',
        letterSpacing: 'var(--track-hero)',
        color: 'var(--text-strong)'
      }}>{greeting}</h1>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'var(--size-display)',
        lineHeight: 1.2,
        letterSpacing: 'var(--track-tight)',
        minHeight: '56px'
      }}>
        <span style={{ fontWeight: 'var(--weight-body)', color: 'var(--text-muted)' }}>{lead}</span>{' '}
        <span style={{ fontWeight: 'var(--weight-body)', color: 'var(--text-muted)', whiteSpace: 'pre' }}>
          {full.slice(0, Math.min(chars, g))}
        </span>
        <span style={{ fontWeight: 'var(--weight-display)', color: 'var(--accent)', whiteSpace: 'pre-wrap' }}>
          {full.slice(g, Math.max(chars, g))}
        </span>
        <span style={{
          display: 'inline-block',
          width: '4px',
          height: '0.86em',
          background: 'var(--caret)',
          marginLeft: '4px',
          verticalAlign: '-0.06em',
          animation: 'ar-caret-blink var(--caret-blink) steps(2, jump-none) infinite'
        }} />
      </div>
    </div>
  );
}
