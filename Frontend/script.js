/* ============================================================
   WASTEVISION AI — REDESIGNED SCRIPT
   Backend API unchanged. All new frontend logic.
   ============================================================ */

const API_URL = "/predict";

// ── WASTE DATA ──────────────────────────────────────────────
const waste_labels = {
  "Food": {
    mainCat: "bio",
    type: "Biodegradable",
    recycling: "Composting or vermicomposting is ideal. Rich organic matter becomes valuable fertilizer for gardens.",
    impact: "Produces methane in landfill — a greenhouse gas 25× more potent than CO₂. About 8% of global greenhouse emissions.",
    decomp: "3–4 weeks",
    harmLevel: 25,
    diy: [
      { emoji: "🌱", title: "Compost Bin", desc: "Build a DIY compost bin with food scraps to create rich soil fertilizer." },
      { emoji: "🧪", title: "Biogas Plant", desc: "Organic waste can be converted into biogas for cooking energy at home." },
      { emoji: "🌻", title: "Garden Mulch", desc: "Dry food scraps make excellent mulch to retain soil moisture." },
      { emoji: "🪱", title: "Vermicompost", desc: "Set up a worm farm to turn food scraps into nutrient-dense casting." },
    ]
  },
  "Animal Dead Body": {
    mainCat: "bio",
    type: "Biodegradable (Biohazardous)",
    recycling: "Industrial processing only. Contact local municipal authorities immediately.",
    impact: "Disease risk and contamination of surrounding soil and water. Never handle without protective equipment.",
    decomp: "1–3 months",
    harmLevel: 60,
    diy: [
      { emoji: "📞", title: "Contact Authorities", desc: "Report to your local municipal corporation for safe removal." },
      { emoji: "🧤", title: "Safety First", desc: "Never handle directly. Always use protective gloves if nearby." },
    ]
  },
  "Paper": {
    mainCat: "bio",
    type: "Biodegradable",
    recycling: "Re-pulping into new paper. Keep dry and separate from wet waste. Stack neatly.",
    impact: "Reduces deforestation when recycled. Saves 17 trees and 7,000 gallons of water per tonne recycled.",
    decomp: "2–6 weeks",
    harmLevel: 15,
    diy: [
      { emoji: "📝", title: "Seed Paper", desc: "Blend paper pulp with seeds to make plantable seed paper cards." },
      { emoji: "🗂", title: "Paper Mache", desc: "Shred paper for papier-mâché sculptures and decorative bowls." },
      { emoji: "🎁", title: "Gift Wrap", desc: "Reuse newspaper and paper for eco-friendly gift wrapping." },
      { emoji: "🏮", title: "Lanterns", desc: "Roll paper into decorative lanterns for festive events." },
    ]
  },
  "Paper Cup": {
    mainCat: "bio",
    type: "Partially Biodegradable",
    recycling: "Difficult due to plastic lining. Check local facility. Switch to reusable cups instead.",
    impact: "Only ~1% are actually recycled due to wax/plastic coating. 500B cups discarded globally per year.",
    decomp: "20 years",
    harmLevel: 45,
    diy: [
      { emoji: "🌱", title: "Seed Starter", desc: "Use paper cups as seedling starters before transplanting." },
      { emoji: "🖊", title: "Desk Organizer", desc: "Stack and glue cups together to make a pencil holder." },
    ]
  },
  "Cardboard": {
    mainCat: "bio",
    type: "Biodegradable",
    recycling: "Flatten boxes before placing in recycling bins. Keep dry. Highly recyclable.",
    impact: "Eco-friendly when reused. Recycling 1 tonne saves 9 cubic yards of landfill space.",
    decomp: "2 months",
    harmLevel: 12,
    diy: [
      { emoji: "🏠", title: "Toy Castle", desc: "Build a cardboard castle or playhouse for children." },
      { emoji: "📦", title: "Storage Box", desc: "Cut and fold cardboard into custom storage compartments." },
      { emoji: "🎨", title: "Art Canvas", desc: "Use thick cardboard as a painting canvas or collage board." },
      { emoji: "🌿", title: "Weed Barrier", desc: "Lay cardboard under mulch in your garden to suppress weeds." },
    ]
  },
  "Glass": {
    mainCat: "nonbio",
    type: "Non-biodegradable",
    recycling: "Melt and reuse endlessly without quality loss. Sort by color: clear, green, brown.",
    impact: "Does not decompose for up to 1 million years. Recycling saves 30% energy vs new glass production.",
    decomp: "1 million years",
    harmLevel: 55,
    diy: [
      { emoji: "🕯", title: "Candle Holder", desc: "Clean glass jars make beautiful candle holders or vases." },
      { emoji: "💧", title: "Water Bottle", desc: "Reuse glass bottles as stylish, eco-friendly water bottles." },
      { emoji: "🫙", title: "Storage Jars", desc: "Use glass jars for storing spices, grains, or DIY body scrubs." },
      { emoji: "🪴", title: "Terrarium", desc: "Create a mini terrarium with moss and small plants in a glass jar." },
    ]
  },
  "Metal": {
    mainCat: "nonbio",
    type: "Non-biodegradable",
    recycling: "Melt and reuse. Aluminum recycling saves 95% of the energy of new production.",
    impact: "Metal mining causes habitat destruction. Steel is the world's most recycled material globally.",
    decomp: "50–200 years",
    harmLevel: 50,
    diy: [
      { emoji: "🖼", title: "Wall Art", desc: "Flatten and cut metal cans to create decorative wall art pieces." },
      { emoji: "🪴", title: "Planter", desc: "Punch drainage holes in metal cans for a rustic garden planter." },
      { emoji: "🔦", title: "Lantern", desc: "Punch patterns into a metal can for a beautiful night lantern." },
      { emoji: "🥁", title: "Musical Toy", desc: "Metal containers can be used as percussion instruments for kids." },
    ]
  },
  "Plastic": {
    mainCat: "nonbio",
    type: "Non-biodegradable",
    recycling: "Shredding and remolding. Check resin code (1–7) for your local recycling facility.",
    impact: "Creates microplastics entering food chains. Takes 20–450+ years to decompose. 8M tonnes enter oceans annually.",
    decomp: "20–1000 years",
    harmLevel: 80,
    diy: [
      { emoji: "🪴", title: "Bottle Planter", desc: "Cut plastic bottles in half and use as planters for herbs." },
      { emoji: "🏺", title: "Piggy Bank", desc: "Seal a plastic bottle with a coin slot cut on top for saving coins." },
      { emoji: "🛁", title: "Toy Boat", desc: "Plastic bottles can be repurposed into floating toy boats." },
      { emoji: "🧵", title: "Bottle Weaving", desc: "Cut plastic bags into strips for weaving into reusable bags." },
    ]
  },
  "Textile": {
    mainCat: "nonbio",
    type: "Non-biodegradable / Partial",
    recycling: "Fiber recovery. Donate wearable items. Recycle damaged ones through textile banks.",
    impact: "Microplastic pollution from synthetic fibers. Fashion industry is 10% of global CO₂ emissions.",
    decomp: "20–200 years",
    harmLevel: 65,
    diy: [
      { emoji: "🧸", title: "Stuffed Toy", desc: "Use old fabric scraps to sew a stuffed animal or cushion." },
      { emoji: "🛒", title: "Tote Bag", desc: "Cut up old t-shirts and sew into reusable shopping bags." },
      { emoji: "🧹", title: "Cleaning Rags", desc: "Cut worn-out clothes into effective cleaning cloths." },
      { emoji: "🎀", title: "Quilt", desc: "Stitch colorful scraps into a patchwork quilt blanket." },
    ]
  },
  "Medical Waste": {
    mainCat: "hazard",
    type: "Hazardous (Biohazardous)",
    recycling: "Limited controlled recycling only. Use sharps containers and dedicated medical waste bins.",
    impact: "Infection and contamination risk. Can spread pathogens including HIV, hepatitis. Must never mix with household waste.",
    decomp: "N/A — Requires incineration",
    harmLevel: 90,
    diy: [
      { emoji: "🚫", title: "Do Not Reuse", desc: "Medical waste must never be reused. It poses severe infection risks." },
      { emoji: "📦", title: "Sharps Containers", desc: "Always use puncture-resistant sharps containers for needles." },
    ]
  },
  "E-Waste": {
    mainCat: "hazard",
    type: "Hazardous",
    recycling: "Metal extraction via certified e-waste recyclers. Never dump in landfill or general bins.",
    impact: "Toxic chemicals including lead, mercury, cadmium leach into groundwater and soil, lasting decades.",
    decomp: "100–1000+ years",
    harmLevel: 88,
    diy: [
      { emoji: "💻", title: "Donate Working Devices", desc: "Working electronics can be donated to schools or NGOs." },
      { emoji: "🔧", title: "DIY Pi Project", desc: "Old phones can run Raspberry Pi-like projects or smart home tools." },
      { emoji: "🖼", title: "Digital Photo Frame", desc: "Repurpose an old tablet into a digital photo or art display." },
      { emoji: "🔋", title: "Solar Charger", desc: "Old phone batteries can power small solar-charging DIY projects." },
    ]
  },
  "Hazardous Waste": {
    mainCat: "hazard",
    type: "Hazardous (Chemical)",
    recycling: "Special chemical processing centers. Contact your local hazardous waste facility.",
    impact: "Severe long-lasting pollution. Chemicals persist in soil and water for decades, affecting entire ecosystems.",
    decomp: "Indefinitely without treatment",
    harmLevel: 95,
    diy: [
      { emoji: "🚫", title: "Never DIY", desc: "Do not attempt to repurpose hazardous waste. Seek certified disposal." },
      { emoji: "📞", title: "Contact Authorities", desc: "Call local hazardous waste center for guided pickup or drop-off." },
    ]
  }
};

