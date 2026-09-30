(function(){
  const tabs=[...document.querySelectorAll('[data-mode-tab]')];
  const panels=[...document.querySelectorAll('[data-mode-panel]')];
  const hero={section:document.getElementById('home'),copy:document.getElementById('heroCopy'),eyebrow:document.getElementById('heroEyebrow'),title:document.getElementById('heroTitle'),desc:document.getElementById('heroDesc'),note:document.getElementById('heroNote'),chip:document.getElementById('heroModeChip'),assistTabs:document.getElementById('heroAssistTabs'),video:document.getElementById('heroVideo')};
  const finalSection=document.querySelector('.final-cta');
  const finalTitle=document.getElementById('finalTitle'),finalDesc=document.getElementById('finalDesc'),finalCta=document.getElementById('finalCta');
  const serviceTabs=document.getElementById('serviceTabs');
  const floatingInquiry=document.getElementById('floatingInquiry'),floatingInquiryLabel=document.getElementById('floatingInquiryLabel');
  const menu=document.getElementById('menuOverlay');

  const modes={
    install:{
      eyebrow:'FREE TV INSTALLATION',
      title:'매장 TV,<br />부담 없이 시작하세요',
      desc:'매장 화면은 더 유용하게, 지역 콘텐츠는 자연스럽게.<br />LocalVision이 설치부터 운영까지 함께합니다.',
      note:'※ 설치 가능 여부와 방식은 매장 환경 확인 후 안내됩니다.',
      chip:'<span>01</span> 무료 TV 설치',
      assistTabs:['무료 TV 설치','매장 화면 70%','설치·운영 지원'],
      finalTitle:'우리 매장에도<br />LocalVision을.',
      finalDesc:'설치 가능 여부부터 먼저 확인해보세요.',
      finalCta:'무료 설치 가능 여부 확인하기 →',
      modal:'store',
      heroVideo:'assets/video/hero-mode-tabs.mp4',
      floatingLabel:'설치문의'
    },
    ads:{
      eyebrow:'LOCAL ADVERTISING',
      title:'의정부 생활공간에<br />브랜드를 보여주세요',
      desc:'사람들이 먹고, 쉬고, 기다리는 매장 TV에서<br />지역 타깃에게 반복적으로 브랜드를 노출합니다.',
      note:'캠페인 목적 · 기간 · 생활권에 맞춰 송출 방식을 협의합니다.',
      chip:'<span>02</span> 광고 문의',
      assistTabs:['42+ 생활공간','반복 노출','SNS 연계'],
      finalTitle:'지역 사람에게 보여주려면<br />지역 사람들이 있는 곳으로.',
      finalDesc:'캠페인 목적에 맞는 LocalVision 광고 운영안을 함께 설계합니다.',
      finalCta:'광고 운영안 받아보기 →',
      modal:'advertiser',
      heroVideo:'assets/video/hero-mode-tabs.mp4',
      floatingLabel:'광고문의'
    },
    public:{
      eyebrow:'PUBLIC COMMUNICATION',
      title:'시민에게 필요한 정보,<br />시민이 있는 곳에서',
      desc:'정책 · 행사 · 안전 · 복지 · 시민참여 정보를<br />생활공간 안에서 자연스럽게 전달합니다.',
      note:'기관은 콘텐츠를 제공하고 송출·운영 방식은 LocalVision과 협의할 수 있습니다.',
      chip:'<span>03</span> 공공정보 송출',
      assistTabs:['정책·행사·안전','생활공간 송출','송출·운영 협의'],
      finalTitle:'시민이 있는 곳에서<br />공공정보를 전달하세요.',
      finalDesc:'사업 목적과 콘텐츠 유형에 맞는 생활밀착형 송출안을 함께 설계합니다.',
      finalCta:'공공정보 송출안 받아보기 →',
      modal:'public',
      heroVideo:'assets/video/hero-mode-tabs.mp4',
      floatingLabel:'공공문의'
    }
  };

  const normalize=(value)=>['install','ads','public'].includes(value)?value:'install';
  function urlMode(){const p=new URLSearchParams(location.search);return normalize(p.get('tab')||location.hash.replace('#',''))}

  function closeMenu(){
    if(!menu)return;
    menu.classList.remove('is-open');menu.setAttribute('aria-hidden','true');
    const opener=document.getElementById('menuOpen');if(opener)opener.setAttribute('aria-expanded','false');
    document.body.style.overflow='';
  }

  function updateHero(mode){
    const d=modes[mode];if(!hero.copy)return;
    hero.copy.classList.add('is-switching');
    setTimeout(()=>{
      hero.eyebrow.textContent=d.eyebrow;hero.title.innerHTML=d.title;hero.desc.innerHTML=d.desc;hero.note.textContent=d.note;hero.chip.innerHTML=d.chip;if(hero.assistTabs){hero.assistTabs.innerHTML=d.assistTabs.map(label=>`<span class="hero-assist-tab">${label}</span>`).join('');}
      hero.copy.classList.remove('is-switching');
    },190);
  }


  function refreshHeroVideo(mode){
    const d=modes[mode];
    const video=hero.video;
    if(!video||!d.heroVideo) return;
    const source=video.querySelector('source');
    const nextSrc=d.heroVideo;
    if(source && source.getAttribute('src')!==nextSrc){
      source.setAttribute('src',nextSrc);
      video.load();
    }else{
      try{video.currentTime=0;}catch(e){}
    }
    video.parentElement?.classList.remove('video-ready');
    const markReady=()=>video.parentElement?.classList.add('video-ready');
    if(video.readyState>=2) markReady();
    else video.addEventListener('canplay',markReady,{once:true});
    video.muted=true;
    const playPromise=video.play?.();
    if(playPromise&&typeof playPromise.catch==='function') playPromise.catch(()=>{});
  }

  function replayHeroSequence(mode){
    const body=document.body;
    refreshHeroVideo(mode);
    body.classList.remove('hero-ready','hero-open');
    void body.offsetWidth;
    requestAnimationFrame(()=>{
      setTimeout(()=>body.classList.add('hero-ready'),80);
      setTimeout(()=>body.classList.add('hero-open'),820);
    });
  }

  function updateFinal(mode){
    const d=modes[mode];if(!finalSection)return;
    finalSection.classList.add('is-switching');
    setTimeout(()=>{
      finalTitle.innerHTML=d.finalTitle;finalDesc.textContent=d.finalDesc;finalCta.textContent=d.finalCta;finalCta.dataset.modalType=d.modal;
      finalSection.classList.remove('is-switching');
    },180);
  }

  function setMode(mode,{push=true,scroll=true}={}){
    mode=normalize(mode);document.body.dataset.mode=mode;
    tabs.forEach(tab=>{const active=tab.dataset.modeTab===mode;if(tab.getAttribute('role')==='tab'){tab.classList.toggle('is-active',active);tab.setAttribute('aria-selected',String(active))}});
    panels.forEach(panel=>{const active=panel.dataset.modePanel===mode;panel.hidden=!active;panel.classList.toggle('is-active',active)});
    updateHero(mode);updateFinal(mode);replayHeroSequence(mode);closeMenu();if(floatingInquiry){floatingInquiry.dataset.modalType=modes[mode].modal;floatingInquiry.setAttribute('aria-label',modes[mode].floatingLabel+' 열기');if(floatingInquiryLabel)floatingInquiryLabel.textContent=modes[mode].floatingLabel;}
    if(push){const u=new URL(location.href);u.searchParams.set('tab',mode);u.hash='';history.pushState({mode},'',u)}
    if(scroll){
      const y=window.scrollY;
      const panelTop=document.querySelector(`[data-mode-panel="${mode}"]`)?.offsetTop||0;
      if(y>window.innerHeight*.7){window.scrollTo({top:Math.max(0,panelTop-110),behavior:'smooth'})}
    }
    setTimeout(()=>window.dispatchEvent(new Event('resize')),80);
  }

  tabs.forEach(tab=>tab.addEventListener('click',()=>setMode(tab.dataset.modeTab)));
  window.addEventListener('popstate',()=>setMode(urlMode(),{push:false,scroll:false}));
  setMode(urlMode(),{push:false,scroll:false});

  // Keep the second-row tab bar visually anchored while the header hides.
  const markScroll=()=>document.body.classList.toggle('is-scrolled',window.scrollY>90);
  window.addEventListener('scroll',markScroll,{passive:true});markScroll();

  // Count-up metrics only when the advertising metric stage is visible.
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const format=(n,el)=>el.dataset.format==='comma'?Math.round(n).toLocaleString('ko-KR'):Math.round(n).toString();
  const animateCount=(el)=>{
    if(el.dataset.counted)return;el.dataset.counted='1';
    const target=Number(el.dataset.count||0),suffix=el.dataset.suffix||'';
    if(reduced){el.textContent=format(target,el)+suffix;return}
    const start=performance.now(),duration=1100;
    const tick=(now)=>{const p=Math.min(1,(now-start)/duration),e=1-Math.pow(1-p,3);el.textContent=format(target*e,el)+suffix;if(p<1)requestAnimationFrame(tick)};requestAnimationFrame(tick);
  };
  const metricObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.querySelectorAll('[data-count]').forEach(animateCount)}),{threshold:.35});
  document.querySelectorAll('[data-metric-stage]').forEach(el=>metricObserver.observe(el));

  // Vertical progress rails.
  const railObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('is-visible')}),{threshold:.18});
  document.querySelectorAll('[data-progress-rail]').forEach(el=>railObserver.observe(el));
})();
