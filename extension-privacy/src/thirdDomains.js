let thirdPartyDomains = {}

function getDomain(url) { // Busca pelo domínio da requisição
    try {
        return new URL(url).hostname
    } 
    
    catch (error) {
        return null
    }
}

function getMainDomain(domain) {
    if (!domain) {
        return null
    }

    let parts = domain.split(".")

    if (parts.length < 2) {
        return domain
    }

    return parts.slice(-2).join(".")
}

function isThirdParty(pageDomain, requestDomain) { // Verifica se a requisição veio de um terceiro
    if (!pageDomain || !requestDomain) {
        return false
    }

    let pageMainDomain = getMainDomain(pageDomain)
    let requestMainDomain = getMainDomain(requestDomain)

    return pageMainDomain !== requestMainDomain
}

browser.webRequest.onBeforeRequest.addListener(
    function(infos) {
        console.log("Requisição detectada")

        if (infos.tabId < 0) { // Ignora a requisição se ela não está relacionada à nenhuma página
            return
        }

        const requestDomain = getDomain(infos.url)
        if (!requestDomain) { // Verifica se o domínio da requisição é valido
            return
        }

        browser.tabs.get(infos.tabId).then(function(tab) {
            if (!tab.url) {
                return
            }

            const currentPage = getDomain(tab.url)

            if (isThirdParty( currentPage, requestDomain )) {
                console.log("Domínio veio de um terceiro")
                if (!thirdPartyDomains[infos.tabId]) {
                    thirdPartyDomains[infos.tabId] = []
                }

                if (!thirdPartyDomains[infos.tabId].includes(requestDomain)) {
                    thirdPartyDomains[infos.tabId].push(requestDomain)
                }
            }
        })
    },
    { // Faz com que a extensão valide as requisições de todas URL do navegador
        urls: ["<all_urls>"]
    }
)

browser.runtime.onMessage.addListener((message) => {
    if (message.method === "getThirdDomains") {
        browser.tabs.query({
            currentWindow: true,
            active: true
        }).then((pages) => {
            let currentPage = pages[0]
            let domains = thirdPartyDomains[currentPage.id] || []

            browser.runtime.sendMessage({
                method: "thirdDomainInfo",
                domains: domains,
                quantidade: domains.length
            })
        })
    }
})