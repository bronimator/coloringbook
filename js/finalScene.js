let finalScene = (cx)=>{
    cx.fillStyle = 'rgba(255,255,255, 0.8)';
    cx.fillRect (0,0, cx.canvas.width, cx.canvas.height);
    console.log("You win");

	let imageCrone = document.createElement("img");
	imageCrone.src = "pic/crone.png";

	//Объекты для вывода на холст
	var croneImg = {
		image: imageCrone,

		side:cx.canvas.width,

		endScale: 0.7,
		currentScale: 5,

		xCenter: Math.floor(cx.canvas.width/2),
		yCenter: Math.floor(cx.canvas.height*0.3),

		srcWidth:750,
		srcHeight:750,

		wait: .5
	};


	let imageStar = document.createElement("img");
	imageStar.src = "pic/star.png";

	var star = {		
		image: imageStar,

		side:Math.floor(cx.canvas.width/8),

		endScale: 1,
		currentScale: 4,

		srcWidth:111,
		srcHeight:111,

		yCenter: Math.floor(cx.canvas.height*0.55)
	};

	var star1 = Object.assign({},star);
	star1.xCenter = Math.floor(cx.canvas.width*0.17);
	star1.wait = 1;

	var star2 = Object.assign({},star);
	star2.xCenter = Math.floor(cx.canvas.width*0.33);
	star2.wait = 1.4;

	var star3 = Object.assign({},star);
	star3.xCenter = Math.floor(cx.canvas.width/2);
	star3.wait = 1.8;

	var star4 = Object.assign({},star);
	star4.xCenter = Math.floor(cx.canvas.width*0.67);
	star4.wait = 2.2;

	var star5 = Object.assign({},star);
	star5.xCenter = Math.floor(cx.canvas.width*0.83);
	star5.wait = 2.6;


	let repeatImg = document.createElement("img");
	repeatImg.src = "pic/rotate.png";

	var repeat = {
		image: repeatImg,

		side:Math.floor(cx.canvas.width/6),

		endScale: 0.7,
		currentScale: 5,

		xCenter: Math.floor(cx.canvas.width/2),
		yCenter: Math.floor(cx.canvas.height*0.7),

		srcWidth:300,
		srcHeight:300,

		wait: 3
	};





	var temp = cx.canvas.toDataURL();
	var tempImg=document.createElement("img");
    tempImg.src = temp;

	var deleted = {deleted:false};

    runAnimation(animation);

    function animation(step){
		cx.drawImage(tempImg,0,0);
		draw(croneImg, step, cx);
		draw(star1, step, cx);
		draw(star2, step, cx);
		draw(star3, step, cx);
		draw(star4, step, cx);
		draw(star5, step, cx);
		draw(repeat, step, cx);
		if((repeat.endScale+repeat.endScale*0.3)>repeat.currentScale){
			cx.canvas.addEventListener("mousedown", (event)=>{handlerFinalPC(event,repeat,deleted)});
			cx.canvas.addEventListener("touchstart", (event)=>{handlerFinal(event.touches[0],repeat,deleted)});
		}
	}
}

let handlerFinalPC = (event,repeat,deleted)=>{
	if (event.which == 1) {//1 - левая кнопка мыши
		handlerFinal(event,repeat,deleted);
	}
}

let handlerFinal = (event,repeat,deleted)=>{
		if(
			(event.clientX > getRelativeCoord(repeat).x) 
			&& (event.clientX < (getRelativeCoord(repeat).x+repeat.side*repeat.currentScale))
			&& (event.clientY > getRelativeCoord(repeat).y) 
			&& (event.clientY < (getRelativeCoord(repeat).y+repeat.side*repeat.currentScale))
			){
				if(!deleted.deleted){
					var el = document.getElementById("pole");
					el.parentNode.removeChild(el);

					var el2 = document.getElementById("pole2");
					el2.parentNode.removeChild(el2);
					deleted.deleted = true;
					start();
				}
		}
}





let draw = (obj,step, cx) =>{
	if(obj.wait>0){
		obj.wait -=step;
	}else{
		resize(obj,step);
		var objCoord = getRelativeCoord(obj);
		drawImages(cx,obj, objCoord);
	}
}


let drawImages = (cx, obj,coord)=>{
	var side = obj.side*obj.currentScale;

	cx.drawImage(obj.image,
	  0, 0, //Координаты рисунка в файле
	  obj.srcWidth,obj.srcHeight,//Размеры рисунка в файле
	  coord.x,coord.y,//Координаты рисунка на холсте
	  side,side//Размеры рисунка на холсте
	  );
  }
  

let getRelativeCoord = (obj)=>{
	var side = obj.side*obj.currentScale/2;
	return coord = {
		x: obj.xCenter - side,
		y: obj.yCenter - side
	};
}

let resize = (obj,step)=>{
	var scaleStep = 10;
	if(obj.currentScale > obj.endScale){
		obj.currentScale -= step*scaleStep;
	}

}






// // Когда закладка или окно браузера спрятано, вызовы requestAnimationFrame
// // прекратятся, пока закладка или окно не станут снова
// // активны. В этом случае, разница между lastTime и
// // текущим временем будет равна тому времени, в течение
// // которого страница была спрятана.
function runAnimation(frameFunc) {
	var lastTime=null;
		function frame(time){//Каждый кадр вызывается эта функция
			var stop=false;
			if(lastTime!=null){
				//Максимальное время для кадра 100 мс. Разделим на 1000, т.е. переведем в сек
				var timeStep = Math.min(time - lastTime, 100) / 1000;
				stop=frameFunc(timeStep)===false;
			}
			lastTime=time;
			if(!stop)//если stop=true вызовы requestAnimationFrame(frame) прекратятся
				requestAnimationFrame(frame);
		}
	requestAnimationFrame(frame);//Вначале здесь однократно вызывается frame
}