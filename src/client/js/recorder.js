import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const startBtn = document.getElementById("startBtn");
const video = document.getElementById("preview"); // upload의 video객체 생성

let stream; // 다른 func에서 사용하기 위함
let recorder;
let videoFile;

const handleDownload = async () => {
  const ffmpeg = createFFmpeg({ log: true }); // 백엔드가 아니라 사용자의 컴퓨터에서 변환
  await ffmpeg.load(); // 웹사이트에서 다른 software를 사용하기 때문에 await로 기다려줘야함

  ffmpeg.FS("writeFile", "recording.webm", await fetchFile(videoFile)); // ffmpeg에 파일 생성

  await ffmpeg.run("-i", "recording.webm", "-r", "60", "output.mp4"); // 가상 파일 시스템에서 .webm파일을 초당 60프레임인 .mp4파일로 생성하는 명령어

  await ffmpeg.run(
    "-i",
    "recording.webm",
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    "thumbnail.jpg"
  ); // 특정시간대로 이동해서 1장의 스크린샷을 찍어 .jpg파일로 저장
  const mp4File = ffmpeg.FS("readFile", "output.mp4"); // mp4파일 읽기
  const thumbFile = ffmpeg.FS("readFile", "thumbnail.jpg");

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" }); // blob 생성
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob); // url을 통해서 파일 접근
  const thumbUrl = URL.createObjectURL(thumbBlob);

  const a = document.createElement("a"); // 링크 생성
  a.href = mp4Url;
  a.download = "MyRecording.mp4"; // 다운로드 할 이름과 확장자
  document.body.appendChild(a);
  a.click();

  const thumbA = document.createElement("a"); // 링크 생성
  thumbA.href = thumbUrl;
  thumbA.download = "MyThumbnail.jpg"; // 다운로드 할 이름과 확장자
  document.body.appendChild(thumbA);
  thumbA.click();

  ffmpeg.FS("unlink", "recording.webm");
  ffmpeg.FS("unlink", "output.mp4");
  ffmpeg.FS("unlink", "thumbnail.jpg");

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);
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
