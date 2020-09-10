// this is some reaaaaally old code I wrote ages ago, it barely functions at all,
// but I just like the concept of having an emoji animated progess bar :)
const readline = require("readline");

const printCurrentState = (
  length,
  numFlames,
  groundChar = "_",
  movingChar = "🔥",
  endCharNormal = "_💣",
  endCharLast = "💥",
) => {
  // reset stdout
  readline.clearLine(process.stdout);
  readline.cursorTo(process.stdout, 0);

  const fuse = Array(length - (progress % length)).join(groundChar);
  const flames = Array(Math.min(progress % length, numFlames + 1)).join(movingChar);
  const burnedFuse = Array(
    Math.min(Math.max((progress % length) - numFlames, 0), length - numFlames),
  ).join(" ");

  // update
  process.stdout.write(burnedFuse + flames + fuse);

  // bomb explosion
  process.stdout.write(
    progress % length == 0 ? `${endCharLast}  ` : `${endCharNormal}  `,
  );

  if (progress % length != 0) {
    progress += 1;
  }
};

const stopFuse = (id) => {
  readline.clearLine(process.stdout);
  readline.cursorTo(process.stdout, 0);
  clearInterval(id);
};

const startFuse = (
  length,
  numFlames,
  fps,
  groundChar,
  movingChar,
  endCharNormal,
  endCharLast,
) => {
  progress = 1;
  return setInterval(() => {
    printCurrentState(
      length,
      numFlames,
      groundChar,
      movingChar,
      endCharNormal,
      endCharLast,
    );
  }, 1000 / fps);
};

module.exports = { startFuse, stopFuse };
