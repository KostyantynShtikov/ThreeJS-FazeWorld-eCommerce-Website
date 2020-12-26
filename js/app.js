
class App {
	constructor() {
		this.container = getEl("id", "threeCont");
		this.w = this.container.offsetWidth; 
		this.h = this.container.offsetHeight;
		// this.w = window.innerWidth;
		// this.h = window.innerHeight;
		console.log(this.w, this.h)
		this.size = {
			w: this.h/2, 
			h: this.h
		}
		this.rAmm = 0.01; // rotation amm
		this.modelScale = 40;

		this.data = {
			fps: 30,
			lt: 0,
			anim: {
				frames: {
					standing: 120,
					fazeup: 100,
				},
				timing: {
					standing: 0,
					fazeup: 0,
				},
			},
			curAnim: "standing",
		}
		this.data.anim.timing.standing = this.data.anim.frames.standing/this.data.fps;
		this.data.anim.timing.fazeup = this.data.anim.frames.fazeup/this.data.fps;
	}

	init(){
		this.setUpThree();
		// this.createElements();
		this.addFootShadow();
		this.loadModel();
		this.addLights();
		this.resize();
	}

	initOnLoad(){
		this.addEvents();
	}

	setUpThree(){
		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera( 50, this.size.w/this.size.h, 0.1, 1000 );
		this.camera.position.y = 5.3;
		this.camera.position.z = 9.9;
		this.camera.lookAt( 0, 3.35, 0 );

		this.clock = new THREE.Clock();

		this.renderer = new THREE.WebGLRenderer({antialias:true, alpha: true});
		this.renderer.setClearColor("#ffffff", 0);
		this.renderer.setSize( this.size.w, this.size.h );

	    this.renderer.shadowMap.enabled = true;
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
		// this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

		this.container.appendChild( this.renderer.domElement );
	}

	// createElements(){
	// 	this.box1 = {};
	// 	this.box1.geo = new THREE.BoxGeometry( 2, 2, 2 );
	// 	var texture = new THREE.TextureLoader().load( 'assets/avatar/shirt_txt_01.jpg' );
	// 	this.box1.mat = new THREE.MeshBasicMaterial( { 
	// 		// color: "#333333", 
	// 		map: texture,
	// 	} );
	// 	this.box1.mesh = new THREE.Mesh( this.box1.geo, this.box1.mat );

	// 	this.scene.add( this.box1.mesh );
	// }

	addLights(){
	    var light = new THREE.AmbientLight( 0xffffff );
	    light.intensity = 0.5;
	    this.scene.add( light );

		var light = new THREE.PointLight( 0xffffff, 0.75, 100 );
		// var light = new THREE.DirectionalLight( 0xffffff, 1 );
		light.position.set( -0.08*this.modelScale, 0.22*this.modelScale, 0.12*this.modelScale );
		// light.position.set( 0.05*this.modelScale, 0.1*this.modelScale, 0.03*this.modelScale );
		light.castShadow = true;

		light.shadow.mapSize.width = 1024;  // default
		light.shadow.mapSize.height = 1024; // default
		light.shadow.camera.near = 2;       // default
		light.shadow.camera.far = 20      // default

		light.shadow.bias = -0.005;

		this.scene.add( light );


		var light = new THREE.PointLight( 0xffffff, 0.5, 100 );
		light.position.set( 0.05*this.modelScale, 0.1*this.modelScale, -0.1*this.modelScale );
		this.scene.add( light );

		var light = new THREE.PointLight( 0xffffff, 0.5, 100 );
		light.position.set( -0.05*this.modelScale, 0.05*this.modelScale, -0.1*this.modelScale );
		this.scene.add( light );

		// var helper = new THREE.CameraHelper( light.shadow.camera );
		// this.scene.add( helper );
	}

	addFootShadow(){
		this.fShadow = {};
		this.fShadow.tex = new THREE.TextureLoader().load( 'assets/avatar/foot_shadow.png' );
		this.fShadow.geo = new THREE.PlaneGeometry( 10, 10, 32 );
		this.fShadow.mat = new THREE.MeshBasicMaterial( {
			map: this.fShadow.tex, 
			side: THREE.DoubleSide,
			opacity: 0.4,
		} );
		this.fShadow.mesh = new THREE.Mesh( this.fShadow.geo, this.fShadow.mat );//

		var s = 0.138;
		this.fShadow.mesh.position.y = -0.48;
		this.fShadow.mesh.position.x = 0;
		this.fShadow.mesh.scale.set(s, s, s);
		this.fShadow.mesh.rotation.x = THREE.Math.degToRad(90);

		this.scene.add( this.fShadow.mesh );
	}

