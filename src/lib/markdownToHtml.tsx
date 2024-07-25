// lib/markdownToHtml.ts

import { marked } from 'marked';
import DOMPurify from 'dompurify';

export default async function markdownToHtml(markdown: string): Promise<string> {
    const dirtyHtml = await marked(markdown);
    const cleanHtml = DOMPurify.sanitize(dirtyHtml);
  return cleanHtml;
}