const category_icons = {
  'Food':'🍎','Animal Dead Body':'🐾','Paper':'📰','Paper Cup':'☕',
  'Cardboard':'📦','Glass':'🪟','Metal':'⚙️','Plastic':'🧴',
  'Textile':'👕','Medical Waste':'💊','E-Waste':'💻','Hazardous Waste':'☣️'
};

Object.assign(waste_labels, {
  'A_Foods': { ...waste_labels['Food'], displayName: 'A_Foods', type: 'Food Waste' },
  'B_Animal Dead Body': { ...waste_labels['Animal Dead Body'], displayName: 'B_Animal Dead Body' },
  'C_Cardboard': { ...waste_labels['Cardboard'], displayName: 'C_Cardboard' },
  'D_Newspaper': { ...waste_labels['Paper'], displayName: 'D_Newspaper', type: 'Newspaper' },
  'E_Paper Cups': { ...waste_labels['Paper Cup'], displayName: 'E_Paper Cups' },
  'F_Papers': { ...waste_labels['Paper'], displayName: 'F_Papers' },
  'G_Brown Glass': { ...waste_labels['Glass'], displayName: 'G_Brown Glass', type: 'Brown Glass' },
  'H_Porcelin': { mainCat: 'nonbio', displayName: 'H_Porcelin', type: 'Porcelain / Ceramic', recycling: 'Reuse when possible. Broken porcelain is usually handled as inert construction or landfill waste because it does not melt with container glass.', impact: 'Does not biodegrade and can contaminate glass recycling streams. Sharp fragments can injure handlers if not wrapped safely.', decomp: 'Centuries', harmLevel: 45, diy: [] },
  'I_Green Glass': { ...waste_labels['Glass'], displayName: 'I_Green Glass', type: 'Green Glass' },
  'J_White Glass': { ...waste_labels['Glass'], displayName: 'J_White Glass', type: 'White / Clear Glass' },
  'K_Beverage Cans': { ...waste_labels['Metal'], displayName: 'K_Beverage Cans', type: 'Beverage Cans' },
  'L_Construction Scrap': { mainCat: 'nonbio', displayName: 'L_Construction Scrap', type: 'Construction Scrap', recycling: 'Separate concrete, wood, metal, tiles, and rubble. Send reusable material to construction and demolition waste recyclers.', impact: 'Bulky debris consumes landfill space and can release dust or mixed contaminants when dumped illegally.', decomp: 'Varies by material', harmLevel: 58, diy: [] },
  'M_Metal Containers': { ...waste_labels['Metal'], displayName: 'M_Metal Containers' },
  'N_Plastic Bag': { ...waste_labels['Plastic'], displayName: 'N_Plastic Bag', type: 'Plastic Bag' },
  'O_Plastic Bottle': { ...waste_labels['Plastic'], displayName: 'O_Plastic Bottle', type: 'Plastic Bottle' },
  'Q_Plastic Containers': { ...waste_labels['Plastic'], displayName: 'Q_Plastic Containers' },
  'R_Plastic Cups': { ...waste_labels['Plastic'], displayName: 'R_Plastic Cups' },
  'S_Tetra Pak': { ...waste_labels['Plastic'], displayName: 'S_Tetra Pak', type: 'Tetra Pak / Carton', recycling: 'Send to facilities that accept multilayer cartons. Rinse, dry, and flatten before collection.', impact: 'Multilayer paper, plastic, and foil packaging is difficult to recycle in regular paper or plastic streams.', decomp: 'Up to 5 years or more', harmLevel: 62, diy: [] },
  'T_Clothes': { ...waste_labels['Textile'], displayName: 'T_Clothes' },
  'U_Shoes': { ...waste_labels['Textile'], displayName: 'U_Shoes', type: 'Footwear' },
  'V_Gloves': { ...waste_labels['Medical Waste'], displayName: 'V_Gloves' },
  'W_Masks': { ...waste_labels['Medical Waste'], displayName: 'W_Masks' },
  'X_Bandai': { ...waste_labels['Medical Waste'], displayName: 'X_Bandai', type: 'Bandage / Dressing' },
  'Y_Medicine and Medicine Strip': { ...waste_labels['Medical Waste'], displayName: 'Y_Medicine and Medicine Strip' },
  'Z_A_A_Syringe': { ...waste_labels['Medical Waste'], displayName: 'Z_A_A_Syringe', type: 'Syringe / Sharps' },
  'Z_A_Diaper': { ...waste_labels['Medical Waste'], displayName: 'Z_A_Diaper', type: 'Diaper / Sanitary Waste' },
  'Z_B_Electrical Cables': { ...waste_labels['E-Waste'], displayName: 'Z_B_Electrical Cables' },
  'Z_C_Electronic Chips': { ...waste_labels['E-Waste'], displayName: 'Z_C_Electronic Chips' },
  'Z_D_Laptops': { ...waste_labels['E-Waste'], displayName: 'Z_D_Laptops' },
  'Z_E_Small Appliances': { ...waste_labels['E-Waste'], displayName: 'Z_E_Small Appliances' },
  'Z_F_Smartphones': { ...waste_labels['E-Waste'], displayName: 'Z_F_Smartphones' },
  'Z_G_Battery': { ...waste_labels['E-Waste'], displayName: 'Z_G_Battery', type: 'Battery' },
  'Z_H_Thermometer': { ...waste_labels['Hazardous Waste'], displayName: 'Z_H_Thermometer', type: 'Thermometer' },
  'Z_I_Cigarette Butt': { ...waste_labels['Hazardous Waste'], displayName: 'Z_I_Cigarette Butt', type: 'Cigarette Butt' },
  'Z_J_Pesticidebottle': { ...waste_labels['Hazardous Waste'], displayName: 'Z_J_Pesticidebottle', type: 'Pesticide Bottle' },
  'Z_K_Spray cans': { ...waste_labels['Hazardous Waste'], displayName: 'Z_K_Spray cans', type: 'Spray Cans' }
});

