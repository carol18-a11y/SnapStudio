
let photoCount = 0;
let maxPhotos = 4;

let selectedLayout = "";
let capturedPhotos = [];

const layoutPage = document.getElementById("layout-page");
const cameraPage = document.getElementById("camera-page");
const resultPage = document.getElementById("result-page");

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

    finalCanvas.width = 420;
    finalCanvas.height = 560;

    finalContext.fillStyle = "white";
    finalContext.fillRect(0,0,420,560);

    const img = new Image();

    img.src = capturedPhotos[0];

    img.onload = ()=>{

        finalContext.drawImage(img,35,35,350,380);

        finalContext.fillStyle="black";
        finalContext.font="26px Arial";
        finalContext.textAlign="center";

        finalContext.fillText(
            "SnapStudio",
            210,
            500
        );

    };

}

function generateGrid(){

    finalCanvas.width=650;
    finalCanvas.height=650;

    finalContext.fillStyle="white";
    finalContext.fillRect(0,0,650,650);

    const positions=[

        [30,30],
        [335,30],
        [30,335],
        [335,335]

    ];

    let loaded=0;

    capturedPhotos.forEach((photo,index)=>{

        const img=new Image();

        img.src=photo;

        img.onload=()=>{

            finalContext.drawImage(

                img,

                positions[index][0],
                positions[index][1],

                280,
                280

            );

            loaded++;

            if(loaded===capturedPhotos.length){

                finalContext.font="24px Arial";

                finalContext.fillStyle="black";

                finalContext.fillText(

                    "SnapStudio",

                    250,

                    630

                );

            }

        };

    });

}

function generateVertical(){

    const imageHeight=220;

    finalCanvas.width=260;
    finalCanvas.height=maxPhotos*imageHeight+40;

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

    const imageWidth=220;

    finalCanvas.width=maxPhotos*imageWidth+40;
    finalCanvas.height=260;

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

                220

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