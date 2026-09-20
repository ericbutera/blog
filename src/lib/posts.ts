export type PostKind = "single" | "gallery";

export interface PostMetadata {
  title: string;
  date: string;
  kind: PostKind;
  cover: string;
  draft?: boolean;
}

export interface PostSummary extends PostMetadata {
  slug: string;
  href: string;
}

export const siteTitle = "Eric Butera Blog";
const draftMode =
  import.meta.env.PUBLIC_DRAFT_MODE ?? import.meta.env.DRAFT_MODE;

export const isDraftMode =
  draftMode === "1" || draftMode === "true";

export const withPostPath = (
  slug: string,
  metadata: PostMetadata,
): PostSummary => ({
  ...metadata,
  slug,
  href: `/${slug}/`,
});

export const formatPageTitle = (post: Pick<PostMetadata, "title">) =>
  `${post.title} | ${siteTitle}`;

export const isPostVisible = (post: Pick<PostMetadata, "draft">) =>
  isDraftMode || !post.draft;

export const getPostPage = (
  post: PostMetadata,
  redirect: (path: string) => Response,
) => ({
  post,
  draftRedirect: isPostVisible(post) ? undefined : redirect("/"),
});

export const formatPostDate = (date: string) =>
  new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