	loadModel(){
		let _this = this;
		this.avatar = {};


	    var loader = new THREE.GLTFLoader().setPath( 'assets/avatar/' );
	    loader.load( '16.glb', function ( gltf ) {

	      _this.avatar.all = gltf.scene;
	      let animations = gltf.animations;
	      console.log(animations)

	      var box = new THREE.Box3().setFromObject( _this.avatar.all );
	      console.log( box.min, box.max, box.getSize() );

	      _this.mixer = new THREE.AnimationMixer(gltf.scene);
	      
	      _this.animation = _this.mixer.clipAction(animations[1]);
	      _this.animation.play();

	      var childrens = _this.avatar.all.children[0].children;

	      childrens[5].material.side = THREE.DoubleSide;

	      for(var i=0; i<childrens.length; i++){
	      	var child = childrens[i];
	      	if(child.type == "SkinnedMesh"){
	      		console.log(child);
		        // var meshMaterial = new THREE.MeshBasicMaterial({
		        	// color: 0xffffff
		        // });

	      		child.material.color = new THREE.Color( 0xffffff );
	      		// child.material = meshMaterial;
	      		child.material.needsUpdate = true
	      		console.log("white")

	      		child.castShadow = true; //default is false
	      		// if(child.name != "top"){
					child.receiveShadow = true; //default
	      		// }
	      	}
	      }

	      console.log(childrens)

	      _this.avatar.all.scale.set(_this.modelScale, _this.modelScale, _this.modelScale);
	      _this.avatar.all.position.y = -0.5;

	      _this.scene.add(_this.avatar.all);
	      _this.fixTextures();
	      _this.initOnLoad();
	    }, (xhr) => xhr, (e) => console.error(e));
	}


	fixTextures(){
		this.changeTexture('pants', texData['p_pants_01'].src);
		this.changeTexture('c_shirts', texData['p_shirt_01'].src);
		this.changeTexture('avatar', texData['body'].src);
	}

	changeTexture(place, path){
		var _this = this;
		var childrens = this.avatar.all.children[0].children;
		var placement = {
			'shoes': 4,
			'pants': 3,
			'avatar': 2,
			'c_shirts': 5,
		}
		var mesh = childrens[placement[place]];

		var loader = new THREE.TextureLoader();
		loader.load(
		    path,
		    function ( texture ) {
		    	texture.flipY = false;
		    	texture.anisotropy = _this.renderer.capabilities.getMaxAnisotropy
				mesh.material.map = texture;
				mesh.material.needsUpdate = true;
		    },
		    undefined,
		    function ( err ) { console.error( 'An error happened.' ); }
		);
	}

	faceUpAnim(){
		console.log("faceUpAnim");
		this.data.curAnim = "fazeup";
		this.mixer.time = 0;
		this.animation.time = this.data.anim.timing.standing;
	}

	render(){
		requestAnimationFrame(()=>this.render());

		drag.loopAnim();

		var td = this.clock.getDelta();
		var ct = this.mixer.time + td;

		// console.log(ct);
		switch(this.data.curAnim){

			case "standing":

				if(ct > this.data.anim.timing.standing){
					this.animation.reset();
					this.mixer.time = 0;
					console.log("reset mixer time")
				}
				break;

			case "fazeup":
				// console.log(ct, this.data.lt)
				if(ct > this.data.anim.timing.fazeup){ // is naujo prasidejo
					this.mixer.time = 0;
					console.log("reset fazeup")
					this.data.curAnim = "standing";
					drag.clickActive = true;
				}
				break;
		}

		// this.data.lt = ct; // last time

        if (this.mixer) this.mixer.update(td);

		this.avatar.all.rotation.y = drag.delayed.x * this.rAmm;
		this.fShadow.mesh.rotation.z = -drag.delayed.x * this.rAmm;

		// console.log(drag.delayed.x)

		this.renderer.render(this.scene, this.camera);
	};

	addEvents(){
		window.addEventListener('resize', ()=>{
			this.resize();
		}, false)
	}

	resize(){
		this.w = this.container.offsetWidth; 
		this.h = this.container.offsetHeight;
		this.size = {
			w: this.h/2, 
			h: this.h
		}
	  	this.camera.aspect = this.size.w / this.size.h
	  	this.camera.updateProjectionMatrix()
	  	this.renderer.setSize(this.size.w, this.size.h)
	}

}




class Drag {
	constructor() {
		this.el = getEl("id", "dragEl");
		this.loop = true;
		this.clicked = false;
		this.clickActive = true;

		this.sum = {x: 0, y: 0}
		this.cur = {x: 0, y: 0}
		this.final = {x: 0, y: 0}
		this.delayed = {x: 0, y: 0}
	}

	init(){
		this.dEl = this.addDraggable(this.el);
	}

	loopAnim(){
    	this.final.x = this.sum.x + this.cur.x;
    	this.final.y = this.sum.y + this.cur.y;

    	var dx = this.final.x - this.delayed.x;
    	this.delayed.x += dx / 10;
	}

