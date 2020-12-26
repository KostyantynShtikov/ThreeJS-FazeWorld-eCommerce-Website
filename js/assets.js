// PRODUCT DATA
var data = {
  'p_shirt_01': {
    modelType: "shirts",
    texture: {
      path: 'assets/avatar/shirt_txt_02.jpg',
    },
    menu: {
      path: 'images/products/p_shirt_01.png',
    },
    product: {
      paths: [
        'images/products/p_shirt_01.png',
        'images/products/p_shirt_01.png',
      ]
    },
  },
}


// Textures
var texData = {
  'p_pants_01': {
    src: 'assets/avatar/pants_txt.jpg',
  },
  'body': {
    src: 'assets/avatar/body_avatar_default_txt_02.jpg',
  },
  'p_shirt_01': {
    src: 'assets/avatar/shirt_txt_02.jpg',
  },
  'p_shirt_03': {
    src: 'assets/avatar/shirt_txt_01.jpg',
  },
}


// Sounds
var sounds = {
  muted: false,
  data: {
    music: { src: ["assets/music.mp3"], loop: true, volume: 0.1, playing: false, },
  },
  list: {},
}

function prepareSounds(){
  Object.entries(sounds.data).forEach(
    ([key, value]) => {
      var s = sounds.data[key];
      sounds.list[key] = new Howl( value );
    }
  );
}

function playSound(name, mode){
  console.log(name, mode);
    var sound = sounds.list[name];
    switch(mode){
      case "play":
        sound.play();
        sounds.data[name].active = true;
        if(sounds.muted){
          sound.volume(0);
        } else {
          sound.volume( (sounds.data[name].volume != null) ? sounds.data[name].volume : 1 );
        }
        break;
      case "stop":
        sound.stop();
        sounds.data[name].active = false;
        break;
      case "mute":
        sound.volume ( 0 );
        break;
      case "unmute":
        sound.volume ( (sounds.data[name].volume != null) ? sounds.data[name].volume : 1 );
        break;
    }
}


function muteSounds(mode){
  console.log("muteSounds", mode)
  for(var key in sounds.data){
    var sound = sounds.data[key];
    if(sound.active){
      if(mode){
        playSound(key, "mute");
      } else {
        playSound(key, "unmute");
      }
    }
  }
}















// Images







    var o = {
      introCont: getEl("id", "introCont"),
      startCont: getEl("id", "startCont"),
    };


    // L O A D    I M A G E S
    var assets_url = "images/";
    var assets = {
        init: [
          {
            format: "png",
            type: "id",
            bgMode: "",
            scale: 1,
            names: "start_copyright start_logo_icon start_logo_subtext start_logo_text start_press_blue start_press_gold"
          },
          {
            format: "png",
            type: "id",
            bgMode: "100% 100%",
            scale: 1,
            names: "start_bg"
          },
          {
            format: "png",
            type: "src",
            bgMode: "",
            scale: 1,
            names: "score_screen score_screen_mob"
          },
        ],
        // end: [
        //   {
        //     format: "png",
        //     type: "id",
        //     scale: 1,
        //     names: ""
        //   },
        // ]
    }

var assetsCur = 0;
var assetsTotal = 0;
var allLoaded = false;

//

function loadAssets(){
    loadAsset(assets.init);
}

function loadOther(){
    assetsTotal =  Object.size(assets);
    for (var prop in assets) {
      if(prop != "init"){
        loadAsset(assets[prop]);
      }
    }
}

function loadMid(){
    loadAsset(assets.mid);
}

function loadEnd(){
    loadAsset(assets.end);
}

function loadAsset(a){
    a.cur_asset_pack = 0;
    a.asset_packs = a.length;

  for(var k=0; k<a.asset_packs; k++){
      var names = a[k].names.split(" ");
      a[k].curLoad = 0;

      for (var i=0; i<names.length; i++){
          var img = new Image();
          img.myCustomData = {total: names.length, a:a, name:names[i], numb: k};
          img.onload = function() {
            o[this.myCustomData.name] = document.getElementById(this.myCustomData.name);
            
            var type = this.myCustomData.a[this.myCustomData.numb].type;
            var bgMode = this.myCustomData.a[this.myCustomData.numb].bgMode;
            var elAmm = 1;
            if (type == "class"){
              o[this.myCustomData.name] = document.getElementsByClassName(this.myCustomData.name);
              elAmm = o[this.myCustomData.name].length;
            }

            for(var j=0;j<elAmm;j++){
              // console.log(this.myCustomData.name);
              var el;
              if (type == "class"){
                el = o[this.myCustomData.name][j];
                el.style.backgroundImage = "url(" + this.src + ")";
              } else if (type == "id") {
                el = o[this.myCustomData.name];
                el.style.backgroundImage = "url(" + this.src + ")";
              } else if (type == "src") {
                console.log( this.src );
                el = o[this.myCustomData.name];
                o[this.myCustomData.name].src = this.src;
              }

              el.style.position = "absolute";
              el.style.width = this.width + "px";
              el.style.height = this.height + "px";

              if(bgMode == "cover center"){
                el.style.backgroundSize = "cover";
                el.style.backgroundPosition = "center";
                el.style.width = "100%";
                el.style.height = "100%";
              } else if (bgMode == "contain center"){
                el.style.backgroundSize = "contain";
                el.style.backgroundRepeat = "none";
                el.style.backgroundPosition = "center";
                el.style.width = "100%";
                el.style.height = "100%";
              } else if (bgMode == "100% 100%"){
                el.style.width = "100%";
                el.style.height = "100%";
                el.style.backgroundSize = "100% 100%";
              }

              if(this.myCustomData.a[this.myCustomData.numb].scale != 1){
                var scale = 1/this.myCustomData.a[this.myCustomData.numb].scale;
                // TweenMax.set(el, {scale: scale, transformOrigin: '0% 0%'});
              }
            }

            countAsset( this.myCustomData.a, this.myCustomData.numb, this.myCustomData.total );
          };
          img.src = assets_url + names[i] + "." + a[k].format;
      }
  }
}

function countAsset(asset, o, total){
  asset[o].curLoad++;
  if(asset[o].curLoad == total) {
    asset.cur_asset_pack++;
    if(asset.cur_asset_pack == asset.asset_packs){
      assetSetLoaded();
    }
  }
}

function assetSetLoaded(){
    assetsCur++;
    if(assetsCur == 1){
      init();
      loadOther();
    } else if(assetsCur == assetsTotal){
      allLoaded = true;
    }
}

//

Object.size = function(obj) { // get objects ammount in var
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

