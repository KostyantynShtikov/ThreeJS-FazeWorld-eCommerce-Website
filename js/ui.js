
class UI {
	constructor() {
		this.data = {
			productBox: {
				el: getEl("id", "productBox"),
				// el2: getEl("id", "menuCont"),
				opened: false,
				active: true,
				selected: null,
			},
			shopBtn: {
				el: getEl("id", "shopBtn"),
				el2: getEl("id", "menuCont"),
				opened: false,
				active: true,
			},
			cartBtn: {
				el: getEl("id", "cartBtn"),
				el2: getEl("id", "cartBox"),
				opened: false,
				active: true,
			},
			startCont: {
				el: getEl("id", "startCont"),
				el2: getEl("id", "scoreCont"),
				active: true,
			},
		}

		this.curCat = null;
		this.lastProductSelect = null;
	}

	init(){
		this.introAnim();
		this.addEvents();
	}

	introAnim(){
		this.introBtnTl = new TimelineMax({repeat:-1, delay:0});
		this.introBtnTl.set(o.start_press_gold, {delay: 0.8, opacity: 1})
					   .set(o.start_press_gold, {delay: 0.8, opacity: 0})
	}



	enterClick(prop){
		if(prop.active){
			prop.active = false;
			this.introBtnTl.kill();
			enterClicked();
		}
	}

	addEvents(){
		let _this = this;

		// -- MENU CATEGORY CLICK -- //
		var el = getEl("class", "list");
		Array.from(el).forEach(function(element) {
			element.addEventListener('click', function(event){
				// console.log(this.getAttribute('alt'))
				_this.curCat = this.getAttribute('alt');
				getEl("id", "menuList").style.display = "none";
				getEl("id", "productList").style.display = "block";

				var el;
				if(_this.curCat == "c_all"){
					el = getEl("class", "product");
				} else {
					el = getEl("class", _this.curCat);
				}
				console.log("_this.curCat", el)
				Array.from(el).forEach(function(element) {
					element.style.display = "inline-block";
				});
			});
 
	    });

	    // -- PRODUCT CLICK -- //
		var el = getEl("class", "product");
		Array.from(el).forEach(function(element) {
			element.addEventListener('click', function(event){
				var id= this.getAttribute('id');
				console.log(id);

				// Remove before selected product
				_this.deselectProduct();
				_this.lastProductSelect = element;

				element.style.backgroundImage = 'url("images/product_select_box.png")';
				_this.toggleProductBox(id);
				app.changeTexture('c_shirts', texData[id].src);
			});
		});


		// -- BACK BUTTON -- //
		var el = getEl("id", "back_btn");
		el.onclick = ()=>{
			getEl("id", "menuList").style.display = "block";
			getEl("id", "productList").style.display = "none";

			if(_this.curCat == "c_all"){
				el = getEl("class", "product");
			} else {
				el = getEl("class", _this.curCat);
			}
			Array.from(el).forEach(function(element) {
				element.style.display = "none";
			});
			// console.log("back_clicked", _this.curCat, el)
		};

		// -- ENTER BUTTON -- //
		document.body.addEventListener("keyup", function(event) {
		  event.preventDefault();
		  if (event.keyCode === 13) {
		    var prop = _this.data.startCont;
			_this.enterClick(prop);

			// app.changeTexture(); // laikinai
		  }
		});

		this.data.startCont.el.onclick = ()=>{
			var prop = this.data.startCont;
			this.enterClick(prop);
		};

		// -- SHOP BUTTON -- //
		this.data.shopBtn.el.onclick = ()=>{
			var prop = this.data.shopBtn;
			if(prop.active){
				prop.opened = !prop.opened;
				var value = (prop.opened) ? "block" : "none";
				prop.el2.style.display = value;
			}
		};

		// -- CART BUTTON -- //
		this.data.cartBtn.el.onclick = ()=>{
			this.toggleCartButton();

			if(this.data.productBox.opened){
				this.closeProductBox();
			}
		};

		// -- CART CLOSE BUTTON -- //
		var el = getEl("id", "cartCloseBtn");
		el.onclick = ()=>{
			this.toggleCartButton();
		};

		// -- PRODUCT CLOSE BUTTON -- //
		var el = getEl("id", "productCloseBtn");
		el.onclick = ()=>{
			this.closeProductBox();
		};
	}

	toggleProductBox(id){
		var prop = this.data.productBox;
		if(prop.active){

			if(prop.selected == id){ // soaudimas ant to pacio el -> uzdarom
				this.closeProductBox();
			} else {
				this.openProductBox(id);
				prop.selected = id;
				this.updateProductBoxData(id);
			}
		}
	}

	deselectProduct(){
		if(this.lastProductSelect != null){
			this.lastProductSelect.style.removeProperty("background-image");
		}
	}

	closeProductBox(){
		var prop = this.data.productBox;
		if(prop.active){
			prop.opened = false;
			prop.el.style.display = "none";
			prop.selected = null;
			this.deselectProduct();
		}
	}

	openProductBox(id){
		var prop = this.data.productBox;
		if(prop.active){
			prop.opened = true;
			prop.el.style.display = "block";

			if(this.data.cartBtn.opened){
				this.toggleCartButton();
			}
		}
	}

	updateProductBoxData(id){
		console.log('updateProductBoxData', id);
	}

	toggleCartButton(){
		var prop = this.data.cartBtn;
		if(prop.active){
			console.log("cartBtn click", prop.opened)
			prop.opened = !prop.opened;
			var value = (prop.opened) ? "block" : "none";
			prop.el2.style.display = value;
		}
	}
}


