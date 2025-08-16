// webbasd post generator - Script
(function(){
  const el = sel => document.querySelector(sel);

  const stage = el('#stage');
  const card  = el('#card');
  const poetry = el('#poetry');
  const credit = el('#credit');

  const ratioSel = el('#ratio');
  const padding = el('#padding');
  const radius = el('#radius');
  const shadow = el('#shadow');

  const bgPreset = el('#bgPreset');
  const bgCss = el('#bgCss');
  const bgImage = el('#bgImage');
  const clearBgImage = el('#clearBgImage');
  const bgOpacity = el('#bgOpacity');
  const bgBlur = el('#bgBlur');

  const fontFamily = el('#fontFamily');
  const fontSize = el('#fontSize');
  const lineHeight = el('#lineHeight');
  const textColor = el('#textColor');
  const centerText = el('#centerText');
  const textShadow = el('#textShadow');

  const creditToggle = el('#creditToggle');
  const creditSize = el('#creditSize');
  const creditColor = el('#creditColor');
  const creditAlign = el('#creditAlign');

  const btnExport = el('#btnExport');
  const btnShare  = el('#btnShare');
  const btnReset  = el('#btnReset');
  const btnSave   = el('#btnSave');
  const btnLoad   = el('#btnLoad');

  // Helpers
  function setAspect(ratio){
    const [w,h] = ratio.split(':').map(Number);
    stage.style.aspectRatio = `${w}/${h}`;
  }

  function applyState(s){
    if(!s) return;
    card.style.background = s.bg;
    poetry.style.setProperty('--pad', `${s.pad}px`);
    card.style.setProperty('--radius', `${s.radius}px`);
    card.classList.toggle('round', s.radius > 0);
    card.classList.toggle('shadow', s.shadow);

    card.style.setProperty('--bg-opacity', s.bgOpacity);
    card.style.setProperty('--bg-blur', `blur(${s.bgBlur}px)`);

    poetry.style.setProperty('--fs', `${s.fontSize}px`);
    poetry.style.setProperty('--lh', s.lineHeight);
    poetry.style.setProperty('--fc', s.textColor);
    poetry.style.setProperty('--ts', s.textShadow ? '0 2px 18px rgba(0,0,0,.55)' : 'none');
    poetry.style.fontFamily = s.fontFamily;
    poetry.style.textAlign = s.centerText ? 'center' : 'right';

    credit.style.display = s.creditToggle ? 'block' : 'none';
    credit.style.setProperty('--cs', `${s.creditSize}px`);
    credit.style.setProperty('--cc', s.creditColor);
    credit.style.textAlign = s.creditAlign === 'start' ? 'left' : (s.creditAlign === 'center' ? 'center' : 'right');

    setAspect(s.ratio);

    // Image layer
    const url = s.bgImageUrl || '';
    card.style.setProperty('--bg-opacity', s.bgOpacity);
    card.style.setProperty('--bg-blur', `blur(${s.bgBlur}px)`);
    card.style.setProperty('--radius', `${s.radius}px`);
    card.classList.toggle('shadow', s.shadow);
    card.classList.toggle('round', s.radius>0);
    card.style.setProperty('--bg-image', url);
    card.style.setProperty('--bg-opacity', s.bgOpacity);

    card.style.setProperty('--bg-blur', `blur(${s.bgBlur}px)`);
    card.style.setProperty('--radius', `${s.radius}px`);
    if(url){
      card.style.setProperty('--bg-opacity', s.bgOpacity);
      card.style.setProperty('--bg-blur', `blur(${s.bgBlur}px)`);
      card.style.setProperty('--bg-image', `url(${url})`);
      card.style.setProperty('--bg-opacity', s.bgOpacity);
      card.style.setProperty('--bg-blur', `blur(${s.bgBlur}px)`);
      // Set ::before background-image via CSS var not directly accessible; fallback by inline style on ::before isn't possible.
      // We will use a dedicated overlay element approach:
      ensureOverlay(url);
    }else{
      removeOverlay();
    }
  }

  function ensureOverlay(url){
    let overlay = card.querySelector('.bg-overlay');
    if(!overlay){
      overlay = document.createElement('div');
      overlay.className = 'bg-overlay';
      overlay.style.position='absolute';
      overlay.style.inset='0';
      overlay.style.backgroundSize='cover';
      overlay.style.backgroundPosition='center';
      overlay.style.zIndex='0';
      card.prepend(overlay);
    }
    overlay.style.backgroundImage = `url(${url})`;
    overlay.style.opacity = state.bgOpacity;
    overlay.style.filter = `blur(${state.bgBlur}px)`;
  }
  function removeOverlay(){
    const overlay = card.querySelector('.bg-overlay');
    if(overlay) overlay.remove();
  }

  const defaultState = {
    ratio: '1:1',
    pad: 24,
    radius: 24,
    shadow: true,
    bg: 'linear-gradient(145deg,#0b1a4a,#112e7a 40%,#a32020)',
    bgImageUrl: '',
    bgOpacity: 1,
    bgBlur: 0,
    fontFamily: "'Noto Nastaliq Urdu', serif",
    fontSize: 36,
    lineHeight: 1.6,
    textColor: '#ffffff',
    centerText: true,
    textShadow: true,
    creditToggle: true,
    creditSize: 18,
    creditColor: '#ffffff',
    creditAlign: 'end',
  };

  let state = {...defaultState};

  // Bind inputs -> state
  ratioSel.addEventListener('change', e => { state.ratio = e.target.value; applyState(state); });
  padding.addEventListener('input', e => { state.pad = +e.target.value; poetry.style.setProperty('--pad', state.pad+'px'); });
  radius.addEventListener('input', e => { state.radius = +e.target.value; applyState(state); });
  shadow.addEventListener('change', e => { state.shadow = e.target.checked; applyState(state); });

  bgPreset.addEventListener('change', e => { state.bg = e.target.value; card.style.background = state.bg; });
  bgCss.addEventListener('change', e => { if(e.target.value.trim()){ state.bg = e.target.value.trim(); card.style.background = state.bg; } });

  bgImage.addEventListener('change', e => {
    const file = e.target.files && e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => { state.bgImageUrl = ev.target.result; ensureOverlay(state.bgImageUrl); };
    reader.readAsDataURL(file);
  });
  clearBgImage.addEventListener('click', () => { state.bgImageUrl = ''; removeOverlay(); });

  bgOpacity.addEventListener('input', e => {
    state.bgOpacity = +e.target.value;
    const overlay = card.querySelector('.bg-overlay');
    if(overlay) overlay.style.opacity = state.bgOpacity;
  });
  bgBlur.addEventListener('input', e => {
    state.bgBlur = +e.target.value;
    const overlay = card.querySelector('.bg-overlay');
    if(overlay) overlay.style.filter = `blur(${state.bgBlur}px)`;
  });

  fontFamily.addEventListener('change', e => { state.fontFamily = e.target.value; poetry.style.fontFamily = state.fontFamily; });
  fontSize.addEventListener('input', e => { state.fontSize = +e.target.value; poetry.style.setProperty('--fs', state.fontSize+'px'); });
  lineHeight.addEventListener('input', e => { state.lineHeight = +e.target.value; poetry.style.setProperty('--lh', state.lineHeight); });
  textColor.addEventListener('input', e => { state.textColor = e.target.value; poetry.style.setProperty('--fc', state.textColor); });
  centerText.addEventListener('change', e => { state.centerText = e.target.checked; poetry.style.textAlign = state.centerText ? 'center' : 'right'; });
  textShadow.addEventListener('change', e => { state.textShadow = e.target.checked; poetry.style.setProperty('--ts', state.textShadow ? '0 2px 18px rgba(0,0,0,.55)' : 'none'); });

  creditToggle.addEventListener('change', e => { state.creditToggle = e.target.checked; credit.style.display = state.creditToggle ? 'block' : 'none'; });
  creditSize.addEventListener('input', e => { state.creditSize = +e.target.value; credit.style.setProperty('--cs', state.creditSize+'px'); });
  creditColor.addEventListener('input', e => { state.creditColor = e.target.value; credit.style.setProperty('--cc', state.creditColor); });
  creditAlign.addEventListener('change', e => { state.creditAlign = e.target.value; credit.style.textAlign = state.creditAlign === 'start' ? 'left' : (state.creditAlign === 'center' ? 'center' : 'right'); });

  // Export
  btnExport.addEventListener('click', async () => {
    // Temporarily ensure card uses exact pixel size for export (based on stage client size)
    const rect = stage.getBoundingClientRect();
    card.style.width = rect.width + 'px';
    card.style.height = rect.height + 'px';

    // Make selection caret invisible for export
    poetry.blur(); credit.blur();

    const canvas = await html2canvas(card, { useCORS: true, backgroundColor: null, scale: 2 });
    const dataURL = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = 'poetry-post.png';
    a.click();
  });

  // Share (if supported)
  btnShare.addEventListener('click', async () => {
    const canvas = await html2canvas(card, { useCORS: true, backgroundColor: null, scale: 2 });
    canvas.toBlob(async (blob)=>{
      if(navigator.canShare && navigator.canShare({ files: [new File([blob], 'poetry.png', {type:'image/png'})] })){
        const file = new File([blob], 'poetry.png', {type:'image/png'});
        try{
          await navigator.share({ files: [file], title: 'Urdu Poetry', text: 'Made with webbasd post generator' });
        }catch(err){ console.warn('Share canceled or failed', err); }
      }else{
        // Fallback: download
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'poetry-post.png';
        a.click();
        alert('Sharing not supported on this device. Image downloaded instead.');
      }
    }, 'image/png');
  });

  // Reset
  btnReset.addEventListener('click', () => {
    state = { ...defaultState };
    // Reset inputs UI
    ratioSel.value = state.ratio;
    padding.value = state.pad;
    radius.value = state.radius;
    shadow.checked = state.shadow;

    bgPreset.value = state.bg;
    bgCss.value = '';
    bgImage.value = '';
    bgOpacity.value = state.bgOpacity;
    bgBlur.value = state.bgBlur;

    fontFamily.value = state.fontFamily;
    fontSize.value = state.fontSize;
    lineHeight.value = state.lineHeight;
    textColor.value = state.textColor;
    centerText.checked = state.centerText;
    textShadow.checked = state.textShadow;

    creditToggle.checked = state.creditToggle;
    creditSize.value = state.creditSize;
    creditColor.value = state.creditColor;
    creditAlign.value = state.creditAlign;

    poetry.textContent = 'یہاں اپنی شاعری لکھیں…';
    credit.textContent = '— شاعر / Poet';

    removeOverlay();
    applyState(state);
  });

  // Save/Load locally
  btnSave.addEventListener('click', () => {
    const payload = {
      state,
      poetry: poetry.innerText,
      credit: credit.innerText
    };
    localStorage.setItem('webbasd-post-generator', JSON.stringify(payload));
    alert('Design saved locally.');
  });
  btnLoad.addEventListener('click', () => {
    const raw = localStorage.getItem('webbasd-post-generator');
    if(!raw){ alert('No saved design found.'); return; }
    try{
      const payload = JSON.parse(raw);
      state = { ...state, ...payload.state };
      poetry.innerText = payload.poetry || poetry.innerText;
      credit.innerText = payload.credit || credit.innerText;
      // reflect controls
      ratioSel.value = state.ratio;
      padding.value = state.pad;
      radius.value = state.radius;
      shadow.checked = state.shadow;

      bgPreset.value = state.bg;
      bgCss.value = '';
      bgOpacity.value = state.bgOpacity;
      bgBlur.value = state.bgBlur;

      fontFamily.value = state.fontFamily;
      fontSize.value = state.fontSize;
      lineHeight.value = state.lineHeight;
      textColor.value = state.textColor;
      centerText.checked = state.centerText;
      textShadow.checked = state.textShadow;

      creditToggle.checked = state.creditToggle;
      creditSize.value = state.creditSize;
      creditColor.value = state.creditColor;
      creditAlign.value = state.creditAlign;

      if(state.bgImageUrl){ ensureOverlay(state.bgImageUrl); } else { removeOverlay(); }
      applyState(state);
      alert('Loaded last saved design.');
    }catch(e){
      console.error(e);
      alert('Failed to load saved design.');
    }
  });

  // Initialize
  applyState(state);
})();