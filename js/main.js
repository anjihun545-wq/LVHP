(function(){
  const header=document.getElementById('siteHeader');
  const menu=document.getElementById('menuOverlay');
  const open=document.getElementById('menuOpen');
  const close=document.getElementById('menuClose');
  let lastY=window.scrollY;
  const heroVideo=document.getElementById('heroVideo');
  if(heroVideo){
    const media=heroVideo.parentElement;
    let fallbackTimer=null;
    const markReady=()=>{
      clearTimeout(fallbackTimer);
      media?.classList.add('video-ready');
      media?.classList.remove('video-fallback');
    };
    const showFallback=()=>{
      media?.classList.remove('video-ready');
      media?.classList.add('video-fallback');
    };
    const attemptPlay=()=>{
      heroVideo.muted=true;
      heroVideo.defaultMuted=true;
      heroVideo.playsInline=true;
      heroVideo.setAttribute('muted','');
      heroVideo.setAttribute('playsinline','');
      heroVideo.setAttribute('webkit-playsinline','');
      const promise=heroVideo.play?.();
      if(promise&&typeof promise.catch==='function') promise.catch(()=>{});
      clearTimeout(fallbackTimer);
      fallbackTimer=setTimeout(()=>{
        if(heroVideo.readyState<2 && heroVideo.paused) showFallback();
      },4500);
    };
    ['loadeddata','canplay','playing'].forEach(type=>heroVideo.addEventListener(type,markReady,{passive:true}));
    heroVideo.addEventListener('error',showFallback,{passive:true});
    window.addEventListener('pageshow',attemptPlay,{passive:true});
    document.addEventListener('visibilitychange',()=>{if(!document.hidden) attemptPlay();},{passive:true});
    document.addEventListener('touchstart',attemptPlay,{once:true,passive:true});
    if(heroVideo.readyState>=2) markReady();
    attemptPlay();
  }

  const setMenu=(state)=>{menu.classList.toggle('is-open',state);menu.setAttribute('aria-hidden',String(!state));open.setAttribute('aria-expanded',String(state));document.body.classList.toggle('menu-open',state);document.body.style.overflow=state?'hidden':''};
  open.addEventListener('click',()=>setMenu(true));close.addEventListener('click',()=>setMenu(false));menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));

  function updateHeader(){
    const y=window.scrollY;
    if(y>90){if(y>lastY+5)header.classList.add('is-hidden');if(y<lastY-5)header.classList.remove('is-hidden')}else header.classList.remove('is-hidden');
    const heroBottom=document.getElementById('home')?.offsetHeight||600;
    header.classList.toggle('is-dark-solid',y>heroBottom-100);
    header.classList.remove('is-solid');lastY=y;
  }
  window.addEventListener('scroll',updateHeader,{passive:true});updateHeader();

  document.addEventListener('click',e=>{
    const q=e.target.closest('.faq-q');if(!q)return;
    const item=q.closest('.faq-item'),a=item.querySelector('.faq-a');const opened=item.classList.toggle('is-open');a.style.maxHeight=opened?a.scrollHeight+'px':'0px';
  });

  document.querySelectorAll('[data-image-accordion]').forEach(group=>{
    const panels=[...group.querySelectorAll('[data-image-panel]')];
    let active=Math.max(0,panels.findIndex(p=>p.classList.contains('is-active')));
    let timer=null;
    const activate=(index)=>{
      active=(index+panels.length)%panels.length;
      panels.forEach((panel,i)=>panel.classList.toggle('is-active',i===active));
    };
    const start=()=>{
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      clearInterval(timer);
      timer=setInterval(()=>activate(active+1),3000);
    };
    panels.forEach((panel,i)=>{
      panel.addEventListener('click',()=>{activate(i);start();});
      panel.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();activate(i);start();}});
    });
    group.addEventListener('mouseenter',()=>clearInterval(timer));
    group.addEventListener('mouseleave',start);
    group.addEventListener('touchstart',()=>clearInterval(timer),{passive:true});
    group.addEventListener('touchend',start,{passive:true});
    activate(active);
    start();
  });


  document.querySelectorAll('[data-auto-slider]').forEach(slider=>{
    const track=slider.querySelector('[data-slider-track]');
    const slides=[...slider.querySelectorAll('.public-screen-slide')];
    const dotsWrap=slider.querySelector('[data-slider-dots]');
    if(!track||!slides.length) return;
    let index=0,timer=null,startX=null;
    const dots=slides.map((_,i)=>{
      const btn=document.createElement('button');
      btn.type='button';
      btn.className='public-screen-dot'+(i===0?' is-active':'');
      btn.setAttribute('aria-label',`슬라이드 ${i+1}`);
      btn.addEventListener('click',()=>{go(i);start();});
      dotsWrap?.appendChild(btn);
      return btn;
    });
    function go(i){
      index=(i+slides.length)%slides.length;
      track.style.transform=`translateX(calc(${index} * -100%))`;
      dots.forEach((d,di)=>d.classList.toggle('is-active',di===index));
    }
    function start(){
      if(window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      clearInterval(timer);
      timer=setInterval(()=>go(index+1),3000);
    }
    function stop(){clearInterval(timer);}
    slider.addEventListener('mouseenter',stop);
    slider.addEventListener('mouseleave',start);
    slider.addEventListener('touchstart',e=>{stop();startX=e.touches[0].clientX;},{passive:true});
    slider.addEventListener('touchend',e=>{
      if(startX!=null){
        const dx=e.changedTouches[0].clientX-startX;
        if(Math.abs(dx)>35){go(index+(dx<0?1:-1));}
      }
      startX=null;start();
    },{passive:true});
    go(0);start();
  });

  const imageLightbox=document.getElementById('imageLightbox');
  const imageLightboxImg=document.getElementById('imageLightboxImg');
  const imageLightboxClose=document.getElementById('imageLightboxClose');
  const openImageLightbox=(src,alt='')=>{
    if(!imageLightbox||!imageLightboxImg) return;
    imageLightboxImg.src=src;
    imageLightboxImg.alt=alt;
    imageLightbox.classList.add('is-open');
    imageLightbox.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  };
  const closeImageLightbox=()=>{
    if(!imageLightbox||!imageLightboxImg) return;
    imageLightbox.classList.remove('is-open');
    imageLightbox.setAttribute('aria-hidden','true');
    imageLightboxImg.removeAttribute('src');
    imageLightboxImg.alt='';
    document.body.style.overflow='';
  };
  document.querySelectorAll('.zoomable-media, .place-card, .case-card').forEach(item=>{
    const openPreview=()=>openImageLightbox(item.dataset.lightboxImage||item.querySelector('img')?.currentSrc||item.querySelector('img')?.src||'',item.dataset.lightboxAlt||item.querySelector('img')?.alt||'');
    item.addEventListener('click',openPreview);
    item.addEventListener('touchend',e=>{e.preventDefault();openPreview();},{passive:false});
    item.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openPreview();}});
    item.setAttribute('tabindex','0');
    item.setAttribute('role','button');
    item.setAttribute('aria-label','이미지 확대 보기');
  });
  imageLightboxClose?.addEventListener('click',closeImageLightbox);
  imageLightbox?.addEventListener('click',e=>{if(e.target===imageLightbox) closeImageLightbox();});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&imageLightbox?.classList.contains('is-open')) closeImageLightbox();});

})();
