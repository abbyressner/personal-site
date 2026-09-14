The brand's one animated element. Use it once, at the top of a page — never twice on the same screen.

```jsx
<TypedIntro
  descriptors={[
    'engineer', 'synesthete', 'socialized medicine admirer',
    'Apple Shortcuts enthusiast', 'detail-oriented developer',
    'open-source contributor', 'imposter syndrome\'s worst nightmare',
    'sudoku addict', 'St. Louisan', 'Duolingo chess student',
    'life-long learner', 'pharmacy benefit manager hater', 'BMad Method fan',
    'Dracula theme user'
  ]}
  noArticleDescriptors={['imposter syndrome\'s worst nightmare']}
/>
```

Descriptors are lowercase and article-free; capitalize only proper nouns. They should be honest and specific — a real opinion or habit beats a job title. The caret is muted, not indigo: only the descriptor itself carries accent color.

Most descriptors get "a"/"an" typed in front of them automatically (vowel-sound detection, initialism-aware — see `needsAn` in the component). A descriptor that already reads as a complete predicate rather than "a/an ___" — like "imposter syndrome's worst nightmare" — goes in `noArticleDescriptors` (an exact-string match against `descriptors`) so no article is typed before it at all. Add future no-article descriptors to that list the same way; nothing else about the typing/deleting mechanism changes.
