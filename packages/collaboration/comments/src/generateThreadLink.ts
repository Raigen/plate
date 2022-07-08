import { Thread } from './Thread';

export function generateThreadLink(thread: Thread) {
  const url = new URL(window.location.href);
  url.searchParams.set('thread', thread.id);
  return url.toString();
}