const ax = require("axios");
const f = require("fs");

const c = {
  'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚',
  'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
  'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝘀', 'T': '𝘁', 'U': '𝗨',
  'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
  'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴',
  'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
  'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂',
  'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇',
  '0': '𝟬', '1': '𝟭', '2': '𝟮', '3': '𝟯', '4': '𝟰', '5': '𝟱', '6': '𝟲',
  '7': '𝟳', '8': '𝟴', '9': '𝟵'
};

function formatText(t) {
  return t.replace(/(?:\*\*(.*?)\*\*|## (.*?)|### (.*?))/g, (_, b, h1, h2) => {
    const s = b || h1 || h2;
    return [...s].map(ch => c[ch] || ch).join('');
  });
}

module.exports.config = {
  name: `lyrics`,
  version: "1.1.0",
  permission: 0,
  credits: "ryuko",
  description: "",
  prefix: false,
  premium: false,
  category: "without prefix",
  usage: ``,
  cooldowns: 3,
  dependency: {}
};

module.exports.run = async function ({ api: a, event: e, args: ar }) {
  const s = ["▞", "✦", "✧", "✦", "⟡", "ᯤ"];
  const sy = s[Math.floor(Math.random() * s.length)];
  let p = encodeURIComponent(ar.join(" "));

  if (!p) {
    const m = await new Promise(r => {
      a.sendMessage('Please provide a song title.', e.threadID, (err, i) => r(i));
    });

    setTimeout(() => a.unsendMessage(m.messageID), 10000);
    return;
  }

  const t = await new Promise(r => {
    a.sendMessage("🔍 | Ｌｙｒｉｃｓ ｉｓ ｓｅａｒｃｈｉｎｇ ｐｌｅａｓｅ ｗａｉｔ．．．．", e.threadID, (err, i) => r(i));
  });

  try {
    const res = (await ax.get(`https://kaiz-apis.gleeze.com/api/lyrics?song=${p}`)).data;

    const at = [];
    const fb = formatText(res.title);
    const fc = formatText(res.artist);
    const fa = formatText(res.lyrics);

    a.unsendMessage(t.messageID);

    a.sendMessage({
      body: `${sy} | 𝗟𝘆𝗿𝗶𝗰𝘀\n━━━━━━━━━━━━━━━━━━\nTitle: ${fb}\nArtist: ${fc}\n\nLyrics:\n${fa}\n━━━━━━━━━━━━━━━━━━`,
      attachment: at,
    }, e.threadID, (err) => {
      if (!err) {
        at.forEach((fl) => {
          try {
            f.unlinkSync(fl.path);
          } catch (error) {
            console.error(error);
          }
        });
      }
    });
  } catch (error) {
    a.unsendMessage(t.messageID);
    a.sendMessage("Api sucks", e.threadID);
  }
};
