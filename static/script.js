
let photoCount = 0;
let maxPhotos = 4;

let selectedLayout = "";
let capturedPhotos = [];
let currentFilter = "normal";
const intensitySlider =
document.getElementById("intensitySlider");

const intensityValue =
document.getElementById("intensityValue");

let filterIntensity = 100;

const filterButtons = document.querySelectorAll(".filter");
const layoutPage = document.getElementById("layout-page");
const cameraPage = document.getElementById("camera-page");
const resultPage = document.getElementById("result-page")
const layoutCards = document.querySelectorAll(".layout-card");
const continueButton = document.getElementById("continueButton");
const photoOptions = document.getElementById("photo-options");
const photoButtons = document.querySelectorAll(".photo-count");
const video = document.getElementById("camera");
const captureButton = document.getElementById("capture");
const restartButton = document.getElementById("restart");
const gallery = document.getElementById("gallery");
const canvas = document.getElementById("photo");
const context = canvas.getContext("2d");
const finalCanvas = document.getElementById("finalCanvas");
const finalContext = finalCanvas.getContext("2d");
const progress = document.getElementById("progress");
const timer = document.getElementById("timer");
const flash = document.getElementById("flash");
const downloadButton = document.getElementById("downloadButton");
const newSessionButton = document.getElementById("newSession");
const shutterSound = new Audio("/static/sounds/shutter.mp3");

intensitySlider.addEventListener("input",()=>{

    filterIntensity = intensitySlider.value;

    intensityValue.innerHTML =
    filterIntensity + "%";

    applyPreviewFilter();

});


navigator.mediaDevices.getUserMedia({

    video: true

})
.then(stream => {

    video.srcObject = stream;

})
.catch(error => {

    console.log(error);

});

layoutCards.forEach(card=>{

    card.addEventListener("click",()=>{

        layoutCards.forEach(c=>{

            c.classList.remove("selected");

        });

        card.classList.add("selected");

        selectedLayout = card.dataset.layout;

        if(selectedLayout==="polaroid"){

            photoOptions.style.display="none";

            maxPhotos=1;

        }

        else if(selectedLayout==="grid"){

            photoOptions.style.display="none";

            maxPhotos=4;

        }

        else{

            photoOptions.style.display="block";

        }

    });

});

photoButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        maxPhotos=parseInt(button.dataset.count);

    });

});

continueButton.addEventListener("click",()=>{

    if(selectedLayout===""){

        alert("Choose a layout first.");

        return;

    }
        filterButtons.forEach(button => {

        button.addEventListener("click", () => {

            filterButtons.forEach(btn => {
                btn.classList.remove("active");
            });

            button.classList.add("active");

            currentFilter = button.dataset.filter;

            applyPreviewFilter();

        });

    });

    layoutPage.style.display="none";

    cameraPage.style.display="block";

});

restartButton.addEventListener("click",restartSession);

newSessionButton.addEventListener("click",()=>{

    location.reload();

});
captureButton.addEventListener("click", startCountdown);

function startCountdown(){

    let count = 3;

    captureButton.disabled = true;

    timer.innerHTML = count;

    timer.style.opacity = "1";

    const countdown = setInterval(()=>{

        count--;

        if(count > 0){

            timer.innerHTML = count;

        }

        else{

            clearInterval(countdown);

            timer.innerHTML = "";

            takePhoto();

        }

    },1000);

}

function takePhoto(){

    flashScreen();

    shutterSound.currentTime = 0;
    shutterSound.play();

    canvas.width = 300;
    canvas.height = 225;

    context.save();

    context.filter = getCanvasFilter();

    context.translate(canvas.width,0);

    context.scale(-1,1);

    context.drawImage(

        video,

        0,
        0,

        canvas.width,
        canvas.height

    );

    context.restore();

    context.filter = "none";
    context.restore();

    const imageData = canvas.toDataURL("image/png");

    capturedPhotos.push(imageData);

    const image = document.createElement("img");

    image.src = imageData;

    gallery.appendChild(image);

    photoCount++;

    updateProgress();

    if(photoCount === maxPhotos){

        captureButton.disabled = true;

        setTimeout(()=>{

            cameraPage.style.display="none";

            resultPage.style.display="block";

            generateLayout();

        },500);

    }

    else{

        captureButton.disabled=false;

    }

}

function updateProgress(){

    if(photoCount < maxPhotos){

        progress.innerHTML =

        `Photo ${photoCount+1} of ${maxPhotos}`;

    }

    else{

        progress.innerHTML="Processing...";

    }

}

function flashScreen(){

    flash.style.opacity="0.9";

    setTimeout(()=>{

        flash.style.opacity="0";

    },150);

}


function restartSession(){

    photoCount=0;

    capturedPhotos=[];

    gallery.innerHTML="";

    progress.innerHTML=`Photo 1 of ${maxPhotos}`;

    timer.innerHTML="";

    captureButton.disabled=false;


}


