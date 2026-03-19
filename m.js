/**
 * versão: 0.03
 * cloud
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Lógica do Menu ---
    // fnc toggle; menu aparece efeito de círculo
    window.toggleMenu = () => {
        const menu = document.getElementById("menu");
        const body = document.body;

        menu.classList.toggle("show-menu");

        // Alterna o atributo de navegação no body para possíveis estilos extra
        body.dataset.nav = body.dataset.nav === "true" ? "false" : "true";

        // Troca o ícone se necessário (exemplo usando FontAwesome)
        const btnIcon = document.querySelector(".menu-button i");
        if (menu.classList.contains("show-menu")) {
            btnIcon.classList.replace("fa-bars", "fa-times");
        } else {
            btnIcon.classList.replace("fa-times", "fa-bars");
        }
    };

    // --- 2. Galeria de Imagens (Efeito Drag/Slide) ---
    // img deslizam conforme você arrasta o mouse ou o dedo no celular.
    const track = document.getElementById("image-track");
    if (track) {
        const handleOnDown = e => {
            track.dataset.mouseDownAt = e.clientX || e.touches[0].clientX;
        };

        const handleOnUp = () => {
            track.dataset.mouseDownAt = "0";
            track.dataset.prevPercentage = track.dataset.percentage || "0";
        };

        const handleOnMove = e => {
            if (track.dataset.mouseDownAt === "0") return;

            const clientX = e.clientX || e.touches[0].clientX;
            const mouseDelta = parseFloat(track.dataset.mouseDownAt) - clientX;
            const maxDelta = window.innerWidth / 2;

            const percentage = (mouseDelta / maxDelta) * -100;
            const nextPercentageUnconstrained = parseFloat(track.dataset.prevPercentage) + percentage;
            const nextPercentage = Math.max(Math.min(nextPercentageUnconstrained, 0), -100);

            track.dataset.percentage = nextPercentage;

            // Animação suave do track
            track.animate({
                transform: `translateX(${nextPercentage}%)`
            }, { duration: 1200, fill: "forwards", easing: "ease-out" });

            // Animação individual das imagens para efeito de parallax interno
            const images = track.getElementsByClassName("image");
            for (const image of images) {
                image.animate({
                    objectPosition: `${100 + nextPercentage}% center`
                }, { duration: 1200, fill: "forwards" });
            }
        };

        // Eventos de Mouse
        window.onmousedown = e => handleOnDown(e);
        window.onmouseup = () => handleOnUp();
        window.onmousemove = e => handleOnMove(e);

        // Eventos de Touch (Mobile)
        window.ontouchstart = e => handleOnDown(e.touches[0]);
        window.ontouchend = () => handleOnUp();
        window.ontouchmove = e => handleOnMove(e.touches[0]);
    }

    // --- 3. Efeito Parallax no Avatar (Camadas 3D) ---
    const img1 = document.querySelector(".img1");
    const img2 = document.querySelector(".img2");
    const img3 = document.querySelector(".img3");

    if (img1 && img2 && img3) {
        document.addEventListener("mousemove", (event) => {
            const { innerWidth, innerHeight } = window;
            const xAxis = (innerWidth / 2 - event.pageX) / 30; // Sensibilidade X
            const yAxis = (innerHeight / 2 - event.pageY) / 30; // Sensibilidade Y

            // Camada do Fundo (Alisterbg.png - Verde - Menos movimento)
            img1.style.transform = `rotateX(${yAxis * 0.4}deg) rotateY(${-xAxis * 0.4}deg) translateZ(-10px)`;

            // Camada do Meio (Alister.png - Personagem principal)
            img2.style.transform = `rotateX(${yAxis * 0.7}deg) rotateY(${-xAxis * 0.7}deg) translateZ(10px)`;

            // Camada do Topo (Alisterscarf.png - Cachecol - Agora mais colado no corpo)
            img3.style.transform = `rotateX(${yAxis * 0.9}deg) rotateY(${-xAxis * 0.9}deg) translateZ(20px)`;
        });
    }

    // --- 4. Data e Hora ---
    const dateElement = document.getElementById("datetime");
    if (dateElement) {
        const updateTime = () => {
            const now = new Date();
            const options = {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            dateElement.innerText = now.toLocaleDateString('pt-BR', options);
        };
        updateTime();
        setInterval(updateTime, 60000); // Atualiza a cada minuto
    }

    // --- 5. Visualizador de Imagens Fullscreen (Lightbox) ---
    const imageViewer = document.getElementById("image-viewer");
    const fullImage = document.getElementById("full-image");
    const closeBtn = document.querySelector(".close-viewer");

    if (imageViewer && track) {
        // Adiciona evento de clique em todas as imagens da galeria
        const galleryImages = track.querySelectorAll(".image");
        galleryImages.forEach(img => {
            img.addEventListener("click", (e) => {
                // Só abre se não estiver deslizando a galeria
                // (Se o valor de arrasto for muito pequeno, consideramos um clique)
                const isDragging = Math.abs(parseFloat(track.dataset.mouseDownAt) - e.clientX) > 10;
                
                if (!isDragging || track.dataset.mouseDownAt === "0") {
                    imageViewer.style.display = "flex"; // Usar flex para centralizar
                    fullImage.src = img.src;
                    document.body.style.overflow = "hidden"; // Trava o scroll do fundo
                }
            });
        });

        // Função para fechar o visualizador
        const closeViewer = () => {
            imageViewer.style.display = "none";
            document.body.style.overflow = "auto"; // Libera o scroll
        };

        if (closeBtn) closeBtn.onclick = closeViewer;
        imageViewer.onclick = (e) => {
            if (e.target === imageViewer) closeViewer();
        };

        // Fechar com a tecla ESC
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") closeViewer();
        });
    }
});
