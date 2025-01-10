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
  dependency: {
    "axios": ""
  }
};

module.exports.run = async function ({api, event, args}) {
  try{
  const axios = require('axios');
  let ask = args.join(' ');
  if (!ask) {
    return api.sendMessage('please provide a song title.', event.threadID, event.messageID)
  }
      var IDs = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
      var randomIDs = Math.floor(Math.random() * IDs.length);



  const res = await axios.get(`https://kaiz-apis.gleeze.com/api/lyrics?song=${ask}`);
  const title = res.data.title;
  const lyrics = res.data.lyrics;
  
  api.sendMessage('Searching Lyrics...', event.threadID, event.messageID)
  
  
  if (res.error) {
    return api.sendMessage('having some unexpected error while fetching api.', event.threadID, event.messageID)
  } else {
    return api.sendMessage(`Title: ${title}\n\n${lyrics}`, event.threadID, event.messageID)
  }
  } catch (error) {
    return api.sendMessage('having some unexpected error', event.threadID, event.messageID)
  }
}
