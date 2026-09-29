function getDomain(url) {
    try {
        return new URL(url).hostname
    }
    catch (error) {
        return null
    }
}

function isFirstParty(cookieDomain, pageDomain) {
    cookieDomain = cookieDomain.replace(/^\./, "")

    return pageDomain === cookieDomain ||
           pageDomain.endsWith("." + cookieDomain)
}

browser.runtime.onMessage.addListener((message) => {
    if (message.method == "getCookies") { // Recebe a requisição de extension.js
        return browser.tabs.query({
            currentWindow: true,
            active: true
        }).then((pages) => {
            let currentPage = pages[0]

            let pageDomain = getDomain(currentPage.url)

            return browser.cookies.getAll({
                url: currentPage.url
            }).then((cookies) => {
                return {
                    cookies: cookies,
                    pageDomain: pageDomain
                }
            })
        }).then((result) => {
            let cookies = result.cookies
            let pageDomain = result.pageDomain
            let cookiesInfo = []

            for (let cookie of cookies) {

                // Verifica primeira ou terceira parte
                let firstParty = isFirstParty(
                    cookie.domain,
                    pageDomain
                )

                // Verifica sessão ou persistente
                let session = (cookie.expirationDate == undefined)

                cookiesInfo.push({
                    name: cookie.name,
                    value: cookie.value,
                    domain: cookie.domain,

                    firstParty: firstParty,
                    type: firstParty ? "Primeira parte" : "Terceira parte",

                    session: session,
                    persistence: session ? "Sessão" : "Persistente"
                })
            }

            browser.runtime.sendMessage({ // Envia as informações dos cookies para o extension.js
                method: "cookiesInfo",
                cookies: cookiesInfo,
                quantidade: cookiesInfo.length
            });
        });
    }
});