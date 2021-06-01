function clickplay() {
    btn = document.getElementsByClassName("ytp-play-button")[0]
    console.log("btn:", btn)
    btn.click()
}



window.clicker = {
    clickplay: () => {
        btn = document.getElementsByClassName("ytp-play-button")[0]
        console.log("btn:", btn)
        btn.click()
    }
}

    function clicknext() {
        btn = document.getElementsByClassName("ytp-next-button")[0]
        btn.click()
    }

    function clickmute() {
        btn = document.getElementsByClassName("ytp-mute-button")[0]
        btn.click()
}

