(function(){
  var prev=document.querySelector('a.pager-item.prev');
  var next=document.querySelector('a.pager-item.next');
  document.addEventListener('keydown',function(e){
    if(e.altKey||e.ctrlKey||e.metaKey||e.shiftKey)return;
    var target=e.target;
    if(target&&(target.isContentEditable||/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)))return;
    if(e.key==='ArrowLeft'&&prev){location.href=prev.getAttribute('href');}
    else if(e.key==='ArrowRight'&&next){location.href=next.getAttribute('href');}
  });
})();
