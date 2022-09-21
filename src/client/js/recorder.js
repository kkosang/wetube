const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview"); // upload의 video객체 생성

let stream; // 다른 func에서 사용하기 위함

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  const recorder = new MediaRecorder(stream); // MediaRecorder를 통해 오디오나 비디오를 녹화
  recorder.ondataavailable = (e) => {
    console.log("recording done !!");
    console.log(e);
    console.log(e.data);
  }; // 녹화 종료시 ondata를 통해 정보를 가져옴
  console.log(recorder);
  recorder.start(); // 녹화시작
  console.log(recorder);
  setTimeout(() => {
    recorder.stop();
  }, 10000);
};

const handleStop = () => {
  startBtn.innerText = "Start Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleStart);
};

const init = async () => {
  //마이크와 카메라에 접근
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 500, height: 800 },
  });
  video.srcObject = stream; // video의 srcObj
  video.play();
};

init();

startBtn.addEventListener("click", handleStart);
