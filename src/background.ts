export {}

export type ChannelInfo = {
    id: string;
    name: string;
    description: string;
    joinedDate: Date;
    avatar: Array<{
        url: string;
        width: number;
        height: number;
    }>;
    stats: {
        subscribers: number;
        views: number;
    };
};

const RapidAPIKey = 'YOUR_API_KEY';	
const RapidAPIHost = 'youtube138.p.rapidapi.com';

const cachedVideoInfoFiFo: Array<{
    videoId: string;
    channelId: string;
}> = [];
const cachedChannelInfoFiFo: Array<ChannelInfo> = [];

chrome.tabs.onUpdated.addListener(function
    (tabId, changeInfo) {
        if (changeInfo.url && changeInfo.url.includes('youtube.com/watch?v=')) {
            chrome.tabs.sendMessage(tabId, {
                type: 'urlChanged',
            }, function(_) { });
        }
    }
);

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.type !== 'getChannelInfo' || !sender.tab || !sender.tab.url) {
            sendResponse(undefined);
            return;
        }

        const url = sender.tab.url;
        if (!url.includes('youtube.com/watch?v=')) {
            sendResponse(undefined);
            return;
        }
        handleRequest(request.videoId, sendResponse);

        return true;
    }
);

async function handleRequest(videoId: string, sendResponse: (response: any) => void) {
    const channelId = await getChannelId(videoId);
    if (!channelId) {
        sendResponse(undefined);
        return;
    }
    cachedVideoInfoFiFo.push({
        videoId,
        channelId,
    });
    if (cachedVideoInfoFiFo.length > 100) {
        cachedVideoInfoFiFo.shift();
    }

    const channelInfo = await getChannelInfo(channelId);
    if (!channelInfo) {
        sendResponse(undefined);
        return;
    }
    cachedChannelInfoFiFo.push(channelInfo);
    if (cachedChannelInfoFiFo.length > 25) {
        cachedChannelInfoFiFo.shift();
    }

    sendResponse(channelInfo);
}

async function getChannelId(videoId: string): Promise<string | undefined> {
    const cachedVideoInfo = cachedVideoInfoFiFo.find(videoInfo => videoInfo.videoId === videoId);
    if (cachedVideoInfo) {
        return cachedVideoInfo.channelId;
    }

    const url = `https://${RapidAPIHost}/video/details/?id=${videoId}`;
    const options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': RapidAPIKey,
            'X-RapidAPI-Host': RapidAPIHost
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        const json = JSON.parse(result);
        return json.author.channelId;
    } catch (error) {
        console.error(error);

        return undefined;
    }
}

async function getChannelInfo(channelId: string): Promise<ChannelInfo | undefined> {
    const cachedChannelInfo = cachedChannelInfoFiFo.find(channelInfo => channelInfo.id === channelId);
    if (cachedChannelInfo) {
        return cachedChannelInfo;
    }

    const url = `https://${RapidAPIHost}/channel/details/?id=${channelId}`;
    const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': RapidAPIKey,
          'X-RapidAPI-Host': RapidAPIHost
        }
    };

    try {
        const response = await fetch(url, options);
        const result = await response.text();
        const json = JSON.parse(result);
        const channelInfo: ChannelInfo = {
            id: json.channelId,
            name: json.title,
            joinedDate: new Date(json.joinedDate),
            description: json.description,
            avatar: json.avatar.map((avatar: any) => ({
                url: avatar.url,
                width: avatar.width,
                height: avatar.height,
            })),
            stats: {
                subscribers: json.stats.subscribers,
                views: json.stats.views,
            },
        };

        return channelInfo;
    } catch (error) {
        console.error(error);

        return undefined;
    }
}