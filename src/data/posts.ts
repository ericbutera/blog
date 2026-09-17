import type { PostMetadata, PostSummary } from "../lib/posts";
import { isDraftMode, isPostVisible, withPostPath } from "../lib/posts";

interface PostModule {
  metadata?: PostMetadata;
}

const pageModules = import.meta.glob<PostModule>([
  "../pages/*.astro",
  "!../pages/index.astro",
]);

let postCache: Promise<PostSummary[]> | undefined;

const getSlug = (path: string) => {
  const slug = path.match(/\/([^/]+)\.astro$/)?.[1];
  if (!slug) {
    throw new Error(`Unable to derive post slug from ${path}`);
  }
  return slug;
};

export const getPosts = async () => {
  postCache ??= Promise.all(
    Object.entries(pageModules).map(async ([path, loadPage]) => {
      const page = await loadPage();
      return page.metadata ? withPostPath(getSlug(path), page.metadata) : undefined;
    }),
  ).then((posts) => posts.filter((post): post is PostSummary => Boolean(post)));

  return postCache;
};

export const getVisiblePosts = async () => {
  const posts = await getPosts();
  return isDraftMode ? posts : posts.filter(isPostVisible);
};

export const getPostsByNewest = async () => {
  const posts = await getVisiblePosts();
  return [...posts].sort((a, b) => b.date.localeCompare(a.date));
};
