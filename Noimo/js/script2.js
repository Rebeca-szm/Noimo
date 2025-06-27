document.addEventListener('DOMContentLoaded', function() {
    // Elementos da interface
    const imageInput = document.getElementById('image-input');
    const loadButton = document.getElementById('load-button');
    const applyEffectButton = document.getElementById('apply-effect');
    const downloadButton = document.getElementById('download-button');
    const colorPicker = document.getElementById('color-picker');
    const pixelDensity = document.getElementById('pixel-density');
    const densityValue = document.getElementById('density-value');
    const originalCanvas = document.getElementById('original-canvas');
    const modifiedCanvas = document.getElementById('modified-canvas');
    
    let originalImage = null;
    let modifiedImageData = null;
    
    // Event listeners
    loadButton.addEventListener('click', loadImage);
    applyEffectButton.addEventListener('click', applyPixelEffect);
    downloadButton.addEventListener('click', downloadImage);
    pixelDensity.addEventListener('input', updateDensityValue);
    
    function updateDensityValue() {
        densityValue.textContent = `${pixelDensity.value}%`;
    }
    
    function loadImage() {
        const file = imageInput.files[0];
        
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                originalImage = new Image();
                originalImage.onload = function() {
                    drawOriginalImage();
                    downloadButton.disabled = true;
                };
                originalImage.src = e.target.result;
            };
            
            reader.readAsDataURL(file);
        }
    }
    
    function drawOriginalImage() {
        const ctx = originalCanvas.getContext('2d');
        
        originalCanvas.width = originalImage.width;
        originalCanvas.height = originalImage.height;
        modifiedCanvas.width = originalImage.width;
        modifiedCanvas.height = originalImage.height;
        
        ctx.drawImage(originalImage, 0, 0);
    }
    
    function applyPixelEffect() {
        if (!originalImage) return;
        
        const ctx = modifiedCanvas.getContext('2d');
        ctx.drawImage(originalImage, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, modifiedCanvas.width, modifiedCanvas.height);
        const data = imageData.data;
        
        const hexColor = colorPicker.value;
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);
        const density = pixelDensity.value / 100;
        
        for (let i = 0; i < data.length; i += 4) {
            if (Math.random() < density) {
                data[i] = r;
                data[i + 1] = g;
                data[i + 2] = b;
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
        modifiedImageData = modifiedCanvas.toDataURL('image/png');
        downloadButton.disabled = false;
    }
    
    function downloadImage() {
        if (!modifiedImageData) return;
        
        const link = document.createElement('a');
        link.download = 'imagem-modificada.png';
        link.href = modifiedImageData;
        link.click();
    }
});