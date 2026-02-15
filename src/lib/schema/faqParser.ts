import type { FaqItem } from './types';

const KKK_HEADING = /^##\s*(KKK|Korduma kippuvad küsimused)\s*$/i;
const H3_HEADING = /^###\s+(.+)$/;

export const parseFaqFromMarkdown = (rawContent: string): FaqItem[] => {
  const lines = rawContent.split('\n');
  const startIndex = lines.findIndex((line) => KKK_HEADING.test(line.trim()));
  if (startIndex < 0) return [];

  const sectionLines = lines.slice(startIndex + 1);
  const items: FaqItem[] = [];

  let currentQuestion = '';
  let currentAnswer: string[] = [];

  for (const line of sectionLines) {
    if (/^##\s+/.test(line)) break;

    const h3Match = line.match(H3_HEADING);
    if (h3Match) {
      if (currentQuestion && currentAnswer.join(' ').trim()) {
        items.push({ question: currentQuestion, answer: currentAnswer.join('\n').trim() });
      }

      currentQuestion = h3Match[1].trim();
      currentAnswer = [];
      continue;
    }

    if (currentQuestion) currentAnswer.push(line);
  }

  if (currentQuestion && currentAnswer.join(' ').trim()) {
    items.push({ question: currentQuestion, answer: currentAnswer.join('\n').trim() });
  }

  return items;
};

export const buildFaqSchema = (rawContent: string) => {
  const items = parseFaqFromMarkdown(rawContent).filter((item) => item.question && item.answer);

  if (items.length < 2) return null;

  return {
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
};
