import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const actionBtn = document.getElementById("actionBtn");
const video = document.getElementById("preview"); // upload의 video객체 생성

let stream; // 다른 func에서 사용하기 위함
let recorder;
let videoFile;

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumb: "thumbnail.jpg",
};

const downloadFile = (fileUrl, fileName) => {
  const a = document.createElement("a"); // 링크 생성
  a.href = fileUrl;
  a.download = fileName; // 다운로드 할 이름과 확장자
  document.body.appendChild(a);
  a.click();
};

const handleDownload = async () => {
  actionBtn.removeEventListener("click", handleDownload); // 버튼을 중복 클릭 방지
  actionBtn.innerText = "Transcoding...";
  actionBtn.disabled = true;

  const ffmpeg = createFFmpeg({ log: true }); // 백엔드가 아니라 사용자의 컴퓨터에서 변환
  await ffmpeg.load(); // 웹사이트에서 다른 software를 사용하기 때문에 await로 기다려줘야함

  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile)); // ffmpeg에 파일 생성

  await ffmpeg.run("-i", files.input, "-r", "60", files.output); // 가상 파일 시스템에서 .webm파일을 초당 60프레임인 .mp4파일로 생성하는 명령어

  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:01",
    "-frames:v",
    "1",
    files.thumb
  ); // 특정시간대로 이동해서 1장의 스크린샷을 찍어 .jpg파일로 저장
  const mp4File = ffmpeg.FS("readFile", files.output); // mp4파일 읽기
  const thumbFile = ffmpeg.FS("readFile", files.thumb);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" }); // blob 생성
  const thumbBlob = new Blob([thumbFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob); // url을 통해서 파일 접근
  const thumbUrl = URL.createObjectURL(thumbBlob);

  downloadFile(mp4Url, "MyRecording.mp4");
  downloadFile(thumbUrl, "MyThumbnail.jpg");

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumb);

  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumbUrl);
  URL.revokeObjectURL(videoFile);

  actionBtn.disabled = false; // download func이 끝나면 다시 버튼 활성화
  actionBtn.innerText = "Record Again";
  actionBtn.addEventListener("click", handleStart);
};

const handleStop = () => {
  actionBtn.innerText = "Download Recording";
  actionBtn.removeEventListener("click", handleStop);
  actionBtn.addEventListener("click", handleDownload);

  recorder.stop();
};

const handleStart = () => {
  actionBtn.innerText = "Stop Recording";
  actionBtn.removeEventListener("click", handleStart);
  actionBtn.addEventListener("click", handleStop);

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

actionBtn.addEventListener("click", handleStart);
