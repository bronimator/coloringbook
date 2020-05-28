function elt(name, attributes) {
  var node = document.createElement(name);
  if (attributes) {
    for (var attr in attributes)
      if (attributes.hasOwnProperty(attr))
        node.setAttribute(attr, attributes[attr]);
  }
  for (var i = 2; i < arguments.length; i++) {
    var child = arguments[i];
    if (typeof child == "string")
      child = document.createTextNode(child);
    node.appendChild(child);
  }
  return node;
}

var controls = Object.create(null);







let state = {
  imageYPositionOnCanvas: 0,
  imageHeight: 0,
  canvasWidth: 0,
  canvasHeight: 0,
  fillStyle: "#ffffff",
  gameOver:false
}


let reducer = (state, action)=>{
  let body = action.body;
  switch(action.type){
    case "SET_CANVAS":
      return {
        ...state,
        canvasWidth : body.canvasWidth,
        canvasHeight : body.canvasHeight
      };
    case "SET_IMAGE":
      return {
        ...state,
        imageYPositionOnCanvas : body.imageYPositionOnCanvas,
        imageHeight : body.imageHeight,
      };
    case "SET_GAMEOVER":
      return {
        ...state,
        gameOver : body.gameOver
      };
    default:
      return state;
  }
}

let canvasActionCreator = (body)=>{
  return {
    type: "SET_CANVAS",
    body
  }
}

let imageActionCreator = (body)=>{
  return {
    type: "SET_IMAGE",
    body
  }
}


let gameOverActionCreator = (body)=>{
  return {
    type: "SET_GAMEOVER",
    body
  }
}

let dispatch = (action)=>{
  let newState = reducer(state, action);
  state.imageYPositionOnCanvas = newState.imageYPositionOnCanvas;
  state.imageHeight = newState.imageHeight;
  state.canvasWidth = newState.canvasWidth;
  state.canvasHeight = newState.canvasHeight;
  state.gameOver = newState.gameOver;
}







function start(){
  createPaint(document.body);
}



function createPaint(parent) {

  state.gameOver = false;

  let divElement = document.querySelector("body");
  let canvasWidth = Math.floor(divElement.offsetWidth);
  let canvasHeight = Math.floor(divElement.offsetHeight);

  dispatch(canvasActionCreator({    
    canvasWidth,
    canvasHeight
  }));

  let width = state.canvasWidth;
  let height = state.canvasHeight;

  let image = document.createElement("img");
  image.src = "pic/img.png";
  let imageSrcWidth = 1050;
  let imageSrcHeight = 1138;
  let imageWidth = width;
  let imageHeight = Math.floor((width*imageSrcHeight)/imageSrcWidth);
  let imageYPositionOnCanvas = Math.floor((height - imageHeight)/2);

  dispatch(imageActionCreator({    
    imageYPositionOnCanvas,//сокращение от imageYPositionOnCanvas: imageYPositionOnCanvas
    imageHeight,//сокращение от imageHeight:imageHeight
  }));

  var canvas = elt("canvas", {width: width, height: height});
  var cx = canvas.getContext("2d");


  //СОЗДАТЬ КНОПКУ ЗАГРУЗКИ ФАЙЛА
  // openFile(cx);

  image.addEventListener("load", () => {
    // if(height>=width){
    //   drawImageInCanvas(cx, image, {imageSrcWidth,imageSrcHeight,imageWidth,imageHeight,imageYPositionOnCanvas});
    // }else{
    //   cx.translate(height,width);
    //   cx.rotate(-Math.PI/2);
    //   drawImageInCanvas(cx, image, {imageSrcWidth,imageSrcHeight,imageWidth,imageHeight,imageYPositionOnCanvas});
    //   cx.restore();
    // }

      drawImageInCanvas(cx, image, {imageSrcWidth,imageSrcHeight,imageWidth,imageHeight,imageYPositionOnCanvas});


      cx.fillStyle = "#ffffff";

      let controlPointsArray = controlPointsArrayCreator(state);

      cx.canvas.addEventListener("mousedown", (event)=> handlerPC(event,controlPointsArray,cx));
      cx.canvas.addEventListener("touchstart", (event)=> handler (event.touches[0],controlPointsArray,cx));
  });



  var panel = elt("div", {class: "picturepanel"}, canvas);
  parent.appendChild(elt("div", {id:"pole"}, panel));
}








let drawImageInCanvas = (cx, image, params)=>{
  let {imageSrcWidth,imageSrcHeight,imageWidth,imageHeight,imageYPositionOnCanvas} = params;
  cx.drawImage(image,
    0, 0, //Координаты рисунка в файле
    imageSrcWidth,imageSrcHeight,//Размеры рисунка в файле
    0,imageYPositionOnCanvas,//Координаты рисунка на холсте
    imageWidth,imageHeight//Размеры рисунка на холсте
    );
}





var c ="#ffffff";

function handlerPC(event,controlPointsArray,cx) {
  if (event.which == 1) {//1 - левая кнопка мыши
    handler(event,controlPointsArray,cx);
  }
}


