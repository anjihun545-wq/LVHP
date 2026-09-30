(function(){
  const modal=document.getElementById('contactModal');
  if(!modal)return;

  const title=document.getElementById('modalTitle');
  const eyebrow=document.getElementById('modalEyebrow');
  const desc=document.getElementById('modalDesc');
  const fieldsEl=document.getElementById('modalFields');
  const form=document.getElementById('inquiryForm');
  const action=document.getElementById('modalAction');
  const status=document.getElementById('modalStatus');
  const REQUEST_TIMEOUT_MS=20000;

  let currentType='store';
  let currentTopic='';

  const content={
    store:{
      eyebrow:'FREE TV INSTALLATION',
      title:'무료 설치 가능 여부를 확인해보세요.',
      desc:'매장 환경을 먼저 확인한 뒤 기존 TV 활용 여부와 설치 방식을 안내합니다.',
      submit:'무료 설치 문의 접수하기',
      fields:[
        {type:'text',name:'storeName',label:'1. 어떤 매장인가요?',placeholder:'매장명을 입력해주세요',required:true},
        {type:'select',name:'businessType',label:'2. 매장 업종을 알려주세요.',required:true,options:['음식점','카페 · 베이커리','병원 · 의원','뷰티 · 헬스','생활서비스','기타']},
        {type:'text',name:'location',label:'3. 매장이 어디에 있나요?',placeholder:'예: 의정부동 / 민락동 / 도로명 주소',required:true},
        {type:'radio',name:'hasTv',label:'4. 현재 매장에 사용 중인 TV가 있나요?',required:true,options:['있음','없음','잘 모르겠음']},
        {type:'radio',name:'installType',label:'5. 어떤 방식이 가장 궁금하신가요?',required:true,options:['기존 TV 활용','새 TV 설치','둘 다 상담 필요','아직 모르겠음']},
        {type:'text',name:'contactName',label:'6. 연락받으실 분의 성함을 알려주세요.',placeholder:'성함',required:true},
        {type:'tel',name:'phone',label:'7. 연락 가능한 번호를 남겨주세요.',placeholder:'010-0000-0000',required:true},
        {type:'textarea',name:'message',label:'8. 추가로 확인하고 싶은 내용이 있나요?',placeholder:'설치 위치, TV 환경, 원하는 운영 방식 등이 있으면 남겨주세요.'}
      ]
    },
    advertiser:{
      eyebrow:'LOCAL ADVERTISING',
      title:'광고 운영안을 받아보세요.',
      desc:'브랜드와 캠페인 목적을 알려주시면 송출 지역·기간·콘텐츠 방식을 기준으로 검토합니다.',
      submit:'광고 문의 접수하기',
      fields:[
        {type:'text',name:'brandName',label:'1. 어떤 브랜드 또는 업체의 광고인가요?',placeholder:'브랜드 / 업체명',required:true},
        {type:'radio',name:'campaignGoal',label:'2. 이번 광고의 가장 큰 목적은 무엇인가요?',required:true,options:['브랜드 인지도','매장 방문 유도','이벤트 · 프로모션','신규 오픈 홍보','행사 · 모집','기타']},
        {type:'select',name:'targetArea',label:'3. 어느 생활권에 노출하고 싶으신가요?',required:true,options:['의정부 전역','의정부역 · 시내권','민락 · 용현권','고산 · 송산권','금오 · 신곡권','회룡 · 호원권','협의 필요']},
        {type:'radio',name:'period',label:'4. 희망 광고 기간은 어느 정도인가요?',required:true,options:['1주','2주','1개월','3개월 이상','아직 미정']},
        {type:'radio',name:'creativeReady',label:'5. 광고 소재는 준비되어 있나요?',required:true,options:['영상 있음','이미지 있음','둘 다 있음','제작 필요','아직 미정']},
        {type:'text',name:'contactName',label:'6. 담당자 성함을 알려주세요.',placeholder:'담당자명',required:true},
        {type:'tel',name:'phone',label:'7. 연락 가능한 번호를 남겨주세요.',placeholder:'010-0000-0000',required:true},
        {type:'textarea',name:'message',label:'8. 캠페인에 대해 추가로 알려주실 내용이 있나요?',placeholder:'예산, 일정, 타깃, 원하는 매장 유형 등이 있으면 남겨주세요.'}
      ]
    },
    public:{
      eyebrow:'PUBLIC COMMUNICATION',
      title:'공공정보 송출안을 받아보세요.',
      desc:'기관·사업 목적과 전달할 내용을 알려주시면 생활공간 송출 방식과 운영 구조를 검토합니다.',
      submit:'공공정보 문의 접수하기',
      fields:[
        {type:'text',name:'organization',label:'1. 기관 또는 단체명을 알려주세요.',placeholder:'기관 / 단체명',required:true},
        {type:'text',name:'department',label:'2. 담당 부서 또는 팀을 알려주세요.',placeholder:'예: 홍보과 / 문화관광과 / 사업운영팀'},
        {type:'select',name:'publicType',label:'3. 어떤 정보를 시민에게 전달하려고 하나요?',required:true,options:['정책','행사','안전','복지','교육','시민참여','기타']},
        {type:'text',name:'projectName',label:'4. 사업·행사·캠페인명이 있다면 알려주세요.',placeholder:'사업명 또는 행사명'},
        {type:'radio',name:'period',label:'5. 희망 송출 기간은 어느 정도인가요?',required:true,options:['1주 이내','2주','1개월','1개월 이상','아직 미정']},
        {type:'radio',name:'qrLink',label:'6. QR 또는 신청 페이지 연결이 필요한가요?',required:true,options:['필요함','필요 없음','상담 후 결정']},
        {type:'text',name:'contactName',label:'7. 담당자 성함을 알려주세요.',placeholder:'담당자명',required:true},
        {type:'email',name:'email',label:'8. 회신받을 이메일을 알려주세요.',placeholder:'name@organization.go.kr',required:true},
        {type:'tel',name:'phone',label:'9. 연락 가능한 번호를 남겨주세요.',placeholder:'전화번호'},
        {type:'textarea',name:'message',label:'10. 송출 목적이나 요청사항을 알려주세요.',placeholder:'대상 시민, 일정, 전달하고 싶은 핵심 내용 등을 남겨주세요.'}
      ]
    }
  };

  const esc=(v='')=>String(v).replace(/[&<>\"]/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','\"':'&quot;'}[s]));
  const inputAttrs=(f)=>{
    if(f.type==='textarea')return ' maxlength="1500"';
    if(f.type==='email')return ' maxlength="160" autocomplete="email"';
    if(f.type==='tel')return ' maxlength="30" inputmode="tel" autocomplete="tel"';
    return ' maxlength="120"';
  };

  function renderField(f,topic){
    const req=f.required?' required':'';
    const mark=f.required?'':' <small>선택</small>';
    if(f.type==='radio'){
      return `<fieldset class="inquiry-group"><legend class="inquiry-label">${f.label}${mark}</legend><div class="inquiry-choice-grid">${f.options.map(opt=>`<label class="inquiry-choice"><input type="radio" name="${f.name}" value="${esc(opt)}"${req}><span>${esc(opt)}</span></label>`).join('')}</div></fieldset>`;
    }
    if(f.type==='select'){
      return `<label class="inquiry-group"><span class="inquiry-label">${f.label}${mark}</span><select class="inquiry-select" name="${f.name}"${req}><option value="">선택해주세요</option>${f.options.map(opt=>`<option value="${esc(opt)}"${topic===opt?' selected':''}>${esc(opt)}</option>`).join('')}</select></label>`;
    }
    if(f.type==='textarea'){
      return `<label class="inquiry-group"><span class="inquiry-label">${f.label}${mark}</span><textarea class="inquiry-textarea" name="${f.name}" placeholder="${esc(f.placeholder||'')}"${inputAttrs(f)}></textarea></label>`;
    }
    return `<label class="inquiry-group"><span class="inquiry-label">${f.label}${mark}</span><input class="inquiry-input" type="${f.type}" name="${f.name}" placeholder="${esc(f.placeholder||'')}"${inputAttrs(f)}${req}></label>`;
  }

  function openModal(type,custom={}){
    currentType=content[type]?type:'store';
    currentTopic=custom.topic||'';
    const d=content[currentType];
    eyebrow.textContent=custom.eyebrow||d.eyebrow;
    title.textContent=custom.title||d.title;
    desc.textContent=custom.desc||d.desc;
    fieldsEl.innerHTML=d.fields.map(f=>renderField(f,currentTopic)).join('');
    form.reset();
    action.disabled=false;
    action.textContent=d.submit;
    status.textContent='';
    status.className='inquiry-status';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
    document.body.classList.add('modal-open');
    setTimeout(()=>form.querySelector('input,select,textarea')?.focus({preventScroll:true}),120);
  }

  function closeModal(){
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    document.body.classList.remove('modal-open');
  }

  document.addEventListener('click',e=>{
    const trigger=e.target.closest('[data-modal-type]');
    if(trigger){
      openModal(trigger.dataset.modalType,{
        eyebrow:trigger.dataset.modalEyebrow,
        title:trigger.dataset.modalTitle,
        desc:trigger.dataset.modalDesc,
        topic:trigger.dataset.modalTopic
      });
      return;
    }
    if(e.target.closest('[data-modal-close]')){closeModal();return;}
    if(e.target===modal)closeModal();
  });

  form.addEventListener('submit',async e=>{
    e.preventDefault();
    if(!form.reportValidity())return;

    const cfg=window.LOCALVISION_CONFIG||{};
    if(!cfg.formEndpoint){
      status.textContent='문의 전송 연결이 설정되지 않았습니다.';
      status.className='inquiry-status is-error';
      return;
    }

    const data=Object.fromEntries(new FormData(form).entries());
    const payload={
      inquiryType:currentType,
      topic:currentTopic||'',
      page:location.href,
      submittedAt:new Date().toISOString(),
      ...data
    };

    status.textContent='';
    status.className='inquiry-status';
    action.disabled=true;
    action.textContent='접수 중...';

    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),REQUEST_TIMEOUT_MS);

    try{
      const res=await fetch(cfg.formEndpoint,{
        method:'POST',
        headers:{'Content-Type':'application/json','Accept':'application/json'},
        body:JSON.stringify(payload),
        signal:controller.signal
      });

      let result;
      try{result=await res.json();}
      catch(_){throw new Error('INVALID_RESPONSE');}

      if(!res.ok||result.success!==true||result.saved!==true){
        throw new Error(result?.message||'SUBMIT_FAILED');
      }

      status.textContent=result.emailSent===false
        ? '문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.'
        : (result.message||'문의가 정상적으로 접수되었습니다. 확인 후 연락드리겠습니다.');
      status.className='inquiry-status is-success';
      form.reset();
      action.textContent='접수 완료';
      action.disabled=true;
    }catch(err){
      status.textContent=err?.name==='AbortError'
        ? '응답이 지연되고 있습니다. 잠시 후 다시 시도해주세요.'
        : '전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
      status.className='inquiry-status is-error';
      action.disabled=false;
      action.textContent=content[currentType].submit;
    }finally{
      clearTimeout(timeout);
    }
  });

  document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
})();
