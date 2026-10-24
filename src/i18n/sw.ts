import type { Dict } from './en';

// Kiswahili. Have a native speaker review the wording before launch.
export const sw: Dict = {
  meta: {
    title: '{name} – Jenga · Uhandisi · Chambua',
    description: '{name}, msanidi programu wa wavuti wa full-stack na mhandisi wa data jijini Nairobi, Kenya. Miradi, makala na njia za kuwasiliana.',
  },
  nav: {
    about: 'Kuhusu', skills: 'Ujuzi', projects: 'Miradi', writing: 'Makala', sql: 'Kazi za SQL', contact: 'Wasiliana',
    menu: 'Menyu', skip: 'Ruka hadi maudhui', language: 'Lugha', theme: 'Badilisha hali ya giza',
  },
  hero: {
    eyebrow: 'JENGA · UHANDISI · CHAMBUA',
    hi: 'Habari, mimi ni {name}',
    roleLead: 'Mimi ni',
    roles: ['Msanidi programu wa full-stack', 'Mhandisi wa data', 'Mchambuzi wa data', 'Mwandishi wa kiufundi'],
    lead: 'Ninatengeneza programu za wavuti na suluhisho za data ambazo watu huzitumia kweli, kuanzia zana za usimamizi wa mashamba hadi hifadhidata za SQL na uchambuzi wa mauzo. Nipo Nairobi, Kenya.',
    ctaWork: 'Tazama kazi zangu', ctaTalk: 'Tuzungumze', available: 'Tayari kwa kazi mpya',
  },
  stats: { projects: 'Miradi iliyoangaziwa', repos: 'Hazina za GitHub', languages: 'Lugha kuu', open: 'Tayari kwa kazi mpya', openValue: 'Ndiyo' },
  about: {
    title: 'Kuhusu mimi',
    p1: 'Mimi ni msanidi programu na mpenda data ninayefurahia kugeuza matatizo halisi kuwa programu zinazofanya kazi. Miradi yangu inahusu kilimo, elimu na fedha binafsi, na ninakuza ujuzi wangu katika uhandisi wa data na kujifunza kwa mashine.',
    p2: 'Ninajali msimbo safi, violesura vya haraka vinavyojirekebisha kulingana na skrini, na data inayoweza kuaminika. Niko wazi kila wakati kushirikiana kwenye miradi ya kuvutia.',
    p3: 'Historia yangu inajumuisha ugani wa kilimo, uhandisi wa programu na uhandisi wa data, jambo linalofanya kazi yangu iwe karibu na watumiaji halisi.',
  },
  skills: { title: 'Ujuzi', sub: 'Zana ninazofanya nazo kazi.', languages: 'LUGHA', web: 'WAVUTI', data: 'DATA', tools: 'ZANA' },
  projects: {
    title: 'Miradi', sub: 'Uteuzi wa nilichojenga.',
    all: 'Yote', apps: 'Programu', data: 'Data', education: 'Elimu',
    code: 'Msimbo', live: 'Onyesho la moja kwa moja', inProgress: 'Inaendelea', empty: 'Hakuna miradi katika kundi hili bado.',
  },
  github: {
    title: 'Mpya kwenye GitHub', sub: 'Hazina zangu mpya zaidi, zinazosasishwa moja kwa moja.',
    loading: 'Inapakia hazina zangu mpya…', error: 'Imeshindwa kupakia hazina kwa sasa.',
    empty: 'Hakuna hazina za umma bado.', viewAll: 'Tazama zote kwenye GitHub', updated: 'Imesasishwa', noDescription: 'Hakuna maelezo.',
  },
  articles: {
    title: 'Makala', sub: 'Ninachochapisha kwenye dev.to.',
    loading: 'Inapakia makala…', empty: 'Makala mpya zinakuja hivi karibuni. Nifuate kwenye dev.to.',
    error: 'Imeshindwa kupakia makala kwa sasa.', minRead: 'Dakika {n} za kusoma', reactions: 'maoni', viewAll: 'Tazama zote kwenye dev.to',
  },
  sql: {
    title: 'Kazi za SQL na hifadhidata',
    intro: 'Kubuni na kuuliza hifadhidata ya PostgreSQL kwenye DBeaver, nikitumia muundo wa hesabu ya bidhaa za “duka” wenye bidhaa, kategoria, bei, hisa na wasambazaji.',
    c1: 'Kuandika SQL na kuchunguza matokeo ya maswali.', c2: 'Kuunda jedwali la duka_products na kuingiza data.', example: 'Mfano wa muundo',
  },
  contact: {
    title: 'Tufanye kazi pamoja', sub: 'Una mradi, nafasi ya kazi au swali? Nitumie ujumbe.',
    name: 'Jina lako', email: 'Barua pepe yako', message: 'Ujumbe', send: 'Tuma ujumbe', sending: 'Inatuma…',
    sent: 'Asante! Ujumbe wako umetumwa. Nitakujibu hivi karibuni.',
    error: 'Ujumbe wako haukutumwa. Tafadhali jaribu tena au nitumie barua pepe moja kwa moja.',
    invalid: 'Tafadhali weka jina lako, barua pepe halali na ujumbe wenye angalau herufi 5.',
    tooFast: 'Tafadhali subiri kidogo kabla ya kutuma ujumbe mwingine.',
    offline: 'Fomu haijaunganishwa na seva bado, kwa hivyo nimefungua programu yako ya barua pepe.',
    elsewhere: 'Au nipate hapa', whatsapp: 'Gumzo la WhatsApp', emailMe: 'Nitumie barua pepe', connect: 'Nipate mtandaoni',
  },
  footer: { rights: '© {year} {name} · {location}', top: 'Rudi juu' },
};
