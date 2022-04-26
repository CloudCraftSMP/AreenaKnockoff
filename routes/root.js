let router = require('express').Router();
const config = require('../config.json')

const axios = require('axios').default;

async function asyncForEach(array, callback) {  
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array)
    }
}

async function getPlaylist(playlist, amount, res) {
    try {
        const response = await axios.get('https://youtube.googleapis.com/youtube/v3/playlistItems', {
            params: {
              part: "contentDetails,snippet",
              maxResults: amount,
              playlistId: playlist,
              key: config.youtube.key
            }
          });

          await asyncForEach(response.data.items, (item, index, array) => {
            console.log(item);

            const datetime = new Date(item.contentDetails.videoPublishedAt);

            response.data.items[index].snippet.title = item.snippet.title.replace(/CloudCraft -/g,'');
            response.data.items[index].snippet.title = item.snippet.title.replace(/CloudCraft –/g,'');
            response.data.items[index].contentDetails.date = datetime.toLocaleString("fi", {
                weekday: 'short',
                month: 'numeric',
                day: 'numeric'
            }).toUpperCase();

            response.data.items[index].contentDetails.time = "KLO " + datetime.toLocaleString("fi", {
                hour: 'numeric',
                minute: 'numeric'
            }).toUpperCase();

        });

        return response.data.items;
        
    } catch (error) {
        res.sendStatus(500);
    }
}

async function getVideo(video, res) {
    try {
        const response = await axios.get('https://youtube.googleapis.com/youtube/v3/videos', {
            params: {
              part: "contentDetails,snippet",
              id: video,
              key: config.youtube.key
            }
          });

          await asyncForEach(response.data.items, (item, index, array) => {
            console.log(item);

            const datetime = new Date(item.snippet.publishedAt);

            response.data.items[index].snippet.title = item.snippet.title.replace(/CloudCraft -/g,'');
            response.data.items[index].snippet.title = item.snippet.title.replace(/CloudCraft –/g,'');
            response.data.items[index].contentDetails.date = datetime.toLocaleString("fi", {
                weekday: 'short',
                month: 'numeric',
                day: 'numeric'
            }).toUpperCase();

            response.data.items[index].contentDetails.time = "KLO " + datetime.toLocaleString("fi", {
                hour: 'numeric',
                minute: 'numeric'
            }).toUpperCase();

        });

        return response.data.items[0];
        
    } catch (error) {
        res.sendStatus(500);
    }
}

router.get('/', async function(req,res) {

    res.render('root/index', { pageTitle: "Home", videos: {
            recommended: await getPlaylist("PL7ua20ATKGslXCw-gM4WjACCl8OZ-2LQQ", 6, res),
            showcases: await getPlaylist("PL7ua20ATKGsnh3U5ApXDS5VRwh12ph8W9", 4, res),
            announcements: await getPlaylist("PL7ua20ATKGsk9hNewTGNt3vSMUgzvXp7L", 4, res),
            events: await getPlaylist("PL7ua20ATKGsmoSH4rktekihYfAtq1nNKE", 4, res),
            anniversaries: await getPlaylist("PL7ua20ATKGsmlvE3scHWbsruUUDbzSZFS", 4, res),
            elections: await getPlaylist("PL7ua20ATKGslPSDs-lV_-eNFJqLLLpnDi", 4, res),
        }
    });

});

router.get('/0-:videoId', async function(req,res) {

    const video = await getVideo(req.params.videoId, res);

    res.render('root/video', { pageTitle: video.snippet.title, video: video });

});

module.exports = router;