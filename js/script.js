// script.js
document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const chatContainer = document.getElementById('chat-container');
    
    // Event listeners
    sendButton.addEventListener('click', processUserInput);
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            processUserInput();
        }
    });
    
    // Processa a entrada do usuário
    function processUserInput() {
        const question = userInput.value.trim();
        
        if (question) {
            addMessageToChat(question, 'user');
            userInput.value = '';
            
            setTimeout(() => {
                const answer = getAIResponse(question);
                addMessageToChat(answer, 'ai');
            }, 500);
        }
    }
    
    // Adiciona mensagens ao chat
    function addMessageToChat(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add(`${sender}-message`);
        messageDiv.textContent = message;
        chatContainer.appendChild(messageDiv);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
    // Lógica simples de resposta da IA
    function getAIResponse(question) {
        const lowerQuestion = question.toLowerCase();
        
        const responses = {
            'oi': "Olá! Como posso te ajudar hoje?",
            'olá': "Olá! Como posso te ajudar hoje?",
            'ola': "Olá! Como posso te ajudar hoje?",
            'nome': "Eu sou uma IA simples criada para demonstrar conceitos básicos.",
            'horas': `Agora são ${new Date().getHours()} horas e ${new Date().getMinutes()} minutos.`,
            'tudo bem': "Estou funcionando perfeitamente, obrigado por perguntar!",
            'javascript': "JavaScript é uma linguagem de programação usada para criar interatividade em páginas web.",
            'html': "HTML é a linguagem de marcação usada para estruturar conteúdo na web.",
            'css': "CSS é usado para estilizar páginas web e controlar sua aparência."
        };
        
        for (const [keyword, response] of Object.entries(responses)) {
            if (lowerQuestion.includes(keyword)) {
                return response;
            }
        }
        
        return "Desculpe, não entendi sua pergunta. Posso responder perguntas simples sobre mim, horas ou conceitos básicos de web.";
    }
});