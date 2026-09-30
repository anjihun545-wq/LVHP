const APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyMGlw7ec_pDJsH0nfJT0gDT307nqES3frUSS_7KPKpL-7GO6jmvYh8MCheN4iuo-8JQQ/exec";
const ALLOWED_TYPES = new Set(['store','advertiser','public']);
const MAX_BODY_BYTES = 50 * 1024;
const UPSTREAM_TIMEOUT_MS = 20000;

const REQUIRED_FIELDS = {
  store:['storeName','businessType','location','hasTv','installType','contactName','phone'],
  advertiser:['brandName','campaignGoal','targetArea','period','creativeReady','contactName','phone'],
  public:['organization','publicType','period','qrLink','contactName','email']
};

function json(res,status,data){
  res.setHeader('Cache-Control','no-store');
  res.setHeader('X-Content-Type-Options','nosniff');
  return res.status(status).json(data);
}

function normalizePayload(input){
  const out={};
  for(const [key,value] of Object.entries(input||{})){
    if(typeof value==='string')out[key]=value.trim().slice(0,4000);
    else if(value!=null)out[key]=String(value).trim().slice(0,4000);
  }
  return out;
}

function validate(payload){
  if(!ALLOWED_TYPES.has(payload.inquiryType))return '올바르지 않은 문의 유형입니다.';
  const missing=(REQUIRED_FIELDS[payload.inquiryType]||[]).filter(k=>!payload[k]);
  if(missing.length)return '필수 입력값이 누락되었습니다.';
  if(payload.inquiryType==='public'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email||''))return '이메일 형식을 확인해주세요.';
  return '';
}

module.exports = async function handler(req,res){
  if(req.method!=='POST'){
    res.setHeader('Allow','POST');
    return json(res,405,{success:false,saved:false,emailSent:false,message:'POST 요청만 허용됩니다.'});
  }

  try{
    const rawBody=typeof req.body==='string'?req.body:JSON.stringify(req.body||{});
    if(Buffer.byteLength(rawBody,'utf8')>MAX_BODY_BYTES){
      return json(res,413,{success:false,saved:false,emailSent:false,message:'문의 내용이 너무 깁니다.'});
    }

    let parsed;
    try{parsed=typeof req.body==='string'?JSON.parse(req.body||'{}'):(req.body||{});}
    catch(_){return json(res,400,{success:false,saved:false,emailSent:false,message:'요청 형식을 확인해주세요.'});}

    const payload=normalizePayload(parsed);

    // Honeypot: 정상 사용자는 이 필드를 채우지 않습니다.
    if(payload.website){
      return json(res,200,{success:true,saved:true,emailSent:true,message:'문의가 정상적으로 접수되었습니다.'});
    }

    const validationError=validate(payload);
    if(validationError){
      return json(res,400,{success:false,saved:false,emailSent:false,message:validationError});
    }

    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),UPSTREAM_TIMEOUT_MS);

    let upstream;
    try{
      upstream=await fetch(APPS_SCRIPT_URL,{
        method:'POST',
        headers:{'Content-Type':'text/plain;charset=utf-8','Accept':'application/json'},
        body:JSON.stringify(payload),
        redirect:'follow',
        signal:controller.signal
      });
    }finally{
      clearTimeout(timeout);
    }

    const raw=await upstream.text();
    let data;
    try{data=JSON.parse(raw);}
    catch(_){
      return json(res,502,{success:false,saved:false,emailSent:false,message:'문의 처리 서버의 응답을 확인하지 못했습니다.'});
    }

    if(!upstream.ok||data.success!==true){
      return json(res,502,{
        success:false,
        saved:Boolean(data?.saved),
        emailSent:Boolean(data?.emailSent),
        message:data?.message||'문의 처리 중 오류가 발생했습니다.'
      });
    }

    // 운영 버전은 Google Sheet 저장 성공 여부를 반드시 반환해야 합니다.
    if(data.saved!==true){
      return json(res,502,{success:false,saved:false,emailSent:Boolean(data?.emailSent),message:'문의 백업 상태를 확인하지 못했습니다.'});
    }

    return json(res,200,{
      success:true,
      saved:true,
      emailSent:data.emailSent===true,
      inquiryId:data.inquiryId||'',
      message:data.message||'문의가 정상적으로 접수되었습니다. 확인 후 연락드리겠습니다.'
    });
  }catch(error){
    const timeout=error?.name==='AbortError';
    return json(res,timeout?504:500,{
      success:false,
      saved:false,
      emailSent:false,
      message:timeout?'문의 처리 서버 응답이 지연되고 있습니다.':'문의 전송 중 오류가 발생했습니다.'
    });
  }
};
