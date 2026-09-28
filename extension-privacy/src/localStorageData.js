browser.runtime.onMessage.addListener((message) => {
    if (message.method == "localStorageData") {
        let data = []

        for (let i = 0; i < localStorage.length; i++) {
            let nome = localStorage.key(i)
            let conteudo = localStorage.getItem(nome)

            data.push({
                name: nome,
                content: conteudo
            })
        }

        return Promise.resolve({
            data: data
        })
    }
})