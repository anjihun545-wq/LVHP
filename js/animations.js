(function(){
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body=document.body;
  if(!reduced){requestAnimationFrame(()=>{setTimeout(()=>body.classList.add('hero-ready'),110);setTimeout(()=>body.classList.add('hero-open'),840)})}else body.classList.add('hero-ready','hero-open');

  const io=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');io.unobserve(entry.target)}})},{threshold:.16,rootMargin:'0px 0px -5% 0px'});
  document.querySelectorAll('.reveal,.scale-reveal,.tv-photo').forEach(el=>io.observe(el));

  const hotplaceStage=document.querySelector('.hotplace-flyin-stage');
  if(hotplaceStage){
    if(reduced){
      hotplaceStage.classList.add('is-visible');
    }else{
      const hotplaceObserver=new IntersectionObserver(entries=>{
        entries.forEach(entry=>{
          if(entry.isIntersecting){
            entry.target.classList.add('is-visible');
            hotplaceObserver.unobserve(entry.target);
          }
        });
      },{threshold:.20,rootMargin:'0px 0px -6% 0px'});
      hotplaceObserver.observe(hotplaceStage);
    }
  }

})();
