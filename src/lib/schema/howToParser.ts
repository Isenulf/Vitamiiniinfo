const STEP_REGEX = /:::step\s*([\s\S]*?):::/g;

const cleanupText = (value: string) =>
  value
    .replace(/\r/g, '')
    .replace(/\n{2,}/g, '\n')
    .replace(/\s+/g, ' ')
    .trim();

const getStepName = (text: string) => text.split(' ').filter(Boolean).slice(0, 10).join(' ');

export const parseHowToStepsFromMarkdown = (rawContent: string) => {
  const steps: string[] = [];

  for (const match of rawContent.matchAll(STEP_REGEX)) {
    const cleaned = cleanupText(match[1] || '');
    if (cleaned) steps.push(cleaned);
  }

  return steps;
};

export const buildHowToSchema = ({
  rawContent,
  pageTitle,
  pageDescription,
}: {
  rawContent: string;
  pageTitle: string;
  pageDescription: string;
}) => {
  const steps = parseHowToStepsFromMarkdown(rawContent);

  if (steps.length < 2) return null;

  return {
    '@type': 'HowTo',
    name: pageTitle,
    description: pageDescription,
    step: steps.map((text, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: getStepName(text),
      text,
    })),
  };
};
