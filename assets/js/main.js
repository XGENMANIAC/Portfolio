const $=(selector,context=document)=>context.querySelector(selector);
const $$=(selector,context=document)=>[...context.querySelectorAll(selector)];

const menuButton=$('.menu-toggle');
const navigation=$('#site-nav');
menuButton?.addEventListener('click',()=>{
  const open=navigation.classList.toggle('open');
  menuButton.setAttribute('aria-expanded',String(open));
  menuButton.setAttribute('aria-label',open?'Close navigation':'Open navigation');
});
$$('#site-nav a').forEach(link=>link.addEventListener('click',()=>{
  navigation?.classList.remove('open');
  menuButton?.setAttribute('aria-expanded','false');
  menuButton?.setAttribute('aria-label','Open navigation');
}));
document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&navigation?.classList.contains('open')){
    navigation.classList.remove('open');
    menuButton?.setAttribute('aria-expanded','false');
    menuButton?.focus();
  }
});

$$('.project-open').forEach(button=>{
  button.addEventListener('click',()=>{
    const project=button.closest('.project');
    const panel=$('.project-detail',project);
    const expanded=button.getAttribute('aria-expanded')==='true';
    button.setAttribute('aria-expanded',String(!expanded));
    button.querySelector('span').textContent=expanded?'Read case study':'Close case study';
    panel.hidden=expanded;
  });
});

const filters=$$('.filter');
const projects=$$('.project');
filters.forEach(button=>{
  button.addEventListener('click',()=>{
    const filter=button.dataset.filter;
    filters.forEach(item=>{
      const active=item===button;
      item.classList.toggle('active',active);
      item.setAttribute('aria-pressed',String(active));
    });
    projects.forEach(project=>{
      const categories=(project.dataset.category||'').split(' ');
      project.hidden=filter!=='all'&&!categories.includes(filter);
    });
  });
});

const year=$('#year');
if(year)year.textContent=String(new Date().getFullYear());
