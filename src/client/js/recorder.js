const startBtn = document.getElementById("startBtn");

const handleStart = async () => {
  //마이크와 카메라에 접근
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
};

startBtn.addEventListener("click", handleStart);
