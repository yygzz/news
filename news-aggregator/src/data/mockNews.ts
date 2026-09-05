import CryptoJS from 'crypto-js';
import type { NewsCategory, NewsData, NewsItem } from '../types';

function hashId(link: string): string {
  return CryptoJS.MD5(link).toString();
}

function hoursAgo(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

const placeholderThumbnail = 'https://via.placeholder.com/640x360?text=News';

const SOURCES = {
  bbc: { name: 'BBC', domain: 'bbc.com' },
  nyt: { name: 'The New York Times', domain: 'nytimes.com' },
  ap: { name: 'AP News', domain: 'apnews.com' },
  abc: { name: 'ABC News', domain: 'abcnews.go.com' },
  verge: { name: 'The Verge', domain: 'theverge.com' },
  bgr: { name: 'BGR', domain: 'bgr.com' },
  hackerNews: { name: 'The Hacker News', domain: 'thehackernews.com' },
  reuters: { name: 'Reuters', domain: 'reuters.com' },
  cnn: { name: 'CNN', domain: 'cnn.com' },
  guardian: { name: 'The Guardian', domain: 'theguardian.com' },
  cnbc: { name: 'CNBC', domain: 'cnbc.com' },
  bloomberg: { name: 'Bloomberg', domain: 'bloomberg.com' },
  techcrunch: { name: 'TechCrunch', domain: 'techcrunch.com' },
  ars: { name: 'Ars Technica', domain: 'arstechnica.com' },
  wired: { name: 'Wired', domain: 'wired.com' },
  hollywoodReporter: { name: 'The Hollywood Reporter', domain: 'hollywoodreporter.com' },
  variety: { name: 'Variety', domain: 'variety.com' },
  espn: { name: 'ESPN', domain: 'espn.com' },
  bbcSport: { name: 'BBC Sport', domain: 'bbc.com/sport' },
  skySports: { name: 'Sky Sports', domain: 'skysports.com' },
  nature: { name: 'Nature', domain: 'nature.com' },
  scienceDaily: { name: 'Science Daily', domain: 'sciencedaily.com' },
  newScientist: { name: 'New Scientist', domain: 'newscientist.com' },
  who: { name: 'World Health Organization', domain: 'who.int' },
  nih: { name: 'NIH', domain: 'nih.gov' },
};

function item(
  title: string,
  link: string,
  sourceKey: keyof typeof SOURCES,
  pubDate: string,
  snippet: string,
  category: NewsCategory,
  authors?: string[]
): NewsItem {
  const source = SOURCES[sourceKey];
  return {
    id: hashId(link),
    title,
    link,
    source: source.name,
    sourceUrl: source.domain,
    pubDate,
    contentSnippet: snippet,
    thumbnail: placeholderThumbnail,
    category,
    authors,
  };
}

const topStories: NewsItem[] = [
  item(
    'Global markets rally as inflation data signals cooling prices worldwide',
    'https://www.bbc.com/news/business-12345678',
    'bbc',
    hoursAgo(1),
    'Major stock indices in Asia, Europe and the United States climbed on Friday after fresh inflation figures suggested that price pressures are easing faster than economists had expected.',
    'top',
    ['Jane Smith', 'Michael Brown']
  ),
  item(
    'Senate passes landmark climate bill after marathon overnight session',
    'https://www.nytimes.com/2026/08/29/us/politics/climate-bill-passed.html',
    'nyt',
    hoursAgo(2),
    'The legislation, which includes hundreds of billions in clean-energy subsidies, passed by a single vote following a dramatic floor debate.',
    'top',
    ['David Leonhardt']
  ),
  item(
    'New malaria vaccine shows 80% efficacy in late-stage trial',
    'https://apnews.com/article/malaria-vaccine-trial-12345',
    'ap',
    hoursAgo(3),
    'Scientists say the results could transform prevention efforts across sub-Saharan Africa, where the disease kills hundreds of thousands of children each year.',
    'top',
    ['Maria Cheng']
  ),
  item(
    'Tech giants unveil joint framework for AI safety standards',
    'https://www.theverge.com/2026/8/29/ai-safety-framework-tech-giants',
    'verge',
    hoursAgo(4),
    'The voluntary commitments include third-party testing, information sharing on risks and research into watermarking tools for synthetic media.',
    'top',
    ['Adi Robertson']
  ),
  item(
    'Olympic committee announces host city for 2036 Summer Games',
    'https://www.espn.com/olympics/story/_/id/12345678/2036-olympics-host-city',
    'espn',
    hoursAgo(5),
    'The announcement ends years of speculation and sets the stage for the first Summer Olympics in the region since 2008.',
    'top',
    ['Howard Fendrich']
  ),
];

const world: NewsItem[] = [
  item(
    'Ukraine and Russia exchange largest prisoner swap since war began',
    'https://www.reuters.com/world/europe/ukraine-russia-prisoner-swap-2026-08-29/',
    'reuters',
    hoursAgo(1),
    'A total of 190 soldiers returned home in the exchange mediated by the United Arab Emirates.',
    'world'
  ),
  item(
    'Protests erupt across major Brazilian cities over education cuts',
    'https://www.theguardian.com/world/2026/aug/29/brazil-protests-education-cuts',
    'guardian',
    hoursAgo(2),
    'Teachers and students blocked major avenues in São Paulo and Rio de Janeiro, demanding the government reverse planned budget reductions.',
    'world'
  ),
  item(
    'Japan plans new tsunami defenses ahead of predicted Nankai trough quake',
    'https://www.bbc.com/news/world-asia-23456789',
    'bbc',
    hoursAgo(3),
    'The government approved a record infrastructure package aimed at protecting coastal communities along the Pacific.',
    'world'
  ),
  item(
    'European leaders hold emergency summit on migration routes',
    'https://apnews.com/article/europe-migration-summit-67890',
    'ap',
    hoursAgo(4),
    'Frontline states pressed for more financial support and faster asylum processing from wealthier EU members.',
    'world'
  ),
  item(
    'India launches crewed space mission test flight successfully',
    'https://www.cnn.com/2026/08/29/india-crew-mission-test-flight/index.html',
    'cnn',
    hoursAgo(5),
    'The uncrewed capsule splashed down in the Bay of Bengal after a 20-minute flight that validated emergency escape systems.',
    'world'
  ),
  item(
    'Nigeria opens Africa’s largest solar manufacturing plant',
    'https://www.bbc.com/news/world-africa-34567890',
    'bbc',
    hoursAgo(6),
    'Officials say the facility will produce panels for domestic use and export to neighboring West African nations.',
    'world'
  ),
  item(
    'Australia and Indonesia sign defense cooperation pact',
    'https://www.reuters.com/world/asia-pacific/australia-indonesia-defense-pact-2026-08-29/',
    'reuters',
    hoursAgo(7),
    'The agreement deepens maritime patrol coordination in waters both countries consider strategically vital.',
    'world'
  ),
  item(
    'Canadian wildfire smoke prompts air quality alerts in US Midwest',
    'https://www.abcnews.go.com/International/canada-wildfire-smoke-midwest-air-quality/story?id=12345',
    'abc',
    hoursAgo(8),
    'Residents in Chicago, Detroit and Minneapolis were advised to limit outdoor activity through the weekend.',
    'world'
  ),
];

const business: NewsItem[] = [
  item(
    'Federal Reserve chair hints at September rate cut in closely watched speech',
    'https://www.cnbc.com/2026/08/29/fed-chair-speech-september-rate-cut.html',
    'cnbc',
    hoursAgo(1),
    'Markets rallied after the central bank leader said the time for policy adjustment was drawing closer.',
    'business'
  ),
  item(
    'Apple and Samsung face new EU rules on replaceable batteries',
    'https://www.bloomberg.com/news/articles/2026-08-29/eu-replaceable-battery-rules-apple-samsung',
    'bloomberg',
    hoursAgo(2),
    'Smartphones sold in Europe will need batteries that consumers can remove with common tools by 2028.',
    'business'
  ),
  item(
    'Oil prices climb as OPEC extends production cuts into winter',
    'https://www.reuters.com/business/energy/oil-prices-opec-cuts-2026-08-29/',
    'reuters',
    hoursAgo(3),
    'Brent crude rose above $85 a barrel after the producer group signaled continued restraint.',
    'business'
  ),
  item(
    'Startup valuations recover in Q3 as venture funding rebounds',
    'https://techcrunch.com/2026/08/29/startup-valuations-q3-venture-funding/',
    'techcrunch',
    hoursAgo(4),
    'Late-stage deals are returning after an 18-month drought, though investors remain selective.',
    'business'
  ),
  item(
    'Airlines report record summer profits despite higher fuel costs',
    'https://apnews.com/article/airlines-profits-summer-2026-45678',
    'ap',
    hoursAgo(5),
    'Strong demand for international travel helped carriers offset elevated jet fuel prices.',
    'business'
  ),
  item(
    'Toyota delays some EV launches to improve battery range',
    'https://www.cnbc.com/2026/08/29/toyota-delays-ev-battery-range.html',
    'cnbc',
    hoursAgo(6),
    'The company said it would rather slow launches than bring vehicles to market with inferior specifications.',
    'business'
  ),
  item(
    'Small business optimism rises for third consecutive month',
    'https://www.bloomberg.com/news/articles/2026-08-29/small-business-optimism-rises',
    'bloomberg',
    hoursAgo(7),
    'Owners reported improved sales expectations and hiring plans in the latest industry survey.',
    'business'
  ),
  item(
    'Cryptocurrency exchange faces SEC lawsuit over unregistered staking',
    'https://www.reuters.com/business/finance/crypto-sec-staking-lawsuit-2026-08-29/',
    'reuters',
    hoursAgo(8),
    'The regulator alleges the firm earned billions by offering staking rewards without proper registration.',
    'business'
  ),
];

const technology: NewsItem[] = [
  item(
    'OpenAI releases new model with improved reasoning for coding tasks',
    'https://www.theverge.com/2026/8/29/openai-new-model-coding-reasoning',
    'verge',
    hoursAgo(1),
    'The upgrade scores significantly higher on competitive programming benchmarks, the company said.',
    'technology',
    ['James Vincent']
  ),
  item(
    'Samsung Galaxy Z Fold 7 review: thinner, lighter and finally mainstream?',
    'https://www.bgr.com/samsung-galaxy-z-fold-7-review/',
    'bgr',
    hoursAgo(2),
    'The latest foldable is the most refined yet, but the price tag remains a barrier for average buyers.',
    'technology',
    ['Chris Smith']
  ),
  item(
    'Critical zero-day in Chrome exploited in the wild, Google warns',
    'https://thehackernews.com/2026/08/google-warns-of-chrome-zero-day.html',
    'hackerNews',
    hoursAgo(3),
    'Users are urged to update to the latest version to patch the high-severity vulnerability.',
    'technology'
  ),
  item(
    'TSMC begins mass production of 2-nanometer chips in Arizona',
    'https://arstechnica.com/gadgets/2026/08/tsmc-2nm-arizona/',
    'ars',
    hoursAgo(4),
    'The milestone is expected to reshape global semiconductor supply chains over the next decade.',
    'technology'
  ),
  item(
    'Meta introduces AI agents that can browse the web for users',
    'https://techcrunch.com/2026/08/29/meta-ai-web-agents/',
    'techcrunch',
    hoursAgo(5),
    'The experimental tools can fill forms, compare prices and book appointments through natural language commands.',
    'technology'
  ),
  item(
    'iPhone 17 leak suggests major camera redesign and larger screens',
    'https://www.bgr.com/iphone-17-leak-camera-redesign/',
    'bgr',
    hoursAgo(6),
    'Analysts predict the Pro models will adopt a rectangular camera bump similar to earlier Pixel designs.',
    'technology'
  ),
  item(
    'Microsoft rolls out passkey support for all consumer accounts',
    'https://www.wired.com/story/microsoft-passkeys-consumer-accounts/',
    'wired',
    hoursAgo(7),
    'The move is part of an industry-wide push to replace passwords with phishing-resistant credentials.',
    'technology'
  ),
  item(
    'Raspberry Pi unveils AI kit for edge machine learning projects',
    'https://www.theverge.com/2026/8/29/raspberry-pi-ai-kit-edge-ml',
    'verge',
    hoursAgo(8),
    'The $70 add-on brings neural-network acceleration to the popular single-board computer.',
    'technology'
  ),
];

const entertainment: NewsItem[] = [
  item(
    'Venice Film Festival opens with standing ovation for sci-fi epic',
    'https://www.hollywoodreporter.com/movies/movie-news/venice-opening-sci-fi-epic-1234567890/',
    'hollywoodReporter',
    hoursAgo(1),
    'The film, starring an ensemble cast, is already generating Oscar buzz after its world premiere.',
    'entertainment'
  ),
  item(
    'Taylor Swift announces surprise live album from Eras Tour finale',
    'https://variety.com/2026/music/news/taylor-swift-live-album-eras-tour-1234567890/',
    'variety',
    hoursAgo(2),
    'The release includes recordings from the final shows of the record-breaking world tour.',
    'entertainment'
  ),
  item(
    'Netflix cancels critically acclaimed drama after two seasons',
    'https://www.theverge.com/2026/8/29/netflix-cancels-drama-two-seasons',
    'verge',
    hoursAgo(3),
    'Fans launched an online campaign to save the show, which had strong reviews but modest viewership.',
    'entertainment'
  ),
  item(
    'Marvel reveals Phase 7 slate at D23 fan event',
    'https://www.hollywoodreporter.com/movies/movie-news/marvel-phase-7-d23-1234567891/',
    'hollywoodReporter',
    hoursAgo(4),
    'The announcements included new Avengers, X-Men and Spider-Man projects scheduled through 2031.',
    'entertainment'
  ),
  item(
    'Rock Hall of Fame announces 2026 inductees',
    'https://variety.com/2026/music/news/rock-hall-fame-inductees-2026-1234567891/',
    'variety',
    hoursAgo(5),
    'This year’s class blends hip-hop pioneers, grunge icons and influential singer-songwriters.',
    'entertainment'
  ),
  item(
    'Streaming services raise prices again as competition intensifies',
    'https://www.cnn.com/2026/08/29/entertainment/streaming-price-increases/index.html',
    'cnn',
    hoursAgo(6),
    'Several major platforms introduced higher subscription tiers and crackdowns on password sharing.',
    'entertainment'
  ),
  item(
    'Animated feature breaks opening-weekend box office record',
    'https://apnews.com/article/animated-movie-box-office-record-78901',
    'ap',
    hoursAgo(7),
    'Family audiences drove the film to a $220 million domestic debut, surpassing previous animated records.',
    'entertainment'
  ),
  item(
    'Beyoncé launches scholarship program for performing arts students',
    'https://www.theguardian.com/music/2026/aug/29/beyonce-scholarship-performing-arts',
    'guardian',
    hoursAgo(8),
    'The initiative will provide full-tuition awards at historically Black colleges and universities.',
    'entertainment'
  ),
];

const sports: NewsItem[] = [
  item(
    'Manchester City defeats Real Madrid in Champions League opener',
    'https://www.bbc.com/sport/football/34567891',
    'bbcSport',
    hoursAgo(1),
    'Erling Haaland scored twice as the defending champions began their European campaign with a statement win.',
    'sports'
  ),
  item(
    'NFL season kicks off with Chiefs victory over Lions',
    'https://www.espn.com/nfl/story/_/id/12345679/chiefs-lions-season-opener',
    'espn',
    hoursAgo(2),
    'Patrick Mahomes threw three touchdown passes in the league’s opening night showcase.',
    'sports'
  ),
  item(
    'Coco Gauff advances to US Open fourth round in straight sets',
    'https://www.skysports.com/tennis/news/12118/12345678/coco-gauff-us-open-fourth-round',
    'skySports',
    hoursAgo(3),
    'The defending champion continued her dominant run on home soil at Flushing Meadows.',
    'sports'
  ),
  item(
    'Formula 1 confirms two new races on 2027 calendar',
    'https://www.espn.com/f1/story/_/id/12345680/f1-2027-calendar-new-races',
    'espn',
    hoursAgo(4),
    'The expansion brings the season total to 26 Grands Prix, the longest in the sport’s history.',
    'sports'
  ),
  item(
    'Los Angeles Dodgers clinch playoff berth with late-inning rally',
    'https://apnews.com/article/dodgers-clinch-playoff-berth-2026-34567',
    'ap',
    hoursAgo(5),
    'Shohei Ohtani hit a go-ahead home run in the eighth inning to seal the division title.',
    'sports'
  ),
  item(
    'NBA preseason to feature games in Abu Dhabi and Berlin',
    'https://www.espn.com/nba/story/_/id/12345681/nba-preseason-abu-dhabi-berlin',
    'espn',
    hoursAgo(6),
    'The league continues its global expansion with a record number of international exhibitions.',
    'sports'
  ),
  item(
    'Olympic sprinter suspended after positive doping test',
    'https://www.reuters.com/sports/olympics/athletics-sprinter-suspended-doping-2026-08-29/',
    'reuters',
    hoursAgo(7),
    'The athlete’s team said it would appeal the provisional ban and request analysis of a backup sample.',
    'sports'
  ),
  item(
    'Women’s World Cup expansion to 48 teams approved by FIFA',
    'https://www.bbc.com/sport/football/45678901',
    'bbcSport',
    hoursAgo(8),
    'The new format will begin with the 2031 tournament, extending the event by one week.',
    'sports'
  ),
];

const science: NewsItem[] = [
  item(
    'James Webb Telescope detects water vapor in distant exoplanet atmosphere',
    'https://www.nature.com/articles/d41586-026-00001-2',
    'nature',
    hoursAgo(1),
    'The discovery could help scientists understand whether rocky planets beyond the solar system can host habitable conditions.',
    'science'
  ),
  item(
    'CRISPR therapy shows promise for inherited blindness in early trial',
    'https://www.sciencedaily.com/releases/2026/08/260829123456.htm',
    'scienceDaily',
    hoursAgo(2),
    'Participants in the small study reported improved light sensitivity weeks after treatment.',
    'science'
  ),
  item(
    'Antarctic ice shelf study revises sea-level rise projections',
    'https://www.newscientist.com/article/1234567-antarctic-ice-shelf-sea-level-rise/',
    'newScientist',
    hoursAgo(3),
    'Researchers warn that current climate models may underestimate melting from below ice shelves.',
    'science'
  ),
  item(
    'New species of deep-sea jellyfish discovered off Japan coast',
    'https://www.nature.com/articles/d41586-026-00002-1',
    'nature',
    hoursAgo(4),
    'The translucent creature was filmed at a depth of 2,400 meters during a marine biology expedition.',
    'science'
  ),
  item(
    'Quantum computer exceeds 1,000 logical qubits in breakthrough experiment',
    'https://www.sciencedaily.com/releases/2026/08/260829789012.htm',
    'scienceDaily',
    hoursAgo(5),
    'The milestone brings fault-tolerant quantum computing closer to practical applications.',
    'science'
  ),
  item(
    'Study links microplastics to changes in human blood cells',
    'https://www.newscientist.com/article/1234568-microplastics-blood-cells-study/',
    'newScientist',
    hoursAgo(6),
    'Scientists found that particles can alter cell shape and function at environmentally relevant concentrations.',
    'science'
  ),
  item(
    'NASA selects landing site for crewed Mars mission simulation',
    'https://apnews.com/article/nasa-mars-landing-site-89012',
    'ap',
    hoursAgo(7),
    'The location offers a mix of geological features that could preserve signs of ancient microbial life.',
    'science'
  ),
  item(
    'Engineers develop self-healing concrete using bacteria',
    'https://www.sciencedaily.com/releases/2026/08/260829345678.htm',
    'scienceDaily',
    hoursAgo(8),
    'The material could extend the lifespan of bridges and roads while reducing maintenance costs.',
    'science'
  ),
];

const health: NewsItem[] = [
  item(
    'WHO warns of rising measles cases in Europe and Central Asia',
    'https://www.who.int/news/item/26-08-2026-measles-cases-rise-europe-central-asia',
    'who',
    hoursAgo(1),
    'Vaccination coverage dropped during the pandemic, leaving pockets of vulnerable children.',
    'health'
  ),
  item(
    'New study ties ultra-processed foods to depression risk',
    'https://www.nih.gov/news-events/news-releases/ultra-processed-foods-depression-risk-study',
    'nih',
    hoursAgo(2),
    'People who consumed the highest amounts showed a measurable increase in depression diagnoses over time.',
    'health'
  ),
  item(
    'FDA approves first over-the-counter birth control pill in US',
    'https://apnews.com/article/fda-otc-birth-control-pill-56789',
    'ap',
    hoursAgo(3),
    'The decision makes contraception more accessible without requiring a prescription.',
    'health'
  ),
  item(
    'Exercise after breast cancer surgery improves long-term survival, study finds',
    'https://www.nih.gov/news-events/news-releases/exercise-breast-cancer-survival',
    'nih',
    hoursAgo(4),
    'Even moderate physical activity was associated with lower recurrence rates in the large observational study.',
    'health'
  ),
  item(
    'Mental health apps face scrutiny over data privacy practices',
    'https://www.theguardian.com/society/2026/aug/29/mental-health-apps-data-privacy',
    'guardian',
    hoursAgo(5),
    'Advocates say sensitive user information is being shared with advertisers without clear consent.',
    'health'
  ),
  item(
    'Hospitals test AI tool to predict sepsis hours before symptoms worsen',
    'https://www.nih.gov/news-events/news-releases/ai-sepsis-prediction-hospitals',
    'nih',
    hoursAgo(6),
    'Early alerts could help clinicians intervene before organ damage occurs.',
    'health'
  ),
  item(
    'Sleep apnea linked to higher dementia risk in large study',
    'https://www.sciencedaily.com/releases/2026/08/260829901234.htm',
    'scienceDaily',
    hoursAgo(7),
    'Researchers say treating breathing disruptions during sleep may help protect brain health.',
    'health'
  ),
  item(
    'CDC updates COVID-19 booster recommendations for fall',
    'https://www.cnn.com/2026/08/29/health/cdc-covid-booster-fall/index.html',
    'cnn',
    hoursAgo(8),
    'The new guidance emphasizes protection for older adults and people with weakened immune systems.',
    'health'
  ),
];

const picksForYou: NewsItem[] = [
  item(
    'The hidden costs of fast fashion on global water supplies',
    'https://www.theguardian.com/environment/2026/aug/29/fast-fashion-water-supplies',
    'guardian',
    hoursAgo(2),
    'A new report traces how textile production strains rivers and aquifers in major manufacturing regions.',
    'world'
  ),
  item(
    'How regenerative agriculture is reshaping Midwest farming',
    'https://www.nytimes.com/2026/08/29/climate/regenerative-agriculture-midwest.html',
    'nyt',
    hoursAgo(5),
    'Farmers adopting cover crops and no-till methods report healthier soil and lower input costs.',
    'business'
  ),
  item(
    'Review: The best wireless earbuds under $100',
    'https://www.theverge.com/2026/8/29/best-wireless-earbuds-under-100',
    'verge',
    hoursAgo(7),
    'These budget options deliver impressive sound, long battery life and reliable connectivity.',
    'technology'
  ),
  item(
    'Why doctors are rethinking daily aspirin for heart health',
    'https://www.nih.gov/news-events/news-releases/rethinking-daily-aspirin-heart-health',
    'nih',
    hoursAgo(9),
    'Updated guidelines emphasize individualized risk assessment over blanket recommendations.',
    'health'
  ),
  item(
    'Inside the race to build a commercial fusion power plant',
    'https://www.wired.com/story/commercial-fusion-power-plant-race/',
    'wired',
    hoursAgo(12),
    'Several startups now aim to deliver electricity to the grid before 2040.',
    'science'
  ),
];

export const mockNewsData: NewsData = {
  lastUpdated: new Date().toISOString(),
  categories: {
    top: topStories,
    world,
    business,
    technology,
    entertainment,
    sports,
    science,
    health,
  },
  topStories,
  picksForYou,
};

export default mockNewsData;
