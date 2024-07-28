document.addEventListener('DOMContentLoaded', function() {
    const modoNoturnoIcon = document.getElementById('modo-noturno');
    const overlay = document.getElementById('overlay');
    const closeOverlay = document.getElementById('close-overlay');
    const centralButton = document.querySelector('.central-button');
    const interactiveObjectsContainer = document.getElementById('interactive-objects');
    let interactiveObjects = [];
    let surroundingObjects = [];

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
            move: { enable: true, speed: 1.5, direction: 'bottom' }
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

        return obj;
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

        const centralObject = createInteractiveObject(0, srcs[0], centralPosition.x, centralPosition.y, true);
        interactiveObjects.push(centralObject);

        surroundingPositions.forEach((pos, index) => {
            const angleInRadians = pos.angle * (Math.PI / 180);
            const x = centralPosition.x + pos.distance * Math.cos(angleInRadians) - 25; /* Ajuste para centralizar */
            const y = centralPosition.y + pos.distance * Math.sin(angleInRadians) - 25; /* Ajuste para centralizar */
            const obj = createInteractiveObject(index + 1, srcs[index + 1], x, y);
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

    const showInteractiveObjects = () => {
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

        const centralObject = interactiveObjects[0];
        anime({
            targets: centralObject,
            opacity: 1,
            scale: 1,
            easing: 'easeOutExpo',
            duration: 1000
        });
    };

    overlay.style.display = 'none';

    modoNoturnoIcon.addEventListener('click', function() {
        document.body.classList.toggle('modo-noturno');
        const isNightMode = document.body.classList.contains('modo-noturno');
        modoNoturnoIcon.src = isNightMode ? 'icone_sol.png' : 'icone_lua.png';
        loadParticlesConfig(isNightMode);
        loadMainParticlesConfig(isNightMode);
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
            showInteractiveObjects();
        });
    });

    closeOverlay.addEventListener('click', function() {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    });

    overlay.addEventListener('click', function(event) {
        if (event.target === overlay) {
            overlay.style.display = 'none';
            document.body.style.overflow = '';
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
