function processImage(blob,type = "gray",callback){
    switch(type){
        case "gray": processImage_gray(blob,callback);break;
        case "opposite": processImage_opposite(blob,callback);break;
        default: callback(blob);
    };
    return null;
};
function processImage_gray(blob,callback){
    var canvas = document.createElement("canvas");
    var id = Math.random().toString(16);
    canvas.id = id;
    canvas.style.display = "none";
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var url = window.URL.createObjectURL(blob);
    var image = new Image();
    image.onload = function(){
        canvas.height = image.height;
        canvas.width = image.width;
        canvas.setAttribute("data","" + canvas.width + "/" + canvas.height);
        ctx.drawImage(image,0,0);
        var data = ctx.getImageData(0,0,image.width,image.height);
        for (i = 0;i < data.data.length;i+=4){
            var gray = (data.data[i] * 0.299 + data.data[i+1] * 0.587 + data.data[i+2] * 0.114);
            data.data[i] = gray;
            data.data[i+1] = gray;
            data.data[i+2] = gray;
        };
        ctx.putImageData(data,0,0);
        canvas.toBlob(callback);
    };
    image.src = url;
};
function processImage_opposite(blob,callback){
    var canvas = document.createElement("canvas");
    var id = Math.random().toString(16);
    canvas.id = id;
    canvas.style.display = "none";
    document.body.appendChild(canvas);
    var ctx = canvas.getContext("2d");
    var url = window.URL.createObjectURL(blob);
    var image = new Image();
    image.onload = function(){
        canvas.height = image.height;
        canvas.width = image.width;
        canvas.setAttribute("data","" + canvas.width + "/" + canvas.height);
        ctx.drawImage(image,0,0);
        var data = ctx.getImageData(0,0,image.width,image.height);
        for (i = 0;i < data.data.length;i+=4){
            data.data[i] = 255 - data.data[i];
            data.data[i+1] = 255 - data.data[i+1];
            data.data[i+2] = 255 - data.data[i+2];
        };
        ctx.putImageData(data,0,0);
        canvas.toBlob(callback);
    };
    image.src = url;
};