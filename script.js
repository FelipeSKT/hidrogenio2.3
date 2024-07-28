document.addEventListener('DOMContentLoaded', () => {
    const modoNoturnoIcon = document.getElementById('modo-noturno');
    const overlay = document.getElementById('overlay');
    const closeOverlay = document.getElementById('close-overlay');
    const centralButton = document.querySelector('.central-button');
    const interactiveObjectsContainer = document.getElementById('interactive-objects');
    const infoOverlaysContainer = document.getElementById('info-overlays');

    let interactiveObjects = [];
    let surroundingObjects = [];
    let infoOverlays = [];
    let vortexActive = false; // Flag to track the state of the vortex animation

    const lightParticlesConfig = {
        particles: {
            number: { value: 90 },
            color: { value: '#000000' },
            shape: { type: 'circle' },
            opacity: { value: 1, random: true },
            size: { value: 1.5 },
            line_linked: { enable: false, color: '#000000' },
            move: { enable: true, speed: 0.6 }
        }
    };

    const darkParticlesConfig = {
        particles: {
            number: { value: 90 },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 1, random: true },
            size: { value: 1.5 },
            line_linked: { enable: false, color: '#ffffff' },
            move: { enable: true, speed: 0.6 }
        }
    };

    const leafParticlesConfig = {
        particles: {
            number: { value: 100 },
            color: { value: '#00ff00' },
            shape: { type: 'image', image: { src: 'folha.png', width: 100, height: 100 } },
            opacity: { value: 1, random: true },
            size: { value: 15, random: true },
            line_linked: { enable: false, color: '#ffffff' },
            move: { enable: true, speed: 1.5, direction: 'bottom' },
        }
    };

    const starParticlesConfig = {
        particles: {
            number: { value: 100 },
            color: { value: '#ffffff' },
            shape: { type: 'image', image: { src: 'star.png', width: 100, height: 100 } },
            opacity: { value: 0.7, random: true },
            size: { value: 6, random: true },
            line_linked: { enable: false, color: '#ffffff' },
            move: { enable: true, speed: 0.2 }
        }
    };

    const loadParticlesConfig = (isNightMode) => {
        const config = isNightMode ? darkParticlesConfig : lightParticlesConfig;
        particlesJS('particles-js', config);
    };

    const loadMainParticlesConfig = (isNightMode) => {
        const config = isNightMode ? starParticlesConfig : leafParticlesConfig;
        particlesJS('particles-main', config);
    };

    const createInteractiveObject = (id, src, x, y, isCentral = false) => {
        const obj = document.createElement('div');
        obj.classList.add('interactive-object');
        if (isCentral) {
            obj.classList.add('central-object');
        }
        obj.style.left = `${x}px`;
        obj.style.top = `${y}px`;

        const img = document.createElement('img');
        img.src = src;
        img.alt = `object-${id}`;

        obj.appendChild(img);
        interactiveObjectsContainer.appendChild(obj);

        obj.addEventListener('click', (event) => {
            showInfoOverlay(id, event);
        });

        return obj;
    };

    const createInfoOverlay = (id, text, link) => {
        const overlay = document.createElement('div');
        overlay.classList.add('info-overlay');
        overlay.id = `info-overlay-${id}`;

        const content = document.createElement('div');
        content.classList.add('info-content');

        const closeButton = document.createElement('button');
        closeButton.classList.add('close-info-overlay');
        closeButton.innerHTML = '<i class="material-icons">close</i>';
        closeButton.addEventListener('click', () => {
            overlay.style.display = 'none';
        });

        const infoText = document.createElement('p');
        infoText.textContent = text;

        const infoLink = document.createElement('a');
        infoLink.href = link;
        infoLink.target = '_blank';
        infoLink.textContent = 'Leia mais';

        content.appendChild(closeButton);
        content.appendChild(infoText);
        content.appendChild(infoLink);
        overlay.appendChild(content);

        infoOverlaysContainer.appendChild(overlay);
        infoOverlays.push(overlay);
    };

    const initializeInteractiveObjects = () => {
        const centralPosition = getCentralPosition();
        const surroundingPositions = [
            { angle: 45, distance: 75 }, /* Distância ajustada para manter os objetos próximos após a redução */
            { angle: 90, distance: 75 },
            { angle: 135, distance: 75 },
            { angle: 180, distance: 75 },
            { angle: 225, distance: 75 },
            { angle: 270, distance: 75 },
            { angle: 315, distance: 75 },
            { angle: 360, distance: 75 },
        ];
        const srcs = [
            'botao/usina.png', 'botao/atomic.png', 'botao/arvore.png', 
            'botao/agua.png', 'botao/carro.png', 'botao/company.png', 
            'botao/economia.png', 'botao/industrial.png', 'botao/sol.png'
        ];
        const infoTexts = [
            'Informações sobre usina...', 'Informações sobre atomic...', 'Informações sobre árvore...',
            'Informações sobre água...', 'Informações sobre carro...', 'Informações sobre empresa...',
            'Informações sobre economia...', 'Informações sobre industrial...', 'Informações sobre sol...'
        ];
        const infoLinks = [
            'https://example.com/usina', 'https://example.com/atomic', 'https://example.com/arvore',
            'https://example.com/agua', 'https://example.com/carro', 'https://example.com/company',
            'https://example.com/economia', 'https://example.com/industrial', 'https://example.com/sol'
        ];

        const centralObject = createInteractiveObject(0, srcs[0], centralPosition.x, centralPosition.y, true);
        interactiveObjects.push(centralObject);

        surroundingPositions.forEach((pos, index) => {
            const angleInRadians = pos.angle * (Math.PI / 180);
            const x = centralPosition.x + pos.distance * Math.cos(angleInRadians) - 25; /* Ajuste para centralizar */
            const y = centralPosition.y + pos.distance * Math.sin(angleInRadians) - 25; /* Ajuste para centralizar */
            const obj = createInteractiveObject(index + 1, srcs[index + 1], x, y);
            createInfoOverlay(index + 1, infoTexts[index], infoLinks[index]);
            surroundingObjects.push(obj);
        });
    };

    const updateObjectPositions = () => {
        const centralPosition = getCentralPosition();
        const centralObject = interactiveObjects[0];
        centralObject.style.left = `${centralPosition.x - 25}px`; /* Ajuste para centralizar */
        centralObject.style.top = `${centralPosition.y - 25}px`; /* Ajuste para centralizar */

        surroundingObjects.forEach((obj, index) => {
            const angleInRadians = (index * 45) * (Math.PI / 180);
            obj.style.left = `${centralPosition.x + 75 * Math.cos(angleInRadians) - 25}px`; /* Ajuste para centralizar */
            obj.style.top = `${centralPosition.y + 75 * Math.sin(angleInRadians) - 25}px`; /* Ajuste para centralizar */
        });
    };

    const showInfoOverlay = (id, event) => {
        // Fechar qualquer sobreposição aberta antes de abrir a nova
        infoOverlays.forEach(overlay => {
            overlay.style.display = 'none';
        });

        const obj = surroundingObjects[id - 1];
        const infoOverlay = document.getElementById(`info-overlay-${id}`);
        if (obj && infoOverlay) {
            const rect = obj.getBoundingClientRect();
            infoOverlay.style.left = `${rect.right + window.scrollX}px`; /* Ajustar a posição ao lado do objeto */
            infoOverlay.style.top = `${rect.top + window.scrollY}px`;
            infoOverlay.style.display = 'block';

            infoOverlay.style.transform = 'scale(0.5)';
            infoOverlay.style.opacity = '0';

            requestAnimationFrame(() => {
                infoOverlay.style.transition = 'transform 0.5s ease-out, opacity 0.5s ease-out';
                infoOverlay.style.transform = 'scale(1)';
                infoOverlay.style.opacity = '1';
            });
        }
    };

    const toggleVortexAnimation = () => {
        if (vortexActive) {
            // Recolher os objetos circundantes de volta para o centro
            anime({
                targets: surroundingObjects,
                opacity: 0,
                translateX: 0,
                translateY: 0,
                scale: 0,
                easing: 'easeInExpo',
                duration: 1000,
                delay: anime.stagger(100, { start: 500 })
            });
        } else {
            // Espalhar os objetos circundantes
            anime({
                targets: surroundingObjects,
                opacity: 1,
                translateX: (el, i) => {
                    const angleInRadians = (i * 45) * (Math.PI / 180);
                    return 75 * Math.cos(angleInRadians); /* Distância ajustada para manter os objetos próximos */
                },
                translateY: (el, i) => {
                    const angleInRadians = (i * 45) * (Math.PI / 180);
                    return 75 * Math.sin(angleInRadians); /* Distância ajustada para manter os objetos próximos */
                },
                scale: 1,
                easing: 'easeOutExpo',
                duration: 1000,
                delay: anime.stagger(100, { start: 500 })
            });
        }
        vortexActive = !vortexActive; // Alternar o estado da animação de vórtice
    };

    overlay.style.display = 'none';

    modoNoturnoIcon.addEventListener('click', function() {
        document.body.classList.toggle('modo-noturno');
        const isNightMode = document.body.classList.contains('modo-noturno');
        modoNoturnoIcon.src = isNightMode ? 'icone_sol.png' : 'icone_lua.png';
        loadParticlesConfig(isNightMode);
        loadMainParticlesConfig(isNightMode);
        document.querySelectorAll('.info-overlay').forEach(overlay => {
            overlay.classList.toggle('modo-noturno', isNightMode);
        });
    });

    centralButton.addEventListener('click', function() {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        loadParticlesConfig(document.body.classList.contains('modo-noturno'));
        // Mostrar objeto central
        const centralObject = interactiveObjects[0];
        anime({
            targets: centralObject,
            opacity: 1,
            scale: 1,
            easing: 'easeOutExpo',
            duration: 1000
        });

        centralObject.addEventListener('click', function() {
            toggleVortexAnimation();
        });
    });

    closeOverlay.addEventListener('click', function() {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        // Resetar a animação de vórtice e ocultar os objetos circundantes
        vortexActive = false;
        surroundingObjects.forEach(obj => {
            obj.style.opacity = '0';
            obj.style.transform = 'translateX(0) translateY(0) scale(0)';
        });
    });

    overlay.addEventListener('click', function(event) {
        if (event.target === overlay) {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
            // Resetar a animação de vórtice e ocultar os objetos circundantes
            vortexActive = false;
            surroundingObjects.forEach(obj => {
                obj.style.opacity = '0';
                obj.style.transform = 'translateX(0) translateY(0) scale(0)';
            });
        }
    });

    window.addEventListener('scroll', function() {
        const footer = document.querySelector('footer');
        footer.style.bottom = (window.scrollY + window.innerHeight >= document.body.offsetHeight) ? '0' : '-150px';
    });

    document.addEventListener('contextmenu', function(e) {
        if (e.target.tagName === 'IMG') {
            e.preventDefault();
        }
    });

    document.addEventListener('mousedown', function(e) {
        e.preventDefault();
    });

    window.addEventListener('resize', updateObjectPositions);

    initializeInteractiveObjects();
    loadMainParticlesConfig(document.body.classList.contains('modo-noturno'));
    updateObjectPositions(); // Atualizar posições ao inicializar
});

const getCentralPosition = () => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    return { x: centerX, y: centerY };
};
