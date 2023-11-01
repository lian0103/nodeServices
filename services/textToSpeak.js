const gtts = require("node-gtts")("zh-TW");
const player = require("node-wav-player");
const path = require("path");
const filepath = path.join(__dirname, "hello.wav");

function playSpeak() {
  player.play({
    path: filepath,
  });
}

export const textToSpeak = (text) => {
  // console.log(gtts);

  gtts.save(filepath, text, function () {
    console.log("save done");
    playSpeak();
  });
};

// test
// const textSpeech = "你好啊 Jason Lien";
// textToSpeak(textSpeech);
