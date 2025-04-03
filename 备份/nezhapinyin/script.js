// 背景音乐播放
let musicPlayed = false;
function playBackgroundMusic() {
    if (musicPlayed) return;
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.volume = 0.5;
    bgMusic.play().then(() => {
        musicPlayed = true;
        // 移除事件监听器，确保只播放一次
        document.removeEventListener('click', playBackgroundMusic);
        document.removeEventListener('touchstart', playBackgroundMusic);
    }).catch(e => console.log('播放失败:', e));
}

// 拼音应用主逻辑
document.addEventListener('DOMContentLoaded', () => {
    // 尝试自动播放，如果失败则添加交互监听
    const bgMusic = document.getElementById('bgMusic');
    bgMusic.play().then(() => {
        musicPlayed = true;
    }).catch(() => {
        console.log('自动播放被阻止，等待用户交互');
        document.addEventListener('click', playBackgroundMusic, { once: true });
        document.addEventListener('touchstart', playBackgroundMusic, { once: true });
    });
    // 获取DOM元素
    const learnBtn = document.getElementById('learn-mode');
    const practiceBtn = document.getElementById('practice-mode');
    const cardArea = document.getElementById('card-area');
    
    // 加载拼音数据
    let pinyinData = {};
    
    fetch('data/pinyin.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('拼音数据加载成功:', data);
            pinyinData = data;
            initApp();
        })
        .catch(error => {
            console.error('加载拼音数据失败:', error);
            cardArea.innerHTML = `<div class="error">加载拼音数据失败，请刷新重试</div>`;
        });

    // 初始化应用
    function initApp() {
        // 默认显示学习模式
        showLearningCards();
        
        // 添加事件监听
        learnBtn.addEventListener('click', showLearningCards);
        practiceBtn.addEventListener('click', showPracticeCards);

        // Make decor images draggable
        makeDraggable(document.querySelectorAll('.decor'));

        // 显示哪吒提示文字
        const tooltips = document.querySelectorAll('.decor-tooltip');
        tooltips.forEach(tooltip => {
            tooltip.style.opacity = 1;
            
            // 3秒后隐藏
            setTimeout(() => {
                tooltip.style.opacity = 0;
            }, 3000);
        });
    }

    // 显示学习卡片
    function showLearningCards() {
        cardArea.innerHTML = '';
        
        // 创建声母卡片
        createCardSection('声母', pinyinData.initials);
        
        // 创建韵母卡片
        createCardSection('韵母', pinyinData.finals);
        
        // 创建整体认读音节卡片
        createCardSection('整体认读', pinyinData.syllables);
    }

    // 创建卡片区域
    function createCardSection(title, items) {
        const section = document.createElement('div');
        section.className = 'card-section';
        
        const heading = document.createElement('h2');
        heading.textContent = title;
        section.appendChild(heading);
        
        const cardGrid = document.createElement('div');
        cardGrid.className = 'card-grid';
        
        items.forEach(item => {
            const card = createCard(item);
            cardGrid.appendChild(card);
        });
        
        section.appendChild(cardGrid);
        cardArea.appendChild(section);
    }

    // 创建单个卡片
    function createCard(item) {
        const card = document.createElement('div');
        card.className = 'pinyin-card';
        
        const char = document.createElement('div');
        char.className = 'pinyin-char';
        char.textContent = item.char;
        card.appendChild(char);
        
        const word = document.createElement('div');
        word.className = 'pinyin-word';
        word.textContent = item.word;
        card.appendChild(word);

        // 添加Emoji
        if (item.emoji) {
            const emoji = document.createElement('div');
            emoji.className = 'pinyin-emoji';
            emoji.textContent = item.emoji;
            card.appendChild(emoji);
        }

        // Add click listener for audio playback
        if (item.audio) {
            card.addEventListener('click', () => playAudio(item.audio));
        } else {
            // Fallback or visual indication if audio is missing
            card.style.opacity = '0.7'; 
            card.title = '缺少音频文件';
        }
        
        return card;
    }

    // --- Audio Playback ---
    let currentAudio = null; // Keep track of the currently playing audio

    function playAudio(audioSrc) {
        if (!audioSrc) {
            console.warn('音频文件路径无效:', audioSrc);
            return;
        }

        // Stop currently playing audio if any
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0; // Reset time
        }

        // Create or reuse an Audio object
        if (!currentAudio || currentAudio.src !== audioSrc) {
             currentAudio = new Audio(audioSrc);
        }
       
        currentAudio.play().catch(error => {
            console.error('播放音频失败:', audioSrc, error);
            // Handle potential errors (e.g., file not found, format not supported)
            alert(`无法播放音频: ${audioSrc}\n错误: ${error.message}`);
        });
    }

    // 显示练习卡片 - 九宫格模式
    function showPracticeCards() {
        cardArea.innerHTML = ''; // 清空区域

        // 合并所有拼音数据
        const allPinyin = [
            ...(pinyinData.initials || []),
            ...(pinyinData.finals || []),
            ...(pinyinData.syllables || [])
        ];

        if (allPinyin.length === 0) {
            cardArea.innerHTML = '<div class="error">没有可用的拼音数据进行练习</div>';
            return;
        }

        // 创建练习区域容器
        const practiceContainer = document.createElement('div');
        practiceContainer.className = 'practice-container';

        // 创建“换一批”按钮
        const refreshButton = document.createElement('button');
        refreshButton.textContent = '换一批';
        refreshButton.className = 'refresh-btn';
        refreshButton.addEventListener('click', displayNineCards);
        practiceContainer.appendChild(refreshButton); // 先添加按钮

        // 创建九宫格
        const practiceGrid = document.createElement('div');
        practiceGrid.className = 'practice-grid';
        practiceContainer.appendChild(practiceGrid); // 再添加九宫格

        cardArea.appendChild(practiceContainer);

        // 显示九宫格卡片
        displayNineCards();

        function displayNineCards() {
            practiceGrid.innerHTML = ''; // 清空旧卡片

            // 随机打乱所有拼音项
            const shuffledPinyin = allPinyin.sort(() => 0.5 - Math.random());

            // 选择前9个（或所有，如果不足9个）
            const selectedItems = shuffledPinyin.slice(0, 9);

            // 创建并添加卡片到九宫格
            selectedItems.forEach(item => {
                const card = createCard(item);
                // 可以为练习卡片添加特定类或数据属性，以便后续添加交互
                // card.classList.add('practice-item');
                // card.dataset.char = item.char;
                practiceGrid.appendChild(card);
            });
        }
    }

    // Function to make elements draggable
    function makeDraggable(elements) {
        elements.forEach(element => {
            let isDragging = false;
            let startX, startY, initialLeft, initialTop;

            // Mouse Events
            element.addEventListener('mousedown', startDragMouse);
            // Touch Events
            element.addEventListener('touchstart', startDragTouch, { passive: false }); // passive: false to allow preventDefault

            function startDragMouse(e) {
                // Prevent dragging if it's not the element itself (e.g., the image inside)
                if (e.target !== element && e.target.parentNode !== element) return;
                startX = e.clientX;
                startY = e.clientY;
                startDrag(element);
                document.addEventListener('mousemove', dragMouse);
                document.addEventListener('mouseup', stopDragMouse);
            }

            function startDragTouch(e) {
                // Prevent dragging if it's not the element itself (e.g., the image inside)
                 if (e.target !== element && e.target.parentNode !== element) return;
                if (e.touches.length === 1) {
                    e.preventDefault(); // Prevent page scrolling on touch devices
                    const touch = e.touches[0];
                    startX = touch.clientX;
                    startY = touch.clientY;
                    startDrag(element);
                    document.addEventListener('touchmove', dragTouch, { passive: false });
                    document.addEventListener('touchend', stopDragTouch);
                }
            }

            function startDrag(targetElement) {
                isDragging = true;
                targetElement.classList.add('dragging');
                // Get initial position. Use computed style to get the actual rendered position
                const style = window.getComputedStyle(targetElement);
                initialLeft = parseFloat(style.left) || 0;
                initialTop = parseFloat(style.top) || 0;
                 // Ensure transform is none initially for correct positioning calculation
                targetElement.style.transform = 'none';
                targetElement.style.bottom = 'auto'; // Switch to top/left positioning
                targetElement.style.right = 'auto';
                targetElement.style.left = `${initialLeft}px`;
                targetElement.style.top = `${initialTop}px`;
            }


            function dragMouse(e) {
                drag(e.clientX, e.clientY, element);
            }

            function dragTouch(e) {
                 if (e.touches.length === 1) {
                    e.preventDefault(); // Prevent page scrolling
                    const touch = e.touches[0];
                    drag(touch.clientX, touch.clientY, element);
                 }
            }

            function drag(clientX, clientY, targetElement) {
                if (!isDragging) return;
                const dx = clientX - startX;
                const dy = clientY - startY;

                let newX = initialLeft + dx;
                let newY = initialTop + dy;

                // Optional: Keep within viewport bounds
                const vpWidth = window.innerWidth;
                const vpHeight = window.innerHeight;
                const elWidth = targetElement.offsetWidth;
                const elHeight = targetElement.offsetHeight;

                newX = Math.max(0, Math.min(newX, vpWidth - elWidth));
                newY = Math.max(0, Math.min(newY, vpHeight - elHeight));

                targetElement.style.left = `${newX}px`;
                targetElement.style.top = `${newY}px`;
            }

            function stopDragMouse() {
                stopDrag(element);
                document.removeEventListener('mousemove', dragMouse);
                document.removeEventListener('mouseup', stopDragMouse);
            }

            function stopDragTouch() {
                stopDrag(element);
                document.removeEventListener('touchmove', dragTouch);
                document.removeEventListener('touchend', stopDragTouch);
            }

            function stopDrag(targetElement) {
                 if (!isDragging) return;
                 isDragging = false;
                 if (targetElement) {
                    targetElement.classList.remove('dragging');
                 }
            }

             // Prevent default browser image dragging
             element.ondragstart = () => false;
             const img = element.querySelector('img');
             if (img) {
                 img.ondragstart = () => false;
             }
        });
    }

    // 支持按钮和弹窗逻辑
    const supportBtn = document.getElementById('supportBtn');
    const modal = document.getElementById('payModal');
    const closeBtn = document.querySelector('.close');

    if (supportBtn && modal && closeBtn) {
        // 点击支持按钮显示弹窗
        supportBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });

        // 点击关闭按钮隐藏弹窗
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // 点击弹窗外部区域隐藏弹窗
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});
