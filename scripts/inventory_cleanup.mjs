import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ============================================================
// COMPLETE INVENTORY KEYWORD LIST
// Extracted from all 86 pages of handwritten inventory scans
// A product is KEPT if its name contains any of these keywords (case-insensitive)
// ============================================================
const INVENTORY_KEYWORDS = [
  // GROCERIES
  'batchelor', 'batchelors', 'knorr', 'tilda', "ben's original", 'bens original',
  'old el paso', 'ktc', 'tropical sun', 'heinz', 'sharwood', 'uncle ben',
  'pot noodle', 'supernoodle', 'super noodle', 'maggi', 'nakd', 'nature valley',
  'nakd bar', 'quaker oat', 'hartley', 'robertson', 'marmite',
  'bovril', 'lea & perrins', 'worcestershire', 'branston', 'hp sauce',
  'ketchup', 'mayonnaise', 'salad cream', 'colman', 'colmans',
  'ambrosia', 'rice pudding', 'carnation', 'angel delight',
  'smash', 'pot mash', 'vesta', 'bachelors',
  'pasta', 'spaghetti', 'macaroni', 'penne', 'fusilli', 'tagliatelle',
  'rice', 'basmati', 'jasmine', 'long grain',
  'lentil', 'chickpea', 'kidney bean', 'black bean',
  'coconut milk', 'coconut cream', 'evaporated milk', 'condensed milk',
  'cooking oil', 'vegetable oil', 'sunflower oil', 'olive oil',
  'vinegar', 'malt vinegar', 'balsamic',
  'salt', 'pepper', 'spice', 'seasoning', 'paprika', 'cumin', 'turmeric',
  'coriander', 'curry powder', 'mixed herbs', 'thyme', 'basil',
  'chicken stock', 'beef stock', 'vegetable stock', 'oxo', 'marigold',
  'tomato paste', 'tomato puree', 'chopped tomato', 'passata',
  'baked bean', 'kidney bean', 'mixed bean', 'butter bean',
  'tuna', 'sardine', 'pilchard', 'salmon', 'mackerel',
  'corned beef', 'spam', 'ham',
  'jam', 'marmalade', 'honey', 'golden syrup', 'treacle',
  'peanut butter', 'nutella', 'biscoff spread',
  'sugar', 'brown sugar', 'icing sugar', 'caster sugar',
  'flour', 'self raising', 'plain flour', 'cornflour',
  'baking powder', 'bicarbonate', 'yeast',
  'chocolate chips', 'cocoa powder', 'drinking chocolate',
  'custard powder', 'jelly', 'gelatine',
  'chicken noodle', 'minestrone', 'tomato soup', 'mushroom soup',
  'oxtail', 'lentil soup',
  'noodle', 'instant noodle', 'ramen',
  'couscous', 'quinoa',
  'crackers', 'rice cake', 'breadstick', 'crispbread',
  'pickled onion', 'pickled egg', 'gherkin',
  'stuffing', 'gravy', 'bisto',
  'frozen pea', 'sweetcorn', 'mixed vegetable',
  'cornflake', 'museli', 'muesli',

  // SOFT DRINKS
  'lucozade', 'barr', 'tango', 'rubicon', 'ka drink', 'k.a.', ' ka ',
  'fanta', 'pepsi', 'coca-cola', 'coke', 'coca cola',
  'red bull', 'boost', 'monster', 'relentless', 'rockstar',
  '7up', 'sprite', 'dr pepper', 'dr. pepper',
  'irn bru', 'vimto', 'ribena', 'robinsons', 'capri-sun', 'capri sun',
  'tropicana', 'innocent', 'oasis', 'mountain dew',
  'lemonade', 'ginger beer', 'ginger ale', 'tonic water',
  'sparkling water', 'still water', 'highland spring', 'evian', 'volvic',
  'san pellegrino', 'fever tree',
  'squash', 'cordial', 'dilute', 'diluting',
  'iced tea', 'snapple', 'lipton',
  'coconut water', 'aloe vera drink',
  'energy drink', 'sports drink', 'isotonic',
  'arizona', 'jamaican', 'd&g', 'grace', 'big h',

  // MEDICINES / HEALTH
  'strepsil', 'ibuprofen', 'gaviscon', 'nurofen', 'lemsip',
  'calpol', 'benylin', 'deep heat', 'paracetamol', 'galpharm',
  'aspirin', 'rennie', 'durex', 'boots pharmacy',
  'dettol antiseptic', 'savlon',
  'night nurse', 'day nurse',
  'beechams', 'sudafed', 'vicks',
  'bonjela', 'anbesol', 'orajel',
  'antacid', 'indigestion', 'heartburn',
  'diarrhea', 'diarrhoea', 'immodium', 'imodium',
  'hayfever', 'antihistamine', 'piriton', 'cetirizine',
  'vaseline', 'lip balm', 'chapstick',
  'pregnancy test', 'swift test',
  'plaster', 'bandage', 'wound',
  'vitamin', 'supplement', 'cod liver', 'omega',
  'glucosamine', 'iron tablet', 'folic acid',
  'galpharm', 'pho plus', 'caffeine',
  'vapour rub', 'vaporub', 'sudocrem',
  'e45', 'aqueous cream',

  // DAIRY
  'freshways', 'onken', 'anchor', 'flora', 'utterly butterly',
  'cravendale', 'arla', 'yeo valley', 'muller',
  'activia', 'danone', 'yakult',
  'cheese', 'cheddar', 'edam', 'gouda', 'brie', 'camembert',
  'mozzarella', 'parmesan', 'feta',
  'butter', 'margarine', 'spread', 'lurpak', 'clover', 'stork',
  'milk', 'semi skimmed', 'full fat', 'skimmed',
  'cream', 'double cream', 'single cream', 'soured cream', 'creme fraiche',
  'yogurt', 'yoghurt',
  'eggs', 'free range',

  // MEAT / READY MEALS
  'zaad', 'peperami', 'tikka bite', 'rustler',
  'pepperoni', 'salami', 'chorizo',
  'chicken slice', 'ham slice', 'turkey slice',
  'sausage roll', 'pork pie',
  'chicken tikka', 'chicken curry', 'beef curry',
  'lasagne', 'cottage pie', 'shepherd pie', 'fish pie',
  'ready meal', 'microwave meal',
  'hotdog', 'hot dog', 'frankfurter',

  // BISCUITS / SNACK BARS
  'maryland', "fox's", 'foxs', 'ritz', "paterson's", 'bourbons',
  'biscoff', 'hobnob', 'digestive', "mcvitie", 'mcvities',
  'custard cream', 'garibaldi', 'rich tea', 'gingernut', 'ginger nut',
  'jaffa cake', 'club biscuit', 'kit kat', 'kitkat',
  'penguin', 'rocky', 'taxi biscuit', 'viscount',
  'wagon wheel', 'jammy dodger',
  'malted milk', 'shortbread', 'butter cookie',
  'oreo', 'choco leibniz', 'bahlsen',
  'nakd bar', 'kind bar', 'graze',
  "jacob's cream cracker", 'jacobs cream cracker',
  'tuc cracker',

  // TEA / COFFEE / HOT DRINKS
  'nescafe', 'nescafé', 'kenco', 'gold blend', 'red mountain',
  'lavazza', 'twinings', 'tetley', 'yorkshire tea', 'pg tips', 'typhoo',
  'clipper tea', 'clipper coffee',
  'cadbury drinking', 'options hot choc',
  'horlicks', 'ovaltine', 'bournvita',
  'coffee mate', 'coffeemate', 'whitener',
  'green tea', 'chamomile', 'peppermint tea', 'herbal tea',
  'earl grey', 'english breakfast', 'assam', 'darjeeling',
  'instant coffee', 'ground coffee', 'coffee pod', 'dolce gusto', 'nespresso',
  'tatly', 'tata tea', 'nambarrie', 'bewleys',

  // CRISPS / SNACKS
  'walkers', 'kp nuts', 'pringles', 'doritos', 'golden wonder',
  'lorenz', 'sensations', 'kettle', 'tyrrell', 'tyrrells',
  'hula hoop', 'mini cheddars', 'french fries crisp',
  'skips', 'quavers', 'wotsit', 'nik nak', 'nik naks',
  'monster munch', 'popchip', 'pop chip',
  'sunbite', 'sun bite', 'hippeas',
  'popcorn', 'butterkist',
  'prawn cocktail', 'cheese and onion', 'salt and vinegar', 'ready salted',
  'beef crisp', 'smoky bacon',
  'pistachio', 'cashew', 'almond', 'peanut', 'mixed nut', 'brazilnut',
  'dry fruit', 'dried mango', 'dried apricot', 'raisin', 'sultana', 'cranberry',
  'sunflower seed', 'pumpkin seed', 'trail mix',
  'plantain chip', 'banana chip',

  // CEREALS
  'weetabix', "kellogg's", 'kellogs', 'kellogg',
  'corn flakes', 'cornflakes', 'frosties', 'crunchy nut', 'rice krispies',
  'coco pops', 'froot loop', 'fruit loop', 'special k', 'all bran',
  'nestle', 'shreddies', 'cheerio', 'shredded wheat',
  'alpen', 'granola', 'oat', 'porridge oat', 'scotts oat',
  'bran flake', 'fruit n fibre', 'fruit and fibre',
  'frosted wheat', 'mini wheats',

  // BAKERY
  'antonelli', 'st michel', 'lago', 'balconi', 'tago',
  'jays cake', 'dulcesol', 'kingsmill', 'hovis',
  'warburton', 'roberts bread', 'nimble',
  'bread roll', 'baguette', 'ciabatta', 'pitta', 'naan',
  'brioche', 'croissant', 'danish pastry',
  'muffin', 'doughnut', 'donut', 'eclair',
  'swiss roll', 'battenberg',
  'mr kipling', 'cadbury cake', 'jaffa',
  'rich tea finger', 'brownie', 'flapjack',
  'crumpet', 'teacake', 'hot cross bun',
  'wraps', 'tortilla wrap',

  // SWEETS / CHOCOLATES
  'haribo', 'bebeto', 'maynards', 'galaxy', 'cadbury',
  'twix', 'kinder', 'ferrero', 'toblerone',
  'maltesers', 'minstrel', 'm&m', 'm and m',
  'skittles', 'starburst', 'fruit pastle', 'fruit pastille',
  'wine gum', 'jelly baby', 'jelly bean',
  'tangfastic', 'percy pig', 'fizzy cola',
  'refresher', 'drumstick', 'sherbet',
  'lollipop', 'chupa chup', 'chupa chups',
  'bounty', 'snickers', 'mars bar', 'milky way',
  'twirl', 'flake', 'crunchie', 'wispa', 'boost bar',
  'lion bar', 'dime', 'daim',
  'roses', 'quality street', 'celebrations',
  'after eight', 'ferrero rocher', 'thornton',
  'reeses', "reese's", 'hershey',
  'lindt', 'green & black', 'hotel chocolat',
  'extra strong mint', 'polo mint', 'tic tac', 'mentos',
  'wrigley', 'airwave', 'extra gum', 'orbit gum',
  'trebor', 'softmint', 'spearmint',

  // TISSUES / PAPER PRODUCTS
  'freedom tissue', 'nicky tissue', 'andrex', 'inspiration tissue',
  'regina tissue', 'blossom soft', 'jacks soft', 'bloom tissue',
  'cushella', 'hush tissue', 'plenty', 'use it',
  'kitchen towel', 'toilet roll', 'tissue roll',
  'kitchen roll', 'household roll', 'paper towel',
  'facial tissue', 'pocket tissue',
  'chef essential',

  // BEERS / LAGER / CIDER
  'guinness', 'heineken', 'stella artois', 'stella',
  'budweiser', 'becks', 'beck\'s', 'corona', 'peroni',
  'kopparberg', 'kopenberg',
  'desperado', 'desperados', 'san miguel', 'sanmiguel',
  'budweisens', 'birra moretti', 'amstel',
  'carlsberg', 'fosters', 'carling', 'tennent',
  'tiger beer', 'singha', 'chang beer',
  'cobra beer', 'bangla beer',
  'efes', 'efes draft', 'modelo', 'negra modelo',
  'tyskie', 'zubr', 'holsten', '1664', 'kronenbourg',
  'lech', 'zywiec', 'debowa', 'kanpackie',
  'red stripe', 'red stripe beer', 'sol beer',
  'skol beer',
  'vk vodka', 'wkd', 'smirnoff ice',
  'magner', 'magners', 'strongbow', 'thatchers',
  'kopparberg cider', 'rekorderlig',
  'bulmers', 'old mout', 'berries',
  'old speckled hen', 'old peculier', 'landlord',
  'chabbies', 'chabbie',
  'carib', 'carib lager',
  'omega cider', 'knight cider', 'white storm', 'lambrini',
  'crumpton oak', 'crumpton oaks', 'frosty jake',
  'staro pramen', 'staropramen', 'dragon stout',
  'black union', 'k-cider', 'mach', 'inchs',

  // WINES
  'blossom hill', 'echo falls', "jacob's creek", 'jacobs creek',
  'barefoot', 'bare foot',
  'campo viejo', 'casillero del diablo', 'casillero',
  'hardys', 'lindemans', 'lindeman',
  'yellow tail', 'wolf blass', 'penfolds',
  'mateus', 'rose wine', 'rosé wine',
  'sauvignon blanc', 'chardonnay', 'merlot', 'cabernet', 'pinot',
  'shiraz', 'malbec', 'rioja', 'tempranillo',
  'prosecco', 'champagne', 'cava', 'sparkling wine',
  'pinot grigio', 'pinot gris',
  'most wanted', 'i heart', 'gallo', 'hardys',
  'kumala', 'isla negra', 'not guilty', 'nozeco',
  'mvembe', 'entwine', 'bannock', 'bannrock', 'inkosi',
  'yalumba', 'rosemount', 'd\'arenberg', 'penfolds',
  'saint mania', 'marco maci', 'pc cream wine', 'vendicco',
  'el bombero', 'il bombero', 'stones and bones', 'lunatic fringe',
  'rasberry bush', 'raspberry bush', 'rex mudi',
  'western cape', 'opi malbec', 'bills and sons', 'patties',
  'queen bee wine', 'bees knees', 'cablie',
  'brass monkey', 'leimoin', 'lime leaf verde',
  'pink diamond', 'cascata vinho', 'vertiges',
  'cinzano bianco', 'most wanted', 'kumala', 'barefoot',
  'handys', 'handy\'s', 'meguigan', 'black stump',
  'fine and foul', 'alessandro', 'first cape', 'distant vines',
  'oxford landing', 'jp chenet', 'quickly bird',
  'grillo', 'faustino', 'sandeman', 'taylors port', 'bottega',
  'gloemorangie', 'glemorangie',
  'black tower', 'lagrein', 'prosecco rossi', 'cortissier',
  'martini asti', 'martini rosso', 'martini bianco',
  'champagne moet', 'paul longier', 'bollinger',

  // SPIRITS / LIQUORS
  'absolut', 'smirnoff vodka', 'smirnoff original', 'ciroc',
  'captain morgan', 'jack daniels', 'gordons', "gordon's",
  'bacardi', 'malibu', 'wkd vodka', 'wkd blue',
  'grey goose', 'au vodka', 'finlandia',
  'vodka prince consort', "glen's vodka", 'glens vodka',
  'wray and nephew', 'wray nephew', 'zubrowka',
  'russian standard', 'smirnoff spicy',
  'md 20/20', 'campari', 'smirnoff vanilla',
  'tequila rose', 'sierra tequila', 'olmeca', 'sauza',
  'sambuca', 'tia maria', 'kahlua', 'jagermeister',
  'pernod', 'ricard', 'pastis',
  'baileys', 'advocaat', 'disaronno', 'amaretto',
  'midori', 'malibu', 'peach schnapps', 'southern comfort',
  'jim beam', 'jack daniel', 'jameson', 'bushmills',
  'grants whisky', 'bells whisky', 'teachers', 'famous grouse',
  'glenfiddich', 'glenmorangie', 'laphroaig', 'macallan',
  'chivas regal', 'haig club', 'jura whisky', 'woodford reserve',
  'remy martin', 'hennessy', 'courvoisier', 'martell',
  'maison', 'cognac', 'brandy',
  'jules claizon', 'red label', 'black label',
  'high commissioner', 'ej brandy', 'prince consort',
  'three barrels', 'bols apricot',
  'kopparberg rum',
  'bombay sapphire', 'tanqueray', 'hendricks', 'beefeater',
  'london dry gin', 'pink gin',
  'alize', 'passoa', 'malibu', 'archers',
  'buzz balz', 'buzzbalz',
  'magnum tonic wine', 'rudder boy', 'red label tonic', 'koppo tonic', 'cherry b tonic',
  'wha gwav', 'whagwav',
  'white mascay', 'white moskov',
  'creme de menthe', 'triple sec', 'blue curacao',

  // PET FOOD
  'dreamies', 'webbox', 'felix', 'whiskas', 'winalot', 'pedigree',
  'purina', 'iams', 'hills science', 'royal canin',
  'bakers dog', 'chappie', 'butchers',
  'sheba', 'gourmet pet', 'encore pet',
  'go-cat', 'go cat',
  'supercoat', 'beta dog',
  'collars', 'flea treatment', 'frontline',
  'dentastix', 'pedigree treat',

  // HOUSEHOLD / CLEANING
  'fairy liquid', 'flash', 'easy off', 'finish tablet',
  'brillo pad', 'dettol surface', 'cif', 'comfort fabric',
  'ariel', 'persil', 'bold', 'surf', 'daz',
  'radion', 'fairy non bio', 'fairy original',
  'method', 'ecover',
  'domestos', 'harpic', 'toilet duck', 'mr muscle',
  'bleach', 'thick bleach',
  'sponge', 'scourer', 'washing up liquid',
  'fabric softener', 'conditioner',
  'air freshener', 'febreze', 'ambi pur', 'glade',
  'bin bag', 'bin liner', 'food bag', 'freezer bag', 'cling film', 'tin foil',
  'kitchen foil', 'aluminium foil', 'baking parchment',
  'washing up bowl', 'rubber glove',
  'zoflora', 'pine disinfectant', 'lifebuoy',
  'cilit bang', 'viakal', 'lime scale',

  // PERSONAL CARE / HYGIENE
  'carex handwash', 'carex soap', 'palmolive', 'colgate', 'lynx',
  'radox', 'sanex', 'gillette', 'dove',
  'imperial leather', 'simple soap', 'original source',
  'head shoulders', 'head & shoulders', 'pantene', 'vo5', 'vosene',
  'alberto balsam', 'elvive', "l'oreal",
  'sure deodorant', 'right guard', 'old spice', 'nivea',
  'gillette foam', 'gillette razor',
  'venus razor', 'wilkinson sword',
  'veet', 'nair hair removal',
  'clearasil', 'oxy facewash', 'clean clear',
  'cotton bud', 'cotton wool',
  'shower gel', 'body wash', 'bubble bath',
  'shampoo', 'conditioner hair',
  'toothpaste', 'toothbrush', 'floss', 'mouthwash', 'listerine', 'corsodyl',
  'feminine hygiene', 'sanitary', 'always', 'tampax', 'bodyform', 'lil-lets',
  'nappy', 'pampers', 'huggies', 'johnsons baby', 'sudocrem baby',
  'baby lotion', 'baby powder', 'baby wipe',
  'wet wipe', 'flushable wipe', 'face wipe', 'antibacterial wipe',
  'hair gel', 'hair wax', 'hair spray', 'mousse', 'styling',
  'nail polish', 'nail remover',
  'tcp antiseptic', 'germolene',
  'lotion', 'moisturiser', 'moisturizer', 'body lotion',
  'sunscreen', 'sun cream', 'after sun',
  'lip gloss', 'mascara',
  'foot cream', 'heel balm',

  // LAUNDRY / BABY
  'bold 2in1', 'persil bio', 'non-bio', 'fairy bio',
  'comfort blue', 'lenor', 'downy',
  'napisan', 'vanish', 'stain remover',
  'laundry tablet', 'capsule', 'laundry powder',
  'pampers pull', 'huggies pull',

  // TOBACCO / CIGARETTES
  'embassy filter', 'embassy gold', 'embassy signature',
  'vogue cigarette', 'marlboro', 'rothmans', 'silkcut', 'silk cut',
  'players cigarette', 'carlton cigarette', 'ymb',
  'american spirit', 'pall mall', 'pallmall',
  'richmond cigarette', 'sovereign cigarette', 'lucky strike',
  'benson gold', 'benson silver', 'benson blue', 'benson dual', 'benson sky',
  'sterling cigarette', 'mayfair cigarette',
  'chesterfield', 'winston',
  // TOBACCO (rolling)
  'golden virginia', 'old holborn', 'riverston', 'amber leaf',
  'mayfair tobacco', 'benson tobacco', 'pall mall tobacco',
  'sterling tobacco', 'marlboro tobacco',
  // HEETS / pods
  'heets', 'iqos', 'terea',
  // VAPE
  'lost mary', 'elf bar', 'geek bar', 'crystal bar', 'randm tornado',
  'side vape', 'vuse', 'blu vape',
  'velo nicotine', 'nordic spirit', 'zyn', 'snus',
  // ROLLING ACCESSORIES
  'rizla', 'raw paper', 'raw rolling', 'ocb', 'elements paper',
  'blunt wrap', 'swan extra slim', 'extra slim filter',
  'jumbo cone', 'jumbo paper', 'roach',
  'clipper lighter', 'clipper butane', 'zippo', 'zig zag lighter', 'bic lighter',
  'swan flint', 'lighter fluid',

  // BATTERIES / MISC GENERAL
  'duracell', 'panasonic battery', 'energizer',
  'sellotape', 'clear adhesive tape',
];

