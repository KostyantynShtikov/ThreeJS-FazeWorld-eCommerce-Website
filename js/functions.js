

function getEl(mode, name){
	var el;
	switch(mode){
		case "id":
			el = document.getElementById(name);
			break;
		case "class":
			el = document.getElementsByClassName(name);
			break;
	}
	return el;
}


function getCssProperty(elmId, property){
	var elem = document.getElementById(elmId);
	return parseInt( window.getComputedStyle(elem,null).getPropertyValue(property) );
}



window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(/* function */ callback, /* DOMElement */ element){
              window.setTimeout(callback, 1000 / 60);
          };
})();