  	addDraggable(el){
  		let _this = this;
    	return Draggable.create(el, { 
	        onPress:function() { 
	          	_this.onPress(this);
	        },
	        onDrag: function(e) {
	          	_this.onDrag(this);
	        },
	        onRelease:function(e){
	          	_this.onRelease(this)
	        }
    	})
  	}

  	onPress(el){
  		if(this.clickActive){
			this.clicked = true;
  		}
  	}

  	onDrag(el){
  		this.cur.x = el.x;
  		this.cur.y = el.y;
		this.clicked = false;
  	}

  	onRelease(el){
  		this.sum.x += this.cur.x;
  		this.sum.y += this.cur.y;

    	this.cur.x = 0;
    	this.cur.y = 0;

		if(this.clicked){
			this.clickActive = false;
			app.faceUpAnim("play");
		}

    	TweenMax.set(el.target, {x: 0, y: 0});
  	}

}






class ScoreBoard {
	constructor() {
		this.container = getEl("id", "scoreCont");
		this.rows = 5;
		this.cols = 6;
		this.total = this.rows * this.cols;
		this.data = {};
		this.size = {w: 960, h: 540};
		this.rectSize = {w: this.size.w / this.cols, h: this.size.h / this.rows};
		this.canvas = null;
		this.ctx = null;
		this.ready = false;
		this.img = getEl("id", "score_screen");
		this.lastImg = "desktop";
	}

	init(){
		this.canvas = document.createElement('canvas');
		this.canvas.id = "scoreCanvas";
		this.canvas.width = this.size.w;
		this.canvas.height = this.size.h;
		this.canvas.style.position = "absolute";

		this.container.appendChild(this.canvas);
		this.ctx = this.canvas.getContext("2d");

		// this.ctx.drawImage(this.img, 0, 0);

		console.log("canvas created")

		this.ready = true;
	}

	show(){
		this.list = Array.from({length: this.total}, () => Math.floor(Math.random() * this.total));
		console.log(this.list)
		let _this = this;
		for(let i=0; i<this.total; i++){
			let counter = {val: 0};
			let ii = this.list[i];

			TweenMax.set(counter, {delay: ii*0.1+0.00, val: 0.6*Math.random(), onComplete: function(){
				_this.drawPart(i, counter.val);
			}});
			TweenMax.set(counter, {delay: ii*0.1+0.05, val: 0.6*Math.random(), onComplete: function(){
				_this.drawPart(i, counter.val);
			}});
			TweenMax.set(counter, {delay: ii*0.1+0.10, val: 0.6*Math.random(), onComplete: function(){
				_this.drawPart(i, counter.val);
			}});
			TweenMax.set(counter, {delay: ii*0.1+0.15, val: 1, onComplete: function(){
				_this.drawPart(i, counter.val);
			}});
		}

		setTimeout( ()=>{ scoreScreen(); }, ( this.total*0.1 + 0.15 + 0.15 ) * 1000 );
	}

	hide(){
		let counter = {val: 0};
		this.ctx.globalAlpha = 1;

		TweenMax.to(counter, 1.5, {val: 1, ease: Power1.easeIn, onUpdate: ()=>{
			// this.ctx.clearRect(0, 0, this.size.w, this.size.h);
			var val = counter.val;

			// var x1 = 0;
			// var y1 = 0;
			// var w1 = this.size.w / 2;
			// var h1 = this.size.h / 2;
			// var x2 = 0;
			// var y2 = 0;
			// var w2 = this.size.w / 2;
			// var h2 = this.size.h / 2;

			// this.ctx.drawImage(this.img, x1, y1, w1, h1, x2, y2, w2, h2);
			// console.log(val);

			// val = 0.2;

			var x1 = 0;
			var x2 = this.size.w;
			var y1 = this.size.h/2 - val * this.size.h/2;
			var y2 = this.size.h/2 + val * this.size.h/2;

			// console.log(x1, y1, x2, y2)

			// this.ctx.clearRect(x1, y1, x2, y2);
			this.ctx.clearRect(x1, y1, x2, y2-y1);

			var y1 = 0;
			var y2 = this.size.h;
			var x1 = this.size.w/2 - val * this.size.w/2;
			var x2 = this.size.w/2 + val * this.size.w/2;

			this.ctx.clearRect(x1, y1, x2-x1, y2);

		}, onComplete: function(){
			o.introCont.style.display = "none";
		}});
	}

	drawPart(i, val){
		var x = i % this.cols * this.rectSize.w;
		var y = (i - (i % this.cols))/this.cols * this.rectSize.h;

		this.ctx.globalAlpha = val;
		this.ctx.drawImage(this.img, x, y, this.rectSize.w, this.rectSize.h, x, y, this.rectSize.w, this.rectSize.h);
	}
}