function handler(event,controlPointsArray,cx) {
  let {canvasWidth,canvasHeight,imageHeight,imageYPositionOnCanvas} = state;
      if(!state.gameOver){
        //Если кликнули по области с цветовым кругом:
        if(event.clientX > (canvasWidth*0.9-canvasWidth*0.07) && event.clientX < (canvasWidth*0.9 + canvasWidth*0.07)){
          //Белый
          if(event.clientY > (imageYPositionOnCanvas  + imageHeight *0.2-imageHeight *0.07) && event.clientY < (imageYPositionOnCanvas  + imageHeight *0.2+imageHeight *0.07)){
            console.log("WHITE");
            c= "#ffffff";
          }
          //Оранжевый
          if(event.clientY > (imageYPositionOnCanvas  + imageHeight *0.4-imageHeight *0.07) && event.clientY < (imageYPositionOnCanvas  + imageHeight *0.4+imageHeight *0.07)){
            console.log("ORANGE");
            c = "#ffc90d";

          }
          //Коричневый
          if(event.clientY > (imageYPositionOnCanvas  + imageHeight *0.6-imageHeight *0.07) && event.clientY < (imageYPositionOnCanvas  + imageHeight *0.6+imageHeight *0.07)){
            console.log("BROWN");
            c= "#b97a57";
          }
          //Зелёный
          if(event.clientY > (imageYPositionOnCanvas  + imageHeight *0.8-imageHeight *0.07) && event.clientY < (imageYPositionOnCanvas  + imageHeight *0.8+imageHeight *0.07)){
            console.log("GREEN");
            c="#b5e51d";
          }
        }else{//Если кликаем по области с рисунком
          console.log(c);
          cx.fillStyle = c;
          fill(event,cx);
        }


        let isOver = isGameOver(cx,controlPointsArray);
        console.log("isOver",isOver);
        if(isOver){
          dispatch(gameOverActionCreator({gameOver:true}));
          finalScene(cx);
        }  
    }
    event.preventDefault();
}






























function relativePos(event, element) {
  var rect = element.getBoundingClientRect();
  return {x: Math.floor(event.clientX - rect.left),
          y: Math.floor(event.clientY - rect.top)};
}


function forAllNeighbors(point, fn) {
  fn({x: point.x, y: point.y + 1});
  fn({x: point.x, y: point.y - 1});
  fn({x: point.x + 1, y: point.y});
  fn({x: point.x - 1, y: point.y});
}



function isSameColor(data, pos1, pos2) {
  var offset1 = (pos1.x + pos1.y * data.width) * 4;
  var offset2 = (pos2.x + pos2.y * data.width) * 4;
  for (var i = 0; i < 4; i++) {
    if (data.data[offset1 + i] != data.data[offset2 + i])
      return false;
  }
  return true;
}

function isBlack(data,pos1){
  var offset1 = (pos1.x + pos1.y * data.width) * 4;
  for (var i = 0; i < 3; i++) {
    if (data.data[offset1 + i] != 0)
      return false;
  }
  return true;
}

let fill = function(event, cx) {
  var startPos = relativePos(event, cx.canvas);
  var data = cx.getImageData(0, 0, cx.canvas.width,
                              cx.canvas.height);
  console.log("isBlack",isBlack(data,startPos));
  if(isBlack(data,startPos)){
    return;
  }                              
  // An array with one place for each pixel in the image.
  var alreadyFilled = new Array(data.width * data.height);

  // This is a list of same-colored pixel coordinates that we have
  // not handled yet.
  var workList = [startPos];
  while (workList.length) {
    var pos = workList.pop();
    var offset = pos.x + data.width * pos.y;
    if (alreadyFilled[offset]) continue;

    cx.fillRect(pos.x, pos.y, 1, 1);
    alreadyFilled[offset] = true;

    forAllNeighbors(pos, function(neighbor) {
      if (neighbor.x >= 0 && neighbor.x < data.width &&
          neighbor.y >= 0 && neighbor.y < data.height &&
          isSameColor(data, startPos, neighbor))
        workList.push(neighbor);
    });
  }
};




















var openFile = function(cx) {

  


  var input = elt("input", {type: "file"});
  input.addEventListener("change", function() {
      if (input.files.length == 0) return;//не выбран ни один файл
      var reader = new FileReader();//Объект для чтения данных из файла
      reader.addEventListener("load", function() {//Если нет ошибок и чтение окончено
          loadImageURL(cx, reader.result);//reader.result - результат чтения
      });
      //Через input можно вытащить несколько файлов, но мы всегда берём один файл, самый первый - input.files[0]
      reader.readAsDataURL(input.files[0]);
  });

  document.body.appendChild(elt("div", {id:"pole2"}, input));
  
}

function loadImageURL(cx, url) {//Загрузка изображения на холст
  var image=document.createElement("img");
  image.src = url;
  image.addEventListener('load',()=>{
      var color = cx.fillStyle, size = cx.lineWidth;//При смене размера холста контекст забывает все настройки, поэтому сохраняем их
      let divElement = document.querySelector("body");

      let canvasWidth = Math.floor(divElement.offsetWidth);
      let canvasHeight = Math.floor(divElement.offsetHeight);
      cx.canvas.width = canvasWidth;
      cx.canvas.height = canvasHeight;
      // cx.drawImage(image, 0, 0);
      
    // console.log(image,
    //   0, 0, //Координаты рисунка в файле
    //   1050,1138,//Размеры рисунка в файле
    //   0,state.imageYPositionOnCanvas,//Координаты рисунка на холсте
    //   state.canvasWidth,state.imageHeight//Размеры рисунка на холсте
    //   );

      cx.drawImage(image,
        0, 0, //Координаты рисунка в файле
        1050,1138,//Размеры рисунка в файле
        0,state.imageYPositionOnCanvas,//Координаты рисунка на холсте
        state.canvasWidth,state.imageHeight//Размеры рисунка на холсте
        );

      cx.fillStyle=color;
      cx.strokeStyle=color;
      cx.lineWidth=size;
  })
}