const mainCatConfig = {
  bio:    { label: 'Biodegradable',     color: 'var(--green)',  bg: 'var(--green-d)',  emoji: '🌿' },
  nonbio: { label: 'Non-Biodegradable', color: 'var(--amber)',  bg: 'var(--amber-d)',  emoji: '🔩' },
  hazard: { label: 'Hazardous',         color: 'var(--red)',    bg: 'var(--red-d)',    emoji: '☣️' }
};

function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3200);
}

// ── THEME TOGGLE ─────────────────────────────────────────────
const themeToggle = document.getElementById('themeToggle');
if (localStorage.getItem('wv-theme') === 'light') {
  document.documentElement.classList.add('light');
  if (themeToggle) themeToggle.textContent = '☀️';
}
themeToggle?.addEventListener('click', () => {
  const isLight = document.documentElement.classList.toggle('light');
  themeToggle.textContent = isLight ? '☀️' : '🌙';
  localStorage.setItem('wv-theme', isLight ? 'light' : 'dark');
});

// ── NAVIGATION ────────────────────────────────────────────────
function navigate(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const target = document.getElementById('page-' + page);
  if (target) { target.classList.add('active'); window.scrollTo({ top: 0, behavior: 'smooth' }); }
  document.querySelectorAll(`.nav-link[data-page="${page}"]`).forEach(l => l.classList.add('active'));
  document.getElementById('navMobile')?.classList.remove('open');

  if (page === 'waste-guide') renderWasteGuide();
}

