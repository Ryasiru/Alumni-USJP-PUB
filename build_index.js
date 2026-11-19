const fs = require('fs');

// 1. Read members data
const valContent = fs.readFileSync('/Users/yasiru/Desktop/Alumni/validate_members.js', 'utf8');
const match = valContent.match(/const members = (\[[\s\S]*?\]);/);
if (!match) {
  console.error("Could not find members array");
  process.exit(1);
}
const membersDataString = match[1];

// 2. Build full single-file HTML
const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alumni Directory • Department of Public Administration • University of Sri Jayewardenepura</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;900&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,900;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    /* ==========================================================================
       RESET & THEME VARIABLES
       ========================================================================== */
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :root {
      --paper-bg: #fdfbf7;
      --paper-tint: #f5eedc;
      --ink-color: #2b251f;
      --ink-muted: #6b6255;
      --gold-primary: #b8860b;
      --gold-light: #f3e5ab;
      --gold-dark: #8c6708;
      --navy-deep: #0e1d2f;
      --navy-mid: #1b3552;
      --navy-light: #2c4d72;
      --book-width: 1060px;
      --book-height: 730px;
      --page-width: 530px;
    }

    body {
      background: radial-gradient(circle at 50% 25%, #222d3d 0%, #0d141e 100%);
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: var(--ink-color);
      min-height: 100vh;
      overflow-x: hidden;
      display: flex;
      flex-direction: column;
      user-select: none;
      -webkit-font-smoothing: antialiased;
    }

    /* ==========================================================================
       TOP APP HEADER & SEARCH BAR
       ========================================================================== */
    .app-header {
      background: rgba(14, 29, 47, 0.95);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(212, 175, 55, 0.35);
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 15px;
      z-index: 100;
      flex-wrap: wrap;
      box-shadow: 0 4px 20px rgba(0,0,0,0.4);
    }

    .header-brand {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .brand-crest {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: radial-gradient(circle, #f3e5ab 0%, #b8860b 80%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 12px rgba(212, 175, 55, 0.5);
      border: 1.5px solid #fff;
      flex-shrink: 0;
    }

    .brand-crest svg {
      width: 24px;
      height: 24px;
      fill: var(--navy-deep);
    }

    .brand-title {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 15px;
      font-weight: 700;
      color: #f7eed3;
      letter-spacing: 1.2px;
      line-height: 1.2;
    }

    .brand-subtitle {
      font-size: 11px;
      color: #bfa87a;
      letter-spacing: 0.8px;
    }

    /* Live Search Box */
    .search-container {
      position: relative;
      flex: 1;
      max-width: 400px;
      min-width: 220px;
    }

    .search-input-wrap {
      position: relative;
      display: flex;
      align-items: center;
    }

    .search-input-wrap svg {
      position: absolute;
      left: 12px;
      width: 15px;
      height: 15px;
      fill: #a69880;
      pointer-events: none;
    }

    .search-input {
      width: 100%;
      padding: 7px 32px 7px 34px;
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(212, 175, 55, 0.35);
      border-radius: 20px;
      color: #fff;
      font-family: inherit;
      font-size: 12.5px;
      outline: none;
      transition: all 0.25s ease;
    }

    .search-input:focus {
      background: rgba(255, 255, 255, 0.15);
      border-color: #d4af37;
      box-shadow: 0 0 12px rgba(212, 175, 55, 0.4);
    }

    .search-input::placeholder {
      color: #8c8170;
    }

    .search-clear {
      position: absolute;
      right: 10px;
      background: none;
      border: none;
      color: #a69880;
      font-size: 14px;
      cursor: pointer;
      display: none;
      line-height: 1;
    }

    .search-results-dropdown {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      right: 0;
      background: #192738;
      border: 1px solid rgba(212, 175, 55, 0.4);
      border-radius: 8px;
      max-height: 320px;
      overflow-y: auto;
      display: none;
      z-index: 1000;
      box-shadow: 0 12px 30px rgba(0,0,0,0.6);
    }

    .search-result-item {
      padding: 9px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      transition: background 0.15s ease;
    }

    .search-result-item:hover {
      background: rgba(212, 175, 55, 0.18);
    }

    .search-res-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }

    .search-res-name {
      font-size: 12.5px;
      font-weight: 600;
      color: #f7eed3;
    }

    .search-res-sub {
      font-size: 10.5px;
      color: #9cb1c9;
    }

    .search-res-page {
      background: rgba(212, 175, 55, 0.2);
      color: #f3e5ab;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 7px;
      border-radius: 10px;
      border: 1px solid rgba(212, 175, 55, 0.3);
      white-space: nowrap;
    }

    /* Header action tools */
    .header-actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .tool-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(212, 175, 55, 0.3);
      color: #f3e5ab;
      font-family: inherit;
      font-size: 11.5px;
      font-weight: 600;
      padding: 6px 12px;
      border-radius: 16px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }

    .tool-btn:hover {
      background: rgba(212, 175, 55, 0.22);
      border-color: #d4af37;
      color: #fff;
    }

    .tool-btn.active {
      background: #b8860b;
      color: #0e1d2f;
      border-color: #f3e5ab;
    }

    /* ==========================================================================
       BOOK VIEWPORT & 3D STAGE
       ========================================================================== */
    .main-stage {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 10px;
      position: relative;
      overflow: hidden;
      min-height: 750px;
    }

    .book-viewport {
      perspective: 2500px;
      perspective-origin: center center;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }

    .book-wrapper {
      transform-origin: center center;
      transition: transform 0.25s ease;
      will-change: transform;
    }

    .book {
      position: relative;
      width: var(--book-width);
      height: var(--book-height);
      transform-style: preserve-3d;
      transition: transform 0.85s cubic-bezier(0.25, 1, 0.5, 1);
      box-shadow: 0 25px 60px rgba(0,0,0,0.5), 0 5px 15px rgba(0,0,0,0.3);
      border-radius: 6px;
    }

    /* Spine and Layered Paper Edge Aesthetics */
    .book-spine {
      position: absolute;
      top: 0;
      left: calc(var(--page-width) - 5px);
      width: 10px;
      height: 100%;
      background: linear-gradient(to right, rgba(0,0,0,0.35), rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.35));
      z-index: 60;
      pointer-events: none;
      border-radius: 4px;
    }

    .book-edge-left {
      position: absolute;
      top: 7px;
      bottom: 7px;
      left: -10px;
      width: 10px;
      background: repeating-linear-gradient(to bottom, #d8d0ba 0px, #f2ebd9 2px, #c8c0a8 3px);
      border-radius: 4px 0 0 4px;
      box-shadow: -4px 0 8px rgba(0,0,0,0.3);
      z-index: 0;
      transition: opacity 0.5s ease;
    }

    .book-edge-right {
      position: absolute;
      top: 7px;
      bottom: 7px;
      right: -10px;
      width: 10px;
      background: repeating-linear-gradient(to bottom, #d8d0ba 0px, #f2ebd9 2px, #c8c0a8 3px);
      border-radius: 0 4px 4px 0;
      box-shadow: 4px 0 8px rgba(0,0,0,0.3);
      z-index: 0;
      transition: opacity 0.5s ease;
    }

    /* Desk shadow below the entire book */
    .desk-shadow {
      position: absolute;
      bottom: -25px;
      left: 5%;
      width: 90%;
      height: 35px;
      background: radial-gradient(ellipse at center, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0) 70%);
      pointer-events: none;
      z-index: -1;
    }

    /* ==========================================================================
       LEAF / SHEET & 3D TURN
       ========================================================================== */
    .sheet {
      position: absolute;
      top: 0;
      left: var(--page-width);
      width: var(--page-width);
      height: var(--book-height);
      transform-origin: left center;
      transform-style: preserve-3d;
      transition: transform 0.85s cubic-bezier(0.25, 1, 0.5, 1);
      pointer-events: none;
    }

    .sheet.flipped {
      transform: rotateY(-180deg);
    }

    .sheet.instant {
      transition: none !important;
    }

    /* Individual Page Faces */
    .page {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      box-sizing: border-box;
      overflow: hidden;
      pointer-events: auto;
      cursor: pointer;
    }

    .page-front {
      transform: rotateY(0deg) translateZ(0.5px);
      border-radius: 2px 6px 6px 2px;
    }

    .page-back {
      transform: rotateY(180deg) translateZ(0.5px);
      border-radius: 6px 2px 2px 6px;
    }

    /* Page Turn Shading & Dynamic Lighting */
    .page-lighting {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.35s ease;
      z-index: 20;
    }

    .sheet.flipping .page-front .page-lighting {
      opacity: 1;
      background: linear-gradient(to right, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.02) 65%, rgba(0,0,0,0) 100%);
    }

    .sheet.flipping .page-back .page-lighting {
      opacity: 1;
      background: linear-gradient(to left, rgba(0,0,0,0.32) 0%, rgba(0,0,0,0.02) 65%, rgba(0,0,0,0) 100%);
    }

    /* Static Gutter / Spine Fold Shadow on Pages */
    .page-back.content-page {
      background: linear-gradient(to right, #fdfbf7 0%, #fdfbf7 90%, rgba(0,0,0,0.06) 96%, rgba(0,0,0,0.18) 100%);
      padding: 22px 28px 20px 24px;
    }

    .page-front.content-page {
      background: linear-gradient(to left, #fdfbf7 0%, #fdfbf7 90%, rgba(0,0,0,0.06) 96%, rgba(0,0,0,0.18) 100%);
      padding: 22px 24px 20px 28px;
    }

    /* ==========================================================================
       COVER PAGE STYLES
       ========================================================================== */
    .cover-front {
      background: radial-gradient(circle at 50% 35%, #182e4b 0%, #0c1827 100%);
      color: #f3e5ab;
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
      border: 4px solid #8d6b1d;
      box-shadow: inset 0 0 60px rgba(0,0,0,0.8), inset 0 0 15px rgba(212,175,55,0.4);
    }

    .cover-back {
      background: radial-gradient(circle at 50% 35%, #182e4b 0%, #0c1827 100%);
      color: #f3e5ab;
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
      border: 4px solid #8d6b1d;
      box-shadow: inset 0 0 60px rgba(0,0,0,0.8), inset 0 0 15px rgba(212,175,55,0.4);
    }

    .cover-inner-border {
      width: 100%;
      height: 100%;
      border: 2px solid #d4af37;
      padding: 22px 18px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      position: relative;
      outline: 1px dashed rgba(212, 175, 55, 0.45);
      outline-offset: -8px;
    }

    /* Ornate Corner SVG Graphics */
    .corner-ornament {
      position: absolute;
      width: 30px;
      height: 30px;
      fill: #d4af37;
      pointer-events: none;
    }
    .corner-tl { top: 2px; left: 2px; }
    .corner-tr { top: 2px; right: 2px; transform: scaleX(-1); }
    .corner-bl { bottom: 2px; left: 2px; transform: scaleY(-1); }
    .corner-br { bottom: 2px; right: 2px; transform: scale(-1); }

    .cover-header-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin-top: 4px;
    }

    .cover-institution-main {
      font-family: 'Cinzel', serif;
      font-size: 13.5px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #f3e5ab;
      margin-bottom: 4px;
    }

    .cover-faculty {
      font-size: 11px;
      letter-spacing: 1px;
      text-transform: uppercase;
      color: #cfbc92;
      margin-bottom: 2px;
    }

    .cover-department {
      font-family: 'Cinzel', serif;
      font-size: 12px;
      letter-spacing: 1.5px;
      color: #e5c158;
      text-transform: uppercase;
      margin-bottom: 12px;
    }

    .cover-divider {
      width: 120px;
      height: 1.5px;
      background: linear-gradient(to right, transparent, #d4af37, transparent);
      margin-bottom: 14px;
    }

    .cover-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 30px;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
      text-align: center;
      line-height: 1.15;
      background: linear-gradient(135deg, #c59b3f 0%, #fff4cc 35%, #b8860b 70%, #f9e295 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));
    }

    .cover-subtitle-pill {
      font-family: 'Cinzel', serif;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: #f3e5ab;
      margin-top: 10px;
      padding: 5px 18px;
      border-top: 1px solid rgba(212,175,55,0.6);
      border-bottom: 1px solid rgba(212,175,55,0.6);
      display: inline-block;
    }

    .cover-crest-container {
      margin: 12px 0;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .cover-crest-circle {
      width: 90px;
      height: 90px;
      border-radius: 50%;
      border: 2px solid #d4af37;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 25px rgba(212, 175, 55, 0.4), inset 0 0 20px rgba(0,0,0,0.6);
      background: radial-gradient(circle, #254063 0%, #0e1d2f 90%);
      position: relative;
    }

    .cover-crest-circle svg {
      width: 50px;
      height: 50px;
      fill: #f3e5ab;
    }

    .cover-alumni-tag {
      font-family: 'Cinzel', serif;
      font-size: 11px;
      letter-spacing: 2px;
      color: #dfcaa2;
      text-transform: uppercase;
      margin-top: 10px;
      text-align: center;
    }

    .cover-cta-group {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 6px;
    }

    .btn-open-book {
      background: linear-gradient(135deg, #b8860b 0%, #f5db8b 50%, #9e7408 100%);
      color: #0b1522;
      font-family: 'Cinzel', Georgia, serif;
      font-size: 13.5px;
      font-weight: 700;
      letter-spacing: 2px;
      text-transform: uppercase;
      border: 1px solid #ffe699;
      border-radius: 30px;
      padding: 12px 36px;
      cursor: pointer;
      box-shadow: 0 4px 18px rgba(0,0,0,0.6), 0 0 25px rgba(212,175,55,0.45);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }

    .btn-open-book:hover {
      transform: translateY(-3px) scale(1.04);
      box-shadow: 0 7px 25px rgba(0,0,0,0.7), 0 0 35px rgba(212,175,55,0.7);
    }

    .cover-hint {
      font-size: 10.5px;
      color: #9cb1c9;
      margin-top: 8px;
      letter-spacing: 0.5px;
    }

    /* ==========================================================================
       INSIDE COVER (Sheet 0 Back)
       ========================================================================== */
    .inside-cover {
      background: #fbf7ee;
      padding: 24px 28px 20px 24px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }

    .inside-border {
      border: 1px solid #d4af37;
      padding: 18px;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      box-sizing: border-box;
      background: rgba(253, 251, 247, 0.7);
    }

    .inside-header-meta {
      text-align: center;
      margin-bottom: 8px;
    }

    .inside-inst-title {
      font-family: 'Cinzel', serif;
      font-size: 11px;
      color: #8c6708;
      font-weight: 700;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .inside-dept-title {
      font-family: 'Cinzel', serif;
      font-size: 10px;
      color: #554836;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }

    .inside-heading {
      font-family: 'Playfair Display', serif;
      font-size: 18px;
      font-weight: 700;
      color: #1e3552;
      text-align: center;
      border-bottom: 2px solid #b8860b;
      padding-bottom: 6px;
      margin-bottom: 10px;
    }

    .inside-intro-text {
      font-size: 11px;
      line-height: 1.45;
      color: #4a4237;
      text-align: justify;
      margin-bottom: 12px;
    }

    .legend-card {
      background: rgba(184, 134, 11, 0.08);
      border: 1px solid rgba(184, 134, 11, 0.25);
      border-radius: 6px;
      padding: 8px 10px;
      margin-bottom: 12px;
    }

    .legend-title {
      font-size: 10.5px;
      font-weight: 700;
      color: #8c6708;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 5px;
    }

    .legend-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 5px;
      font-size: 10.5px;
    }

    .legend-item {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #332d24;
    }

    .stats-card-group {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 6px;
      margin-bottom: 12px;
    }

    .stat-mini-box {
      background: #fff;
      border: 1px solid rgba(0,0,0,0.1);
      border-radius: 6px;
      padding: 6px 4px;
      text-align: center;
      box-shadow: 0 1px 4px rgba(0,0,0,0.05);
    }

    .stat-mini-num {
      font-family: 'Cinzel', serif;
      font-size: 16px;
      font-weight: 700;
      color: #1b3552;
    }

    .stat-mini-lbl {
      font-size: 9px;
      color: #7a6e5d;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .toc-container {
      flex: 1;
      margin-bottom: 8px;
    }

    .toc-title {
      font-family: 'Cinzel', serif;
      font-size: 10.5px;
      font-weight: 700;
      color: #1e3552;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 5px;
      border-bottom: 1px dashed #d4af37;
      padding-bottom: 3px;
    }

    .toc-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 5px;
    }

    .toc-link {
      background: #fff;
      border: 1px solid rgba(184, 134, 11, 0.3);
      padding: 3px 5px;
      border-radius: 4px;
      font-size: 10px;
      color: #1e3552;
      text-align: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .toc-link:hover {
      background: #b8860b;
      color: #fff;
      border-color: #b8860b;
    }

    .inside-nav-tip {
      font-size: 10px;
      color: #7a6e5d;
      text-align: center;
      font-style: italic;
      border-top: 1px solid rgba(0,0,0,0.08);
      padding-top: 5px;
    }

    /* ==========================================================================
       CONTENT PAGES & TABLE LAYOUT
       ========================================================================== */
    .content-page {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      height: 100%;
    }

    .page-header {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      border-bottom: 1.5px solid #d4af37;
      padding-bottom: 4px;
      margin-bottom: 6px;
    }

    .page-header-left {
      display: flex;
      flex-direction: column;
    }

    .page-header-dept {
      font-size: 9.5px;
      font-weight: 600;
      color: #8c6708;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .page-header-title {
      font-family: 'Cinzel', Georgia, serif;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      color: #1b3552;
      text-transform: uppercase;
    }

    .page-header-num {
      font-family: 'Cinzel', serif;
      font-size: 10.5px;
      font-weight: 700;
      color: #8c6708;
    }

    .table-scroll-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
    }

    .member-table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
      font-size: 11px;
    }

    .member-table thead th {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 9.5px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      color: #5a4b32;
      border-bottom: 1.5px solid #d4af37;
      padding: 4px 6px 5px 6px;
      text-align: left;
      background: rgba(212, 175, 55, 0.08);
    }

    .member-row {
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
      transition: background 0.15s ease;
    }

    .member-row:nth-child(even) {
      background: rgba(184, 134, 11, 0.035);
    }

    .member-row:hover {
      background: rgba(212, 175, 55, 0.13);
    }

    .member-row.highlighted {
      background: rgba(255, 215, 0, 0.35) !important;
      outline: 2px solid #b8860b;
    }

    .col-no {
      width: 30px;
      font-weight: 700;
      color: #8c6708;
      font-size: 10px;
      text-align: center;
      padding: 4px 2px;
      vertical-align: top;
    }

    .col-name-role {
      width: 49%;
      padding: 4px 6px;
      vertical-align: top;
    }

    .col-contact {
      width: 44%;
      padding: 4px 6px;
      vertical-align: top;
    }

    .col-class {
      width: 35px;
      padding: 4px 2px;
      vertical-align: top;
      text-align: center;
    }

    .name-badge-wrap {
      display: flex;
      align-items: baseline;
      gap: 5px;
      margin-bottom: 1px;
      flex-wrap: wrap;
    }

    .member-name {
      font-family: 'Playfair Display', Georgia, serif;
      font-weight: 700;
      font-size: 12px;
      color: #1a1610;
      line-height: 1.2;
    }

    .lm-pill {
      display: inline-block;
      background: linear-gradient(135deg, #b8860b, #e5c158);
      color: #121008;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 8.5px;
      font-weight: 800;
      padding: 1px 5px;
      border-radius: 10px;
      letter-spacing: 0.5px;
      border: 1px solid rgba(255,255,255,0.6);
      box-shadow: 0 1px 2px rgba(0,0,0,0.15);
      flex-shrink: 0;
    }

    .field-item {
      font-size: 10.5px;
      line-height: 1.25;
      color: #3d372e;
      margin-top: 1px;
      word-break: break-word;
      overflow-wrap: break-word;
    }

    .field-lbl {
      font-weight: 700;
      font-size: 9.5px;
      color: #7d6b4f;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-right: 2px;
    }

    .email-val {
      color: #184b77;
      word-break: break-all;
    }

    .class-year {
      display: inline-block;
      background: rgba(0,0,0,0.05);
      color: #4a4031;
      font-weight: 700;
      font-size: 9.5px;
      padding: 2px 3px;
      border-radius: 4px;
      border: 1px solid rgba(0,0,0,0.08);
    }

    .page-footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(0,0,0,0.08);
      padding-top: 4px;
      margin-top: 4px;
    }

    .page-footer-text {
      font-size: 9px;
      color: #8c8170;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }

    .page-footer-num {
      font-family: 'Cinzel', serif;
      font-size: 10.5px;
      font-weight: 700;
      color: #635645;
    }

    /* Page 55 Summary Milestone Card */
    .summary-milestone-card {
      margin-top: 10px;
      border: 2px dashed #b8860b;
      border-radius: 8px;
      padding: 14px;
      background: rgba(184, 134, 11, 0.06);
      text-align: center;
    }

    .summary-milestone-card h3 {
      font-family: 'Playfair Display', serif;
      font-size: 15px;
      color: #1b3552;
      margin-bottom: 4px;
    }

    .summary-milestone-card p {
      font-size: 11px;
      color: #594e3e;
      line-height: 1.4;
      margin-bottom: 10px;
    }

    .summary-stats-flex {
      display: flex;
      justify-content: space-around;
      gap: 8px;
      margin-bottom: 12px;
    }

    .stat-pill {
      background: #fff;
      border: 1px solid rgba(184,134,11,0.3);
      border-radius: 6px;
      padding: 5px 10px;
    }

    .stat-pill-val {
      font-family: 'Cinzel', serif;
      font-size: 15px;
      font-weight: 700;
      color: #b8860b;
    }

    .stat-pill-lbl {
      font-size: 9px;
      color: #665a48;
      text-transform: uppercase;
    }

    /* ==========================================================================
       BACK COVER STYLES
       ========================================================================== */
    .back-cover-inst {
      font-family: 'Cinzel', serif;
      font-size: 12px;
      letter-spacing: 1.5px;
      color: #d4af37;
      text-transform: uppercase;
      text-align: center;
      margin-top: 4px;
    }

    .back-cover-dept {
      font-size: 10.5px;
      letter-spacing: 1px;
      color: #cfbc92;
      text-transform: uppercase;
      text-align: center;
      margin-top: 2px;
    }

    .back-cover-title {
      font-family: 'Playfair Display', Georgia, serif;
      font-size: 26px;
      font-weight: 900;
      letter-spacing: 2px;
      text-transform: uppercase;
      text-align: center;
      background: linear-gradient(135deg, #c59b3f 0%, #fff4cc 35%, #b8860b 70%, #f9e295 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-top: 8px;
    }

    .back-cover-subtitle {
      font-family: 'Cinzel', serif;
      font-size: 11px;
      letter-spacing: 2px;
      color: #d4af37;
      text-transform: uppercase;
      margin-top: 6px;
      border-top: 1px solid rgba(212,175,55,0.5);
      border-bottom: 1px solid rgba(212,175,55,0.5);
      padding: 4px 14px;
    }

    .back-count-container {
      margin: 20px 0;
      text-align: center;
      background: rgba(0,0,0,0.35);
      border: 1.5px solid rgba(212, 175, 55, 0.4);
      border-radius: 12px;
      padding: 16px 26px;
      box-shadow: 0 0 25px rgba(0,0,0,0.5), inset 0 0 15px rgba(212,175,55,0.15);
    }

    .back-count-num {
      font-family: 'Cinzel', serif;
      font-size: 50px;
      font-weight: 900;
      color: #f3e5ab;
      line-height: 1;
      text-shadow: 0 0 20px rgba(212, 175, 55, 0.6);
    }

    .back-count-label {
      font-family: 'Cinzel', serif;
      font-size: 10.5px;
      letter-spacing: 2px;
      color: #bfa87a;
      text-transform: uppercase;
      margin-top: 6px;
    }

    .btn-reopen {
      background: linear-gradient(135deg, #b8860b 0%, #f5db8b 50%, #9e7408 100%);
      color: #0b1522;
      font-family: 'Cinzel', Georgia, serif;
      font-size: 12.5px;
      font-weight: 700;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      border: 1px solid #ffe699;
      border-radius: 25px;
      padding: 10px 30px;
      cursor: pointer;
      box-shadow: 0 4px 15px rgba(0,0,0,0.6), 0 0 20px rgba(212,175,55,0.4);
      transition: all 0.3s ease;
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }

    .btn-reopen:hover {
      transform: translateY(-2px) scale(1.04);
      box-shadow: 0 6px 20px rgba(0,0,0,0.7), 0 0 30px rgba(212,175,55,0.6);
    }

    /* ==========================================================================
       BOTTOM CONTROL & NAVIGATION BAR
       ========================================================================== */
    .app-footer {
      background: rgba(14, 29, 47, 0.95);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      border-top: 1px solid rgba(212, 175, 55, 0.35);
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      z-index: 100;
      flex-wrap: wrap;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.4);
    }

    .nav-btn-group {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .nav-btn {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(212, 175, 55, 0.35);
      color: #f3e5ab;
      font-family: 'Cinzel', serif;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 1px;
      padding: 8px 18px;
      border-radius: 20px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: all 0.2s ease;
    }

    .nav-btn:hover:not(:disabled) {
      background: rgba(212, 175, 55, 0.25);
      border-color: #d4af37;
      color: #fff;
      transform: translateY(-1px);
    }

    .nav-btn:disabled {
      opacity: 0.35;
      cursor: not-allowed;
      border-color: rgba(255, 255, 255, 0.1);
    }

    .page-indicator-pill {
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(212, 175, 55, 0.45);
      color: #f7eed3;
      font-family: 'Cinzel', serif;
      font-size: 12.5px;
      font-weight: 700;
      letter-spacing: 1.5px;
      padding: 6px 18px;
      border-radius: 20px;
      min-width: 170px;
      text-align: center;
      box-shadow: inset 0 0 10px rgba(0,0,0,0.4);
    }

    .page-jump-container {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 11.5px;
      color: #bfa87a;
    }

    .jump-input {
      width: 48px;
      padding: 4px 6px;
      background: rgba(255, 255, 255, 0.1);
      border: 1px solid rgba(212, 175, 55, 0.35);
      border-radius: 4px;
      color: #fff;
      text-align: center;
      font-family: inherit;
      font-size: 12px;
      outline: none;
    }

    .jump-input:focus {
      border-color: #d4af37;
      background: rgba(255, 255, 255, 0.2);
    }

    .btn-jump {
      background: rgba(212, 175, 55, 0.2);
      border: 1px solid rgba(212, 175, 55, 0.4);
      color: #f3e5ab;
      font-size: 11px;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 4px;
      cursor: pointer;
    }

    .btn-jump:hover {
      background: #b8860b;
      color: #000;
    }

    /* Page Turn Hint Floaters on Left and Right */
    .turn-hint-left, .turn-hint-right {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: rgba(14, 29, 47, 0.7);
      border: 1px solid rgba(212, 175, 55, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #f3e5ab;
      cursor: pointer;
      opacity: 0.5;
      transition: all 0.2s ease;
      z-index: 80;
    }

    .turn-hint-left { left: 20px; }
    .turn-hint-right { right: 20px; }

    .turn-hint-left:hover, .turn-hint-right:hover {
      opacity: 1;
      background: rgba(212, 175, 55, 0.9);
      color: #0e1d2f;
      transform: translateY(-50%) scale(1.1);
    }

    /* ==========================================================================
       RESPONSIVE & MOBILE ADAPTATIONS
       ========================================================================== */
    @media (max-width: 1100px) {
      .app-header {
        padding: 8px 12px;
      }
      .brand-title {
        font-size: 14px;
      }
      .search-container {
        max-width: 260px;
      }
    }

    @media (max-width: 768px) {
      .main-stage {
        padding: 10px 4px;
        min-height: 520px;
      }
      .app-header {
        justify-content: center;
        gap: 10px;
      }
      .search-container {
        order: 3;
        width: 100%;
        max-width: 100%;
      }
      .app-footer {
        padding: 8px 10px;
        gap: 8px;
      }
      .nav-btn {
        padding: 6px 12px;
        font-size: 11px;
      }
      .page-indicator-pill {
        min-width: 140px;
        font-size: 11px;
        padding: 5px 12px;
      }
      .turn-hint-left, .turn-hint-right {
        display: none;
      }
    }
  </style>
</head>
<body>

  <!-- ========================================================================
       TOP HEADER WITH BRAND, LIVE SEARCH, & TOOLS
       ======================================================================== -->
  <header class="app-header">
    <div class="header-brand">
      <div class="brand-crest">
        <!-- Laurel Torch Emblem -->
        <svg viewBox="0 0 24 24">
          <path d="M12 2L9 9h6l-3-7zm-4.5 9c-.83 0-1.5.67-1.5 1.5 0 2.21 1.79 4 4 4v2.5c-2.76 0-5 2.24-5 5h14c0-2.76-2.24-5-5-5V16.5c2.21 0 4-1.79 4-4 0-.83-.67-1.5-1.5-1.5h-9z"/>
        </svg>
      </div>
      <div>
        <div class="brand-title">ALUMNI DIRECTORY</div>
        <div class="brand-subtitle">Dept. of Public Administration • USJP</div>
      </div>
    </div>

    <!-- Live Member Search -->
    <div class="search-container">
      <div class="search-input-wrap">
        <svg viewBox="0 0 24 24">
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        <input type="text" id="search-input" class="search-input" placeholder="Search by name, #, designation, office..." autocomplete="off">
        <button id="search-clear" class="search-clear">&times;</button>
      </div>
      <div id="search-dropdown" class="search-results-dropdown"></div>
    </div>

    <!-- Control Actions -->
    <div class="header-actions">
      <button id="btn-autoplay" class="tool-btn" title="Toggle automatic page turning">
        <span>▶</span> Auto Turn
      </button>
      <button id="btn-zoom" class="tool-btn" title="Toggle zoom fit / 100%">
        <span>🔍</span> Fit
      </button>
      <button id="btn-fullscreen" class="tool-btn" title="Toggle fullscreen">
        <span>⛶</span> Fullscreen
      </button>
    </div>
  </header>

  <!-- ========================================================================
       MAIN STAGE WITH 3D FLIP BOOK
       ======================================================================== -->
  <main class="main-stage">
    <!-- Click cues -->
    <button class="turn-hint-left" id="hint-prev" title="Turn to Previous Page">❮</button>
    <button class="turn-hint-right" id="hint-next" title="Turn to Next Page">❯</button>

    <div class="book-viewport" id="book-viewport">
      <div class="book-wrapper" id="book-wrapper">
        <div class="book" id="book">
          <!-- Stacked Page Thickness Edges -->
          <div class="book-edge-left" id="edge-left"></div>
          <div class="book-edge-right" id="edge-right"></div>
          <!-- Central Spine Shadow -->
          <div class="book-spine"></div>
          <!-- Sheets injected dynamically -->
        </div>
        <div class="desk-shadow"></div>
      </div>
    </div>
  </main>

  <!-- ========================================================================
       BOTTOM NAVIGATION CONTROLS
       ======================================================================== -->
  <footer class="app-footer">
    <div class="nav-btn-group">
      <button id="btn-first" class="nav-btn" title="Go to Front Cover">|◀ Cover</button>
      <button id="btn-prev" class="nav-btn" title="Previous Page (Left Arrow)">◀ Prev</button>
    </div>

    <div id="page-indicator" class="page-indicator-pill">Cover Page</div>

    <div class="nav-btn-group">
      <button id="btn-next" class="nav-btn" title="Next Page (Right Arrow)">Next ▶</button>
      <button id="btn-last" class="nav-btn" title="Go to Back Cover">End ▶|</button>
    </div>

    <div class="page-jump-container">
      <span>Page:</span>
      <input type="number" id="jump-page-input" class="jump-input" min="1" max="55" placeholder="1">
      <button id="btn-jump" class="btn-jump">Go</button>
    </div>
  </footer>

  <!-- ========================================================================
       MEMBER DATA & FLIPBOOK SCRIPT
       ======================================================================== -->
  <script>
    // ------------------------------------------------------------------------
    // MEMBER DATA (Life Members - USJP Alumni)
    // ------------------------------------------------------------------------
    const members = ${membersDataString};

    // ------------------------------------------------------------------------
    // FLIPBOOK CORE CONFIGURATION
    // ------------------------------------------------------------------------
    const RECORDS_PER_PAGE = 8;
    const totalMembers = members.length;
    const totalContentPages = Math.ceil(totalMembers / RECORDS_PER_PAGE); // 55
    const totalSheets = 29; // Sheet 0 (Cover) + Sheets 1..27 (Pages 1..54) + Sheet 28 (Page 55 & Back Cover)

    let currentSheet = 0; // 0 = Cover, 1 = Spread 1, ..., 29 = Back Cover
    let isAnimating = false;
    let autoPlayTimer = null;
    let isZoomed100 = false;

    // DOM Elements
    const bookEl = document.getElementById('book');
    const bookWrapperEl = document.getElementById('book-wrapper');
    const pageIndicatorEl = document.getElementById('page-indicator');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const btnFirst = document.getElementById('btn-first');
    const btnLast = document.getElementById('btn-last');
    const jumpInput = document.getElementById('jump-page-input');
    const btnJump = document.getElementById('btn-jump');
    const btnAutoplay = document.getElementById('btn-autoplay');
    const btnZoom = document.getElementById('btn-zoom');
    const btnFullscreen = document.getElementById('btn-fullscreen');
    const searchInput = document.getElementById('search-input');
    const searchDropdown = document.getElementById('search-dropdown');
    const searchClear = document.getElementById('search-clear');
    const hintPrev = document.getElementById('hint-prev');
    const hintNext = document.getElementById('hint-next');

    // Helper: Safe string display with '—' for empty
    function safeText(str) {
      if (str === null || str === undefined) return "—";
      const trimmed = String(str).trim();
      return trimmed.length > 0 ? trimmed : "—";
    }

    // Corner Ornaments SVG template
    const cornerSVG = \`
      <svg class="corner-ornament corner-tl" viewBox="0 0 100 100">
        <path d="M0,0 L100,0 C70,10 60,30 50,50 C40,70 30,60 0,100 L0,0 Z"/>
        <path d="M12,12 L80,12 C60,20 50,35 40,50 C30,60 20,50 12,80 L12,12 Z" fill="none" stroke="#d4af37" stroke-width="2"/>
        <circle cx="25" cy="25" r="4"/>
      </svg>
      <svg class="corner-ornament corner-tr" viewBox="0 0 100 100">
        <path d="M0,0 L100,0 C70,10 60,30 50,50 C40,70 30,60 0,100 L0,0 Z"/>
        <path d="M12,12 L80,12 C60,20 50,35 40,50 C30,60 20,50 12,80 L12,12 Z" fill="none" stroke="#d4af37" stroke-width="2"/>
        <circle cx="25" cy="25" r="4"/>
      </svg>
      <svg class="corner-ornament corner-bl" viewBox="0 0 100 100">
        <path d="M0,0 L100,0 C70,10 60,30 50,50 C40,70 30,60 0,100 L0,0 Z"/>
        <path d="M12,12 L80,12 C60,20 50,35 40,50 C30,60 20,50 12,80 L12,12 Z" fill="none" stroke="#d4af37" stroke-width="2"/>
        <circle cx="25" cy="25" r="4"/>
      </svg>
      <svg class="corner-ornament corner-br" viewBox="0 0 100 100">
        <path d="M0,0 L100,0 C70,10 60,30 50,50 C40,70 30,60 0,100 L0,0 Z"/>
        <path d="M12,12 L80,12 C60,20 50,35 40,50 C30,60 20,50 12,80 L12,12 Z" fill="none" stroke="#d4af37" stroke-width="2"/>
        <circle cx="25" cy="25" r="4"/>
      </svg>
    \`;

    // Render a single member table row
    function renderMemberRow(m, globalIndex) {
      const num = safeText(m.membershipNo);
      const name = safeText(m.name);
      const amLm = m.amLm && m.amLm.trim() ? m.amLm.trim() : "";
      const desig = safeText(m.designation);
      const office = safeText(m.office);
      const tel = safeText(m.tel);
      const resNo = safeText(m.residenceNo);
      const email = safeText(m.email);
      const addr = safeText(m.address);
      const grad = safeText(m.graduation);

      const pillHtml = amLm 
        ? \`<span class="lm-pill">\${amLm}</span>\` 
        : \`<span style="color:#aaa;">—</span>\`;

      return \`
        <tr class="member-row" data-index="\${globalIndex}" data-mem-no="\${num}" id="member-row-\${globalIndex}">
          <td class="col-no">\${num}</td>
          <td class="col-name-role">
            <div class="name-badge-wrap">
              <span class="member-name">\${name}</span>
              \${pillHtml}
            </div>
            <div class="field-item"><span class="field-lbl">Desig:</span> \${desig}</div>
            <div class="field-item"><span class="field-lbl">Office:</span> \${office}</div>
          </td>
          <td class="col-contact">
            <div class="field-item"><span class="field-lbl">Tel:</span> \${tel}</div>
            <div class="field-item"><span class="field-lbl">Res:</span> \${resNo}</div>
            <div class="field-item"><span class="field-lbl">Email:</span> <span class="email-val">\${email}</span></div>
            <div class="field-item"><span class="field-lbl">Addr:</span> \${addr}</div>
          </td>
          <td class="col-class">
            <span class="class-year">\${grad}</span>
          </td>
        </tr>
      \`;
    }

    // Render a content page (with 8 records)
    function renderContentPage(pageNum) {
      const startIndex = (pageNum - 1) * RECORDS_PER_PAGE;
      const pageMembers = members.slice(startIndex, startIndex + RECORDS_PER_PAGE);

      let rowsHtml = pageMembers.map((m, idx) => renderMemberRow(m, startIndex + idx)).join('');

      let extraContentHtml = '';
      // If it is the final content page (Page 55), add the Directory Summary milestone card
      if (pageNum === totalContentPages) {
        extraContentHtml = \`
          <div class="summary-milestone-card">
            <h3>Directory Complete</h3>
            <p>Department of Public Administration • Faculty of Management Studies & Commerce</p>
            <div class="summary-stats-flex">
              <div class="stat-pill">
                <div class="stat-pill-val">\${totalMembers}</div>
                <div class="stat-pill-lbl">Life Members</div>
              </div>
              <div class="stat-pill">
                <div class="stat-pill-val">1963 – 2019</div>
                <div class="stat-pill-lbl">Alumni Cohorts</div>
              </div>
              <div class="stat-pill">
                <div class="stat-pill-val">55</div>
                <div class="stat-pill-lbl">Total Pages</div>
              </div>
            </div>
            <button class="nav-btn" style="margin: 0 auto; background:#1b3552; color:#f3e5ab;" onclick="goToSheet(totalSheets)">
              Proceed to Back Cover ❯
            </button>
          </div>
        \`;
      }

      return \`
        <div class="page-lighting"></div>
        <div class="page-header">
          <div class="page-header-left">
            <div class="page-header-dept">Dept. of Public Administration • USJP</div>
            <div class="page-header-title">Life Members Directory</div>
          </div>
          <div class="page-header-num">Page \${pageNum} of \${totalContentPages}</div>
        </div>
        <div class="table-scroll-wrap">
          <table class="member-table">
            <thead>
              <tr>
                <th class="col-no">#</th>
                <th class="col-name-role">Member & Professional Role</th>
                <th class="col-contact">Contact Information</th>
                <th class="col-class">Class</th>
              </tr>
            </thead>
            <tbody>
              \${rowsHtml}
            </tbody>
          </table>
          \${extraContentHtml}
        </div>
        <div class="page-footer">
          <div class="page-footer-text">University of Sri Jayewardenepura</div>
          <div class="page-footer-num">\${pageNum}</div>
        </div>
      \`;
    }

    // Build all Sheets in the DOM
    function buildBookDOM() {
      let sheetsHtml = '';

      // --- SHEET 0: Front Cover / Inside Front Cover ---
      sheetsHtml += \`
        <div class="sheet" id="sheet-0" data-sheet-index="0">
          <!-- Front Cover -->
          <div class="page page-front cover-front">
            <div class="page-lighting"></div>
            <div class="cover-inner-border">
              \${cornerSVG}
              <div class="cover-header-group">
                <div class="cover-institution-main">University of Sri Jayewardenepura</div>
                <div class="cover-faculty">Faculty of Management Studies & Commerce</div>
                <div class="cover-department">Department of Public Administration</div>
                <div class="cover-divider"></div>
                <h1 class="cover-title">MEMBERSHIP<br>DIRECTORY</h1>
                <div class="cover-subtitle-pill">LIFE MEMBERS (LM)</div>
              </div>
              <div class="cover-crest-container">
                <div class="cover-crest-circle">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z"/>
                  </svg>
                </div>
                <div class="cover-alumni-tag">Alumni Association Official Registry</div>
              </div>
              <div class="cover-cta-group">
                <button class="btn-open-book" id="btn-open-book">
                  <span>Open Book</span> 📖
                </button>
                <div class="cover-hint">Click book or press Right Arrow (→) to browse</div>
              </div>
            </div>
          </div>

          <!-- Inside Front Cover -->
          <div class="page page-back inside-cover">
            <div class="page-lighting"></div>
            <div class="inside-border">
              <div>
                <div class="inside-header-meta">
                  <div class="inside-inst-title">University of Sri Jayewardenepura</div>
                  <div class="inside-dept-title">Faculty of Management Studies & Commerce • Dept. of Public Administration</div>
                </div>
                <h2 class="inside-heading">Life Members Directory</h2>
                <p class="inside-intro-text">
                  Welcome to the Official Directory of Life Members (LM) of the Alumni Association. 
                  This registry commemorates the distinguished service, academic excellence, and fellowship of graduates 
                  and faculty members of the Department of Public Administration spanning over five decades.
                </p>

                <div class="stats-card-group">
                  <div class="stat-mini-box">
                    <div class="stat-mini-num">\${totalMembers}</div>
                    <div class="stat-mini-lbl">Life Members</div>
                  </div>
                  <div class="stat-mini-box">
                    <div class="stat-mini-num">55</div>
                    <div class="stat-mini-lbl">Pages</div>
                  </div>
                  <div class="stat-mini-box">
                    <div class="stat-mini-num">1963-2019</div>
                    <div class="stat-mini-lbl">Classes</div>
                  </div>
                </div>

                <div class="legend-card">
                  <div class="legend-title">Directory Legend & Key</div>
                  <div class="legend-grid">
                    <div class="legend-item"><span class="lm-pill">LM</span> Life Member</div>
                    <div class="legend-item"><strong>#</strong> Membership Number</div>
                    <div class="legend-item"><strong>Class:</strong> Year of Graduation</div>
                    <div class="legend-item"><strong>Desig:</strong> Official Role</div>
                  </div>
                </div>
              </div>

              <div class="toc-container">
                <div class="toc-title">Quick Jump Index</div>
                <div class="toc-grid">
                  <div class="toc-link" onclick="goToPage(1)">Page 1 (#1)</div>
                  <div class="toc-link" onclick="goToPage(10)">Page 10 (#73)</div>
                  <div class="toc-link" onclick="goToPage(20)">Page 20 (#153)</div>
                  <div class="toc-link" onclick="goToPage(30)">Page 30 (#233)</div>
                  <div class="toc-link" onclick="goToPage(40)">Page 40 (#313)</div>
                  <div class="toc-link" onclick="goToPage(50)">Page 50 (#393)</div>
                </div>
              </div>

              <div class="inside-nav-tip">
                Navigation tip: Click right side of book or use arrow keys (← →) to flip pages.
              </div>
            </div>
          </div>
        </div>
      \`;

      // --- SHEETS 1 THROUGH 27: Content Pages 1 to 54 ---
      for (let s = 1; s <= 27; s++) {
        const frontPageNum = (s * 2) - 1; // 1, 3, 5, ..., 53
        const backPageNum = s * 2;        // 2, 4, 6, ..., 54

        sheetsHtml += \`
          <div class="sheet" id="sheet-\${s}" data-sheet-index="\${s}">
            <div class="page page-front content-page">
              \${renderContentPage(frontPageNum)}
            </div>
            <div class="page page-back content-page">
              \${renderContentPage(backPageNum)}
            </div>
          </div>
        \`;
      }

      // --- SHEET 28: Content Page 55 & Outside Back Cover ---
      sheetsHtml += \`
        <div class="sheet" id="sheet-28" data-sheet-index="28">
          <!-- Front: Final Content Page 55 -->
          <div class="page page-front content-page">
            \${renderContentPage(55)}
          </div>

          <!-- Back: Outside Back Cover -->
          <div class="page page-back cover-back">
            <div class="page-lighting"></div>
            <div class="cover-inner-border">
              \${cornerSVG}
              <div class="cover-header-group">
                <div class="back-cover-inst">University of Sri Jayewardenepura</div>
                <div class="back-cover-dept">Department of Public Administration</div>
                <h2 class="back-cover-title">END OF DIRECTORY</h2>
                <div class="back-cover-subtitle">Official Life Members Roll</div>
              </div>

              <div class="back-count-container">
                <div class="back-count-num">\${totalMembers}</div>
                <div class="back-count-label">Total Registered Life Members</div>
              </div>

              <div class="cover-crest-container">
                <div class="cover-crest-circle">
                  <svg viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14.5v-9l6 4.5-6 4.5z"/>
                  </svg>
                </div>
                <div class="cover-alumni-tag" style="margin-top: 12px; line-height: 1.4;">
                  Faculty of Management Studies & Commerce<br>
                  <span style="font-size: 10px; opacity: 0.85;">Alumni Association • Sri Lanka</span>
                </div>
              </div>

              <div class="cover-cta-group">
                <button class="btn-reopen" id="btn-reopen">
                  <span>↻ Return to Cover</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      \`;

      bookEl.insertAdjacentHTML('beforeend', sheetsHtml);
    }

    // Update Z-indexes of all sheets based on current state
    function updateZIndexes() {
      const sheets = document.querySelectorAll('.sheet');
      sheets.forEach((sheet, idx) => {
        if (idx < currentSheet) {
          sheet.style.zIndex = idx + 1;
        } else {
          sheet.style.zIndex = totalSheets - idx;
        }
      });
    }

    // Update Book Centering, Page Indicator, and Navigation Controls
    function updateBookState() {
      const sheets = document.querySelectorAll('.sheet');

      // Update .flipped classes on sheets
      sheets.forEach((sheet, idx) => {
        if (idx < currentSheet) {
          sheet.classList.add('flipped');
        } else {
          sheet.classList.remove('flipped');
        }
      });

      // Update Horizontal Book Centering Translation
      if (currentSheet === 0) {
        bookEl.style.transform = 'translateX(-265px)';
      } else if (currentSheet >= totalSheets) {
        bookEl.style.transform = 'translateX(265px)';
      } else {
        bookEl.style.transform = 'translateX(0)';
      }

      // Update Page Indicator Label
      if (currentSheet === 0) {
        pageIndicatorEl.textContent = 'Cover Page';
      } else if (currentSheet === 1) {
        pageIndicatorEl.textContent = 'Guide / Page 1 of 55';
      } else if (currentSheet === 28) {
        pageIndicatorEl.textContent = 'Pages 54 – 55 of 55';
      } else if (currentSheet >= totalSheets) {
        pageIndicatorEl.textContent = 'Back Cover (End)';
      } else {
        const leftPage = (currentSheet * 2) - 2;
        const rightPage = (currentSheet * 2) - 1;
        pageIndicatorEl.textContent = \`Pages \${leftPage} – \${rightPage} of \${totalContentPages}\`;
      }

      // Update Nav Buttons
      btnPrev.disabled = (currentSheet === 0);
      btnFirst.disabled = (currentSheet === 0);
      btnNext.disabled = (currentSheet >= totalSheets);
      btnLast.disabled = (currentSheet >= totalSheets);

      // Layered Edge thickness visibility
      document.getElementById('edge-left').style.opacity = currentSheet === 0 ? '0' : '1';
      document.getElementById('edge-right').style.opacity = currentSheet >= totalSheets ? '0' : '1';

      // Update static Z-indexes
      updateZIndexes();
    }

    // Turn to Next Sheet
    function nextPage() {
      if (isAnimating || currentSheet >= totalSheets) return;
      isAnimating = true;

      const sheetToFlip = document.getElementById(\`sheet-\${currentSheet}\`);
      sheetToFlip.style.zIndex = 1000;
      sheetToFlip.classList.add('flipping');
      sheetToFlip.classList.add('flipped');

      currentSheet++;

      // Centering shift
      if (currentSheet === 1) {
        bookEl.style.transform = 'translateX(0)';
      } else if (currentSheet >= totalSheets) {
        bookEl.style.transform = 'translateX(265px)';
      }

      setTimeout(() => {
        sheetToFlip.classList.remove('flipping');
        updateBookState();
        isAnimating = false;
      }, 850);
    }

    // Turn to Previous Sheet
    function prevPage() {
      if (isAnimating || currentSheet <= 0) return;
      isAnimating = true;

      const sheetToFlip = document.getElementById(\`sheet-\${currentSheet - 1}\`);
      sheetToFlip.style.zIndex = 1000;
      sheetToFlip.classList.add('flipping');
      sheetToFlip.classList.remove('flipped');

      currentSheet--;

      // Centering shift
      if (currentSheet === 0) {
        bookEl.style.transform = 'translateX(-265px)';
      } else {
        bookEl.style.transform = 'translateX(0)';
      }

      setTimeout(() => {
        sheetToFlip.classList.remove('flipping');
        updateBookState();
        isAnimating = false;
      }, 850);
    }

    // Direct Jump to a specific sheet (instant or quick)
    function goToSheet(targetSheet) {
      if (targetSheet < 0) targetSheet = 0;
      if (targetSheet > totalSheets) targetSheet = totalSheets;
      if (targetSheet === currentSheet) return;

      const sheets = document.querySelectorAll('.sheet');
      sheets.forEach(s => s.classList.add('instant'));

      currentSheet = targetSheet;
      updateBookState();

      void bookEl.offsetWidth;
      setTimeout(() => {
        sheets.forEach(s => s.classList.remove('instant'));
      }, 50);
    }

    // Jump to Content Page number (1 to 55)
    function goToPage(pageNumber) {
      pageNumber = parseInt(pageNumber, 10);
      if (isNaN(pageNumber) || pageNumber < 1) pageNumber = 1;
      if (pageNumber > totalContentPages) pageNumber = totalContentPages;

      let targetSheet = 1;
      if (pageNumber >= 2) {
        targetSheet = Math.floor(pageNumber / 2) + 1;
      }
      goToSheet(targetSheet);
    }

    // ------------------------------------------------------------------------
    // RESPONSIVE AUTO-SCALING
    // ------------------------------------------------------------------------
    function handleResize() {
      if (isZoomed100) {
        bookWrapperEl.style.transform = 'scale(1)';
        return;
      }

      const availWidth = window.innerWidth - (window.innerWidth < 768 ? 16 : 48);
      const availHeight = window.innerHeight - (window.innerWidth < 768 ? 150 : 180);

      const scaleX = availWidth / 1060;
      const scaleY = availHeight / 730;
      const fitScale = Math.min(1.15, Math.min(scaleX, scaleY));

      bookWrapperEl.style.transform = \`scale(\${Math.max(0.32, fitScale)})\`;
    }

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    // ------------------------------------------------------------------------
    // EVENT LISTENERS & INTERACTIONS
    // ------------------------------------------------------------------------

    // Click on Book: Left half = Prev, Right half = Next
    bookEl.addEventListener('click', (e) => {
      if (e.target.closest('button, input, select, a, .toc-link, .search-result-item')) {
        return;
      }

      const rect = bookEl.getBoundingClientRect();
      const clickX = e.clientX - rect.left;

      if (currentSheet === 0) {
        nextPage();
        return;
      }

      if (currentSheet >= totalSheets) {
        prevPage();
        return;
      }

      if (clickX >= rect.width / 2) {
        nextPage();
      } else {
        prevPage();
      }
    });

    // Keyboard Arrow Keys
    document.addEventListener('keydown', (e) => {
      if (e.target.closest('input, textarea, select')) return;

      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prevPage();
      } else if (e.key === 'Home') {
        e.preventDefault();
        goToSheet(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goToSheet(totalSheets);
      }
    });

    // Button Listeners
    btnNext.addEventListener('click', nextPage);
    btnPrev.addEventListener('click', prevPage);
    btnFirst.addEventListener('click', () => goToSheet(0));
    btnLast.addEventListener('click', () => goToSheet(totalSheets));

    hintNext.addEventListener('click', nextPage);
    hintPrev.addEventListener('click', prevPage);

    // Jump Input
    btnJump.addEventListener('click', () => {
      const p = parseInt(jumpInput.value, 10);
      if (p) goToPage(p);
    });

    jumpInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const p = parseInt(jumpInput.value, 10);
        if (p) goToPage(p);
      }
    });

    // Cover & Back Buttons
    document.addEventListener('click', (e) => {
      if (e.target.closest('#btn-open-book')) {
        nextPage();
      }
      if (e.target.closest('#btn-reopen')) {
        goToSheet(0);
      }
    });

    // Auto Play / Auto Turn Toggle
    btnAutoplay.addEventListener('click', () => {
      if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
        btnAutoplay.classList.remove('active');
        btnAutoplay.innerHTML = '<span>▶</span> Auto Turn';
      } else {
        btnAutoplay.classList.add('active');
        btnAutoplay.innerHTML = '<span>⏸</span> Pause';
        autoPlayTimer = setInterval(() => {
          if (currentSheet >= totalSheets) {
            goToSheet(0);
          } else {
            nextPage();
          }
        }, 3200);
      }
    });

    // Zoom Toggle
    btnZoom.addEventListener('click', () => {
      isZoomed100 = !isZoomed100;
      if (isZoomed100) {
        btnZoom.classList.add('active');
        btnZoom.innerHTML = '<span>🔍</span> 100%';
        bookWrapperEl.style.transform = 'scale(1)';
      } else {
        btnZoom.classList.remove('active');
        btnZoom.innerHTML = '<span>🔍</span> Fit';
        handleResize();
      }
    });

    // Fullscreen Toggle
    btnFullscreen.addEventListener('click', () => {
      if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
        btnFullscreen.classList.add('active');
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
          btnFullscreen.classList.remove('active');
        }
      }
    });

    // ------------------------------------------------------------------------
    // LIVE MEMBER SEARCH & ROW HIGHLIGHTING
    // ------------------------------------------------------------------------
    searchInput.addEventListener('input', () => {
      const q = searchInput.value.trim().toLowerCase();
      if (!q) {
        searchDropdown.style.display = 'none';
        searchClear.style.display = 'none';
        return;
      }

      searchClear.style.display = 'block';

      const matches = [];
      for (let i = 0; i < members.length; i++) {
        const m = members[i];
        const str = [
          m.name, m.membershipNo, m.office, m.designation, 
          m.address, m.email, m.tel, m.graduation
        ].join(' ').toLowerCase();

        if (str.includes(q)) {
          matches.push({ member: m, index: i });
          if (matches.length >= 12) break;
        }
      }

      if (matches.length === 0) {
        searchDropdown.innerHTML = '<div style="padding: 12px; color: #bfa87a; font-size: 12px; text-align: center;">No matching members found</div>';
      } else {
        searchDropdown.innerHTML = matches.map(match => {
          const page = Math.floor(match.index / RECORDS_PER_PAGE) + 1;
          return \`
            <div class="search-result-item" data-page="\${page}" data-index="\${match.index}">
              <div class="search-res-info">
                <div class="search-res-name">\${safeText(match.member.name)} (#\${safeText(match.member.membershipNo)})</div>
                <div class="search-res-sub">\${safeText(match.member.designation)} • \${safeText(match.member.office)}</div>
              </div>
              <div class="search-res-page">Page \${page}</div>
            </div>
          \`;
        }).join('');
      }

      searchDropdown.style.display = 'block';
    });

    searchClear.addEventListener('click', () => {
      searchInput.value = '';
      searchDropdown.style.display = 'none';
      searchClear.style.display = 'none';
      document.querySelectorAll('.member-row.highlighted').forEach(r => r.classList.remove('highlighted'));
    });

    searchDropdown.addEventListener('click', (e) => {
      const item = e.target.closest('.search-result-item');
      if (!item) return;

      const page = parseInt(item.dataset.page, 10);
      const globalIndex = item.dataset.index;

      goToPage(page);
      searchDropdown.style.display = 'none';

      setTimeout(() => {
        document.querySelectorAll('.member-row.highlighted').forEach(r => r.classList.remove('highlighted'));
        const row = document.getElementById(\`member-row-\${globalIndex}\`);
        if (row) {
          row.classList.add('highlighted');
          row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }, 200);
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search-container')) {
        searchDropdown.style.display = 'none';
      }
    });

    // ------------------------------------------------------------------------
    // TOUCH SWIPE SUPPORT FOR MOBILE
    // ------------------------------------------------------------------------
    let touchStartX = 0;
    let touchStartY = 0;

    bookEl.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].clientX;
      touchStartY = e.changedTouches[0].clientY;
    }, { passive: true });

    bookEl.addEventListener('touchend', (e) => {
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const dx = touchEndX - touchStartX;
      const dy = touchEndY - touchStartY;

      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        if (dx < 0) {
          nextPage();
        } else {
          prevPage();
        }
      }
    }, { passive: true });

    // ------------------------------------------------------------------------
    // INITIALIZATION
    // ------------------------------------------------------------------------
    window.addEventListener('DOMContentLoaded', () => {
      buildBookDOM();
      updateBookState();
      handleResize();
    });
  </script>
</body>
</html>
`;

fs.writeFileSync('/Users/yasiru/Desktop/Alumni/index.html', html, 'utf8');
console.log("Updated index.html with complete institutional branding! File size:", html.length);
