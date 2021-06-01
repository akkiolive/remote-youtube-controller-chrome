(function () {
    //for debug
    console.log("commander.js is called!")

    function httpGet(theUrl) {
        var xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", theUrl, false); // false for synchronous request
        xmlHttp.send(null);
        return xmlHttp.responseText;
    }


    debug(location.href)

    // socket io
    //const socket = io("http://localhost:4000");
    const socket = io(location.href);
    debug("start!")

    socket.on("new_connection", (msg) => {
        console.log(msg)
        debug(msg);
    });


    var MediaTabs = {};

    socket.emit("post", {
        command: "Give me MediaTabs.",
        command_from: "node",
        reponse: {},
        response_from: "",
    })


    socket.on("member-post", (message) => {
        if (message.response_from != "") {
            if (message.command == "Give me MediaTabs.") {
                clearTabList();
                MediaTabs = message.response.MediaTabs;
                debug(["Received MediaTabs", Object.keys(MediaTabs).length])
                mediatabs_ids = Object.keys(MediaTabs)
                for (idx in mediatabs_ids) {
                    tabId = mediatabs_ids[idx]
                    mediatab = MediaTabs[tabId];
                    debug(["mediatab:", tabId])
                    insertTabElem(mediatab);
                }
            }
            else {

            }
        }
    });

    function clearTabList() {
        // refresh list
        list = document.getElementById("tab_list");
        while (list.firstChild) {
            list.removeChild(list.firstChild);
        }
    }

    function insertTabElem(mediatab) {
        // get mediatab info
        tabId = mediatab.tab.id;
        debug(["refreshing tabId:", tabId])
        url = mediatab.tab.url
        title = mediatab.tab.title
        is_playing = mediatab.media_state.is_playing;
        is_muted = mediatab.media_state.is_mute;
        site = mediatab.site;

        // append
        elem_proto = document.getElementById("tab_info_proto")
        elem = elem_proto.cloneNode(true)
        elem.removeAttribute("id")
        elem.setAttribute("data-tabId", tabId)
        elem_play = elem.querySelector(".tab_controller .play")
        elem_pause = elem.querySelector(".tab_controller .play")
        elem_next = elem.querySelector(".tab_controller .next")
        elem_mute = elem.querySelector(".tab_controller .mute")
        elem.querySelector(".tab_title").innerHTML = title
        elem.querySelector(".tab_title").href = url

        list.appendChild(elem, list.lastChild)
        elem.removeAttribute("hidden")
        /*
                if (is_playing) {
                    elem_play.removeAttribute("hidden")
                    elem_pause.setAttribute("hidden", 1)
                }
                else {
                    elem_play.setAttribute("hidden", 1)
                    elem_pause.removeAttribute("hidden")
                }
        */
        elem_play.addEventListener("click", ss(tabId));
    }

    function ss(tabId) {
        return function () {
            console.log("start button clicked!", tabId)
            console.log(this)
            socket.emit("post", {
                command: "ytpcmd-startstop",
                command_from: "node",
                response: {},
                response_from: "",
                target_tabId: tabId,
            });
        }
    }




    // form
    document.querySelector("#frm-post").addEventListener("submit", (e) => {
        e.preventDefault();
        const msg = document.querySelector("#msg");
        if (msg.value === "") {
            return (false);
        }
        socket.emit("post", { command: msg.value });
        socket.emit("cmd", { text: msg.value });
        //msg.value = "";
    });


    // member post
    socket.on("member-post", (msg) => {
        console.log("member-posted:", msg)
        const list = document.querySelector("#msglist");
        const li = document.createElement("li");
        li.innerHTML = `${msg}`;
        list.insertBefore(li, list.lastChild);
    });


    function debug(text) {
        const list = document.querySelector("#msglist");
        const li = document.createElement("li");
        li.innerHTML = `${text}`;
        list.insertBefore(li, list.lastChild);
    }



})();