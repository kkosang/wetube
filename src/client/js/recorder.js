const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview"); // upload의 video객체 생성

let stream; // 다른 func에서 사용하기 위함
let recorder;
let videoFile;

const handleDownload = () => {
  const a = document.createElement("a"); // 링크 생성
  a.href = videoFile;
  a.download = "MyRecording.webm"; // 다운로드 할 이름과 확장자
  document.body.appendChild(a);
  a.click();
};

const handleStop = () => {
  startBtn.innerText = "Download Recording";
  startBtn.removeEventListener("click", handleStop);
  startBtn.addEventListener("click", handleDownload);

  recorder.stop();
};

const handleStart = () => {
  startBtn.innerText = "Stop Recording";
  startBtn.removeEventListener("click", handleStart);
  startBtn.addEventListener("click", handleStop);

  recorder = new MediaRecorder(stream); // MediaRecorder를 통해 오디오나 비디오를 녹화
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data); // 단순히 브라우저의 메모리를 가리키기만 하고 있는 URL (파일을 가리키고 있는 url)
    // preview를 recorder 영상으로 바꿈
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  }; // 녹화 종료시 ondata를 통해 정보를 가져옴
  recorder.start(); // 녹화시작
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
