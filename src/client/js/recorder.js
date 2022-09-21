const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview"); // upload의 video객체 생성

const handleStart = async () => {
  //마이크와 카메라에 접근
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 500, height: 800 },
  });
  video.srcObject = stream; // video의 srcObj
  video.play();
};

startBtn.addEventListener("click", handleStart);
