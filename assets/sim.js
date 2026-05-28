(function() {
  // ===== Mobile hamburger menu =====
  const hamburger = document.getElementById('nav-hamburger');
  const navLinks  = document.querySelector('nav.links');
  const overlay   = document.getElementById('nav-overlay');
  if (hamburger && navLinks && overlay) {
    const open  = () => { hamburger.classList.add('is-open'); navLinks.classList.add('is-open'); overlay.classList.add('is-open'); document.body.style.overflow = 'hidden'; };
    const close = () => { hamburger.classList.remove('is-open'); navLinks.classList.remove('is-open'); overlay.classList.remove('is-open'); document.body.style.overflow = ''; };
    hamburger.addEventListener('click', () => hamburger.classList.contains('is-open') ? close() : open());
    overlay.addEventListener('click', close);
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
  }

  // ===== Hero parallax =====
  const heroBg = document.querySelector('.hero-parallax-bg');
  if (heroBg) {
    const onScroll = () => {
      heroBg.style.transform = 'translateY(' + (window.scrollY * 0.35) + 'px)';
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  // ===== FAQ accordion =====
  document.querySelectorAll('.faq-item .faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const open = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!open) item.classList.add('open');
    });
  });

  // ===== Smooth scroll for in-page anchors =====
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1) {
        const el = document.querySelector(id);
        if (el) {
          e.preventDefault();
          window.scrollTo({top: el.offsetTop - 70, behavior:'smooth'});
        }
      }
    });
  });

  // ===== CONSÓRCIO COM DATA CERTA — SIMULATOR =====
  // Calibrated against three real datapoints:
  // (1) credit=R$50.000, mês=12, com seguro → parcela R$1.277, taxa 1,93%, total R$91.209
  // (2) credit=R$60.000, mês=12, com seguro → parcela R$1.533, taxa 1,93%, total R$109.451
  //                                sem seguro → parcela R$1.506, taxa 1,91%, total R$109.072
  // (3) credit=R$70.000, mês=24, com seguro → parcela R$1.555, taxa 1,45%, total R$111.425
  //                                sem seguro → parcela R$1.524, taxa 1,43%, total R$110.841
  // Linear-in-M model; seguro applies as a small uplift on parcela (~2%) and total (~0.5%).

  const $credit = document.getElementById('sim-credit');
  if (!$credit) return; // not on a page with the simulator

  const TERM_STEPS = [12, 18, 24, 36];

  const FIN_TAXA_AM = 0.0230;
  const FIN_TERM = 72; // 6 years

  let segState = 'com'; // 'sem' | 'com'

  const $term = document.getElementById('sim-term');
  const $creditVal = document.getElementById('sim-credit-val');
  const $termVal = document.getElementById('sim-term-val');
  const $rcMes = document.getElementById('rc-mes');
  const $cParcela = document.getElementById('rc-c-parcela');
  const $cTaxa = document.getElementById('rc-c-taxa');
  const $cTotal = document.getElementById('rc-c-total');
  const $fParcela = document.getElementById('rc-f-parcela');
  const $fTaxa = document.getElementById('rc-f-taxa');
  const $fTotal = document.getElementById('rc-f-total');
  const $cbCTotal = document.getElementById('cb-c-total');
  const $cbFTotal = document.getElementById('cb-f-total');
  const $cbCCredit = document.getElementById('cb-c-credit');
  const $cbCExtra = document.getElementById('cb-c-extra');
  const $cbFCredit = document.getElementById('cb-f-credit');
  const $cbFExtra = document.getElementById('cb-f-extra');
  const $cbDiff = document.getElementById('cb-diff');
  const $cbSegLabel = document.getElementById('cb-seg-label');

  function fmt(n) { return Math.round(n).toLocaleString('pt-BR'); }
  function fmtCredit(n) { return n.toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}); }
  function fmtPct(n) { return n.toFixed(2).replace('.', ','); }

  function updateRangeFill(input) {
    const min = +input.min, max = +input.max, val = +input.value;
    const p = ((val - min) / (max - min)) * 100;
    input.style.setProperty('--p', p + '%');
  }

  function pmt(principal, rate, term) {
    return principal * (rate * Math.pow(1+rate, term)) / (Math.pow(1+rate, term) - 1);
  }

  function recalc() {
    const credit = +$credit.value;
    const mes = TERM_STEPS[+$term.value];

    const totalFactorCom = 2.0566 - 0.01937 * mes;
    const parcelaRatioCom = 0.02888 - 0.000278 * mes;
    const taxaPctCom = 2.41 - 0.04 * mes;

    const segP    = (segState === 'com') ? 1.0 : (0.98472 - 0.000194 * mes);
    const segT    = (segState === 'com') ? 1.0 : (0.99832 - 0.0001483 * mes);
    const segTaxa = (segState === 'com') ? 1.0 : (0.99305 - 0.000285 * mes);

    const consTotal = credit * totalFactorCom * segT;
    const consParcela = credit * parcelaRatioCom * segP;
    const consTaxaAm = taxaPctCom * segTaxa;

    const finParcela = pmt(credit, FIN_TAXA_AM, FIN_TERM);
    const finTotal = finParcela * FIN_TERM;
    const finTaxaAm = FIN_TAXA_AM * 100;

    const diff = Math.max(0, finTotal - consTotal);

    const maxTotal = Math.max(consTotal, finTotal);
    const cCreditW = (credit / consTotal) * 100;
    const cExtraW  = 100 - cCreditW;
    const fCreditW = (credit / finTotal) * 100;
    const fExtraW  = 100 - fCreditW;
    const cBarScale = (consTotal / maxTotal) * 100;
    const fBarScale = (finTotal / maxTotal) * 100;

    $creditVal.textContent = fmtCredit(credit);
    $termVal.textContent = mes;
    $rcMes.textContent = mes + 'º';
    $cParcela.textContent = fmt(consParcela);
    $cTaxa.textContent = fmtPct(consTaxaAm);
    $cTotal.textContent = fmt(consTotal);
    $fParcela.textContent = fmt(finParcela);
    $fTaxa.textContent = fmtPct(finTaxaAm);
    $fTotal.textContent = fmt(finTotal);
    $cbCTotal.textContent = fmt(consTotal);
    $cbFTotal.textContent = fmt(finTotal);
    $cbDiff.textContent = fmt(diff);

    const cParent = $cbCCredit.parentElement;
    const fParent = $cbFCredit.parentElement;
    cParent.style.width = cBarScale + '%';
    fParent.style.width = fBarScale + '%';
    $cbCCredit.style.width = cCreditW + '%';
    $cbCExtra.style.width = cExtraW + '%';
    $cbFCredit.style.width = fCreditW + '%';
    $cbFExtra.style.width = fExtraW + '%';

    $cbSegLabel.textContent = '(' + (segState === 'com' ? 'Com Seguro' : 'Sem Seguro') + ')';

    updateRangeFill($credit);
    updateRangeFill($term);
  }

  document.querySelectorAll('.seg-opt').forEach(b => {
    b.addEventListener('click', () => {
      segState = b.dataset.seg;
      document.querySelectorAll('.seg-opt').forEach(x => x.classList.toggle('active', x === b));
      recalc();
    });
  });
  $credit.addEventListener('input', recalc);
  $term.addEventListener('input', recalc);
  recalc();

  // Phone mask
  const $phone = document.getElementById('sim-phone');
  if ($phone) {
    $phone.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '').slice(0, 11);
      if (v.length > 10) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`;
      else if (v.length > 6) v = `(${v.slice(0,2)}) ${v.slice(2,6)}-${v.slice(6)}`;
      else if (v.length > 2) v = `(${v.slice(0,2)}) ${v.slice(2)}`;
      else if (v.length > 0) v = `(${v}`;
      e.target.value = v;
    });
  }

  window.submitSim = function(e) {
    e.preventDefault();
    const name = document.getElementById('sim-name').value.trim();
    const phone = document.getElementById('sim-phone').value.trim();
    const email = document.getElementById('sim-email').value.trim();
    const credit = fmt(+$credit.value);
    const mes = $term.value;
    const parcela = $cParcela.textContent;
    const total = $cTotal.textContent;

    const msg = `Olá! Sou ${name}.\n\nFiz uma simulação de Consórcio com Data Certa no site da Invista:\n• Valor do crédito: R$ ${credit}\n• Contemplação: ${mes}º mês\n• Seguro: ${segState === 'com' ? 'Com' : 'Sem'}\n• Parcela inicial: R$ ${parcela}\n• Total a pagar: R$ ${total}\n\nGostaria de receber a proposta personalizada.\nE-mail: ${email}`;
    const wa = `https://wa.me/5511940400000?text=${encodeURIComponent(msg)}`;
    window.open(wa, '_blank');
    return false;
  };
})();
