let photoCount = 0;
const maxPhotos = 4;

const gallery = document.getElementById("gallery");
const video = document.getElementById("camera");
const button =document.getElementById("capture");
const canvas = document.getElementById("photo");
const timer = document.getElementById("timer");

navigator.mediaDevices.getUserMedia({
    video:true
})
.then(stream=>{
    video.srcObject=stream;
})
.catch(error => {
    console.log("Camera error:", error);
});

button.addEventListener("click",()=>{

    let count=3;
    button.disabled=true;
    button.innerHTML ="Get Ready.."

    timer.innerHTML = count;
    const countdown = setInterval(()=> {
        count--;
        timer.innerHTML = count;

        if(count===0){
            clearInterval(countdown);
            takePhoto();
            timer.innerHTML = "Photo Taken!";
        }
    },1000);

    });
 function takePhoto(){
    if(photoCount >= maxPhotos){
        return;
    }

    canvas.width = 150;
    canvas.height=100;

    const context = canvas.getContext("2d");

    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );
    const image=document.createElement("img");
    image.src=canvas.toDataURL("image/png");
    image.width=120;
    gallery.appendChild(image);
    photoCount++;
    
    if(photoCount ===maxPhotos){
        button.disabled = true;
        button.innerHTML = "Photos Complete!"
    }
    else{
    button.disabled = false;
    button.innerHTML="Take Photo";
    }
};