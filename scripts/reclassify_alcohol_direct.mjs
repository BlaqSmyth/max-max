import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const WINE_PATTERNS = [
  'wine', 'chardonnay', 'merlot', 'pinot', 'sauvignon', 'shiraz', 'malbec',
  'rosé', 'rose wine', 'cabernet', 'sherry', 'prosecco', 'champagne',
  'lambrini', 'cava', 'rioja', 'tempranillo', 'riesling', 'viognier', 'grenache',
  'syrah', 'zinfandel', 'chianti', 'barolo', 'moscato', 'madeira', 'vermouth',
  'pinotage', 'chenin', 'verdejo', 'albarino', 'sancerre', 'chablis',
  'bordeaux', 'burgundy', 'beaujolais', 'freixenet', 'echo falls', 'blossom hill',
  'hardys', 'mcguigan', 'isla negra', 'casillero', 'jp chenet', 'grillhouse',
  'distant vines', 'mendoza', 'campo viejo', 'black tower', 'nozeco',
  'cascata', 'vinho verde', 'pink diamond', 'stones and bones', 'lunatic fringe',
  'cablie', 'raspberry bush', 'queen bee', 'bees knees', 'vertiges', 'cinzano',
  'el bombero', 'yellow tail', 'barefoot', 'santa rita', 'wolf blass',
  'meguigan', 'sparkling non alc', 'brut', 'blanc de',
];

const BEER_PATTERNS = [
  'lager', ' beer', 'beers', ' ale ', ' ipa', 'stout', 'bitter', 'porter',
  'pilsner', ' pils', 'wheat beer', 'weiss', 'shandy', 'carling', 'stella',
  'heineken', 'carlsberg', 'corona', 'budweiser', 'peroni', 'moretti', 'birra',
  'sol lager', 'cruzcampo', 'cobra', 'kingfisher', 'san miguel', 'fosters',
  'tennents', 'amstel', 'becks', "beck's", 'leffe', 'hoegaarden', 'skol',
  'efes', 'coors', 'modelo', 'dos equis', 'blue moon', 'guinness', 'brewdog',
  'camden', 'meantime', 'estrella', 'tiger beer', 'asahi', 'sapporo', 'kirin',
  'tsingtao', 'president', 'red stripe', 'desperados', 'harp', 'john smiths',
  'boddingtons', 'newcastle', 'old speckled', 'hobgoblin', 'holsten', '1664',
  'tyskie', 'zubr', ' lech ', 'zywiec', 'debowa', 'kanpackie', 'black union',
  'staropramen', 'erdinger', ' perla', 'white storm', 'frosty jakes', 'black storm',
  'blumper', 'crumpton oaks',
];

const CIDER_PATTERNS = [
  'cider', 'kopparberg', 'strongbow', 'magners', 'bulmers', 'thatchers',
  'rekorderlig', 'old mout', "inch's", 'inchs', 'aspall', 'westons',
  'angry orchard',
];

function buildIlikeCondition(patterns) {
  return patterns.map((_, i) => `lower(name) LIKE $${i + 1}`).join(' OR ');
}

function buildParams(patterns) {
  return patterns.map(p => `%${p}%`);
}

async function run() {
  const client = await pool.connect();
  try {
    // Count starting point
    const { rows: start } = await client.query("SELECT count(*) FROM products WHERE category='alcohol'");
    console.log('Starting alcohol products:', start[0].count);

    // Update wines
    const wineWhere = buildIlikeCondition(WINE_PATTERNS);
    const wineParams = buildParams(WINE_PATTERNS);
    const { rowCount: winesUpdated } = await client.query(
      `UPDATE products SET category='wines' WHERE category='alcohol' AND (${wineWhere})`,
      wineParams
    );
    console.log(`Updated ${winesUpdated} → wines`);

    // Update beers  
    const beerWhere = buildIlikeCondition(BEER_PATTERNS);
    const beerParams = buildParams(BEER_PATTERNS);
    const { rowCount: beersUpdated } = await client.query(
      `UPDATE products SET category='beers' WHERE category='alcohol' AND (${beerWhere})`,
      beerParams
    );
    console.log(`Updated ${beersUpdated} → beers`);

    // Update ciders
    const ciderWhere = buildIlikeCondition(CIDER_PATTERNS);
    const ciderParams = buildParams(CIDER_PATTERNS);
    const { rowCount: cidersUpdated } = await client.query(
      `UPDATE products SET category='cider' WHERE category='alcohol' AND (${ciderWhere})`,
      ciderParams
    );
    console.log(`Updated ${cidersUpdated} → cider`);

    // Final counts
    const { rows: final } = await client.query(`
      SELECT category, count(*) FROM products 
      WHERE category IN ('alcohol','wines','beers','cider') 
      GROUP BY category ORDER BY count DESC
    `);
    console.log('\nFinal breakdown:');
    final.forEach(r => console.log(`  ${r.category.padEnd(12)} ${r.count}`));

  } finally {
    client.release();
    await pool.end();
  }
}

run().catch(console.error);
