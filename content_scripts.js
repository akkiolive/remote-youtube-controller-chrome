(function () {

    // for debug
    console.log("contents_script.js is called!")
    function alive() {
        console.log("contents_script.js is alive.")
        setTimeout(() => {
            alive()
        }, 1000);
    }
    //alive()

    var video;

    function sendMessage(command, content = {"dummy": "dummy"}, callback = null) {
        var message = {
            command: command,
            command_from: "contents_script",
            response: {},
            response_from: "",
            content: content,
        }
        if (callback) {
            chrome.runtime.sendMessage(message, callback);
        }
        else {
            chrome.runtime.sendMessage(message);
        }
        console.log("sent message", message);
    }


    function get_video_youtube() {
        video = document.querySelector("#player-container video")
        return video;
    }




    // inject
    s = document.createElement("script")
    s.setAttribute("type", "text/javascript")
    url = chrome.extension.getURL('/clicker.js')
    s.setAttribute("src", url)
    document.body.appendChild(s)
    console.log("appended.")







    // functions
    // judge site
    function judge_media_site() {
        judged_site = ""

        // judge youtube
        if (location.href.indexOf("https://www.youtube.com/") === 0) {
            if (document.getElementsByClassName("ytp-play-button").length > 0 ||
                (document.getElementsByTagName("ytd-miniplayer").length > 0 && document.getElementsByTagName("ytd-miniplayer")[0].getAttribute("active"))) {
                judged_site = "youtube"
            }
        }
        // judge twitch
        else if (location.href.indexOf("https://www.twitch.tv/") === 0) {
            judged_site = "twitch"
        }

        return judged_site
    }

    // judge state
    function judge_media_state(site) {
        if (site == "youtube") {
            // playing or not
            is_playing = false;
            if (document.getElementsByClassName("ytp-play-button").length > 0 && document.getElementsByClassName("ytp-play-button")[0].title.indexOf("Play") != -1) {
                is_playing = true;
            }
            // muted or not
            is_mute = true;
            if (document.getElementsByClassName("ytp-mute-button").length > 0 && document.getElementsByClassName("ytp-mute-button")[0].title.indexOf("Unmute") != -1) { //Unmute (m)
                is_mute = false;
            }
            // muted tab or not
        }
        else {
            return {};
        }

        return {
            is_playing: is_playing,
            is_mute: is_mute
        };

    }
    // Event listeners
    // onMessage
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        console.log("message", message);
        command = message.command;
        response = message.response;
        site = message.site;
        target_tabid = message.target_tabid;
        video = document.querySelector("#player-container video")
        if (message.is_media_control) {
            if (message.site == "youtube") {
                hoge = 1
                video = document.querySelector("#player-container video")
            }
        }

        // player controls
        if (message.command == "cmd-ss") {
            if (video.paused) {
                video.play();
            }
            else {
                video.pause();
            }
        }
        else if (message.command == "cmd-play") {
            video.play();
        }
        else if (message.command == "cmd-pause") {
            video.pause();

        }
        else if (message.command == "cmd-next-video") {
            if (site == "youtube") {
                document.getElementsByClassName("ytp-next-button")[0].click();
            }
        }
        else if (message.command == "cmd-mute-video") {
            if (site == "youtube") {
                document.getElementsByClassName("ytp-mute-button")[0].click();
            }
        }
        // judge media state
        else if (message.command == "Tell me a media state.") {
            message_res = message;
            message_res.response_from = "contents_script"
            message_res.response.media_state = judge_media_state(site);
            chrome.runtime.sendMessage(message_res);
        }
        // judge site
        else if (message.command = "Is this a media tab?") {
            message_res = message;
            message_res.response_from = "contents_script"
            judged_site = judge_media_site()
            message_res.response.site = judged_site
            message_res.response.media_state = judge_media_state(judged_site)
            message_res.site = judged_site
            chrome.runtime.sendMessage(message_res);
            console.log("send message", message_res)
        }
        else if (message.command == "") {

        }
        else {

        }

        return true;
    });




    window.onload = () => {
        site = judge_media_site();
        if (site == "youtube") {
            document.getElementsByClassName("ytp-play-button")[0].addEventListener("change", () => {
                message = {
                    command: "MediaTabs should be updated.",
                    command_from: "contents_script",
                    response: {},
                    response_from: "",
                }
                chrome.runtime.sendMessage(message)
            });
        }
    }
})();