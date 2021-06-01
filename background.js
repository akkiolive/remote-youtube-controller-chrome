//for debug
console.log("background.js is called!")
bk = "back ground dayo!!"

// socket io
const socket = io("http://localhost:4000");

socket.on("member-post", (message) => {
    if (message.response_from != "background") {
        console.log("member-post", message)
        if (message.command == "Give me MediaTabs.") {
            message_res = {
                command: "Give me MediaTabs.",
                command_from: message.command_from,
                response: {
                    MediaTabs: MediaTabs
                },
                response_from: "background"
            }
            console.log("sent to node", message_res);
            socket.emit("post", message_res);
        }
        else if (message.command == "ytpcmd-startstop") {
            message = {
                command: "cmd-ss",
                command_from: "background",
                response: {},
                response_from: "",
                target_tabId: message.target_tabId,
                is_media_control: true,
            }
            chrome.tabs.sendMessage(message.target_tabId, message)
        }
        
    }
});




////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// manage media tabs
class MediaTab {
    constructor(site) {
        this.site = site;
        this.media_state = {};
        this.tab = {};
    }
}
var MediaTabs = {
    //tabId: media_tab,
};



function ask_isMediaTab(tabId) {
    message = {
        command: "Is this a media tab?",
        command_from: "background",
        response: {},
        response_from: "",
        target_tabId: tabId,
    }
    chrome.tabs.sendMessage(tabId, message);
    console.log("send message", message)
}

function refreshMediaTabs() {
    chrome.tabs.query({}, tabs => {
        for (i = 0; i < tabs.length; i++) {
            ask_isMediaTab(tabs[i].id);
        }
    });
}

//// onInstalled
chrome.runtime.onInstalled.addListener(() => {
    refreshMediaTabs()
});
//// onStartup
chrome.runtime.onStartup.addListener(() => {
    refreshMediaTabs()
});


//// onUpdated tabs
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    console.log("------")
    console.log("tab is updated:", tabId, changeInfo, tab);

    if (tab.url.indexOf("chrome://") == 0) {
        delete MediaTabs[tabId];
        console.log(tabId, "deleted")
    }
    else {
        ask_isMediaTab(tabId);
    }
    console.log(MediaTabs)
});


// onMessage from contents_script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("received message", message)
    // from contents_script
    if (message.command == "Is this a media tab?") {
        console.log("site", message.response.site)
        if (message.response.site) {
            tabId = message.target_tabId
            site = message.response.site
            MediaTabs[tabId] = new MediaTab(site)
            MediaTabs[tabId].media_state = message.response.media_state
            chrome.tabs.get(tabId, (tab) => {
                MediaTabs[tabId].tab = tab
            });
        }
        else {
            tabId = message.target_tabId
            delete MediaTabs[tabId]
        }
    }
    else if (message.command == "video") {
        console.log(message.content)

    }
    // with popup
    else if (message.command == "Give me MediaTabs.") {
        message_res = {
            command: "Give me MediaTabs.",
            command_from: message.command_from,
            response: {
                MediaTabs: MediaTabs
            },
            response_from: "background"
        }
        console.log("sent", message_res)
        chrome.runtime.sendMessage(message_res)
    }
    else if (message.command == "cmd-ss_popup") {
        chrome.tabs.sendMessage(message.target_tabId, {
            ommand: "cmd-ss",
            command_from: "background",
            response: {},
            response_from: ""
        });
        message_res = {
            command: "cmd-ss_popup",
            command_from: message.command_from,
            response: {
                MediaTabs: MediaTabs
            },
            response_from: "background"
        }
        console.log("sent", message_res)
        chrome.runtime.sendMessage(message_res)
    }
    console.log("MediaTabs:", MediaTabs.length, MediaTabs);
    return true;
});





