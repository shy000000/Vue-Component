class PS{
    constructor(img,canvas){
        this.img = img;
        this.width = img.width;
        this.height = img.height;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img,0,0);
        this.imgData = ctx.getImageData(0,0,this.width,this.height);
    }
    getImgData(){
        return new Object(this.imgData);
    }
    //灰度滤镜
    gray(){
        var imgData = this.getImgData(),
            data = imgData.data;
        for(let i=0;i<data.length;i+=4){
            let gray = data[i]*0.299+data[i+1]*0.587+data[i+1]*0.114;
            data[i] = data[i+1] = data[i+2] = gray;
        }
        this.ctx.putImageData(imgData,0,0);
    }
    //反色滤镜
    inverse(){
        var imgData = this.getImgData(),
            data = imgData.data;
        for(let i =0;i<data.length;i+=4){
            data[i] = 255-data[i];
            data[i+1] = 255-data[i+1];
            data[i+2] = 255-data[i+2];
        }
        this.ctx.putImageData(imgData,0,0);
    }
    //黑白滤镜
    black(){
        var imgData = this.getImgData(),
            data = imgData.data;
        for(let i=0;i<data.length;i+=4){
            let R = data[i];
            let G = data[i+1];
            let B = data[i+2];
            if((R+G+B)>=300){
                data[i]=data[i+1]=data[i+2] = 255;
            }else{
                data[i]=data[i+1]=data[i+2] = 0;
            }   
            data[i+3]=255;
        }
        this.ctx.putImageData(imgData,0,0);
    }
    //返回字符
    getText(g){
        if (g <= 30) {
            return '#';
        } else if (g > 30 && g <= 60) {
            return '.';
        } else if (g > 60 && g <= 120) {
            return '$';
        }  else if (g > 120 && g <= 150) {
            return '*';
        } else if (g > 150 && g <= 180) {
            return 'o';
        } else if (g > 180 && g <= 210) {
            return '!';
        } else if (g > 210 && g <= 240) {
            return ';';
        }  else {
            return '&nbsp;';
        }
    }
    //返回灰度
    getGray(R,G,B){
        return 0.299*R+0.578*G+0.114*B;
    }
    //字符画
	toText(){
        var imgData = this.getImgData(),
            data = imgData.data,
            html = '';
         for (let h = 0; h < this.height; h += 12) {
            var p = '<p>';
            for (let w = 0; w < this.width; w += 3) {
                var index = (w + this.width * h) * 4;
                var r = data[index + 0];
                var g = data[index + 1];
                var b = data[index + 2];
                var gray = this.getGray(r, g, b);
                p += this.getText(gray);
            }
            p += '</p>';
            html += p;
        }
        txtDiv.innerHTML = html;
        p+='</p>';
        html+=p;
        txtDiv.innerHTML = html;
    }
}