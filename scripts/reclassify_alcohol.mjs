import { createClient } from '@supabase/supabase-js';

const sb = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Keywords for each sub-category (all lowercase)
const WINE_KEYWORDS = [
  'wine', 'chardonnay', 'merlot', 'pinot', 'sauvignon', 'shiraz', 'malbec',
  'rosé', ' rose ', 'rose wine', 'cabernet', 'sherry', 'prosecco', 'champagne',
  'lambrini', 'cava', 'rioja', 'tempranillo', 'riesling', 'viognier', 'grenache',
  'syrah', 'zinfandel', 'chianti', 'barolo', 'moscato', 'port wine', 'madeira',
  'vermouth', 'pinotage', 'chenin', 'verdejo', 'albarino', 'sancerre', 'chablis',
  'bordeaux', 'burgundy', 'beaujolais', 'blanc de', 'brut', 'freixenet',
  'echo falls', 'blossom hill', 'hardys', 'mcguigan', 'isla negra', 'casillero',
  'jp chenet', 'grillhouse', 'distant vines', 'mendoza', 'king cabernet',
  'yellow tail', 'barefoot', 'gallo', 'santa rita', 'wolf blass',
];

const BEER_KEYWORDS = [
  'lager', ' beer', 'beer ', 'beers', ' ale', 'ale ', 'stout', ' ipa', 'ipa ',
  'bitter', 'porter', 'pilsner', 'pils ', 'wheat beer', 'weiss', 'shandy',
  'carling', 'stella', 'heineken', 'carlsberg', 'corona', 'budweiser', 'bud ',
  'peroni', 'moretti', 'birra', 'sol lager', 'cruzcampo', 'cobra', 'kingfisher',
  'san miguel', 'fosters', 'tennents', 'amstel', 'becks', 'beck\'s', 'leffe',
  'hoegaarden', 'skol', 'efes', 'coors', 'modelo', 'dos equis', 'blue moon',
  'guinness', 'brewdog', 'camden', 'meantime', 'estrella', 'tiger beer',
  'asahi', 'sapporo', 'kirin', 'tsingtao', 'president', 'red stripe',
  'blumper', 'desperados', 'harp', 'john smiths', 'boddingtons',
  'newcastle', 'old speckled', 'hobgoblin',
];

const CIDER_KEYWORDS = [
  'cider', 'kopparberg', 'strongbow', 'magners', 'bulmers', 'thatchers',
  'rekorderlig', 'old mout', "inch's", 'inchs', 'aspall', 'westons', 'angry orchard',
];

function classify(name) {
  const n = ` ${name.toLowerCase()} `;

  if (CIDER_KEYWORDS.some(k => n.includes(k))) return 'cider';
  if (WINE_KEYWORDS.some(k => n.includes(k))) return 'wines';
  if (BEER_KEYWORDS.some(k => n.includes(k))) return 'beers';
  return null; // stays as alcohol (spirits etc.)
}

async function run() {
  // Fetch all alcohol products
  let all = [], from = 0;
  while (true) {
    const { data, error } = await sb.from('products').select('id,name').eq('category', 'alcohol').range(from, from + 999);
    if (error) { console.error(error); break; }
    if (!data || data.length === 0) break;
    all = all.concat(data);
    if (data.length < 1000) break;
    from += 1000;
  }
  console.log(`Fetched ${all.length} alcohol products`);

  const buckets = { wines: [], beers: [], cider: [], alcohol: [] };
  for (const p of all) {
    const cat = classify(p.name) || 'alcohol';
    buckets[cat].push(p);
  }

  console.log(`Classification:`);
  console.log(`  wines:   ${buckets.wines.length}`);
  console.log(`  beers:   ${buckets.beers.length}`);
  console.log(`  cider:   ${buckets.cider.length}`);
  console.log(`  alcohol (spirits/unclassified): ${buckets.alcohol.length}`);

  // Show unclassified for review
  console.log('\nUnclassified (staying as alcohol/spirits):');
  buckets.alcohol.forEach(p => console.log('  -', p.name));

  // Update wines
  if (buckets.wines.length > 0) {
    const ids = buckets.wines.map(p => p.id);
    const { error } = await sb.from('products').update({ category: 'wines' }).in('id', ids);
    if (error) console.error('Wine update error:', error);
    else console.log(`\nUpdated ${ids.length} products → wines`);
  }

  // Update beers
  if (buckets.beers.length > 0) {
    const ids = buckets.beers.map(p => p.id);
    const { error } = await sb.from('products').update({ category: 'beers' }).in('id', ids);
    if (error) console.error('Beer update error:', error);
    else console.log(`Updated ${ids.length} products → beers`);
  }

  // Update cider
  if (buckets.cider.length > 0) {
    const ids = buckets.cider.map(p => p.id);
    const { error } = await sb.from('products').update({ category: 'cider' }).in('id', ids);
    if (error) console.error('Cider update error:', error);
    else console.log(`Updated ${ids.length} products → cider`);
  }

  console.log('\nDone!');
}

run().catch(console.error);
