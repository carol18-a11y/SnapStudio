const video = document.getElementById("camera");
const button =document.getElementById("capture");
const canvas = document.getElementById("photo");

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

    canvas.width = video.videoWidth;
    canvas.height=video.videoHeight;

    const context = canvas.getContext("2d");

    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );
});