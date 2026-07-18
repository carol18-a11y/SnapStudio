// Variables


let photoCount = 0;
const maxPhotos = 4;

const gallery = document.getElementById("gallery");
const video = document.getElementById("camera");
const button = document.getElementById("capture");
const restartButton = document.getElementById("restart");
const canvas = document.getElementById("photo");
const timer = document.getElementById("timer");
const progress = document.getElementById("progress");
const flash = document.getElementById("flash");
const shutterSound = new Audio("/static/sounds/freesound_community-camera-shutter-6305.mp3")

// Camera Setup

navigator.mediaDevices.getUserMedia({
    video: true
})
.then(stream => {
    video.srcObject = stream;
})
.catch(error => {
    console.log("Camera error:", error);
});


// Capture Button
button.addEventListener("click", () => {

    let count = 3;

    button.disabled = true;
    button.innerHTML = "Get Ready...";

    timer.innerHTML = count;

    const countdown = setInterval(() => {

        count--;
        timer.innerHTML = count;
        timer.style.animation = "none";
        timer.offsetHeight;
        timer.style.animation = "pop 0.5s";

        if (count === 0) {

            clearInterval(countdown);

            takePhoto();
        }

    }, 1000);

});

restartButton.addEventListener("click",() => {
    restartSession();
});



// Capture Photo Function
function takePhoto() {
    flashScreen();
    shutterSound.currentTime=0;
    shutterSound.play();

    if (photoCount >= maxPhotos) {
        return;
    }

    canvas.width = 150;
    canvas.height = 100;

    const context = canvas.getContext("2d");

    context.setTransform(1,0,0,1,0,0);
    context.translate(canvas.width, 0);
    context.scale(-1,1);
    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );

    const image = document.createElement("img");

    image.src = canvas.toDataURL("image/png");

    image.width = 120;

    gallery.appendChild(image);

    photoCount++;

    if(photoCount < maxPhotos){
        progress.innerHTML = `Photo ${photoCount + 1} of ${maxPhotos}`
    }
    else{
        progress.innerHTML = "Photos Complete!";
    }

    if (photoCount === maxPhotos) {

        button.disabled = true;
        button.innerHTML = "Photos Complete!";

    }
    else {

        button.disabled = false;
        button.innerHTML = "Take Photo";

    }

}

function flashScreen(){
    console.log("Flash!");
    flash.style.opacity = "0.8";
    setTimeout(() => {
        flash.style.opacity = "0";
    },1000);
}

function restartSession(){
    photoCount =0;
    gallery.innerHTML ="";
    progress.innerHTML=`Photo 1 of ${maxPhotos}`;
    timer.innerHTML = "";
    button.disabled=false;
    button.innerHTML="Take Photo";
}