// ============================================================
// Normalise a string for fuzzy comparison
// ============================================================
function normalise(str) {
  return str.toLowerCase()
    .replace(/[''`]/g, "'")
    .replace(/[^\w\s&]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function isInInventory(productName) {
  const name = normalise(productName);
  for (const kw of INVENTORY_KEYWORDS) {
    const normKw = normalise(kw);
    if (name.includes(normKw)) return true;
  }
  return false;
}

// ============================================================
// Main
// ============================================================
async function main() {
  console.log('Fetching all epos- products from Supabase...');

  // Paginate to get all products
  let allProducts = [];
  let from = 0;
  const PAGE = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('products')
      .select('id, name')
      .like('id', 'epos-%')
      .range(from, from + PAGE - 1);
    if (error) { console.error('Fetch error:', error); process.exit(1); }
    if (!data || data.length === 0) break;
    allProducts = allProducts.concat(data);
    if (data.length < PAGE) break;
    from += PAGE;
  }

  console.log(`Total epos- products: ${allProducts.length}`);

  const toKeep = allProducts.filter(p => isInInventory(p.name));
  const toDelete = allProducts.filter(p => !isInInventory(p.name));

  console.log(`\nKeep: ${toKeep.length}`);
  console.log(`Delete: ${toDelete.length}`);

  if (toDelete.length > 0) {
    console.log('\nProducts to DELETE (sample up to 50):');
    toDelete.slice(0, 50).forEach(p => console.log(`  ${p.id}: ${p.name}`));
    if (toDelete.length > 50) {
      console.log(`  ... and ${toDelete.length - 50} more`);
    }

    // Save the full delete list
    const deleteIds = toDelete.map(p => p.id);
    process.stdout.write('\nDELETE_IDS_JSON:' + JSON.stringify(deleteIds) + '\n');

    // Delete in batches of 100
    const BATCH = 100;
    let deleted = 0;
    for (let i = 0; i < deleteIds.length; i += BATCH) {
      const batch = deleteIds.slice(i, i + BATCH);
      const { error } = await supabase
        .from('products')
        .delete()
        .in('id', batch);
      if (error) {
        console.error(`Error deleting batch at index ${i}:`, error);
      } else {
        deleted += batch.length;
        process.stdout.write(`  Deleted batch ${Math.floor(i/BATCH)+1}: ${deleted}/${deleteIds.length}\n`);
      }
    }
    console.log(`\nDone! Deleted ${deleted} products.`);
  } else {
    console.log('\nNothing to delete.');
  }

  // Show what we're keeping (sample)
  console.log('\nSample of KEPT products (first 20):');
  toKeep.slice(0, 20).forEach(p => console.log(`  ${p.id}: ${p.name}`));
}

main().catch(console.error);
