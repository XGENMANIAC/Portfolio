const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];

const navBtn=$('.navbtn'),nav=$('nav');
navBtn?.addEventListener('click',()=>{
  const open=nav.classList.toggle('open');
  navBtn.setAttribute('aria-expanded',String(open));
});
$$('nav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');navBtn?.setAttribute('aria-expanded','false')}));

$$('.project-toggle').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const card=btn.closest('.project'),panel=$('.detail',card),open=btn.getAttribute('aria-expanded')==='true';
    btn.setAttribute('aria-expanded',String(!open));
    card.classList.toggle('open',!open);
    panel.hidden=open;
  });
});

const io=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
},{threshold:.12,rootMargin:'0px 0px -40px'});
$$('.reveal').forEach(el=>io.observe(el));

$('#contact-form')?.addEventListener('submit',e=>{
  e.preventDefault();
  const fd=new FormData(e.currentTarget);
  const subject=encodeURIComponent('Portfolio inquiry from '+fd.get('name'));
  const body=encodeURIComponent('Name: '+fd.get('name')+'\nEmail: '+fd.get('email')+'\n\n'+fd.get('message'));
  location.href='mailto:nicodemusmuema84@gmail.com?subject='+subject+'&body='+body;
});

async function boot3D(){
  const canvas=$('#hero3d'),wrap=$('#visual');
  if(!canvas||!wrap) return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||navigator.connection?.saveData) return;
  try{
    const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.js');
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'high-performance'});
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));
    const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(48,1,.1,100);
    camera.position.z=5.2;

    const group=new THREE.Group();scene.add(group);
    const geo=new THREE.IcosahedronGeometry(1.45,2);
    const wire=new THREE.LineSegments(new THREE.WireframeGeometry(geo),new THREE.LineBasicMaterial({color:0x79f2c0,transparent:true,opacity:.33}));
    group.add(wire);

    const nodes=new THREE.Points(
      geo,
      new THREE.PointsMaterial({color:0xb8ffe1,size:.045,transparent:true,opacity:.9})
    );
    group.add(nodes);

    const count=420,pos=new Float32Array(count*3);
    for(let i=0;i<count;i++){
      const r=2.3+Math.random()*2.7,th=Math.random()*Math.PI*2,ph=Math.acos(2*Math.random()-1);
      pos[i*3]=r*Math.sin(ph)*Math.cos(th);
      pos[i*3+1]=r*Math.sin(ph)*Math.sin(th);
      pos[i*3+2]=r*Math.cos(ph);
    }
    const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
    const field=new THREE.Points(pg,new THREE.PointsMaterial({color:0x77a7ff,size:.018,transparent:true,opacity:.42}));
    scene.add(field);

    const ring1=new THREE.Mesh(new THREE.TorusGeometry(2.05,.006,8,180),new THREE.MeshBasicMaterial({color:0x35556f,transparent:true,opacity:.55}));
    ring1.rotation.x=1.12;ring1.rotation.z=.35;scene.add(ring1);
    const ring2=ring1.clone();ring2.scale.setScalar(.78);ring2.rotation.y=1.2;scene.add(ring2);

    let mx=0,my=0,tx=0,ty=0;
    wrap.addEventListener('pointermove',e=>{
      const r=wrap.getBoundingClientRect();
      tx=((e.clientX-r.left)/r.width-.5)*.7;
      ty=((e.clientY-r.top)/r.height-.5)*.55;
    });
    wrap.addEventListener('pointerleave',()=>{tx=ty=0});

    const resize=()=>{
      const w=wrap.clientWidth,h=wrap.clientHeight;
      renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();
    };
    resize();new ResizeObserver(resize).observe(wrap);

    const clock=new THREE.Clock();
    function frame(){
      const t=clock.getElapsedTime();
      mx+=(tx-mx)*.035;my+=(ty-my)*.035;
      group.rotation.y=t*.12+mx;group.rotation.x=t*.07+my;
      field.rotation.y=-t*.018;field.rotation.x=t*.012;
      ring1.rotation.z=t*.04;ring2.rotation.z=-t*.035;
      renderer.render(scene,camera);
      requestAnimationFrame(frame);
    }
    frame();
    $('.fallback',wrap)?.remove();
  }catch(err){console.warn('3D fallback active',err)}
}
if('requestIdleCallback'in window) requestIdleCallback(boot3D,{timeout:1800}); else setTimeout(boot3D,500);