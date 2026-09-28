browser.runtime.onMessage.addListener((message) => {
    if (message.method == "getCookies") { // Recebe a requisição de extension.js
        return browser.tabs.query({
            currentWindow: true,
            active: true
        }).then((pages) => {
            let currentPage = pages[0] 

            return browser.cookies.getAll({  // Acessa os cookies da página atual
                url: currentPage.url
            });
        }).then((cookies) => {
            browser.runtime.sendMessage({ // Envia as informações dos cookies para o extension.js
                method: "cookiesInfo",
                cookies: cookies,
                quantidade: cookies.length
            });

        });
    }
});