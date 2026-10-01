(function(){
  const promo=document.getElementById('audiencePromo');
  const trigger=document.getElementById('audiencePromoTrigger');
  const image=document.getElementById('audiencePromoImage');
  const closeBtn=document.getElementById('audiencePromoClose');
  const hide24Btn=document.getElementById('audiencePromoHide24');
  if(!promo||!trigger||!image||!closeBtn||!hide24Btn)return;

  const HIDE_UNTIL_KEY='localvisionPromoHideUntil';
  const ONE_DAY=24*60*60*1000;
  let closedForPage=false;

  const modes={
    install:{
      src:'assets/images/promo/promo-install.webp',
      alt:'50~60인치 스마트메뉴판 무료설치 - LocalVision',
      modal:'store',
      label:'무료 설치 문의 바로가기'
    },
    ads:{
      src:'assets/images/promo/promo-ads.webp',
      alt:'의정부 핫플레이스 우리 브랜드 광고 월 2만원 - LocalVision',
      modal:'advertiser',
      label:'지역 광고 문의 바로가기'
    },
    public:{
      src:'assets/images/promo/promo-public.webp',
      alt:'주무관님 편하게 홍보하세요 결과보고서 원격반영 - LocalVision',
      modal:'public',
      label:'공공정보 송출 문의 바로가기'
    }
  };

  const local={
    get(key){try{return localStorage.getItem(key)}catch(_){return null}},
    set(key,value){try{localStorage.setItem(key,value)}catch(_){}},
    remove(key){try{localStorage.removeItem(key)}catch(_){}}
  };

  function currentMode(){
    const mode=document.body.dataset.mode;
    return modes[mode]?mode:'install';
  }

  function hiddenFor24Hours(){
    const hideUntil=Number(local.get(HIDE_UNTIL_KEY)||0);
    if(hideUntil>Date.now())return true;
    if(hideUntil)local.remove(HIDE_UNTIL_KEY);
    return false;
  }

  function setVisible(enabled){
    const visible=Boolean(enabled)&&!closedForPage&&!hiddenFor24Hours();
    document.body.classList.toggle('promo-enabled',visible);
    promo.setAttribute('aria-hidden',String(!visible));
  }

  function update(){
    const data=modes[currentMode()];
    if(image.getAttribute('src')!==data.src)image.setAttribute('src',data.src);
    image.alt=data.alt;
    trigger.dataset.modalType=data.modal;
    trigger.setAttribute('aria-label',data.label);
  }

  function closeForPage(){
    closedForPage=true;
    setVisible(false);
  }

  update();
  setVisible(true);

  const modeObserver=new MutationObserver(mutations=>{
    if(mutations.some(m=>m.attributeName==='data-mode'))update();
  });
  modeObserver.observe(document.body,{attributes:true,attributeFilter:['data-mode']});

  closeBtn.addEventListener('click',e=>{
    e.preventDefault();
    e.stopPropagation();
    closeForPage();
  });

  hide24Btn.addEventListener('click',e=>{
    e.preventDefault();
    e.stopPropagation();
    local.set(HIDE_UNTIL_KEY,String(Date.now()+ONE_DAY));
    closeForPage();
  });

  // 이미지 전체가 문의하기 버튼이다. 기존 문의 모달의 data-modal-type 이벤트가 이어서 실행된다.
  trigger.addEventListener('click',()=>{
    requestAnimationFrame(closeForPage);
  });
})();
