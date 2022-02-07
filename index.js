let root = document.getElementById("root");
let loading = document.getElementById("loading");
let message = document.getElementById("message");
const MAX_WIDTH = 240
const MAX_HEIGHT = 240
root.style.zoom="30%"

//increasing height and width reduces performance as the number of elements increases

const MIME_TYPE = "image/jpeg";
const QUALITY = 0.3;
const PIXEL_SIZE = 5;

root.style.width = `${MAX_WIDTH*PIXEL_SIZE}px`;
root.style.height = `${MAX_HEIGHT * PIXEL_SIZE}px`;
//just to use it sometimes later
let blob;
const img = new Image();
const input = document.getElementById("file");


function handelClick(){input.click()
    loading.style = "transform:scale(1)";
    message.innerText = "Loading....";
}


input.onchange = (ev) => {
    const file = ev.target.files[0];
    blob = file;
    clearDom();
    img.info("Original", blob);
    
    //const blobURL = URL.createObjectURL(file);
    // img.src = blobURL; 
    (async function () {

        let compressedFile = await img.compress(file, QUALITY);
        img.info("Compressed", compressedFile);
        let dataURL = await img.toBase64(compressedFile);
        let colors = await img.getPixels(dataURL);
       message.innerText = `adding ${colors.length} elements `;
        img.toCanvas(dataURL);
        img.createElements("p", colors).forEach((element) => {


            root.appendChild(element);

        })


        loading.style = "transform:scale(0)";
        //img.getPixels(dataURL);
    })();



}



//converting image to base64
img.toBase64 = function (blob) {
    return new Promise((resolve, reject) => {

        try {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onload = () => {
                resolve(reader.result)
            };
        } catch (ex) {

            reject("Error has occurred");
        }
    });
}



//compressing images
img.compress = async function (file) {
    const options = {
        maxSizeMB: 0.1,
        maxWidthOrHeight: MAX_WIDTH,
        useWebWorker: true,
    };
    try {
        const compressedFile = await imageCompression(file, options);
        return compressedFile
    } catch (error) {
        console.log(error);
    }

};

//getting image's color pixels
img.getPixels = function (dataURL) {
    if (!dataURL) {
        return alert("Need a valid image data");
    }

    return new Promise((resolve, reject) => {
        let height, width;
        try {

            let image = new Image();
            image.src = dataURL;
            image.onload = () => {
                let canvas = document.createElement("canvas");
                let ctx = canvas.getContext("2d");
                console.log(image.width, image.height);
                if (image.width < MAX_WIDTH) {
//temp fix
                    width = MAX_WIDTH;
                    height = image.height;
                } else if (image.height < MAX_HEIGHT) {
                    width = image.width;
                    height = image.height;

                } else {
                    width = MAX_WIDTH;
                    height = MAX_HEIGHT;
                }
                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(image, 0, 0);
                let imgData = ctx.getImageData(0, 0, width, height);
                let data = imgData.data;
                let colors = [];
                let i = 0;
                while (i < data.length) {
                    colors.push(data[i]);
                    i += 4;
                };

                resolve(colors);
            }
        } catch (ex) {
            reject(ex);
        }

    });

};

//creating elements with colors
img.createElements = function (element = "div", colors = []) {
    let divArray = [];
    for (let i = 0; i < colors.length; i++) {
        let div = document.createElement(element);
        div.style.backgroundColor = `rgb(${colors[i]},${colors[i]},${colors[i]})`;
        div.style.width = `${PIXEL_SIZE}px`;
        div.style.height = `${PIXEL_SIZE}px`;
        div.style.display = "inline-block";
        div.style.margin = "0px";
        div.style.padding = "0px";
        divArray.push(div);
    }



    return divArray;
};

//img to canvas element
img.toCanvas = function (dataURL) {
    //image to canvas 
    let canvas = document.createElement("canvas");
    let ctx = canvas.getContext("2d");
    let img = new Image();
    img.src = dataURL;
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        console.log(img.width, img.height);
        ctx.drawImage(img, 0, 0);
        root.appendChild(canvas);
    }

};

img.info = function (label, file) {
    const p = document.createElement("p");
    p.innerText = `${label} - ${readableBytes(file.size)}`;
    document.getElementById("info").append(p);
};

function readableBytes(bytes) {
    const i = Math.floor(Math.log(bytes) / Math.log(1024)),
        sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    return (bytes / Math.pow(1024, i)).toFixed(2) + " " + sizes[i];
}


//clear dom 
function clearDom() {
    while (root.firstChild) {
        root.removeChild(root.firstChild);
    }

}