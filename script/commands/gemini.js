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
  name: `gemini`,
  version: "1.1.0",
  permission: 0,
  credits: "ryuko",
  description: "",
  prefix: false,
  premium: false,
  category: "without prefix",
  usage: ``,
  cooldowns: 3,
  dependency: {

  }
};

module.exports.run = async function ({ api: a, event: e, args: ar }) {
  const s = ["▞", "✦", "✧", "✦", "⟡", "ᯤ"];
  const sy = s[Math.floor(Math.random() * s.length)];
  let p = encodeURIComponent(ar.join(" "));

  if (!p) {
    const m = await new Promise(r => {
      a.sendMessage('Please provide a prompt', e.threadID, (err, i) => r(i));
    });

    setTimeout(() => a.unsendMessage(m.messageID), 10000);
    return;
  }



  const t = await new Promise(r => {
    a.sendMessage("🗨 | 𝙶𝚎𝚖𝚒𝚗𝚒 𝙰𝙸 𝚒𝚜 𝚝𝚑𝚒𝚗𝚔𝚒𝚗𝚐 𝚙𝚕𝚎𝚊𝚜𝚎 𝚠𝚊𝚒𝚝...", e.threadID, (err, i) => r(i));
  });

  try {
    if (e.type === "message_reply") {
      if (e.messageReply.attachments[0]?.type === "photo") {
        const i = encodeURIComponent(e.messageReply.attachments[0].url);
        const r = (await ax.get(`https://kaiz-apis.gleeze.com/api/gemini-vision?q=${p}&uid=${e.senderID}&imageUrl=${i}`)).data;



        const fr = `${sy} | 𝗚𝗘𝗠𝗜𝗡𝗜-𝗙𝗟𝗔𝗦𝗛 𝟭.𝟱\n━━━━━━━━━━━━━━━━━━\n${r.response}\n━━━━━━━━━━━━━━━━━━`;
        a.unsendMessage(t.messageID);
        return a.sendMessage(fr, e.threadID, e.messageID);
      } else {
        a.unsendMessage(t.messageID);
        return a.sendMessage('𝘗𝘭𝘦𝘢𝘴𝘦 𝘳𝘦𝘱𝘭𝘺 𝘵𝘰 𝘢𝘯 𝘪𝘮𝘢𝘨𝘦.', e.threadID);
      }
    }

    const r = (await ax.get(`https://kaiz-apis.gleeze.com/api/gemini-pro?q=${p}&uid=${e.senderID}`)).data;
    
    const at = [];

    if (r.generated_image?.length > 0) {
      const b = Buffer.from(r.generated_image[0], "base64");
      const fp = __dirname + "/cache/generated_image.jpg";
      f.writeFileSync(fp, b);
      at.push(f.createReadStream(fp));
    }

    if (r.imageUrls?.length > 0) {
      for (const i of r.imageUrls) {
        try {
          const ib = (await ax.get(i, { responseType: "arraybuffer" })).data;
          const fp = __dirname + `/cache/image_${Date.now()}.jpg`;
          f.writeFileSync(fp, Buffer.from(ib, "binary"));
          at.push(f.createReadStream(fp));
        } catch (error) {}
      }
    }

    const fa = formatText(r.response);
    a.unsendMessage(t.messageID);

    a.sendMessage({
      body: `${sy} | 𝗚𝗘𝗠𝗜𝗡𝗜-𝗣𝗥𝗢\n━━━━━━━━━━━━━━━━━━\n${fa}\n━━━━━━━━━━━━━━━━━━`,
      attachment: at,
    }, e.threadID, (err) => {
      if (!err) {
        at.forEach((fl) => {
          try {
            f.unlinkSync(fl.path);
          } catch (error) {}
        });
      }
    });
  } catch (error) {
    a.unsendMessage(t.messageID);
    a.sendMessage("Api Dead", e.threadID);
  }
};
