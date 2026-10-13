(function(){
  document.documentElement.classList.add('js');
  var toggle=document.querySelector('.contents-toggle');
  var contents=document.getElementById('intro-contents');
  if(toggle&&contents){
    toggle.addEventListener('click',function(){
      var open=toggle.getAttribute('aria-expanded')!=='true';
      toggle.setAttribute('aria-expanded',String(open));
      contents.classList.toggle('is-open',open);
      var label=toggle.querySelector('span');
      if(label)label.textContent=open?'收起目录':'展开目录';
    });
    document.addEventListener('keydown',function(e){
      if(e.key==='Escape'&&toggle.getAttribute('aria-expanded')==='true'){
        toggle.click();
        toggle.focus();
      }
    });
  }
  var prev=document.querySelector('a.pager-item.prev');
  var next=document.querySelector('a.pager-item.next');
  document.addEventListener('keydown',function(e){
    if(e.defaultPrevented||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return;
    var target=e.target;
    if(target&&(target.isContentEditable||/^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(target.tagName)))return;
    if(e.key==='ArrowLeft'&&prev){location.href=prev.getAttribute('href');}
    else if(e.key==='ArrowRight'&&next){location.href=next.getAttribute('href');}
  });
})();
