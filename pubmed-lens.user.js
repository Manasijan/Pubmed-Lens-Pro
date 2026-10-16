// ==UserScript==
// @name         PubMed-Lens Pro: Clinical Evidence & Dual-Pane Appraisal Engine
// @namespace    https://github.com/Manasijan/PubMed-Lens
// @version      2.1.0
// @description  Exact V9.6 full-width side-by-side layout with contained year slider and modern pill-chip filter dashboard.
// @author       Manasijan
// @match        https://pubmed.ncbi.nlm.nih.gov/*
// @grant        GM_addStyle
// @run-at       document-idle
// ==/UserScript==

(function() {
  'use strict';

  console.log("⚡ PubMed-Lens Pro 2.1 (V9.6 Layout Engine + Contained Slider) Active...");

  // 1. Exact V9.6 Layout Rules + Sidebar Slider Containment + Modern Dashboard UI
  const styleText = `
    /* EXACT V9.6 PAGE WIDTH & SIDE-BY-SIDE ALIGNMENT */
    .inner-wrap, main.search-results-page, #article-page, .search-page {
      max-width: 98vw !important;
      width: 98vw !important;
      margin: 0 auto !important;
    }

    .search-results-page > .inner-wrap,
    main > .inner-wrap {
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: nowrap !important;
      align-items: flex-start !important;
      justify-content: space-between !important;
      gap: 20px !important;
    }

    /* Lock Left Sidebar to 220px and clip any overflowing SVG bars */
    aside.search-sidebar, .search-sidebar, #search-sidebar {
      flex: 0 0 220px !important;
      width: 220px !important;
      max-width: 220px !important;
      margin: 0 !important;
      position: relative !important;
      overflow: hidden !important;
    }

    /* Prevent the .inner-wrap rule above from stretching the Year Slider inside the sidebar */
    aside.search-sidebar .inner-wrap,
    .search-sidebar .inner-wrap,
    #search-sidebar .inner-wrap,
    .results-by-year,
    .results-by-year .inner-wrap,
    .timeline-filter,
    .timeline-filter .inner-wrap {
      width: 100% !important;
      max-width: 210px !important;
      min-width: 0 !important;
      overflow: hidden !important;
    }

    aside.search-sidebar svg,
    .results-by-year svg,
    .timeline-filter svg {
      max-width: 205px !important;
      width: 100% !important;
    }

    /* EXACT V9.6 SEARCH RESULTS COLUMN WIDTH */
    #search-results, .search-results {
      flex: 1 1 calc(100% - 250px) !important;
      width: calc(100% - 250px) !important;
      max-width: calc(100% - 250px) !important;
      margin-top: 0 !important;
      padding-top: 0 !important;
    }

    .search-results-chunk, .search-results-chunks {
      max-width: 100% !important;
      width: 100% !important;
    }

    /* Dual-Pane Article Row: Left (Article Details) + Right (PICO Box) */
    article.full-docsum {
      display: flex !important;
      flex-direction: row !important;
      flex-wrap: nowrap !important;
      justify-content: space-between !important;
      align-items: flex-start !important;
      gap: 18px !important;
      width: 100% !important;
      max-width: 100% !important;
      margin-bottom: 14px !important;
      padding-bottom: 14px !important;
      border-bottom: 1px solid #e2e8f0 !important;
      box-sizing: border-box !important;
    }

    article.full-docsum > .docsum-wrap {
      flex: 1 1 56% !important;
      max-width: 56% !important;
      min-width: 0 !important;
      box-sizing: border-box !important;
    }

    /* Zero-Gap Hiding when filtered out */
    article.full-docsum.lens-hidden {
      display: none !important;
      height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
    }

    /* Right-Side PICO Appraisal Card */
    .lens-flank-card {
      flex: 0 0 42% !important;
      width: 42% !important;
      max-width: 42% !important;
      min-width: 320px !important;
      background: #f8fafc !important;
      border: 1px solid #cbd5e1 !important;
      border-left: 4px solid #0284c7 !important;
      border-radius: 8px !important;
      padding: 10px 14px !important;
      box-sizing: border-box !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      font-size: 11.5px !important;
      line-height: 1.45 !important;
      color: #334155 !important;
      display: flex !important;
      flex-direction: column !important;
      box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03) !important;
    }

    /* Modern Dashboard Toolbar */
    #lens-toolbar {
      background: #ffffff !important;
      border: 1px solid #cbd5e1 !important;
      border-top: 3px solid #2563eb !important;
      border-radius: 10px !important;
      box-shadow: 0 4px 12px rgba(15, 23, 42, 0.05) !important;
      margin-bottom: 18px !important;
      overflow: hidden !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      color: #1e293b !important;
    }

    /* Interactive Filter Pill Chips */
    .lens-chip {
      display: inline-flex !important;
      align-items: center !important;
      gap: 5px !important;
      padding: 4px 10px !important;
      border-radius: 999px !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      cursor: pointer !important;
      user-select: none !important;
      transition: all 0.15s ease !important;
      border: 1px solid #cbd5e1 !important;
      background: #f8fafc !important;
      color: #64748b !important;
      margin: 0 !important;
    }

    .lens-chip:hover {
      border-color: #94a3b8 !important;
      background: #f1f5f9 !important;
    }

    .lens-chip:has(input:checked) {
      background: #eff6ff !important;
      border-color: #93c5fd !important;
      color: #1d4ed8 !important;
      box-shadow: 0 1px 2px rgba(37, 99, 235, 0.08) !important;
    }

    .lens-chip input[type="checkbox"] {
      appearance: checkbox !important;
      -webkit-appearance: checkbox !important;
      opacity: 1 !important;
      position: static !important;
      width: 12px !important;
      height: 12px !important;
      margin: 0 !important;
      cursor: pointer !important;
      accent-color: #2563eb !important;
    }

    /* Sort Buttons */
    .lens-sort-btn {
      background: #f8fafc !important;
      color: #334155 !important;
      border: 1px solid #cbd5e1 !important;
      padding: 4px 10px !important;
      border-radius: 6px !important;
      cursor: pointer !important;
      font-size: 11px !important;
      font-weight: 600 !important;
      transition: all 0.15s ease !important;
    }

    .lens-sort-btn:hover {
      background: #eff6ff !important;
      color: #1d4ed8 !important;
      border-color: #93c5fd !important;
    }

    /* Clean Select Boxes */
    .lens-select {
      padding: 4px 28px 4px 10px !important;
      border: 1px solid #cbd5e1 !important;
      border-radius: 6px !important;
      font-size: 11.5px !important;
      font-weight: 600 !important;
      color: #1e293b !important;
      background-color: #ffffff !important;
      background-position: right 8px center !important;
      width: auto !important;
      min-width: 140px !important;
      height: 28px !important;
      line-height: 1.2 !important;
      cursor: pointer !important;
      margin: 0 !important;
    }

    .lens-select-sm {
      padding: 4px 24px 4px 8px !important;
      min-width: 85px !important;
    }

    .lens-flank-outcome-scroll::-webkit-scrollbar {
      width: 4px;
    }
    .lens-flank-outcome-scroll::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 2px;
    }
  `;

  if (typeof GM_addStyle !== 'undefined') {
    GM_addStyle(styleText);
  } else {
    const s = document.createElement('style');
    s.innerHTML = styleText;
    document.head.appendChild(s);
  }

  // Trigger a resize event so PubMed's year-slider SVG recalculates inside the 220px sidebar
  setTimeout(() => window.dispatchEvent(new Event('resize')), 100);

  // 2. Journal Metrics Knowledge Base
  const JOURNAL_DB = {
    "am fam physician": { if: "3.6", q: "Q1", cas: "Tier 2" },
    "int j nurs stud": { if: "7.8", q: "Q1", cas: "Tier 1" },
    "curr opin obstet gynecol": { if: "2.1", q: "Q2", cas: "Tier 3" },
    "int j colorectal dis": { if: "2.8", q: "Q2", cas: "Tier 3" },
    "ann surg": { if: "8.1", q: "Q1", cas: "Tier 1" },
    "bjs": { if: "8.9", q: "Q1", cas: "Tier 1" },
    "lancet": { if: "98.4", q: "Q1", cas: "Tier 1" },
    "n engl j med": { if: "96.2", q: "Q1", cas: "Tier 1" },
    "jama": { if: "63.1", q: "Q1", cas: "Tier 1" },
    "bmj": { if: "93.6", q: "Q1", cas: "Tier 1" },
    "colorectal dis": { if: "2.9", q: "Q2", cas: "Tier 3" },
    "dis colon rectum": { if: "4.3", q: "Q1", cas: "Tier 2" },
    "world j surg": { if: "2.4", q: "Q2", cas: "Tier 3" },
    "surg endosc": { if: "3.2", q: "Q1", cas: "Tier 2" },
    "front oncol": { if: "3.5", q: "Q2", cas: "Tier 3" },
    "cureus": { if: "1.2", q: "Q3", cas: "Tier 4" },
    "plos one": { if: "2.9", q: "Q2", cas: "Tier 3" },
    "scientific reports": { if: "3.8", q: "Q1", cas: "Tier 2" }
  };

  const pmidRegistry = new Map();

  // 3. Clinical N-Extractor
  const parseClinicalN = (text, fullTitle) => {
    const combined = (fullTitle + " " + text);
    let m = combined.match(/\b(?:n\s*=\s*|sample\s+(?:size\s+)?(?:of\s+)?|total\s+of\s+|enrolled\s+|cohort\s+of\s+)(\d{1,6})\b/i);
    if (m) return m[1];

    m = combined.match(/\b(\d{1,6})\s+(?:patients|participants|women|men|subjects|cases|individuals|neonates|infants|cadavers)\b/i);
    if (m) return m[1];

    m = combined.match(/\b(\d{1,4})\s+(?:studies|trials|articles|RCTs|publications)\s+(?:were\s+included|identified|analyzed|reviewed)\b/i);
    if (m) return `${m[1]} studies`;

    const words = {
      one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
      eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16, seventeen: 17,
      eighteen: 18, nineteen: 19, twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60,
      seventy: 70, eighty: 80, ninety: 90
    };
    const wordRegex = new RegExp(`\\b(${Object.keys(words).join('|')})(?:[- ](${Object.keys(words).join('|')}))?\\s+(?:patients|cases|women|men|participants|subjects)\\b`, 'i');
    m = combined.match(wordRegex);
    if (m) {
      let val = words[m[1].toLowerCase()] || 0;
      if (m[2] && words[m[2].toLowerCase()]) val += words[m[2].toLowerCase()];
      return String(val);
    }

    if (/\b(?:a|an|one)\s+\d{1,2}-year-old\s+(?:female|male|boy|girl|woman|man|patient)\b/i.test(combined) || /\bcase\s+report\b/i.test(combined)) {
      return "1 (Case Report)";
    }
    m = combined.match(/\bseries\s+of\s+(\d{1,4})\s+cases\b/i);
    if (m) return m[1];

    return "Not stated in abstract";
  };

  // 4. Filter Application
  const applyFilters = () => {
    const selectedLevels = Array.from(document.querySelectorAll('.lens-lvl-chk:checked')).map(el => el.value);
    const selectedQs = Array.from(document.querySelectorAll('.lens-q-chk:checked')).map(el => el.value);
    const selectedCas = Array.from(document.querySelectorAll('.lens-cas-chk:checked')).map(el => el.value);
    const minCite = parseInt(document.querySelector('#lens-min-cite')?.value, 10) || 0;
    const minRcr = parseFloat(document.querySelector('#lens-min-rcr')?.value) || 0;
    const oaOnly = document.querySelector('#lens-oa-filter')?.checked || false;

    let visibleCount = 0;
    pmidRegistry.forEach(item => {
      const matchLevel = selectedLevels.includes(String(item.level));
      const matchQ = selectedQs.includes(item.q);
      const matchCas = selectedCas.length === 0 || selectedCas.includes(item.cas);
      const matchCite = item.citations >= minCite;
      const matchRcr = item.rcr >= minRcr;
      const matchOA = !oaOnly || item.isFree;

      const isMatch = matchLevel && matchQ && matchCas && matchCite && matchRcr && matchOA;
      item.card.classList.toggle('lens-hidden', !isMatch);

      if (isMatch) visibleCount++;
    });

    const counter = document.querySelector('#lens-match-count');
    if (counter) counter.textContent = `${visibleCount} / ${pmidRegistry.size} visible`;
  };

  // 5. Sister Trials Modal
  const initModal = () => {
    if (document.querySelector('#lens-sister-modal')) return;
    const modal = document.createElement('div');
    modal.id = 'lens-sister-modal';
    modal.style = `
      display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 650px; max-width: 90vw; max-height: 80vh; background: #ffffff; border-radius: 12px;
      box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.25); z-index: 99999; padding: 20px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1e293b; overflow-y: auto;
    `;
    modal.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px;">
        <h3 style="margin: 0; font-size: 15px; color: #0f172a;">🔗 Sister Clinical Trials & Meta-Analyses</h3>
        <button id="lens-modal-close" style="border: none; background: #f1f5f9; cursor: pointer; border-radius: 50%; width: 26px; height: 26px; font-weight: bold;">✕</button>
      </div>
      <div id="lens-modal-query" style="font-size: 11px; color: #64748b; margin: 8px 0;"></div>
      <div id="lens-modal-body" style="font-size: 12px;">Searching NCBI Entrez database...</div>
    `;
    document.body.appendChild(modal);

    const backdrop = document.createElement('div');
    backdrop.id = 'lens-modal-backdrop';
    backdrop.style = `display: none; position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); z-index: 99998;`;
    document.body.appendChild(backdrop);

    const closeModal = () => {
      modal.style.display = 'none';
      backdrop.style.display = 'none';
    };

    document.querySelector('#lens-modal-close').addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    window.findSisterTrials = async function(pmid, rawTitle) {
      modal.style.display = 'block';
      backdrop.style.display = 'block';
      const bodyEl = document.querySelector('#lens-modal-body');
      const queryEl = document.querySelector('#lens-modal-query');

      const cleanTerms = rawTitle
        .replace(/[^\w\s]/gi, '')
        .split(/\s+/)
        .filter(w => w.length > 3 && !['with', 'from', 'that', 'this', 'after', 'using', 'study', 'effect', 'effects', 'trial', 'systematic', 'review'].includes(w.toLowerCase()))
        .slice(0, 4)
        .join(' ');

      queryEl.innerHTML = `Derived clinical focus: <strong>"${cleanTerms}"</strong> (Filtered for RCTs & Systematic Reviews)`;
      bodyEl.innerHTML = `<div style="text-align: center; padding: 25px; color: #64748b;">🔍 Querying NCBI Entrez API...</div>`;

      try {
        const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=(${encodeURIComponent(cleanTerms)})+AND+(randomized+controlled+trial[pt]+OR+systematic+review[pt])&retmax=6&sort=pub_date&retmode=json`;
        const sRes = await fetch(searchUrl).then(r => r.json());
        const idList = sRes.esearchresult?.idlist?.filter(id => id !== pmid) || [];

        if (idList.length === 0) {
          bodyEl.innerHTML = `<p style="color: #64748b; padding: 20px 0;">No direct RCT or Systematic Review sister trials found matching this specific query.</p>`;
          return;
        }

        const sumUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${idList.join(',')}&retmode=json`;
        const sumRes = await fetch(sumUrl).then(r => r.json());

        let html = `<div style="display: flex; flex-direction: column; gap: 10px; margin-top: 10px;">`;
        idList.forEach(id => {
          const item = sumRes.result[id];
          if (!item) return;
          html += `
            <div style="border: 1px solid #e2e8f0; border-radius: 6px; padding: 8px 10px; background: #f8fafc;">
              <div style="font-weight: 600; color: #1e40af; margin-bottom: 3px;">
                <a href="https://pubmed.ncbi.nlm.nih.gov/${id}/" target="_blank" style="text-decoration: none; color: #2563eb;">${item.title}</a>
              </div>
              <div style="font-size: 11px; color: #64748b;">${item.source} · ${item.pubdate} · PMID: ${id}</div>
            </div>
          `;
        });
        html += `</div>`;
        bodyEl.innerHTML = html;
      } catch (e) {
        bodyEl.innerHTML = `<span style="color: #ef4444;">Failed to retrieve sister trials: ${e.message}</span>`;
      }
    };
  };

  // 6. Redesigned Aesthetic SaaS Filter & Synthesis Dashboard
  const initToolbar = () => {
    if (document.querySelector('#lens-toolbar')) return;
    const header = document.querySelector('.search-results-chunk') || document.querySelector('#search-results');
    if (!header) return;

    const toolbar = document.createElement('div');
    toolbar.id = 'lens-toolbar';

    toolbar.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 16px; background: #ffffff; border-bottom: 1px solid #f1f5f9; flex-wrap: wrap; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span style="font-size: 14px; font-weight: 800; color: #0f172a; letter-spacing: -0.2px; display: flex; align-items: center; gap: 6px;">
            ⚡ PubMed-Lens <span style="background: #dbeafe; color: #1d4ed8; font-size: 10px; padding: 1px 6px; border-radius: 4px; font-weight: 700;">PRO</span>
          </span>
          <span id="lens-match-count" style="font-size: 11px; color: #0f766e; font-weight: 700; background: #ccfbf1; padding: 2px 9px; border-radius: 999px;">
            Scanning...
          </span>
        </div>

        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="font-size: 11px; color: #64748b; font-weight: 600; margin-right: 2px;">Sort:</span>
          <button id="lens-sort-cite" class="lens-sort-btn">💬 Citations ↓</button>
          <button id="lens-sort-rcr" class="lens-sort-btn">🎯 RCR ↓</button>
          <button id="lens-sort-level" class="lens-sort-btn">⚖️ Evidence ↑</button>
          <button id="lens-toggle-panel-btn" class="lens-sort-btn" style="background: #f1f5f9 !important; margin-left: 4px;">
            ⚙️ Filters ▾
          </button>
        </div>
      </div>

      <div id="lens-drawer" style="display: block;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 12px; padding: 12px 16px; background: #ffffff;">
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 9px 12px;">
            <div style="font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 7px;">
              ⚖️ Evidence Levels (Oxford CEBM)
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
              <label class="lens-chip"><input type="checkbox" class="lens-lvl-chk" value="1" checked /> L1: SR/Meta</label>
              <label class="lens-chip"><input type="checkbox" class="lens-lvl-chk" value="2" checked /> L2: RCT</label>
              <label class="lens-chip"><input type="checkbox" class="lens-lvl-chk" value="3" checked /> L3: Cohort</label>
              <label class="lens-chip"><input type="checkbox" class="lens-lvl-chk" value="4" checked /> L4: Obs</label>
              <label class="lens-chip"><input type="checkbox" class="lens-lvl-chk" value="5" checked /> L5: Opinion</label>
            </div>
          </div>

          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 9px 12px;">
            <div style="font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 7px;">
              🏛️ Journal Rigor (Scimago & CAS Tiers)
            </div>
            <div style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center;">
              <label class="lens-chip"><input type="checkbox" class="lens-q-chk" value="Q1" checked /> Q1</label>
              <label class="lens-chip"><input type="checkbox" class="lens-q-chk" value="Q2" checked /> Q2</label>
              <label class="lens-chip"><input type="checkbox" class="lens-q-chk" value="Q3" checked /> Q3</label>
              <label class="lens-chip"><input type="checkbox" class="lens-q-chk" value="Q-Unrated" checked /> Unrated</label>
              <span style="color: #cbd5e1; font-weight: 300;">|</span>
              <label class="lens-chip"><input type="checkbox" class="lens-cas-chk" value="Tier 1" /> CAS Tier 1</label>
              <label class="lens-chip"><input type="checkbox" class="lens-cas-chk" value="Tier 2" /> CAS Tier 2</label>
            </div>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; padding: 9px 16px; background: #f8fafc; border-top: 1px solid #e2e8f0; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px; flex-wrap: wrap;">
            <label style="display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 600; color: #334155; margin: 0;">
              Min Cites:
              <input type="number" id="lens-min-cite" value="0" min="0" style="width: 52px; height: 28px; padding: 2px 6px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 11.5px; font-weight: 600; background: #fff;" />
            </label>
            <label style="display: inline-flex; align-items: center; gap: 6px; font-size: 11.5px; font-weight: 600; color: #334155; margin: 0;">
              Min RCR:
              <select id="lens-min-rcr" class="lens-select lens-select-sm">
                <option value="0">Any</option>
                <option value="1.0">≥ 1.0x</option>
                <option value="2.0">≥ 2.0x</option>
              </select>
            </label>
            <label class="lens-chip" style="padding: 4px 11px !important;">
              <input type="checkbox" id="lens-oa-filter" /> 🔓 Open Access Only
            </label>
          </div>

          <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
            <span style="font-size: 11px; font-weight: 700; color: #475569;">📥 Export:</span>
            <select id="lens-export-style" class="lens-select">
              <option value="matrix">Full PICO Matrix</option>
              <option value="vancouver">Vancouver Style</option>
              <option value="ama">AMA Style (11th)</option>
              <option value="apa">APA Style (7th)</option>
              <option value="mla">MLA Style (9th)</option>
              <option value="chicago">Chicago Style</option>
              <option value="ieee">IEEE Style</option>
            </select>
            <select id="lens-export-target" class="lens-select" style="min-width: 125px !important;">
              <option value="csv">📊 CSV (Excel)</option>
              <option value="word">📄 Word (.doc)</option>
              <option value="copy">📋 Copy Text</option>
            </select>
            <button id="lens-export-btn" style="background: linear-gradient(135deg, #10b981, #059669); color: #fff; border: none; height: 28px; padding: 0 14px; border-radius: 6px; cursor: pointer; font-weight: 700; font-size: 11.5px; box-shadow: 0 1px 2px rgba(5, 150, 105, 0.2);">
              Export →
            </button>
          </div>
        </div>
      </div>
    `;
    header.insertBefore(toolbar, header.firstChild);

    const drawer = document.querySelector('#lens-drawer');
    const toggleBtn = document.querySelector('#lens-toggle-panel-btn');
    toggleBtn.addEventListener('click', () => {
      const isVisible = drawer.style.display !== 'none';
      drawer.style.display = isVisible ? 'none' : 'block';
      toggleBtn.textContent = isVisible ? '⚙️ Filters ▸' : '⚙️ Filters ▾';
    });

    document.querySelectorAll('.lens-lvl-chk, .lens-q-chk, .lens-cas-chk').forEach(chk => chk.addEventListener('change', applyFilters));
    document.querySelector('#lens-min-cite').addEventListener('input', applyFilters);
    document.querySelector('#lens-min-rcr').addEventListener('change', applyFilters);
    document.querySelector('#lens-oa-filter').addEventListener('change', applyFilters);

    const reorderCards = (comparator) => {
      const parent = document.querySelector('article.full-docsum')?.parentNode;
      if (!parent) return;
      const sorted = Array.from(pmidRegistry.values()).sort(comparator);
      sorted.forEach(item => parent.appendChild(item.card));
    };

    document.querySelector('#lens-sort-cite').addEventListener('click', () => reorderCards((a, b) => b.citations - a.citations));
    document.querySelector('#lens-sort-rcr').addEventListener('click', () => reorderCards((a, b) => b.rcr - a.rcr));
    document.querySelector('#lens-sort-level').addEventListener('click', () => reorderCards((a, b) => parseInt(a.level) - parseInt(b.level)));

    const formatCitation = (item, style, index) => {
      const cleanTitle = item.title.replace(/\.$/, '');
      switch (style) {
        case "vancouver": return `${item.authors}. ${cleanTitle}. ${item.citationText} PMID: ${item.pmid}.`;
        case "ama": return `${item.authors}. ${cleanTitle}. ${item.journalTitle}. ${item.year};${item.volume}${item.issue ? '(' + item.issue + ')' : ''}${item.pages ? ':' + item.pages : ''}. doi/PMID: ${item.pmid}.`;
        case "apa": return `${item.authors} (${item.year}). ${cleanTitle}. ${item.journalTitle}, ${item.volume}${item.issue ? '(' + item.issue + ')' : ''}${item.pages ? ', ' + item.pages : ''}. https://pubmed.ncbi.nlm.nih.gov/${item.pmid}/`;
        case "mla": return `${item.authors}. "${cleanTitle}." ${item.journalTitle}, vol. ${item.volume || 'n/a'}, no. ${item.issue || 'n/a'}, ${item.year}, pp. ${item.pages || 'n/a'}. PubMed, https://pubmed.ncbi.nlm.nih.gov/${item.pmid}/.`;
        case "chicago": return `${item.authors}. ${item.year}. "${cleanTitle}." ${item.journalTitle} ${item.volume} ${item.issue ? '(' + item.issue + ')' : ''}: ${item.pages || ''}. https://pubmed.ncbi.nlm.nih.gov/${item.pmid}/.`;
        case "ieee": return `[${index + 1}] ${item.authors}, "${cleanTitle}," ${item.journalTitle}, vol. ${item.volume || 'n/a'}, no. ${item.issue || 'n/a'}, pp. ${item.pages || 'n/a'}, ${item.year}.`;
        default: return `${item.title} - ${item.authors} (${item.year})`;
      }
    };

    document.querySelector('#lens-export-btn').addEventListener('click', () => {
      const visibleItems = Array.from(pmidRegistry.values()).filter(it => !it.card.classList.contains('lens-hidden'));
      if (visibleItems.length === 0) {
        alert("No visible papers to export! Adjust your filters first.");
        return;
      }

      const style = document.querySelector('#lens-export-style').value;
      const target = document.querySelector('#lens-export-target').value;

      if (target === "csv") {
        let csv = "PMID,Title,Authors,Year,Evidence Level,Journal,Quartile,Impact Factor,CAS Tier,Citations,RCR,Sample Size (N),Intervention/Comparison,Full Clinical Outcome,PMC Link\n";
        visibleItems.forEach(it => {
          const esc = (t) => `"${String(t || '').replace(/"/g, '""')}"`;
          csv += [
            it.pmid, esc(it.title), esc(it.authors), it.year, esc(it.levelLabel), esc(it.journalTitle),
            it.q, it.if || 'N/A', it.cas, it.citations, it.rcr ? it.rcr.toFixed(2) : 'N/A',
            esc(it.pico.nVal), esc(it.pico.ivc), esc(it.pico.outcome),
            it.isFree ? `https://www.ncbi.nlm.nih.gov/pmc/articles/pmid/${it.pmid}/` : 'N/A'
          ].join(',') + "\n";
        });
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PubMed_Clinical_PICO_Matrix_${Date.now()}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (target === "word") {
        let bodyHtml = "";
        if (style === "matrix") {
          bodyHtml = `<h2>Literature Evidence & PICO Matrix</h2><table border="1" cellpadding="6" cellspacing="0" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:10pt;"><tr style="background:#f1f5f9;"><th>PMID</th><th>Title</th><th>Level</th><th>Journal</th><th>Sample (N)</th><th>Intervention/Regimen</th><th>Full Clinical Outcome</th><th>RCR</th></tr>${visibleItems.map(it => `<tr><td>${it.pmid}</td><td><strong>${it.title}</strong><br><small>${it.authors} (${it.year})</small></td><td>${it.levelLabel}</td><td>${it.journalTitle} (${it.q} \vert{} IF:${it.if || 'N/A'})</td><td><strong>${it.pico.nVal}</strong></td><td>${it.pico.ivc}</td><td>${it.pico.outcome}</td><td>${it.rcr ? it.rcr.toFixed(2) + 'x' : 'N/A'}</td></tr>`).join('')}</table>`;
        } else {
          bodyHtml = `<h2>PubMed References (${style.toUpperCase()})</h2><ol style="font-family:Arial,sans-serif;font-size:11pt;line-height:1.6;">${visibleItems.map((it, idx) => `<li>${formatCitation(it, style, idx)}</li>`).join('')}</ol>`;
        }
        const fullDoc = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>PubMed Synthesis</title></head><body>${bodyHtml}</body></html>`;
        const blob = new Blob(['\ufeff', fullDoc], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `PubMed_PICO_Matrix_${Date.now()}.doc`;
        a.click();
        URL.revokeObjectURL(url);
      } else if (target === "copy") {
        let outputText = "";
        if (style === "matrix") {
          outputText = "| PMID | Title | N | Level | Journal | Citations | Full Clinical Outcome |\n|---|---|---|---|---|---|---|\n";
          visibleItems.forEach(it => {
            outputText += `| ${it.pmid} | ${it.title} | ${it.pico.nVal} | ${it.levelLabel} | ${it.journalTitle} | ${it.citations} | ${it.pico.outcome} |\n`;
          });
        } else {
          outputText = visibleItems.map((it, idx) => formatCitation(it, style, idx)).join('\n\n');
        }
        navigator.clipboard.writeText(outputText).then(() => {
          const btn = document.querySelector('#lens-export-btn');
          const original = btn.textContent;
          btn.textContent = "✅ Copied!";
          setTimeout(() => {
            btn.textContent = original;
          }, 2000);
        });
      }
    });
  };

  // 7. Process ONLY article.full-docsum
  const processNewCards = async (newCards) => {
    const unparsed = [];

    newCards.forEach(card => {
      if (card.hasAttribute('data-lens-done')) return;
      card.setAttribute('data-lens-done', 'true');

      card.querySelectorAll('.lens-card-addon').forEach(el => el.remove());

      let pmid = card.getAttribute('data-article-id')
        || card.querySelector('.docsum-pmid, .pmid')?.textContent.match(/\b\d{7,9}\b/)?.[0]
        || card.querySelector('a.docsum-title')?.getAttribute('href')?.match(/\/(\d{7,9})\/?/)?.[1];

      if (!pmid || pmidRegistry.has(pmid)) return;

      let title = card.querySelector('a.docsum-title')?.textContent.trim() || "Untitled Article";
      let authors = card.querySelector('.docsum-authors')?.textContent.trim() || "Unknown Authors";
      let citationText = card.querySelector('.docsum-journal-citation')?.textContent.trim() || "";

      let journalRaw = citationText.split('.')[0]?.trim().toLowerCase() || "";
      let journalTitle = citationText.split('.')[0]?.trim() || "Journal";
      let yearMatch = citationText.match(/\b(19\d\d|20\d\d)\b/);
      let year = yearMatch ? yearMatch[0] : "n.d.";

      let volMatch = citationText.match(/;\s*(\d+)(\([^)]+\))?:?([\d-]+)?/);
      let volume = volMatch ? volMatch[1] : "";
      let issue = volMatch && volMatch[2] ? volMatch[2] : "";
      let pages = volMatch && volMatch[3] ? volMatch[3] : "";

      const text = (title + " " + card.textContent).toLowerCase();

      let level = "4";
      let levelLabel = "Level 4: Observational";
      let levelStyle = "background: #fef3c7; color: #92400e; border: 1px solid #fde68a;";

      if (text.includes("meta-analysis") || text.includes("systematic review")) {
        level = "1";
        levelLabel = "Level 1: Meta-Analysis / SR";
        levelStyle = "background: #dcfce7; color: #15803d; border: 1px solid #86efac; font-weight: 700;";
      } else if (text.includes("randomized controlled trial") || text.includes(" rct") || text.includes("randomised")) {
        level = "2";
        levelLabel = "Level 2: RCT";
        levelStyle = "background: #ccfbf1; color: #0f766e; border: 1px solid #99f6e4; font-weight: 700;";
      } else if (text.includes("cohort") || text.includes("case-control")) {
        level = "3";
        levelLabel = "Level 3: Cohort / Case-Control";
        levelStyle = "background: #e0e7ff; color: #4338ca; border: 1px solid #c7d2fe;";
      } else if (text.includes("review") || text.includes("guideline") || text.includes("commentary") || text.includes("opinion")) {
        level = "5";
        levelLabel = "Level 5: Narrative Review / Opinion";
        levelStyle = "background: #f5f3ff; color: #6d28d9; border: 1px solid #ddd6fe; font-weight: 600;";
      }

      const isFree = card.querySelector('.free-resources, .free-article') !== null || text.includes("free article");
      const targetContainer = card.querySelector('.docsum-content') || card;

      const flankCard = document.createElement('div');
      flankCard.className = 'lens-card-addon lens-flank-card';
      flankCard.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:5px;border-bottom:1px solid #e2e8f0;padding-bottom:4px;">
          <span style="font-weight:700;color:#0f172a;text-transform:uppercase;font-size:10px;letter-spacing:0.5px;">📋 PICO Appraisal</span>
          <span class="lens-n-pill" style="background:#fdf2f8;color:#9d174d;padding:1px 6px;border-radius:4px;font-weight:700;border:1px solid #fbcfe8;">👥 N = ...</span>
        </div>
        <div class="lens-pico-ivc" style="margin-bottom:5px;"><strong style="color:#0f172a;">Regimen:</strong> <span style="color:#0f766e;">Extracting...</span></div>
        <div style="flex:1;"><strong style="color:#0f172a;">Full Clinical Outcome:</strong>
          <div class="lens-pico-outcome lens-flank-outcome-scroll" style="margin-top:2px;max-height:125px;overflow-y:auto;padding-right:4px;color:#334155;line-height:1.42;">
            Extracting clinical endpoint...
          </div>
        </div>
      `;
      card.appendChild(flankCard);

      const pillBar = document.createElement('div');
      pillBar.className = 'lens-card-addon lens-pill-bar';
      pillBar.style = "display:flex;gap:6px;margin:7px 0 3px 0;font-size:11px;font-weight:600;flex-wrap:wrap;align-items:center;";
      pillBar.innerHTML = `
        <span style="${levelStyle} padding:2px 7px;border-radius:4px;" title="Oxford CEBM Level">⚖️ ${levelLabel}</span>
        <span class="lens-cite-pill" style="background:#e0f2fe;color:#0284c7;padding:2px 7px;border-radius:4px;border:1px solid #bae6fd;">💬 Citations: ...</span>
        <span class="lens-rcr-pill" style="background:#fef3c7;color:#b45309;padding:2px 7px;border-radius:4px;border:1px solid #fde68a;">🎯 RCR: ...</span>
        <span class="lens-j-pill" style="background:#f3e8ff;color:#7e22ce;padding:2px 7px;border-radius:4px;border:1px solid #e9d5ff;">🏛️ Quality</span>
        <button onclick="window.findSisterTrials('${pmid}', '${title.replace(/'/g, "\\'")}')" style="background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;padding:2px 7px;border-radius:4px;cursor:pointer;font-size:11px;font-weight:600;">🔗 Sister Trials</button>
        ${isFree ? `<a href="https://www.ncbi.nlm.nih.gov/pmc/articles/pmid/${pmid}/" target="_blank" style="text-decoration:none;background:#ecfdf5;color:#047857;padding:2px 7px;border-radius:4px;border:1px solid #a7f3d0;" title="Open Access Article">🔓 Free PMC</a>` : ''}
      `;

      const citationLine = targetContainer.querySelector('.docsum-journal-citation') || targetContainer.querySelector('.docsum-title');
      if (citationLine && citationLine.parentNode) {
        citationLine.parentNode.insertBefore(pillBar, citationLine.nextSibling);
      } else {
        targetContainer.appendChild(pillBar);
      }

      const dataItem = {
        card, container: targetContainer, flankElem: flankCard, pillElem: pillBar,
        pmid, title, authors, journalRaw, journalTitle, citationText, year, volume, issue, pages,
        level, levelLabel, levelStyle, isFree,
        pico: { nVal: "Scanning...", ivc: "Analyzing...", outcome: "Extracting outcome..." },
        citations: 0, rcr: 0, q: "Q-Unrated", cas: "Unranked", if: "Pending"
      };

      pmidRegistry.set(pmid, dataItem);
      unparsed.push(pmid);
    });

    if (unparsed.length === 0) return;

    const chunkArray = (arr, size) => {
      const res = [];
      for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size));
      return res;
    };

    const chunks = chunkArray(unparsed, 50);

    for (const chunk of chunks) {
      const chunkIds = chunk.join(',');

      try {
        const [iciteData, xmlText] = await Promise.all([
          fetch(`https://icite.od.nih.gov/api/pubs?pmids=${chunkIds}`).then(r => r.json()).then(j => j.data || []).catch(() => []),
          fetch(`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${chunkIds}&retmode=xml`).then(r => r.text()).catch(() => "")
        ]);

        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const pubmedArticles = Array.from(xmlDoc.querySelectorAll('PubmedArticle'));

        pubmedArticles.forEach(art => {
          const pmid = art.querySelector('MedlineCitation > PMID')?.textContent?.trim();
          const item = pmidRegistry.get(pmid);
          if (!item) return;

          const abstractNodes = Array.from(art.querySelectorAll('AbstractText'));
          let fullAbstract = "";
          let methodsText = "";
          let resultsText = "";
          let conclusionsText = "";

          abstractNodes.forEach(node => {
            const label = (node.getAttribute('Label') || "").toUpperCase();
            const nodeText = node.textContent.trim();
            fullAbstract += " " + nodeText;

            if (label.includes("METHOD")) methodsText += " " + nodeText;
            if (label.includes("RESULT")) resultsText += " " + nodeText;
            if (label.includes("CONCLUSION")) conclusionsText += " " + nodeText;
          });

          const searchScope = methodsText ? `${methodsText} ${resultsText} ${fullAbstract}` : fullAbstract;
          const nVal = parseClinicalN(searchScope, item.title);

          let outcome = "";
          if (conclusionsText) outcome = conclusionsText.trim();
          else if (resultsText) outcome = resultsText.trim();
          else {
            const sentences = fullAbstract.split(/(?<=[.!?])\s+/);
            outcome = sentences.slice(-3).join(' ').trim();
          }
          if (!outcome || outcome.length < 5) outcome = "Abstract text not indexed or ongoing protocol.";

          let ivc = "";
          const ivcMatch = (methodsText + " " + item.title).match(/(?:evaluated|evaluated the effect of|investigated|administered|treated with|compared with|versus|vs\.?)([^.,;]+)/i);
          ivc = ivcMatch ? ivcMatch[1].trim() : "Standard clinical comparative regimen";

          item.pico = { nVal, ivc: ivc.slice(0, 80), outcome };
        });

        iciteData.forEach(article => {
          const item = pmidRegistry.get(String(article.pmid));
          if (!item) return;
          item.citations = article.citation_count ?? 0;
          item.rcr = article.relative_citation_ratio ?? 0;
          item.citesPerYear = article.citations_per_year != null ? article.citations_per_year.toFixed(1) + '/yr' : '-';

          const jMeta = JOURNAL_DB[item.journalRaw] || { if: "IF Pending", q: "Q-Unrated", cas: "Unranked" };
          item.q = jMeta.q;
          item.cas = jMeta.cas;
          item.if = jMeta.if;
        });

        chunk.forEach(pmid => {
          const item = pmidRegistry.get(pmid);
          if (!item) return;

          const jMeta = JOURNAL_DB[item.journalRaw] || { if: "IF Pending", q: "Q-Unrated", cas: "Unranked" };

          if (item.flankElem) {
            item.flankElem.querySelector('.lens-n-pill').innerHTML = `👥 N = <strong>${item.pico.nVal}</strong>`;
            item.flankElem.querySelector('.lens-pico-ivc').innerHTML = `<strong style="color:#0f172a;">Regimen:</strong> <span style="color:#0f766e;">${item.pico.ivc}</span>`;
            item.flankElem.querySelector('.lens-pico-outcome').textContent = item.pico.outcome;
          }

          if (item.pillElem) {
            item.pillElem.querySelector('.lens-cite-pill').textContent = `💬 Citations: ${item.citations} (${item.citesPerYear || '-'})`;
            item.pillElem.querySelector('.lens-rcr-pill').textContent = `🎯 RCR: ${item.rcr > 0 ? item.rcr.toFixed(2) + 'x' : 'N/A'}`;
            item.pillElem.querySelector('.lens-j-pill').innerHTML = `🏛️ <strong>${jMeta.q}</strong> · IF: ${jMeta.if}${jMeta.cas !== 'Unranked' ? ' | ' + jMeta.cas : ''}`;
          }
        });
      } catch (err) {
        console.warn("Chunk processing error:", err);
      }
    }

    applyFilters();
  };

  // 8. Bootstrap Engine
  const initEngine = () => {
    initToolbar();
    initModal();

    const initialCards = Array.from(document.querySelectorAll('article.full-docsum:not([data-lens-done="true"])'));
    if (initialCards.length > 0) {
      processNewCards(initialCards);
    }

    const targetNode = document.querySelector('#search-results') || document.body;
    let debounceTimer = null;

    const observer = new MutationObserver((mutations) => {
      const addedCards = [];
      mutations.forEach(mut => {
        mut.addedNodes.forEach(node => {
          if (node.nodeType === 1) {
            if (node.matches && node.matches('article.full-docsum') && !node.hasAttribute('data-lens-done')) {
              addedCards.push(node);
            } else if (node.querySelectorAll) {
              const inside = node.querySelectorAll('article.full-docsum:not([data-lens-done="true"])');
              inside.forEach(c => addedCards.push(c));
            }
          }
        });
      });

      if (addedCards.length > 0) {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          processNewCards(addedCards);
        }, 150);
      }
    });

    observer.observe(targetNode, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEngine);
  } else {
    initEngine();
  }
})();
