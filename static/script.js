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

    let count=5;
    timer.innerHTML = count;
    const countdown = setInterval(()=> {
        count--;
        timer.innerHTML = count;

        if(count==0){
            clearInterval(countdown);
            takePhoto();
            timer.innerHTML = "Photo Taken!";
        }
    },1000);

    });
 function takePhoto(){
    canvas.width = 200;
    canvas.height=150;

    const context = canvas.getContext("2d");

    context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
    );
};