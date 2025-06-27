document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const imageInput = document.getElementById('image-input');
    const analyzeButton = document.getElementById('analyze-button');
    const colorPicker = document.getElementById('color-picker');
    const sensitivity = document.getElementById('sensitivity');
    const sensitivityValue = document.getElementById('sensitivity-value');
    const originalCanvas = document.getElementById('original-canvas');
    const resultCanvas = document.getElementById('result-canvas');
    const analysisResult = document.getElementById('analysis-result');
    
    // Atualiza o valor da sensibilidade
    sensitivity.addEventListener('input', function() {
        sensitivityValue.textContent = `${sensitivity.value}%`;
    });
    
    // Evento para analisar a imagem
    analyzeButton.addEventListener('click', function() {
        const file = imageInput.files[0];
        if (!file) {
            alert('Por favor, selecione uma imagem primeiro.');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                analyzeImage(img);
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    });
    
    // Função principal de análise
    function analyzeImage(img) {
        // Configura os canvases
        originalCanvas.width = resultCanvas.width = img.width;
        originalCanvas.height = resultCanvas.height = img.height;
        
        // Desenha a imagem original
        const originalCtx = originalCanvas.getContext('2d');
        originalCtx.drawImage(img, 0, 0);
        
        // Prepara o canvas de resultado
        const resultCtx = resultCanvas.getContext('2d');
        resultCtx.drawImage(img, 0, 0);
        
        // Obtém os dados da imagem
        const imageData = resultCtx.getImageData(0, 0, img.width, img.height);
        const data = imageData.data;
        
        // Cor selecionada para análise (convertida para RGB)
        const hexColor = colorPicker.value;
        const targetR = parseInt(hexColor.substr(1, 2), 16);
        const targetG = parseInt(hexColor.substr(3, 2), 16);
        const targetB = parseInt(hexColor.substr(5, 2), 16);
        
        // Parâmetros de sensibilidade
        const threshold = sensitivity.value / 100 * 50; // Ajuste baseado na sensibilidade
        
        // Contadores para análise
        let totalPixels = 0;
        let suspectPixels = 0;
        let suspectClusters = 0;
        let currentClusterSize = 0;
        
        // Analisa cada pixel
        for (let i = 0; i < data.length; i += 4) {
            totalPixels++;
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            
            // Calcula a diferença para a cor alvo
            const diff = Math.sqrt(
                Math.pow(r - targetR, 2) + 
                Math.pow(g - targetG, 2) + 
                Math.pow(b - targetB, 2)
            );
            
            // Se o pixel for suspeito
            if (diff < threshold) {
                suspectPixels++;
                currentClusterSize++;
                
                // Destaca o pixel no resultado (vermelho)
                data[i] = 255;     // R
                data[i + 1] = 0;   // G
                data[i + 2] = 0;   // B
            } else {
                // Finaliza um cluster se existir
                if (currentClusterSize > 0) {
                    suspectClusters++;
                    currentClusterSize = 0;
                }
            }
        }
        
        // Finaliza o último cluster se existir
        if (currentClusterSize > 0) {
            suspectClusters++;
        }
        
        // Aplica as alterações ao canvas de resultado
        resultCtx.putImageData(imageData, 0, 0);
        
        // Exibe os resultados
        const suspectPercentage = (suspectPixels / totalPixels * 100).toFixed(2);
        let resultText = '';
        
        if (suspectPercentage > 5) {
            resultText = `🔴 ALERTA: ${suspectPercentage}% de pixels suspeitos detectados (${suspectClusters} áreas).`;
        } else if (suspectPercentage > 1) {
            resultText = `🟡 CUIDADO: ${suspectPercentage}% de pixels suspeitos encontrados.`;
        } else {
            resultText = `🟢 Nenhum pixel suspeito detectado significativamente.`;
        }
        
        analysisResult.textContent = resultText + 
            ` Analisados ${totalPixels} pixels no total.`;
    }
});