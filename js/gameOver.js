let controlPointsArrayCreator = (state)=>{
    return [
        //Рука справа
        {
            x: Math.floor(state.canvasWidth*0.7),
            y: Math.floor(state.imageYPositionOnCanvas  + state.imageHeight *0.46),
            color: "#b97a57",
            colorRGB : [185,122,87]   
        },
        // Рука слева
        {
            x: Math.floor(state.canvasWidth*0.15),
            y: Math.floor(state.imageYPositionOnCanvas  + state.imageHeight *0.37),
            color: "#b97a57",
            colorRGB : [185,122,87]
        },


        
        {//Верхний шар
            x: Math.floor(state.canvasWidth*0.42),
            y:  Math.floor(state.imageYPositionOnCanvas  + state.imageHeight *0.17),
            color: "#ffffff",
            colorRGB : [255,255,255,255]
        },
        {//Средний шар
            x: Math.floor(state.canvasWidth*0.5),
            y:  Math.floor(state.imageYPositionOnCanvas  + state.imageHeight *0.5),
            color: "#ffffff",
            colorRGB : [255,255,255,255]
        },
        {//Нижний шар
            x: Math.floor(state.canvasWidth*0.23),
            y:  Math.floor(state.imageYPositionOnCanvas  + state.imageHeight *0.7),
            color: "#ffffff",
            colorRGB : [255,255,255,255]
        },


        {
            x: Math.floor(state.canvasWidth*0.4),
            y:  Math.floor(state.imageYPositionOnCanvas  + state.imageHeight *0.27),
            color: "#ffc90d",
            colorRGB : [255,201,13,255]
        },
        // {
        //     x: Math.floor(state.canvasWidth*0.4),
        //     y:  Math.floor(state.imageYPositionOnCanvas  + state.imageHeight *0.74),
        //     color: "#ffc90d",
        //     colorRGB : [255,201,13,255]            
        // },

        // {
        //     x: Math.floor(state.canvasWidth*0.314),
        //     y:  Math.floor(state.imageYPositionOnCanvas  + state.imageHeight *0.75),
        //     color:"#b5e51d",
        //     colorRGB : [181,229,29,255]        
        // }
    ];
}






let isGameOver=(cx, controlPointsArray)=>{
    var data=cx.getImageData(0,0,cx.canvas.width,cx.canvas.height);

    for(let i = 0; i<controlPointsArray.length; i++){
        let checkColor = isTheSameColor(data, controlPointsArray[i].x, controlPointsArray[i].y, controlPointsArray[i].colorRGB);
        if(!checkColor){
            return false;
        }
    }

    return true;
}




function isTheSameColor(data, x, y, color){
    var offset=(x+data.width*y)*4;
    console.log(x,y,color);
    for(var i=0;i<3;i++){
        if(data.data[offset+i]!=color[i])
            return false;
    }
    return true;
}