function generateLayout(){

    if(selectedLayout==="polaroid"){

        generatePolaroid();

    }

    else if(selectedLayout==="grid"){

        generateGrid();

    }

    else if(selectedLayout==="vertical"){

        generateVertical();

    }

    else if(selectedLayout==="horizontal"){

        generateHorizontal();

    }

}


function generatePolaroid(){

    finalCanvas.width = 520;
    finalCanvas.height = 590;

    finalContext.fillStyle = "#fcfbf7";
    finalContext.fillRect(0,0,450,560);

    const img = new Image();

    img.src = capturedPhotos[0];

    img.onload = ()=>{

        const frameX = 40;
        const frameY = 40;
        const frameSize = 440;

        const imgRatio = img.width / img.height;
        const frameRatio = 1; // square

        let sx, sy, sw, sh;

        if (imgRatio > frameRatio) {
            // Image is wider than the frame → crop left & right
            sh = img.height;
            sw = sh * frameRatio;
            sx = (img.width - sw) / 2;
            sy = 0;
        } else {
            // Image is taller than the frame → crop top & bottom
            sw = img.width;
            sh = sw / frameRatio;
            sx = 0;
            sy = (img.height - sh) / 2;
        }
        finalContext.save();

        finalContext.beginPath();
        finalContext.roundRect(frameX, frameY, frameSize, frameSize, 12);
        finalContext.clip();

        finalContext.drawImage(
            img,
            sx, sy, sw, sh,
            frameX, frameY, frameSize, frameSize
        );
        finalContext.restore();

    };

}

function generateGrid(){

    finalCanvas.width=650;
    finalCanvas.height=640;

    finalContext.fillStyle="white";
    finalContext.fillRect(0,0,650,650);

    const positions=[

        [20,20],
        [325,20],
        [20,325],
        [325,325]

    ];

    let loaded=0;

    capturedPhotos.forEach((photo,index)=>{

        const img=new Image();

        img.src=photo;

        img.onload=()=>{
            finalContext.fillStyle = "white";

            finalContext.fillRect(

                positions[index][0] - 5,
                positions[index][1] - 5,

                300,
                300

            );

            finalContext.drawImage(

                img,

                positions[index][0],
                positions[index][1],

                290,
                290

            );

            loaded++;

            if(loaded===capturedPhotos.length){
            }

        };

    });

}

function generateVertical(){

    const imageHeight=190;

    finalCanvas.width=260;
    finalCanvas.height=maxPhotos*imageHeight+55;

    finalContext.fillStyle="white";

    finalContext.fillRect(

        0,

        0,

        finalCanvas.width,

        finalCanvas.height

    );

    let loaded=0;

    capturedPhotos.forEach((photo,index)=>{

        const img=new Image();

        img.src=photo;

        img.onload=()=>{

            finalContext.drawImage(

                img,

                20,

                20+index*imageHeight,

                220,

                180

            );

            loaded++;

        };

    });

}

function generateHorizontal(){

    const imageWidth=195;

    finalCanvas.width=maxPhotos*imageWidth+40;
    finalCanvas.height=280;

    finalContext.fillStyle="white";

    finalContext.fillRect(

        0,

        0,

        finalCanvas.width,

        finalCanvas.height

    );

    capturedPhotos.forEach((photo,index)=>{

        const img=new Image();

        img.src=photo;

        img.onload=()=>{

            finalContext.drawImage(

                img,

                20+index*imageWidth,

                20,

                180,

                240

            );

        };

    });

}

downloadButton.addEventListener("click",()=>{

    const link=document.createElement("a");

    link.download="SnapStudio.png";

    link.href=finalCanvas.toDataURL("image/png");

    link.click();

});

function applyPreviewFilter(){

    switch(currentFilter){

        case "normal":
            video.style.filter = "none";
            break;

        case "bw":
            video.style.filter = `grayscale(${filterIntensity}%)`;
            break;

        case "sepia":
            video.style.filter = `sepia(${filterIntensity}%)`;
            break;

        case "vintage":
            video.style.filter =
                `sepia(${filterIntensity * 0.5}%)
                contrast(90%)
                brightness(110%)`;
            break;

        case "cool":
            video.style.filter =
                `hue-rotate(${filterIntensity * 1.8}deg)`;
            break;

        case "warm":
            video.style.filter =
                `sepia(${filterIntensity * 0.3}%)
                saturate(150%)`;
            break;

        case "retro":
           video.style.filter =
                `contrast(120%)
                sepia(${filterIntensity * 0.4}%)
                saturate(130%)`;
            break;

    }

}

function getCanvasFilter(){

    switch(currentFilter){

        case "bw":
            return `grayscale(${filterIntensity}%)`;

        case "sepia":
            return `sepia(${filterIntensity}%)`;

        case "vintage":
            return `sepia(${filterIntensity * 0.5}%)
                    contrast(90%)
                    brightness(110%)`;

        case "warm":
            return `sepia(${filterIntensity * 0.3}%)
                    saturate(150%)`;

        case "retro":
            return `contrast(120%)
                    sepia(${filterIntensity * 0.4}%)
                    saturate(130%)`;

        default:
            return "none";

    }

}