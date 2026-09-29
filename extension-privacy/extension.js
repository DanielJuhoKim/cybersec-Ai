browser.tabs.query({
    currentWindow: true,
    active: true
}).then((pages) => {
    let currentPage = pages[0]

    const currentPagePopup = document.getElementById("current-page")

    currentPagePopup.textContent = "Página atual: " + currentPage.url
}) // Pega a URL da página atual e envia para o popup

browser.runtime.onMessage.addListener((message) => { // Espera receber a resposta dos arquivos.js no background do manifest.json
    if (message.method == "cookiesInfo") {
        const qtdCookies = document.getElementById("qtd-cookies")
        const cookiesList = document.getElementById("cookies-list")
        
        if (message.quantidade > 0) {
            qtdCookies.textContent = "Cookies encontrados: " + message.quantidade

            cookiesList.innerHTML = ""

            for (let cookie of message.cookies) {

                const li = document.createElement("li")

                li.textContent = cookie.name + ": " + cookie.value.substring(0, 10)

                if (cookie.value.length > 10) {
                    li.textContent += "..."
                }

                cookiesList.appendChild(li)
            }
        }

        else {
            qtdCookies.textContent = "Esta página não tem cookies"
        }
    }

    if (message.method == "localStorageInfo") {
        const sizeLocalStorage = document.getElementById("size-local-storage")
        const dataLocalStorage = document.getElementById("data-local-storage")

        if (message.quantidade > 0) {
            sizeLocalStorage.textContent = "Armazenamento local: size(" + message.quantidade + ")"
            dataLocalStorage.innerHTML = ""

            for (let storage of message.storages) {
                const li = document.createElement("li")

                li.textContent = storage.name + ": " + storage.content.substring(0, 10)

                if (storage.content.length > 10) {
                    li.textContent += "..."
                }

                dataLocalStorage.appendChild(li)
            }
        }

        else {
            sizeLocalStorage.textContent = "Esta página não tem armazenamento local"
        }
    }

    if (message.method == "thirdDomainInfo") {
        const qtdThirdDomains = document.getElementById("qtd-third-domains")
        const thirdDomainsList = document.getElementById("domains-list")

        if (message.quantidade > 0) {
            qtdThirdDomains.textContent = "Domínios de terceira parte: " + message.quantidade
            thirdDomainsList.innerHTML = ""

            for (let domain of message.domains) {
                const li = document.createElement("li")

                li.textContent = domain

                thirdDomainsList.appendChild(li)
            }
        }
        else {
            qtdThirdDomains.textContent = "Nenhum domínio de terceira parte foi identificado"
        }
    }
})

browser.runtime.sendMessage({
    method: "getCookies"
});

browser.runtime.sendMessage({
    method: "getThirdDomains"
})

browser.runtime.sendMessage({
    method: "getLocalStorage"
})