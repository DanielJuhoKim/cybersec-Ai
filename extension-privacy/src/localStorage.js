browser.runtime.onMessage.addListener((message) => {
    if (message.method == "getLocalStorage") {
        browser.tabs.query({
            currentWindow: true,
            active: true
        }).then(async (pages) => {
            let currentPage = pages[0]

            const localStorage = await browser.tabs.sendMessage(
                currentPage.id, {
                    method: "localStorageData"
                }
            )

            let localStorageSize = 0

            if (localStorage.data.length > 0) {
                for (let storage of localStorage.data) {
                    if (storage) {
                        localStorageSize++
                    }
                }
            }

            browser.runtime.sendMessage({
                method: "localStorageInfo",
                quantidade: localStorageSize,
                storages: localStorage.data
            })
        })
    }
})