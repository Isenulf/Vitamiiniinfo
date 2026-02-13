export type ArticleType = 'pillar' | 'supporting' | 'uudis' | 'praktiline';
export type SectionKey = 'vitamiinid' | 'mineraalid' | 'toidulisandid' | 'kasulik-info-ja-uudised';

export interface Article {
  slug: string;
  section: SectionKey;
  categorySlug?: 'uudised' | 'praktiline-terviseinfo';
  title: string;
  description: string;
  date: string;
  type: ArticleType;
  topics: string[];
  pillarSlug?: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
}

export const sectionMeta: Record<SectionKey, { title: string; description: string; icon: string; href: string }> = {
  vitamiinid: {
    title: 'Vitamiinid',
    description: 'Kõik, mida pead teadma vitamiinidest – nende rollist organismis, puuduse sümptomitest ja parimatest allikatest.',
    icon: '☀️',
    href: '/vitamiinid/',
  },
  mineraalid: {
    title: 'Mineraalid',
    description: 'Olulised mineraalid, nende mõju tervisele ning praktilised soovitused tasakaalu hoidmiseks.',
    icon: '💎',
    href: '/mineraalid/',
  },
  toidulisandid: {
    title: 'Toidulisandid',
    description: 'Tasakaalukas ülevaade toidulisanditest, annustamisest ja teadlikust kasutamisest.',
    icon: '🧬',
    href: '/toidulisandid/',
  },
  'kasulik-info-ja-uudised': {
    title: 'Kasulik info ja uudised',
    description: 'Uudised teadusuuringutest ning praktilised terviseartiklid igapäevaseks otsustamiseks.',
    icon: '📰',
    href: '/kasulik-info-ja-uudised/',
  },
};

