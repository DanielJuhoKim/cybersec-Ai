browser.runtime.onMessage.addListener((message) => {
    if (message.method === "getCookies") {
        return browser.tabs.query({
            currentWindow: true,
            active: true
        }).then((pages) => {
            let currentPage = pages[0];

            return browser.cookies.getAll({
                url: currentPage.url
            });
        }).then((cookies) => {
            browser.runtime.sendMessage({
                method: "cookiesInfo",
                cookies: cookies,
                quantidade: cookies.length
            });

        });
    }
});