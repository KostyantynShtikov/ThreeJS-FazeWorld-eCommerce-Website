var intro = {
	active: true,
}

class Resizer {
	constructor() {
		this.el = {
			shopCont: getEl("id", "shopCont"),
			// avatarCont: getEl("id", "avatarCont"),
			cartCont: getEl("id", "cartCont"),
		}

		this.do();

		this.addEvents();
	}

	do(){
		this.getSize();
		this.resize();
	}

	getSize(){
		this.w = window.innerWidth;
		this.h = window.innerHeight;
		this.ratio = this.w/this.h;
		this.size = (this.ratio > 1) ? this.h : this.w;
	}

	resize(){
		var s = this.size / 1350;

		TweenMax.set(this.el.shopCont, {scale: s, transformOrigin: "0% 0%"});
		TweenMax.set(this.el.cartCont, {scale: s, transformOrigin: "100% 0%"});

		// if(scoreboard.ready){ this.resizeCanvas(); }
		this.resizeMain();
		this.resizeCanvas();
		if(intro.active){ this.resizeIntro(); }
	}

	resizeMain(){
		// console.log("resizeMain")
		var imgSize = {
			w: 1136,
			h: 640,
		}
		var br1 = 2.181; // brake ratio 1

		var el = getEl("id", "mainCont");

		var rat = this.w / this.h;
		var irat = imgSize.w / imgSize.h;

		var x, y, w, h;

		w = this.w;
		h = w / irat;
		y = -(h - this.h)/2;
		x = 0;


		if(rat > br1){
			console.log("br1")
			h = this.h * br1 / irat;
			w = h * irat;
			y = -(h - this.h)/2;
			x = -(w - this.w)/2;
		} else if (rat < irat){
			console.log("br2")
			h = this.h;
			w = h * irat;
			y = -(h - this.h)/2;
			x = -(w - this.w)/2;
		}

		el.style.width = w + "px";
		el.style.height = h + "px";
		el.style.left = x + "px";
		el.style.top = y + "px";

		// tv
		var s = h / imgSize.h;
		console.log(s);
		var tv = {
			x: 177*s,
			y: 229*s,
		}
		tv.el = getEl("id", "tvCont");
		TweenMax.set(tv.el, {x: tv.x, y: tv.y, scale: s});


		// console.log( x, y, w, h, rat, irat);
	}

	resizeCanvas(){
		// console.log("resizeCanvas")
		var el = getEl("id", "scoreCont");
		var size = scoreboard.size;
		var winSize = {w: app.w, h: app.h};

		var cR = size.w / size.h;
		var sR = winSize.w / winSize.h;
		var rDif = cR/sR;

		var s = 1;
		var pos = {x: 0, y: 0};

		if(cR > sR){ // pagal height
			s = winSize.h / size.h;
			pos.x = -(size.w*s - winSize.w)/2;
		} else { // pagal width
			s = winSize.w / size.w;
			pos.y = -(size.h*s - winSize.h)/2;
		}

		TweenMax.set(el, {scale: s, x: pos.x, y: pos.y, transformOrigin: "0% 0%"})

		// console.log(rDif, scoreboard.lastImg)
		// if(rDif > 2.1){ console.log("AAAA")}
		// if(scoreboard.lastImg == "desktop"){ console.log("BBBB")}
		if((rDif > 2.1) && (scoreboard.lastImg == "desktop")){
			console.log("NOW MOBILE")
			scoreboard.img = getEl("id", "score_screen_mob");
			scoreboard.lastImg = "mobile";
		} else if ((rDif <= 2.1) && (scoreboard.lastImg == "mobile")) {
			console.log("NOW DESKTOP")
			scoreboard.img = getEl("id", "score_screen");
			scoreboard.lastImg = "desktop";
		}
	}

	resizeIntro(){
		var el = getEl("id", "startResized");
		var size = {w: 624, h: 351};
		var winSize = {w: app.w, h: app.h};

		var cR = size.w / size.h;
		var sR = winSize.w / winSize.h;
		var rDif = cR/sR;

		var s = 1;
		var pos = {x: 0, y: 0};

		if(cR > sR){ // pagal height
			// console.log("h", rDif)
			var sAdd = (rDif > 2.2) ? (1-rDif/2.2) : 0;
			if(rDif > 2.6){ sAdd = (1-rDif/2.2)*2.4 };
			if(rDif > 3.8){ sAdd = (1-rDif/2.2)*1 };
			if(rDif > 6.8){ sAdd = (1-rDif/2.2)*0.7 };
			s = winSize.h / size.h + sAdd;
			pos.x = -(size.w*s - winSize.w)/2;
			pos.y = -size.h/2 * sAdd;
		} else { // pagal width
			var sAdd = (rDif < 0.94) ? -(1-rDif/0.94)*2 : 0; // 0 ->
			s = winSize.w / size.w + sAdd;
			pos.y = -(size.h*s - winSize.h)/2;
			pos.x = -size.w/2 * sAdd;
		}

		TweenMax.set(el, {scale: s, x: pos.x, y: pos.y, transformOrigin: "0% 0%"})
	}

	addEvents(){
		window.addEventListener('resize', ()=>{
			this.do();
		}, false)
	}

}
