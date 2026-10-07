/**
 * The signature hero: a plain greeting, then a typed-and-deleted list of honest
 * self-descriptors in indigo. The muted article ("a"/"an", or none) is typed in
 * per descriptor — vowel-sound detection picks "a" vs "an", and a descriptor can
 * opt out of an article entirely via noArticleDescriptors — so grammar never
 * breaks mid-rotation.
 *
 * @startingPoint section="Content" subtitle="Signature typed self-descriptor hero" viewport="1120x300"
 */
export interface TypedIntroProps {
  greeting?: string;
  /** Muted lead-in, article-free ("I am") — the component types "a"/"an" per descriptor */
  lead?: string;
  /** Written lowercase, no article — the component adds "a"/"an" */
  descriptors?: string[];
  /** Exact strings from `descriptors` that already read as a complete predicate; no article is typed before them */
  noArticleDescriptors?: string[];
  /** Pause on a completed descriptor before deleting */
  holdMs?: number;
  style?: React.CSSProperties;
}
export declare function TypedIntro(props: TypedIntroProps): JSX.Element;
