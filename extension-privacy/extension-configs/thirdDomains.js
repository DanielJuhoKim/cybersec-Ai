let thirdPartyDomains = {};

function getDomain(url) { // Busca pelo domínio da requisição
    try {
        return new URL(url).hostname;
    } 
    
    catch (error) {
        return null;
    }
}

function isThirdParty(pageDomain, requestDomain) { // Verifica se a requisição veio de um terceiro

    if (!pageDomain || !requestDomain) {
        return false;
    }

    return pageDomain !== requestDomain;
}

browser.webRequest.onBeforeRequest.addListener(
    function(infos) {
        console.log("Requisição detectada")

        if (infos.tabId < 0) { // Ignora a requisição se ela não está relacionada à nenhuma página
            return;
        }

        const requestDomain = getDomain(infos.url);
        if (!requestDomain) { // Verifica se o domínio da requisição é valido
            return;
        }

        browser.tabs.get(infos.tabId).then(function(tab) {

            if (!tab.url) {
                return;
            }

            const currentPage = getDomain(tab.url);

            console.log("Verificando se a requisição para a página " + currentPage + " veio de um terceiro")

            console.log(isThirdParty(currentPage, requestDomain))

            if ( isThirdParty(currentPage, requestDomain) ) {
                console.log("\nA requisição veio do domínio de um terceiro");

                console.log("Página: " + currentPage);

                console.log("Domínio terceiro:", requestDomain);

                console.log("URL:", infos.url);

                if ( !thirdPartyDomains[infos.tabId] ) {
                    thirdPartyDomains[infos.tabId] = [];
                }

                if ( !thirdPartyDomains[infos.tabId].includes(requestDomain) ) {
                    thirdPartyDomains[infos.tabId].push(requestDomain);
                }
            }
        });
    },
    { // Faz com que a extensão valide as requisições de todas URL do navegador
        urls: ["<all_urls>"]
    }

);