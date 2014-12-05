/**
 * kB.js
 * https://github.com/Xeoncross/kb_javascript_framework/blob/master/license.txt
 * https://github.com/Xeoncross/kb_javascript_framework
 */
$=function(a){return a.style?a:document.getElementById(a)};var kb={b:function(){return document.body},toggle:function(a){a.style.display=(a.style.display!="none")?"none":""},yellowFade:function(d){var a=155;function c(){d.style.backgroundColor="rgb(255,255,"+(a+=4)+")";if(a<255){setTimeout(c,50)}}c()},on:function(d,a,c,b){if(d.attachEvent?(b?d.detachEvent("on"+a,d[a+c]):1):(b?d.removeEventListener(a,c,0):d.addEventListener(a,c,0))){d["e"+a+c]=c;d[a+c]=function(){d["e"+a+c](window.event)};d.attachEvent("on"+a,d[a+c])}},ready:function(a){"\v"=="v"?setTimeout(a,0):kb.on(document,"DOMContentLoaded",a)},ajax:function(b,c,e,a){a=new (window.ActiveXObject||XMLHttpRequest)("Microsoft.XMLHTTP");a.open(e?"POST":"GET",b,1);a.setRequestHeader("X-Requested-With","XMLHttpRequest");a.setRequestHeader("Content-type","application/x-www-form-urlencoded");a.onreadystatechange=function(){a.readyState>3&&c&&c(a.responseText,a)};a.send(e)},uriEncode:function(b,c,a){c="";for(a in b){c+="&"+a+"="+encodeURIComponent(b[a])}return c.slice(1)},ajaxForm:function(a,b){kb.on((a=$(a)),"submit",function(c){kb.ajax(a.action,b,kb.serialize(a));kb.stop(c)})},serialize:function(h){function e(f){return h.getElementsByTagName(f)}var a=function(f){if(f.name){return encodeURIComponent(f.name)+"="+encodeURIComponent(f.value)}};var c=kb.collect(e("input"),function(f){if((f.type!="radio"&&f.type!="checkbox")||f.checked){return a(f)}});var d=kb.collect(e("select"),a);var b=kb.collect(e("textarea"),a);return c.concat(d).concat(b).join("&")},collect:function(b,e){var g=[];for(var d=0;d<b.length;d++){var c=e(b[d]);if(c!=null){g.push(c)}}return g},insertAfter:function(b,a){b.parentNode.insertBefore(a,b.nextSibling)},jsonDecode:function(j){return eval("("+j+")")},jsonEncode:function(a,b){if(!a){return a+""}b=[];if(a.pop){for(x in a){b.push(json_encode(a[x]))}a="["+b.join(",")+"]"}else{if(typeof a=="object"){for(x in a){b.push(x+":"+json_encode(a[x]))}a="{"+b.join(",")+"}"}else{if(a.split){a="'"+a.replace(/\'/g,"\\'")+"'"}}}return a},fx:function(a,h,g,d,b,e){b=0;(e=function(){b++<a&&g(b/a)!==0?setTimeout(e,h):(d?d():0)})()},move:function(b,a,c){b.style.left=parseInt(b.style.left)+a+"px";b.style.top=parseInt(b.style.top)+c+"px"},fade:function(j,b,g,c,a){j=j=="in";kb.fx(c?c:15,a?a:50,function(d){d=(j?0:1)+(j?1:-1)*d;b.style.opacity=d;b.style.filter="alpha(opacity="+100*d+")"},g)},slide:function(j,g,h,c,a,b){if(j){g.style.height="";g.style.display=""}b=b?b:kb.pos(g).h;kb.fx(c?c:20,a?a:20,function(d){d=(j?0:1)+(j?1:-1)*d;g.style.height=(d*b)+"px"},function(){if(!j){g.style.display="none"}if(h){h()}})},pos:function(c,b){b={l:0,t:0,w:c.offsetWidth,h:c.offsetHeight};do{b.l+=c.offsetLeft;b.t+=c.offsetTop}while(c=c.offsetParent);return b},scrollTo:function(d,b,a,g,c){g=g?g:50;c=kb.pos(d),w=kb.windowPos();kb.moveWindow((c.l-w.x-g)/b,(c.t-w.y-g)/b,b,a)},moveWindow:function(a,d,c,b){if(c){window.scrollBy(a,d);setTimeout(function(){kb.moveWindow(a,d,c-1,b)},b?b:40)}},windowPos:function(){var a=window,b=document,c=b.documentElement;return{x:(a.pageXOffset||b.body.scrollLeft||c.scrollLeft),y:(a.pageYOffset||b.body.scrollTop||c.scrollTop)}},stop:function(a){a.preventDefault?a.preventDefault():a.returnValue=0},modal:function(j,d,g,n,b,i,a,l){l=document.createElement("div");l.id="modal_overlay";kb.b().appendChild(l);if(!b){kb.on(l,"click",function(){kb.closeModal()})}a=document.createElement("div");a.id="modal";j.style?a.appendChild(j):a.innerHTML=j;setTimeout(function(c){kb.b().appendChild(a);if(!d||!g){l=kb.pos(a);d=l.w;g=l.h}a.style.width=d+"px";a.style.height=g+"px";a.style.marginLeft=-d/2+"px";a.style.marginTop=-g/2+"px";kb.fade("in",a,n,i?i:10);if(j=$("modal_close")){kb.on(j,"click",function(f){kb.closeModal();return kb.stop(f)})}},100)},closeModal:function(){kb.remove($("modal"));kb.remove($("modal_overlay"))},lightbox:function(b,a){if(a=kb.getByClassName(b?b:"lightbox")){for(k in a){kb.on(a[k],"click",function(c){kb.modal('<img src="'+this.href+'" />');return kb.stop(c)})}}},remove:function(a){a.parentNode.removeChild(a)},index:function(c,b,d){for(d=b.length;d--&&b[d]!=c;){}return d},getByClassName:function(f,c,e,a,b){e=(c?c:document).getElementsByTagName("*");b=[];for(a=e.length;a--;){kb.index(f,e[a].className.split(" "))>-1&&b.push(e[a])}return b},selection:function(){var c=window.getSelection,b=document.getSelection,a=document.selection;return(c?c():(b)?b():(a?a.createRange().text:0))}};

function getHash() {
    return window.location.hash.substring(1);
}

function setHash(hash) {
    window.location.hash = hash;
}

/**
 * Search for ebola
 * @param query
 */
function search(query) {
    kb.ajax('server/app.php?address=' + query + '&imp=' + $('imperial').checked, function(response) {
        var result = kb.jsonDecode(response);
        console.log(result);

        if (! result.state) {
            return alert(result.message);
        }

        kb.fx(10, 20, function(i) {
            if ($('container').style.marginTop !== '0%') {
                $('container').style.marginTop = 10 - (i * 10) + '%';
            }
        }, function() {
            $('result-place').innerHTML = result.formatted_address;
            $('result-affected-location').innerHTML = result.affected_location;
            $('result-affected-distance').innerHTML = result.affected_distance;

            $('result-text').innerHTML = result.message;

            $('result-data').style.display = 'block';
            $('result-text').style.display = 'block';
            kb.fade('in', $('result-data'));
            kb.fade('in', $('result-text'));
        });
    });
}

kb.ready(function() {
    var placeInput = $('place');
    placeInput.value = getHash();

    kb.on(window, 'hashchange', function(e) {
        e.preventDefault();
        placeInput.value = getHash();

        search(placeInput.value);
    });

    kb.on($('search'), 'submit', function(e) {
        e.preventDefault();
        setHash(placeInput.value);

        search(placeInput.value);
    });
});