document.addEventListener('click', e => {
  const page = e.target.closest('[data-page]')?.dataset.page;
  if (page) navigate(page);
});

document.getElementById('navHamburger')?.addEventListener('click', () => {
  document.getElementById('navMobile')?.classList.toggle('open');
});

// ── HOMEPAGE SCAN DEMO ────────────────────────────────────────
const scanDemoItems = [
  { imgUrl:'https://images.unsplash.com/photo-1602556648780-24e596f25135?w=600&q=80', rawLabel:'O_Plastic Bottle', category:'O_Plastic Bottle', confidence:94.7, subLabel:'Plastic Bottle', icon:'🧴', logLines:[
    {t:400,cls:'info',text:'→ Image loaded: 600×400px'},
    {t:900,cls:'dim', text:'  normalizing & preprocessing...'},
    {t:1400,cls:'dim',text:'  EfficientNet forward pass...'},
    {t:2000,cls:'ok', text:'✓ class: O_Plastic Bottle'},
    {t:2300,cls:'ok', text:'✓ confidence: 94.7%'},
    {t:2600,cls:'warn',text:'⚠ Non-biodegradable · High risk'},
  ]},
  { imgUrl:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', rawLabel:'J_White Glass', category:'J_White Glass', confidence:91.3, subLabel:'White Glass Bottle', icon:'🪟', logLines:[
    {t:400,cls:'info',text:'→ Image loaded: 600×400px'},
    {t:900,cls:'dim', text:'  normalizing & preprocessing...'},
    {t:1400,cls:'dim',text:'  EfficientNet forward pass...'},
    {t:2000,cls:'ok', text:'✓ class: J_White Glass'},
    {t:2300,cls:'ok', text:'✓ confidence: 91.3%'},
    {t:2600,cls:'info',text:'♻ Recyclable · 30% energy saved'},
  ]},
  { imgUrl:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80', rawLabel:'Z_F_Smartphones', category:'Z_F_Smartphones', confidence:96.2, subLabel:'Smartphone (E-Waste)', icon:'💻', logLines:[
    {t:400,cls:'info',text:'→ Image loaded: 600×400px'},
    {t:900,cls:'dim', text:'  normalizing & preprocessing...'},
    {t:1400,cls:'dim',text:'  EfficientNet forward pass...'},
    {t:2000,cls:'ok', text:'✓ class: Z_F_Smartphones'},
    {t:2300,cls:'ok', text:'✓ confidence: 96.2%'},
    {t:2600,cls:'warn',text:'⚠ Hazardous · Certified recycler only'},
  ]},
  { imgUrl:'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80', rawLabel:'C_Cardboard', category:'C_Cardboard', confidence:88.9, subLabel:'Corrugated Cardboard', icon:'📦', logLines:[
    {t:400,cls:'info',text:'→ Image loaded: 600×400px'},
    {t:900,cls:'dim', text:'  normalizing & preprocessing...'},
    {t:1400,cls:'dim',text:'  EfficientNet forward pass...'},
    {t:2000,cls:'ok', text:'✓ class: C_Cardboard'},
    {t:2300,cls:'ok', text:'✓ confidence: 88.9%'},
    {t:2600,cls:'info',text:'♻ Biodegradable · Flatten & recycle'},
  ]},
];

