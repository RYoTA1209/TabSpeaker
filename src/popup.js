chrome.tabs.query({currentWindow: true, audible: true, active: true}, (tabs) => {
    if (tabs.length > 0) {
        let volume_range = document.getElementById("volume");
        let value = document.getElementById("volume_value");
        value.innerText = volume_range.value;

        volume_range.addEventListener("input", ev => {
            console.log(volume_range.value);
            value.innerText = volume_range.value;
            chrome.runtime.sendMessage({"type": "SOUND_VOLUME_CHANGED", "value": volume_range.value});
        });
    } else {
        document.body.childNodes.forEach((node) => node.remove());
        document.body.innerText = "This tab is not audible.";
    }
});

window.onload = () => {
    let volume_range = document.getElementById("volume");
    let value = document.getElementById("volume_value");
    chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
        chrome.runtime.sendMessage({"type": "CHECK_IS_CAPTURED", "value": tabs[0].id}, (response => {
            if (response != undefined) {
                volume_range.value = response * 100;
                value.innerText = (Math.round(response * 100)).toString();
            }
        }))
    })
}

