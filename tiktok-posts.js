const table = base.getTable("Accounts");
let queryResult = await table.selectRecordsAsync({fields: ["Username"]});

const profiles = []
for (let i = 0; i < queryResult.records.length; i++) {
    profiles.push(queryResult.records[i]["name"])
}

const response = await fetch('https://api.apify.com/v2/acts/clockworks~tiktok-scraper/run-sync-get-dataset-items?token=', {
    method: 'POST',
    headers: {
        'Content-type': 'application/json'
    },
    body: JSON.stringify({
        "profiles": profiles,
        "scrapeLastNDays": 1,
        "shouldDownloadCovers": false,
        "shouldDownloadSlideshowImages": false,
        "shouldDownloadVideos": false
    })
});


const result = await response.json();

const videos = {};
if (result) {
    for(let i = 0; i < result.length; i++) {
        if (!result[i].authorMeta || !result[i].authorMeta.name) {
            continue;
        }

        if (!videos[result[i].authorMeta.name]) {
            videos[result[i].authorMeta.name] = [];
        }

        videos[result[i].authorMeta.name].push({fields : {
            "id": result[i].id,
            "text": result[i].text,
            "Date": result[i].createTimeISO,
            "Likes": result[i].diggCount,
            "Shares": result[i].shareCount,
            "Plays": result[i].playCount,
            "Comments": result[i].commentCount,
        }});
    };
}

console.log(videos)

for (const [authorName, videoRecords] of Object.entries(videos)) {
    const tableOutput = base.getTable(authorName)
    await tableOutput.createRecordsAsync(videoRecords);
}