let scanIdx = 0, scanRunning = false, scanTmt = null;

function runScanDemo(item) {
  scanRunning = true;
  const scImg = document.getElementById('scImg');
  const scPlaceholder = document.getElementById('scPlaceholder');
  const scLine = document.getElementById('scLine');
  const scLiveLabel = document.getElementById('scLiveLabel');
  const scStatus = document.getElementById('scStatus');
  const scOutput = document.getElementById('scOutput');
  const srIcon = document.getElementById('srIcon');
  const srCat = document.getElementById('srCat');
  const srSub = document.getElementById('srSub');
  const srPct = document.getElementById('srPct');

  scStatus.textContent = '● SCANNING';
  scStatus.style.color = 'var(--amber)';

  scImg.classList.add('hidden');
  scPlaceholder?.classList.remove('hidden');
  scLine.classList.remove('active');
  scLiveLabel.textContent = '';
  scLiveLabel.classList.remove('visible');
  srCat.textContent = '—'; srSub.textContent = '—'; srPct.textContent = '—';
  scOutput.innerHTML = '<div class="so-line dim">// WasteVision v3.0</div><div class="so-line dim">// Loading image…</div>';

  scanTmt = setTimeout(() => {
    if (!scImg) return;
    scImg.src = item.imgUrl;
    scImg.onload = () => {
      scImg.classList.remove('hidden');
      scPlaceholder?.classList.add('hidden');
      scLine.classList.add('active');
    };
  }, 300);

  item.logLines.forEach(line => {
    scanTmt = setTimeout(() => {
      const div = document.createElement('div');
      div.className = 'so-line ' + line.cls;
      div.textContent = line.text;
      scOutput.appendChild(div);
      scOutput.scrollTop = scOutput.scrollHeight;
    }, line.t);
  });

  scanTmt = setTimeout(() => {
    scLiveLabel.textContent = item.subLabel.toUpperCase();
    scLiveLabel.classList.add('visible');
  }, 2100);

  scanTmt = setTimeout(() => {
    scLine.classList.remove('active');
    srIcon.textContent = item.icon;
    srCat.textContent = item.category;
    srSub.textContent = item.subLabel;
    srPct.textContent = item.confidence + '%';
    scStatus.textContent = '● DONE';
    scStatus.style.color = 'var(--teal)';
    scanRunning = false;
    scanIdx = (scanIdx + 1) % scanDemoItems.length;
    scanTmt = setTimeout(() => runScanDemo(scanDemoItems[scanIdx]), 4500);
  }, 3200);
}

function startScanDemo() {
  runScanDemo(scanDemoItems[scanIdx]);
}

setTimeout(startScanDemo, 800);

// ── CLASSIFY PAGE ─────────────────────────────────────────────
const uploadZone = document.getElementById('uploadZone');
const previewContainer = document.getElementById('previewContainer');
const previewImage = document.getElementById('previewImage');
const fileInput = document.getElementById('fileInput');
const changeFileInput = document.getElementById('changeFileInput');
const classifyBtn = document.getElementById('classifyBtn');
const resultSection = document.getElementById('resultSection');
const resultPlaceholder = document.getElementById('resultPlaceholder');
const confidenceBar = document.getElementById('confidenceBar');
const resultOriginal = document.getElementById('resultOriginal');
const resultCategory = document.getElementById('resultCategory');
const resultConfidence = document.getElementById('resultConfidence');
const resultCatIcon = document.getElementById('resultCatIcon');

let selectedFile = null;

function handleFile(file) {
  if (!file || !file.type.startsWith('image/')) return;
  selectedFile = file;
  previewImage.src = URL.createObjectURL(file);
  uploadZone.classList.add('hidden');
  previewContainer.classList.remove('hidden');
  classifyBtn.classList.remove('hidden');
  resultSection.classList.add('hidden');
  resultPlaceholder.classList.remove('hidden');
}

fileInput?.addEventListener('change', e => handleFile(e.target.files[0]));
changeFileInput?.addEventListener('change', e => handleFile(e.target.files[0]));

uploadZone?.addEventListener('dragover', e => { e.preventDefault(); uploadZone.classList.add('dragging'); });
uploadZone?.addEventListener('dragleave', () => uploadZone.classList.remove('dragging'));
uploadZone?.addEventListener('drop', e => {
  e.preventDefault(); uploadZone.classList.remove('dragging');
  const file = e.dataTransfer.files[0]; if (file) handleFile(file);
});

