/* Illustrative walkthroughs. Automatic selections are demonstrations, not autoplay product promises. */
(function(global){
  'use strict';
  var films=['Year one','Grandma’s garden','Our street','The strawberry farm','Canada','The wedding','Happy birthday','Baby laughing'];
  function create(hero,reduced){return {hero:hero,phase:reduced?'choice':hero?'grid':'play',time:0,film:0,auto:!reduced,paused:false,scroll:0,turn:0,selected:null};}
  function options(s){return [(s.film+1)%films.length,(s.film+2)%films.length];}
  function act(s,event,value){
    var n=Object.assign({},s);
    function phase(p){n.phase=p;n.time=0;}
    if(event==='toggle'){n.paused=!n.paused;return n;}
    if(event==='swipe'){n.auto=false;n.paused=false;n.selected=null;phase('choice');return n;}
    if(event==='choose'&&s.phase==='choice'){n.auto=false;n.paused=false;n.selected=options(s)[value];phase('selected');return n;}
    if(event==='tile'){n.auto=false;n.paused=false;n.film=value;n.selected=null;phase('play');return n;}
    if(event!=='tick'||s.paused)return n;
    n.time++;
    if(s.phase==='grid'){
      n.scroll=n.time>=4?2:n.time>=2?1:0;
      if(n.time>=6)phase('play');
    }else if(s.phase==='play'&&n.time>=3){phase(n.hero?'swipe':'choice');}
    else if(s.phase==='swipe'&&n.time>=1){phase('choice');}
    else if(s.phase==='choice'&&n.auto&&n.time>=2){n.selected=options(s)[s.turn%2];phase('selected');}
    else if(s.phase==='selected'&&n.time>=1){n.film=s.selected;n.selected=null;n.turn++;phase('play');}
    // Return to the tile treatment only after the selected film has played.
    if(n.hero&&n.auto&&n.turn>=2&&n.phase==='swipe'){n.turn=0;n.scroll=0;phase('grid');}
    return n;
  }
  if(typeof module!=='undefined'&&module.exports){module.exports={create:create,act:act,options:options};return;}
  function mount(id,hero){
    var root=document.getElementById(id),motion=matchMedia('(prefers-reduced-motion: reduce)');
    var state=create(hero,motion.matches),lastFilm=-1;
    var art=root.querySelector('.walk-art'),title=root.querySelector('.walk-title'),choices=root.querySelector('.walk-choices');
    var buttons=Array.from(root.querySelectorAll('[data-choice]')),toggle=root.querySelector('.walk-toggle');
    var player=root.querySelector('.walk-player'),grid=root.querySelector('.walk-grid'),phone=root.querySelector('.walk-phone');
    if(hero){
      var ul=grid.querySelector('.vids');
      // Reuse the existing four tile treatments; repeat rows to illustrate scrolling.
      for(var card=4;card<films.length;card++){
        var li=document.createElement('li'),button=document.createElement('button'),heading=document.createElement('h3');
        button.type='button';button.className='thumb c-'+['red','blue','green','yellow'][card%4];button.dataset.film=card;button.setAttribute('aria-label','Choose '+films[card]+', an example film');
        button.innerHTML='<span class="pbtn"><span class="play"></span></span>';heading.textContent=films[card];li.append(button,heading);ul.appendChild(li);
      }
      var originals=Array.from(ul.children);for(var repeat=0;repeat<1;repeat++){originals.forEach(function(li){ul.appendChild(li.cloneNode(true));});}
      Array.from(ul.querySelectorAll('.thumb')).forEach(function(b){
        var i=Number(b.dataset.film);b.insertAdjacentHTML('afterbegin',FM.poster(['kb','stack','scatter','slide'][i%4],i));
        b.addEventListener('click',function(){send('tile',i);});
      });
    }
    function render(){
      root.dataset.phase=state.phase;root.dataset.film=state.film;
      if(hero){
        var tiles=state.phase==='grid';grid.hidden=!tiles;phone.hidden=tiles;
        var ul=grid.querySelector('.vids'),row=ul.children[0].getBoundingClientRect().height;
        var distance=Math.min(state.scroll*(row+18),Math.max(0,ul.scrollHeight-grid.clientHeight+36));
        ul.style.transform='translateY(-'+distance+'px)';
        document.getElementById('channel-mode').textContent=tiles?'Channel':'Phone feed';
      }
      if(lastFilm!==state.film){art.innerHTML=FM.poster('kb',state.film);lastFilm=state.film;}
      title.textContent=films[state.film];
      choices.hidden=state.phase!=='choice'&&state.phase!=='selected';
      var opts=options(state);
      buttons.forEach(function(b,i){b.textContent=(i?'B · ':'A · ')+films[opts[i]];b.classList.toggle('selected',state.selected===opts[i]);b.disabled=state.phase!=='choice';});
      toggle.textContent=state.paused?'Resume demo':'Pause demo';toggle.setAttribute('aria-pressed',String(state.paused));
      root.style.setProperty('--walk-play',state.paused?'paused':'running');
    }
    function send(e,v){state=act(state,e,v);render();}
    buttons.forEach(function(b,i){b.addEventListener('click',function(){send('choose',i);});});
    toggle.addEventListener('click',function(){send('toggle');});
    var startY=null;
    player.addEventListener('pointerdown',function(e){if(!e.target.closest('button'))startY=e.clientY;});
    player.addEventListener('pointerup',function(e){if(startY!==null&&startY-e.clientY>35)send('swipe');startY=null;});
    player.addEventListener('pointercancel',function(){startY=null;});
    player.tabIndex=0;player.setAttribute('aria-label','Example film. Press Arrow Up to choose another film.');
    player.addEventListener('keydown',function(e){if(e.key==='ArrowUp'){e.preventDefault();send('swipe');}});
    motion.addEventListener('change',function(e){if(e.matches){state=create(hero,true);render();}});
    if(hero){
      function sizeHero(){
        var copy=document.querySelector('.promo-copy'),cta=copy.querySelector('.button'),figure=root.closest('figure');
        var desktop=matchMedia('(min-width:901px)').matches;
        var height=desktop?Math.max(240,cta.getBoundingClientRect().bottom-root.getBoundingClientRect().top):Math.min(480,Math.max(360,root.clientWidth*1.3));
        root.style.height=Math.round(height)+'px';root.style.setProperty('--demo-height',Math.round(height)+'px');
      }
      new ResizeObserver(sizeHero).observe(document.querySelector('.promo-copy'));
      window.addEventListener('resize',sizeHero);document.fonts.ready.then(sizeHero);sizeHero();
    }
    render();
    setInterval(function(){var r=root.getBoundingClientRect();if(!document.hidden&&r.bottom>0&&r.top<innerHeight)send('tick');},1000);
  }
  mount('hero',true);mount('choice-demo',false);
})(typeof window!=='undefined'?window:globalThis);
