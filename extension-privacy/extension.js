browser.tabs.query({
    currentWindow: true,
    active: true
}).then((pages) => {
    let currentPage = pages[0]

    const currentPagePopup = document.getElementById("current-page")

    currentPagePopup.textContent = "Página atual: " + currentPage.url
})

browser.runtime.onMessage.addListener((message) => {
    if (message.method === "cookiesInfo") {
        const qtdCookies = document.getElementById("qtd-cookies")
        const cookiesList = document.getElementById("cookies-list")
        
        if (message.quantidade > 0) {
            qtdCookies.textContent = "Quantidade de cookies: " + message.quantidade

            cookiesList.innerHTML = ""

            for (let cookie of message.cookies) {

                const li = document.createElement("li")

                li.textContent = cookie.name + ": " + cookie.value

                cookiesList.appendChild(li)
            }
        }

        else {
            qtdCookies.textContent = "Esta página não tem cookies"
        }
    }

    if (message.method === "thirdDomainInfo") {
        const qtdThirdDomains = document.getElementById("qtd-thirdDomains")
        const thirdDomainsList = document.getElementById("domains-list")

        if (message.quantidade > 0) {
            qtdThirdDomains.textContent = "Quantidade de domínios: " + message.quantidade
            thirdDomainsList.innerHTML = ""

            for (let domain of message.domains) {
                const li = document.createElement("li")

                li.textContent = domain

                thirdDomainsList.appendChild(li)
            }
        }
    }
})

browser.runtime.sendMessage({
    method: "getCookies"
});

browser.runtime.sendMessage({
    method: "getThirdDomains"
})