// ── TAB SWITCHING ─────────────────────────────────────────────
document.addEventListener('click', e => {
  const tab = e.target.closest('.rp-tab');
  if (!tab) return;
  const tabName = tab.dataset.tab;
  document.querySelectorAll('.rp-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.rp-tab-body').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  document.getElementById('tab-' + tabName)?.classList.add('active');
});

// ── DISPLAY RESULT ────────────────────────────────────────────
function displayResult(mainCategory, confidence) {
  const info = waste_labels[mainCategory] || {
    mainCat: 'nonbio', type: 'Unknown',
    recycling: 'No data available.', impact: 'No data available.',
    decomp: 'Unknown', harmLevel: 50, diy: []
  };
  const displayName = info.displayName || mainCategory;

  const icon = category_icons[mainCategory] || '♻️';
  const catCfg = mainCatConfig[info.mainCat] || mainCatConfig.nonbio;

  // Header
  resultCatIcon.textContent = icon;
  resultCategory.textContent = displayName;
  resultConfidence.textContent = confidence + '%';

  confidenceBar.style.width = '0%';
  requestAnimationFrame(() => setTimeout(() => { confidenceBar.style.width = confidence + '%'; }, 100));

  // Main category badge
  const badgeEl = document.getElementById('rpMainCatBadge');
  if (badgeEl) {
    badgeEl.innerHTML = `<span style="display:inline-flex;align-items:center;gap:6px;background:${catCfg.bg};color:${catCfg.color};border:1px solid ${catCfg.color}33;border-radius:100px;padding:4px 12px;font-size:.72rem;font-weight:700;">${catCfg.emoji} ${catCfg.label}</span>`;
  }

  // Impact tab
  const impactEl = document.getElementById('impactContent');
  if (impactEl) {
    const harmColor = info.harmLevel > 70 ? 'var(--red)' : info.harmLevel > 40 ? 'var(--amber)' : 'var(--green)';
    impactEl.innerHTML = `
      <div class="impact-item">
        <span class="ii-icon">🌍</span>
        <div><strong>Environmental Impact</strong><br>${info.impact}</div>
      </div>
      <div class="impact-item">
        <span class="ii-icon">⏳</span>
        <div><strong>Decomposition Time</strong><br>${info.decomp}</div>
      </div>
      <div class="impact-item" style="background:${harmColor}18;border-color:${harmColor}33;">
        <span class="ii-icon">📊</span>
        <div style="flex:1;">
          <strong style="color:${harmColor};">Harm Level: ${info.harmLevel}%</strong>
          <div style="margin-top:8px;height:6px;background:rgba(255,255,255,.06);border-radius:3px;overflow:hidden;">
            <div style="height:100%;width:${info.harmLevel}%;background:${harmColor};border-radius:3px;transition:width 1s ease;"></div>
          </div>
        </div>
      </div>
    `;
  }

  // Disposal tab
  const disposalEl = document.getElementById('disposalContent');
  if (disposalEl) {
    disposalEl.innerHTML = `
      <div class="disposal-item">
        <span class="ii-icon">♻️</span>
        <div><strong>Recycling Method</strong><br>${info.recycling}</div>
      </div>
      <div class="disposal-item">
        <span class="ii-icon">📂</span>
        <div><strong>Waste Category</strong><br>${info.type}</div>
      </div>
      <div class="disposal-item">
        <span class="ii-icon">${catCfg.emoji}</span>
        <div><strong>Classification</strong><br>${catCfg.label} — ${
          info.mainCat === 'bio' ? 'Compostable, decomposes naturally in the environment.' :
          info.mainCat === 'nonbio' ? 'Does not decompose. Must be recycled or repurposed.' :
          'Toxic material. Requires certified disposal facility.'
        }</div>
      </div>
    `;
  }

  // DIY tab
  const diyEl = document.getElementById('diyContent');
  if (diyEl) {
    if (info.diy && info.diy.length) {
      diyEl.innerHTML = `<div class="diy-grid">` +
        info.diy.map(d => `
          <div class="diy-card">
            <div class="diy-emoji">${d.emoji}</div>
            <strong>${d.title}</strong>
            ${d.desc}
          </div>`).join('') +
      `</div>`;
    } else {
      diyEl.innerHTML = `<div class="disposal-item"><span class="ii-icon">💡</span><div>No DIY ideas available for this item. Prioritize safe disposal.</div></div>`;
    }
  }
  showToast(`Classified as ${displayName}`);

  resultPlaceholder.classList.add('hidden');
  resultSection.classList.remove('hidden');
  // Reset to impact tab
  document.querySelectorAll('.rp-tab').forEach(t => t.classList.remove('active'));
  document.querySelectorAll('.rp-tab-body').forEach(t => t.classList.remove('active'));
  document.querySelector('.rp-tab[data-tab="impact"]')?.classList.add('active');
  document.getElementById('tab-impact')?.classList.add('active');
}

