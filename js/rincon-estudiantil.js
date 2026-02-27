// ✅ EFECTO DE ESCRITURA DEL TÍTULO HERO - IGUAL A SUGAMUXI
document.addEventListener('DOMContentLoaded', function () {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';

        let charIndex = 0;
        function typeWriter() {
            if (charIndex < originalText.length) {
                heroTitle.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(typeWriter, 50);
            }
        }

        setTimeout(typeWriter, 500);
    }

    // Particles and Floating Elements handled by global.js

    const cards = document.querySelectorAll('.colegio-card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.3}s`;
    });
});