// Função para carregar o calendário de aulas
function carregarCalendario() {
    const calendarContainer = document.getElementById('calendar');
    if (!calendarContainer) return; // Garante que só execute na página que tem o calendário

    fetch('http://localhost:3000/aulas')
        .then(response => response.json())
        .then(aulas => {
            const eventos = aulas.map(aula => ({
                title: `${aula.nome_aula} - ${aula.professor}`,
                start: `${aula.data_aula}T${aula.hora_inicio}`,
                end: `${aula.data_aula}T${aula.hora_fim}`,
                description: aula.descricao
            }));

            $('#calendar').fullCalendar({
                themeSystem: 'standard',
                events: eventos,
                eventRender: function(event, element) {
                    if (event.description) {
                        element.attr('title', event.description);
                    }
                }
            });
        })
        .catch(err => {
            console.error("Erro ao carregar aulas:", err);
            alert("Erro ao carregar as aulas");
        });
}

// Função para carregar imagens da galeria
function carregarGaleria() {
    const container = document.getElementById('galeria-fotos');
    if (!container) return; // Garante que só execute na página com galeria

    fetch('/galeria')
        .then(res => res.json())
        .then(imagens => {
            imagens.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.classList.add('foto');
                container.appendChild(img);
            });
        })
        .catch(err => {
            console.error("Erro ao carregar galeria:", err);
        });
}

// Ao carregar a página, execute o necessário
window.onload = function () {
    carregarCalendario();
    carregarGaleria();
};