// ── CLASSIFY ──────────────────────────────────────────────────
async function classifyImage() {
  if (!selectedFile) { alert('Please select an image first'); return; }
  classifyBtn.disabled = true;
  classifyBtn.innerHTML = '<div class="spinner"></div> Classifying…';

  const formData = new FormData();
  formData.append('file', selectedFile);

  try {
    const response = await fetch(API_URL, { method: 'POST', body: formData });
    if (!response.ok) throw new Error('API error: ' + response.status);
    const data = await response.json();
    if (!data.prediction || !data.gradcam) throw new Error('Invalid API response');

    resultOriginal.src = URL.createObjectURL(selectedFile);
    document.getElementById('gradcamImg').src = 'data:image/jpeg;base64,' + data.gradcam;

    const rawLabel = data.prediction;
    displayResult(rawLabel, data.confidence);

  } catch (error) {
    console.error('Classification error:', error);
    if (error.message.includes('fetch') || error.message.includes('API error')) {
      showToast('⚡ API offline — showing demo result');
      runDemo(); return;
    }
    alert('Error: ' + error.message);
  }

  classifyBtn.disabled = false;
  classifyBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" width="16" height="16"><circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/><path d="m21 21-4.35-4.35" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg> Classify Waste`;
}

function runDemo() {
  const demos = [
    { category:'O_Plastic Bottle',   confidence:94.7, imgUrl:'https://images.unsplash.com/photo-1602556648780-24e596f25135?w=600&q=80' },
    { category:'J_White Glass',     confidence:91.3, imgUrl:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80' },
    { category:'C_Cardboard', confidence:88.9, imgUrl:'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80' },
    { category:'Z_F_Smartphones',   confidence:96.2, imgUrl:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=600&q=80' },
    { category:'A_Foods',      confidence:87.1, imgUrl:'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80' },
  ];
  const demo = demos[Math.floor(Math.random() * demos.length)];
  resultOriginal.src = demo.imgUrl;
  document.getElementById('gradcamImg').src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/GradCAM_example.png/640px-GradCAM_example.png';
  previewImage.src = demo.imgUrl;
  uploadZone.classList.add('hidden');
  previewContainer.classList.remove('hidden');
  classifyBtn.classList.remove('hidden');
  displayResult(demo.category, demo.confidence);
}

classifyBtn?.addEventListener('click', classifyImage);
document.getElementById('demoBtn')?.addEventListener('click', runDemo);

// ── WASTE GUIDE ───────────────────────────────────────────────
const WASTE_GUIDE_DATA = [
  { key:'A_Foods', cat:'bio', emoji:'', color:'var(--green)', bg:'var(--green-d)' },
  { key:'B_Animal Dead Body', cat:'bio', emoji:'', color:'var(--teal)', bg:'var(--teal-d)' },
  { key:'C_Cardboard', cat:'bio', emoji:'', color:'var(--teal)', bg:'var(--teal-d)' },
  { key:'D_Newspaper', cat:'bio', emoji:'', color:'var(--green)', bg:'var(--green-d)' },
  { key:'E_Paper Cups', cat:'bio', emoji:'', color:'var(--teal)', bg:'var(--teal-d)' },
  { key:'F_Papers', cat:'bio', emoji:'', color:'var(--green)', bg:'var(--green-d)' },
  { key:'G_Brown Glass', cat:'nonbio', emoji:'', color:'var(--blue)', bg:'var(--blue-d)' },
  { key:'H_Porcelin', cat:'nonbio', emoji:'', color:'var(--blue)', bg:'var(--blue-d)' },
  { key:'I_Green Glass', cat:'nonbio', emoji:'', color:'var(--blue)', bg:'var(--blue-d)' },
  { key:'J_White Glass', cat:'nonbio', emoji:'', color:'var(--blue)', bg:'var(--blue-d)' },
  { key:'K_Beverage Cans', cat:'nonbio', emoji:'', color:'var(--blue)', bg:'var(--blue-d)' },
  { key:'L_Construction Scrap', cat:'nonbio', emoji:'', color:'var(--amber)', bg:'var(--amber-d)' },
  { key:'M_Metal Containers', cat:'nonbio', emoji:'', color:'var(--blue)', bg:'var(--blue-d)' },
  { key:'N_Plastic Bag', cat:'nonbio', emoji:'', color:'var(--amber)', bg:'var(--amber-d)' },
  { key:'O_Plastic Bottle', cat:'nonbio', emoji:'', color:'var(--amber)', bg:'var(--amber-d)' },
  { key:'Q_Plastic Containers', cat:'nonbio', emoji:'', color:'var(--amber)', bg:'var(--amber-d)' },
  { key:'R_Plastic Cups', cat:'nonbio', emoji:'', color:'var(--amber)', bg:'var(--amber-d)' },
  { key:'S_Tetra Pak', cat:'nonbio', emoji:'', color:'var(--amber)', bg:'var(--amber-d)' },
  { key:'T_Clothes', cat:'nonbio', emoji:'', color:'var(--purple)', bg:'var(--purple-d)' },
  { key:'U_Shoes', cat:'nonbio', emoji:'', color:'var(--purple)', bg:'var(--purple-d)' },
  { key:'V_Gloves', cat:'hazard', emoji:'', color:'var(--red)', bg:'var(--red-d)' },
  { key:'W_Masks', cat:'hazard', emoji:'', color:'var(--red)', bg:'var(--red-d)' },
  { key:'X_Bandai', cat:'hazard', emoji:'', color:'var(--red)', bg:'var(--red-d)' },
  { key:'Y_Medicine and Medicine Strip', cat:'hazard', emoji:'', color:'var(--red)', bg:'var(--red-d)' },
  { key:'Z_A_A_Syringe', cat:'hazard', emoji:'', color:'var(--red)', bg:'var(--red-d)' },
  { key:'Z_A_Diaper', cat:'hazard', emoji:'', color:'var(--red)', bg:'var(--red-d)' },
  { key:'Z_B_Electrical Cables', cat:'hazard', emoji:'', color:'var(--orange)', bg:'var(--orange-d)' },
  { key:'Z_C_Electronic Chips', cat:'hazard', emoji:'', color:'var(--orange)', bg:'var(--orange-d)' },
  { key:'Z_D_Laptops', cat:'hazard', emoji:'', color:'var(--orange)', bg:'var(--orange-d)' },
  { key:'Z_E_Small Appliances', cat:'hazard', emoji:'', color:'var(--orange)', bg:'var(--orange-d)' },
  { key:'Z_F_Smartphones', cat:'hazard', emoji:'', color:'var(--orange)', bg:'var(--orange-d)' },
  { key:'Z_G_Battery', cat:'hazard', emoji:'', color:'var(--red)', bg:'var(--red-d)' },
  { key:'Z_H_Thermometer', cat:'hazard', emoji:'', color:'var(--red)', bg:'var(--red-d)' },
  { key:'Z_I_Cigarette Butt', cat:'hazard', emoji:'', color:'var(--red)', bg:'var(--red-d)' },
  { key:'Z_J_Pesticidebottle', cat:'hazard', emoji:'', color:'var(--red)', bg:'var(--red-d)' },
  { key:'Z_K_Spray cans', cat:'hazard', emoji:'', color:'var(--red)', bg:'var(--red-d)' },
];

let wgFilter = 'all';

function renderWasteGuide() {
  const grid = document.getElementById('wgGrid');
  if (!grid) return;
  const filtered = wgFilter === 'all' ? WASTE_GUIDE_DATA : WASTE_GUIDE_DATA.filter(w => w.cat === wgFilter);

  grid.innerHTML = filtered.map(w => {
    const info = waste_labels[w.key];
    if (!info) return '';
    const catCfg = mainCatConfig[w.cat];
    const harmColor = info.harmLevel > 70 ? 'var(--red)' : info.harmLevel > 40 ? 'var(--amber)' : 'var(--green)';
    const harmLabel = info.harmLevel > 70 ? 'High' : info.harmLevel > 40 ? 'Medium' : 'Low';
    return `
      <div class="wg-card" data-cat="${w.cat}">
        <div class="wg-card-header">
          <div class="wg-card-emoji" style="background:${w.bg};">${w.emoji || category_icons[w.key] || '♻'}</div>
          <div class="wg-card-title">
            <div class="wg-card-name">${info.displayName || w.key}</div>
            <div class="wg-card-type">${info.type}</div>
          </div>
          <span class="wg-harm-badge" style="background:${harmColor}18;color:${harmColor};border:1px solid ${harmColor}30;">
            ${harmLabel} Risk
          </span>
        </div>
        <div class="wg-card-body">
          <div class="wg-section-lbl">☠️ Harmful Effects</div>
          <div class="wg-text">${info.impact}</div>

          <div class="wg-section-lbl">♻️ Recycling & Disposal</div>
          <div class="wg-text">${info.recycling}</div>

          <div class="wg-section-lbl">🔧 Creative Reuse Ideas</div>
          <ul class="wg-reuse-list">
            ${(info.diy || []).slice(0,3).map(d => `<li>${d.emoji} <strong>${d.title}:</strong> ${d.desc}</li>`).join('')}
          </ul>

          <div class="decomp-chip">⏳ Decomposes in: <strong style="margin-left:4px;">${info.decomp}</strong></div>
          <div class="decomp-chip" style="margin-left:6px;background:${catCfg.bg};border-color:${catCfg.color}30;color:${catCfg.color};">${catCfg.emoji} ${catCfg.label}</div>
        </div>
      </div>
    `;
  }).join('');
}

document.addEventListener('click', e => {
  const btn = e.target.closest('.wg-filter');
  if (!btn) return;
  document.querySelectorAll('.wg-filter').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  wgFilter = btn.dataset.filter;
  renderWasteGuide();
});
// ── INIT ──────────────────────────────────────────────────────
