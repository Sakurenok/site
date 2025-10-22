// ===== ИНТЕРАКТИВНЫЕ ФУНКЦИИ ДЛЯ ГЕОГРАФИЧЕСКОГО СПРАВОЧНИКА =====

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация всех интерактивных элементов
    initInteractiveElements();
    initAnimations();
    initSearchEnhancements();
    initProgressBars();
    initTooltips();
    initCounters();
});

// Инициализация интерактивных элементов
function initInteractiveElements() {
    // Добавляем классы для анимации при загрузке
    const cards = document.querySelectorAll('.geo-card, .info-card, .stat-item');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Добавляем эффекты при наведении на карточки
    const interactiveCards = document.querySelectorAll('.geo-card, .info-card');
    interactiveCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Инициализация анимаций
function initAnimations() {
    // Анимация появления элементов при скролле
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Наблюдаем за всеми элементами с классом для анимации
    const animatedElements = document.querySelectorAll('.geo-card, .stat-item, .info-card');
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Улучшения поиска
function initSearchEnhancements() {
    const searchInput = document.querySelector('.md-search__input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            // Добавляем эффект печати
            this.style.borderColor = '#673ab7';
            this.style.boxShadow = '0 0 0 2px rgba(103, 58, 183, 0.2)';
        });

        searchInput.addEventListener('blur', function() {
            this.style.borderColor = '';
            this.style.boxShadow = '';
        });
    }
}

// Прогресс бары
function initProgressBars() {
    const progressBars = document.querySelectorAll('.progress-fill');
    progressBars.forEach(bar => {
        const width = bar.getAttribute('data-width') || '0';
        setTimeout(() => {
            bar.style.width = width + '%';
        }, 500);
    });
}

// Подсказки
function initTooltips() {
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', showTooltip);
        element.addEventListener('mouseleave', hideTooltip);
    });
}

function showTooltip(event) {
    const tooltip = document.createElement('div');
    tooltip.className = 'geo-tooltip';
    tooltip.textContent = event.target.getAttribute('data-tooltip');
    tooltip.style.cssText = `
        position: absolute;
        background: #333;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 14px;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
    
    setTimeout(() => {
        tooltip.style.opacity = '1';
    }, 10);
    
    event.target._tooltip = tooltip;
}

function hideTooltip(event) {
    if (event.target._tooltip) {
        event.target._tooltip.remove();
        delete event.target._tooltip;
    }
}

// Счетчики для статистики
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const duration = 2000; // 2 секунды
        const increment = target / (duration / 16); // 60 FPS
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = Math.floor(current).toLocaleString();
        }, 16);
    });
}

// Функция для создания интерактивных карт
function createInteractiveMap(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Создаем SVG карту
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 800 400');
    svg.style.width = '100%';
    svg.style.height = 'auto';
    svg.style.borderRadius = '12px';
    svg.style.boxShadow = '0 4px 20px rgba(103, 58, 183, 0.3)';
    
    // Добавляем интерактивные элементы
    data.forEach((item, index) => {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', item.x);
        circle.setAttribute('cy', item.y);
        circle.setAttribute('r', item.size || 10);
        circle.setAttribute('fill', '#673ab7');
        circle.setAttribute('opacity', '0.7');
        circle.style.cursor = 'pointer';
        circle.style.transition = 'all 0.3s ease';
        
        circle.addEventListener('mouseenter', function() {
            this.setAttribute('r', (item.size || 10) * 1.5);
            this.setAttribute('opacity', '1');
        });
        
        circle.addEventListener('mouseleave', function() {
            this.setAttribute('r', item.size || 10);
            this.setAttribute('opacity', '0.7');
        });
        
        svg.appendChild(circle);
    });
    
    container.appendChild(svg);
}

// Функция для создания викторины
function createQuiz(containerId, questions) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    let currentQuestion = 0;
    let score = 0;
    
    function renderQuestion() {
        const question = questions[currentQuestion];
        container.innerHTML = `
            <div class="quiz-container">
                <div class="quiz-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" data-width="${(currentQuestion / questions.length) * 100}"></div>
                    </div>
                    <span>Вопрос ${currentQuestion + 1} из ${questions.length}</span>
                </div>
                <h3>${question.question}</h3>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <button class="quiz-option" data-index="${index}">${option}</button>
                    `).join('')}
                </div>
                <div class="quiz-score">Счёт: ${score}</div>
            </div>
        `;
        
        // Добавляем обработчики событий
        const options = container.querySelectorAll('.quiz-option');
        options.forEach(option => {
            option.addEventListener('click', function() {
                const selectedIndex = parseInt(this.getAttribute('data-index'));
                if (selectedIndex === question.correct) {
                    score++;
                    this.style.background = '#4caf50';
                    this.style.color = 'white';
                } else {
                    this.style.background = '#f44336';
                    this.style.color = 'white';
                }
                
                // Показываем правильный ответ
                options[question.correct].style.background = '#4caf50';
                options[question.correct].style.color = 'white';
                
                setTimeout(() => {
                    currentQuestion++;
                    if (currentQuestion < questions.length) {
                        renderQuestion();
                    } else {
                        showResults();
                    }
                }, 1500);
            });
        });
    }
    
    function showResults() {
        container.innerHTML = `
            <div class="quiz-results">
                <h3>Результаты викторины</h3>
                <div class="final-score">Ваш счёт: ${score} из ${questions.length}</div>
                <div class="score-percentage">${Math.round((score / questions.length) * 100)}%</div>
                <button class="geo-btn" onclick="location.reload()">Попробовать снова</button>
            </div>
        `;
    }
    
    renderQuestion();
}

// Функция для создания интерактивной таблицы
function createInteractiveTable(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const table = document.createElement('table');
    table.className = 'interactive-table';
    
    // Заголовки
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    Object.keys(data[0]).forEach(key => {
        const th = document.createElement('th');
        th.textContent = key;
        th.style.cursor = 'pointer';
        th.addEventListener('click', () => sortTable(key));
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // Данные
    const tbody = document.createElement('tbody');
    data.forEach(row => {
        const tr = document.createElement('tr');
        Object.values(row).forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    
    container.appendChild(table);
    
    function sortTable(column) {
        const tbody = table.querySelector('tbody');
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        rows.sort((a, b) => {
            const aVal = a.querySelector(`td:nth-child(${Object.keys(data[0]).indexOf(column) + 1})`).textContent;
            const bVal = b.querySelector(`td:nth-child(${Object.keys(data[0]).indexOf(column) + 1})`).textContent;
            return aVal.localeCompare(bVal);
        });
        
        rows.forEach(row => tbody.appendChild(row));
    }
}

// Утилиты
function formatNumber(num) {
    return new Intl.NumberFormat('ru-RU').format(num);
}

function formatCurrency(amount, currency = 'USD') {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

// Экспорт функций для использования в HTML
window.createInteractiveMap = createInteractiveMap;
window.createQuiz = createQuiz;
window.createInteractiveTable = createInteractiveTable;
window.formatNumber = formatNumber;
window.formatCurrency = formatCurrency;
