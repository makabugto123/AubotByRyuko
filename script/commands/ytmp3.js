const axios = require('axios');
const fs = require('fs');
const path = require('path');

module.exports.config = {
    name: "ytmp3",
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
    const chilli = args.join(' ');

    if (!chilli) {
        return api.sendMessage('Please provide a song, for example: ytmp3 Selos', event.threadID, event.messageID);
    }

    const apiUrl = `https://dlvc.vercel.app/yt-audio?search=${encodeURIComponent(chilli)}`;

    try {
        const response = await axios.get(apiUrl);
        const maanghang = response.data;

        if (!maanghang || !maanghang.downloadUrl) {
            return api.sendMessage('No song found for your search. Please try again with a different query.', event.threadID, event.messageID);
        }




        const bundat = maanghang.downloadUrl;
        
        
        
        
        const fileName = `${maanghang.title}.mp3`;
        const filePath = path.join(__dirname, fileName);

        const downloadResponse = await axios({
            method: 'GET',
            url: bundat,
            responseType: 'stream',
        });

        const writer = fs.createWriteStream(filePath);
        downloadResponse.data.pipe(writer);

        writer.on('finish', async () => {
            await api.sendMessage(`🎶 Now playing: ${maanghang.title}\n\n🔗 Download Link: ${maanghang.downloadUrl}\n\n🎙️Uploader: ${maanghang.channelName}`, event.threadID);

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