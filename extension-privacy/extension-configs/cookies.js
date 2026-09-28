const cookiesDisplay = (browserPages) => {
    let currentPage = browserPages.pop(); // Pega a última página da lista de páginas do navegador, que é a página atual
    let qtdCookies = 0; // Quantidade de cookies da página

    var getCookies = browser.cookies.getAll({ // Busca pelos cookies da página atual usando sua url
        url: currentPage.url
    });

    console.log("Página atual: " + currentPage.url);

    getCookies.then((cookies) => { // Espera firefox retornar os cookies e o .then armazena em cookies
        if (cookies.length > 0) {
            for (let cookie of cookies) {
                console.log(cookie)
                qtdCookies++;
            }

            console.log("Quantidade de cookies: " + qtdCookies)
            } 
            
            else {
            console.log("Esta página não tem cookies")
        }
        });
    }

    function getActiveTab() { // Pega a página atual
    return browser.tabs.query({
        currentWindow: true, active: true
    });
    }

    getActiveTab().then(cookiesDisplay); // Executa a função para mostrar cookies