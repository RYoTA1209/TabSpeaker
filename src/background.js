let tabsStream = {};
let tabsAudioCtx = {};
let tabsSource = {};
let tabsNodeGain = {};

chrome.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
    if (msg["type"] == "SOUND_VOLUME_CHANGED") {
        chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
            if (tabsStream.hasOwnProperty(tabs[0].id)){
                tabsNodeGain[tabs[0].id].gain.value = msg["value"]/100;
            }else{
                chrome.tabCapture.capture({
                    audio: true,
                    video: false
                }, (stream) => {
                    tabsAudioCtx[tabs[0].id] = new window.AudioContext();
                    tabsStream[tabs[0].id] = stream;
                    tabsSource[tabs[0].id] = tabsAudioCtx[tabs[0].id].createMediaStreamSource(tabsStream[tabs[0].id]);
                    tabsNodeGain[tabs[0].id] = tabsAudioCtx[tabs[0].id].createGain();
                    tabsSource[tabs[0].id].connect(tabsNodeGain[tabs[0].id]);
                    tabsNodeGain[tabs[0].id].connect(tabsAudioCtx[tabs[0].id].destination);
                    tabsNodeGain[tabs[0].id].gain.value = msg["value"]/100;
                });
            }
        });
    }else if(msg["type"] == "CHECK_IS_CAPTURED"){
        if(tabsStream.hasOwnProperty(msg["value"])){
            sendResponse(tabsNodeGain[msg["value"]].gain.value);
        }else{
            sendResponse(undefined);
        }
    }
});
