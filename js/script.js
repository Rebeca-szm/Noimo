function responder() {
    const entrada = document.getElementById("input").ariaValueMax.toLowerCase();
    const resposta = document.getElementById("Resposta");

    if (entrada.includes("olá") || entrada.includes("oi")){
        resposta.innerText = "Olá! Como posso ajudar?";
    } else if (entrada.includes("quem é você")){
        resposta.innerText = "Sou uma Ia criada por você no VS Code!";
    } else {
        resposta.innerText = "Ainda estou aprendendo... tente outra pergunta!"
    }
}