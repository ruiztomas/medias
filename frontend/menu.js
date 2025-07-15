document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.getElementById('menuBtn');
    const menuLateral = document.getElementById('menuLateral');
    const menuOverlay = document.getElementById('menuOverlay');

    if (menuBtn && menuLateral && menuOverlay) {
        menuBtn.addEventListener('click', () => {
            menuLateral.classList.toggle('abierto');
            menuOverlay.classList.toggle('visible');
        });

        menuOverlay.addEventListener('click', () => {
            menuLateral.classList.remove('abierto');
            menuOverlay.classList.remove('visible');
        });
    }
});