export const articles: Article[] = [
  {
    slug: 'c-vitamiin',
    section: 'vitamiinid',
    title: 'C-vitamiin – täielik juhend',
    description: 'Kõik, mida pead teadma C-vitamiinist: funktsioonid, allikad, päevane annus ja puuduse mõju tervisele.',
    date: '2026-01-15',
    type: 'pillar',
    topics: ['c-vitamiin', 'immuunsus'],
    content: `<p>C-vitamiin (askorbiinhape) on vees lahustuv vitamiin, millel on oluline roll immuunsüsteemi, kollageeni sünteesi ja raua imendumise toetamisel.</p>
<h2>Miks on C-vitamiin oluline?</h2>
<p>C-vitamiin aitab kaitsta rakke oksüdatiivse stressi eest ning toetab naha, veresoonte ja sidekoe normaalset talitlust.</p>
<h2>Parimad toiduallikad</h2>
<p>Head C-vitamiini allikad on paprika, kiivi, tsitruselised, brokoli ja marjad. Värske toit aitab hoida vitamiinisisaldust paremini.</p>
<h2>Soovitatav päevane annus</h2>
<p>Täiskasvanul on soovituslik päevane kogus keskmiselt 75–100 mg. Suitsetajatel ja kõrgema koormusega inimestel võib vajadus olla suurem.</p>`,
    seoTitle: 'C-vitamiin: mõju, allikad ja annus | Vitamiiniinfo.ee',
    seoDescription: 'Teaduspõhine C-vitamiini juhend: miks see on oluline, kust seda saada ja kui palju päevas tarbida.',
  },
  {
    slug: 'c-vitamiin/puudus',
    section: 'vitamiinid',
    title: 'C-vitamiini puudus – sümptomid ja ravi',
    description: 'Kuidas ära tunda C-vitamiini puudust, millised on sümptomid ja kuidas puudust ravida.',
    date: '2026-01-20',
    type: 'supporting',
    topics: ['c-vitamiin', 'immuunsus'],
    pillarSlug: 'c-vitamiin',
    content: `<p>C-vitamiini puudus on üks sagedasemaid kergeid vitamiinipuuduseid. Raske puudus on harv, kuid kerge puudus võib mõjutada enesetunnet ja taastumist.</p>
<h2>Peamised sümptomid</h2>
<ul><li>Krooniline väsimus ja nõrkus</li><li>Igemete veritsus</li><li>Aeglane haavade paranemine</li><li>Sagedasemad külmetused</li></ul>
<h2>Riskirühmad</h2>
<p>Suuremas riskis on suitsetajad, eakad, piiratud toitumisega inimesed ning krooniliste haigustega patsiendid.</p>
<h2>Ravi ja ennetamine</h2>
<p>Puuduse leevendamiseks suurenda C-vitamiinirikaste toitude osakaalu. Vajadusel kasuta lühiajaliselt toidulisandit tervishoiutöötaja soovitusel.</p>`,
    seoTitle: 'C-vitamiini puudus: sümptomid ja ravi | Vitamiiniinfo.ee',
    seoDescription: 'C-vitamiini puuduse tunnused, riskirühmad ja praktilised sammud puuduse ennetamiseks ja leevendamiseks.',
  },
  {
    slug: 'd-vitamiin',
    section: 'vitamiinid',
    title: 'D-vitamiin – täielik juhend',
    description: 'D-vitamiini roll immuunsuses, luude tervises ning praktilised soovitused Eesti tingimustes.',
    date: '2026-01-17',
    type: 'pillar',
    topics: ['d-vitamiin', 'immuunsus', 'luud'],
    content: `<p>D-vitamiin aitab reguleerida kaltsiumi ainevahetust ning toetab immuunsüsteemi normaalset talitlust.</p>
<h2>Millal D-vitamiini kõige rohkem vajatakse?</h2>
<p>Eestis on talveperioodil päikesevalgusest saadav D-vitamiini tootmine piiratud, mistõttu on toitumine ja vajadusel lisand oluline.</p>
<h2>Peamised allikad</h2>
<p>Rasvane kala, rikastatud piimatooted ja munad annavad D-vitamiini, kuid sageli jääb neist üksi väheks.</p>`,
    seoTitle: 'D-vitamiin: immuunsus ja annustamine | Vitamiiniinfo.ee',
    seoDescription: 'D-vitamiini juhend Eesti tingimustes: allikad, mõju tervisele ja praktilised annustamise põhimõtted.',
  },
  {
    slug: 'magneesium',
    section: 'mineraalid',
    title: 'Magneesium – põhjalik ülevaade',
    description: 'Magneesiumi roll lihastes, närvisüsteemis ja energiavahetuses.',
    date: '2026-01-18',
    type: 'pillar',
    topics: ['magneesium', 'uni', 'lihased'],
    content: '<p>Magneesium osaleb sadades ensümaatilistes protsessides ja toetab närvi-lihastalitlust.</p>',
    seoTitle: 'Magneesium: roll, allikad ja vajadus | Vitamiiniinfo.ee',
    seoDescription: 'Usaldusväärne magneesiumi ülevaade: milleks see vajalik on ja kuidas tarbimist tasakaalus hoida.',
  },
  {
    slug: 'omega-3',
    section: 'toidulisandid',
    title: 'Omega-3 rasvhapped – teaduspõhine juhend',
    description: 'Kuidas valida omega-3 lisandit ja millal sellest kasu võib olla.',
    date: '2026-01-22',
    type: 'pillar',
    topics: ['omega-3', 'süda', 'ajutervis'],
    content: '<p>Omega-3 rasvhapped (EPA ja DHA) on olulised südame ja aju normaalseks talitluseks.</p>',
    seoTitle: 'Omega-3 juhend: valik ja annus | Vitamiiniinfo.ee',
    seoDescription: 'Praktiline omega-3 juhend: millal kaaluda lisandit, kuidas lugeda etiketti ja mida annusest teada.',
  },
  {
    slug: 'uudis-d-vitamiin-immuunsus',
    section: 'kasulik-info-ja-uudised',
    categorySlug: 'uudised',
    title: 'Uus uuring: D-vitamiini mõju immuunsüsteemile on suurem kui arvati',
    description: 'Helsingi Ülikooli 2026. aasta uuring näitab, et D-vitamiini roll immuunsüsteemis on varasemast olulisem.',
    date: '2026-02-01',
    type: 'uudis',
    topics: ['d-vitamiin', 'immuunsus'],
    content: '<p>Uuringu tulemused viitavad, et regulaarne D-vitamiini taseme jälgimine võib aidata vähendada hooajalisi haigestumisi.</p>',
    seoTitle: 'D-vitamiin ja immuunsus: uus uuring | Vitamiiniinfo.ee',
    seoDescription: 'Lühikokkuvõte uuest D-vitamiini uuringust ja selle praktiline tähendus tervisekäitumisele.',
  },
  {
    slug: '5-koige-olulisemat-vitamiini-talvel',
    section: 'kasulik-info-ja-uudised',
    categorySlug: 'praktiline-terviseinfo',
    title: '5 kõige olulisemat vitamiini talvel',
    description: 'Millised vitamiinid on talvel eriti olulised ja kuidas tagada nende piisav tarbimine?',
    date: '2026-01-25',
    type: 'praktiline',
    topics: ['c-vitamiin', 'd-vitamiin', 'immuunsus'],
    content: '<p>Talvekuudel tasub keskenduda D-vitamiinile, C-vitamiinile, B12-le ja tasakaalustatud toitumisele.</p>',
    seoTitle: 'Olulisimad vitamiinid talvel | Vitamiiniinfo.ee',
    seoDescription: 'Praktiline ülevaade talvel vajalikest vitamiinidest koos lihtsate igapäevaste soovitustega.',
  },
];

export const articlesBySection = (section: SectionKey) => articles.filter((article) => article.section === section);
export const getArticleBySlug = (slug: string) => articles.find((article) => article.slug === slug);

export const formatDate = (dateValue: string) =>
  new Date(dateValue).toLocaleDateString('et-EE', { day: 'numeric', month: 'long', year: 'numeric' });

export const buildBreadcrumbs = (pathname: string) => {
  const parts = pathname.split('/').filter(Boolean);
  const crumbs = [{ label: 'Avaleht', href: '/' }];
  let running = '';

  for (const part of parts) {
    running += `/${part}`;
    crumbs.push({
      label: part
        .replaceAll('-', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
        .replace('Ja', 'ja'),
      href: `${running}/`,
    });
  }
  return crumbs;
};

export const getSupportingForPillar = (pillarSlug: string) =>
  articles.filter((article) => article.type === 'supporting' && article.pillarSlug === pillarSlug);

export const relatedForArticle = (article: Article) => {
  const cluster = articles.filter(
    (entry) =>
      entry.slug !== article.slug &&
      entry.section !== 'kasulik-info-ja-uudised' &&
      entry.topics.some((topic) => article.topics.includes(topic)),
  );
  const editorial = articles.filter(
    (entry) =>
      entry.slug !== article.slug &&
      entry.section === 'kasulik-info-ja-uudised' &&
      entry.topics.some((topic) => article.topics.includes(topic)),
  );

  return [...cluster.slice(0, 2), ...editorial.slice(0, 2)];
};

export const newsroomByType = (type: 'uudis' | 'praktiline') =>
  articles
    .filter((article) => article.type === type)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));

export const latestArticles = [...articles].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 6);
