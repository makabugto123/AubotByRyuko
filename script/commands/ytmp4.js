const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "ytmp4",
    version: "1.0.0",
    permission: 0,
    credits: "ryuko",
    premium: false,
    description: "Send Youtube Music",
    prefix: false,
    category: "without prefix",
    usages: `ytmp3 [music title]`,
    cooldowns: 5,
    dependencies: {
        "path": "",
        "fs-extra": ""
    }
};

module.exports.run = async function({ api, event, args }) {
    const search = args.join(' ');

    if (!search) {
        return api.sendMessage('Please provide a song, for example: ytmp3 Selos', event.threadID, event.messageID);
    }
    
    api.sendMessage(`𝚂𝚎𝚊𝚛𝚌𝚑𝚒𝚗𝚐 𝚅𝚒𝚍𝚎𝚘...🎥`, event.threadID);



    const apiUrl1 = `https://betadash-search-download.vercel.app/yt?search=${encodeURIComponent(search)}`;
    
    
    

    try {
    
    const response1 = await axios.get(apiUrl1);
    const data1 = response1.data;
    const yturl = data1[0].url;
    const channel = data1[0].channelName;
    
        const apiUrl = `https://yt-video-production.up.railway.app/ytdl?url=${encodeURIComponent(yturl)}`;
    
        const response = await axios.get(apiUrl);
        const maanghang = response.data;

        if (!maanghang || !maanghang.video) {
            return api.sendMessage('𝙽𝚘 𝚟𝚒𝚍𝚎𝚘 𝚏𝚘𝚞𝚗𝚍 𝚏𝚘𝚛 𝚢𝚘𝚞𝚛 𝚜𝚎𝚊𝚛𝚌𝚑. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚠𝚒𝚝𝚑 𝚊 𝚍𝚒𝚏𝚏𝚎𝚛𝚎𝚗𝚝 𝚚𝚞𝚎𝚛𝚢.', event.threadID, event.messageID);
        }




        const bundat = maanghang.video;
        
        
        
        
        const fileName = `${maanghang.title}.mp4`;
        const filePath = path.join(__dirname, fileName);

        const downloadResponse = await axios({
            method: 'GET',
            url: bundat,
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(filePath);
        downloadResponse.data.pipe(writer);

        writer.on('finish', async () => {
            await api.sendMessage(`🎥 Now playing: ${maanghang.title}\n\n🔗 Download Link: ${maanghang.video}\n\n🎙️Uploader: ${channel}`, event.threadID);

            api.sendMessage({
                attachment: fs.createReadStream(filePath)
            }, event.threadID, () => {
                fs.unlinkSync(filePath);
            });
        });

        writer.on('error', () => {
            api.sendMessage('There was an error downloading the file. Please try again later.', event.threadID, event.messageID);
        });
    } catch (pogi) {
        console.error('Error fetching song:', pogi);
        api.sendMessage('An error occurred while fetching the song. Please try again later.', event.threadID, event.messageID);
    }
};
