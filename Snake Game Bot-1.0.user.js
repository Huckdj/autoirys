// ==UserScript==
// @name         Snake Game Bot
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Da So thi dung dung, da dung thi dung so
// @author       caobang
// @match        https://irysarcade.xyz/games/snake
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    function waitForGameContainer() {
        if (!document.getElementById('snake-bot-ui')) {
            createStandaloneUI();
        }

        const gameDiv = document.querySelector('.game-container');
        if (!gameDiv) {
            console.log('Không tìm thấy game container, thử lại...');
            setTimeout(waitForGameContainer, 1000);
            return;
        }

        console.log('Bắt đầu chơi nào...');
        initializeBot(gameDiv);
    }

    function createStandaloneUI() {
        const existingUI = document.getElementById('snake-bot-ui');
        if (existingUI) {
            existingUI.remove();
        }

        const uiContainer = document.createElement('div');
        uiContainer.id = 'snake-bot-ui';
        uiContainer.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 999999 !important;
            background: #1a1a1a !important;
            border: 2px solid #333 !important;
            border-radius: 10px !important;
            padding: 15px !important;
            font-family: Arial, sans-serif !important;
            color: white !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
            min-width: 200px !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        `;

        const title = document.createElement('div');
        title.textContent = 'Snake Bot Control';
        title.style.cssText = `
            font-size: 16px !important;
            font-weight: bold !important;
            margin-bottom: 10px !important;
            text-align: center !important;
            color: #4CAF50 !important;
        `;

        const status = document.createElement('div');
        status.id = 'bot-status';
        status.textContent = 'Trạng thái: Đang chờ trò chơi...';
        status.style.cssText = `
            font-size: 14px !important;
            margin-bottom: 10px !important;
            text-align: center !important;
            color: #ffaa00 !important;
        `;

        const startButton = document.createElement('button');
        startButton.id = 'start-bot-btn';
        startButton.textContent = 'Start Bot';
        startButton.style.cssText = `
            background: #4CAF50 !important;
            color: white !important;
            border: none !important;
            padding: 10px 20px !important;
            border-radius: 5px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            margin-right: 5px !important;
            transition: background 0.3s !important;
        `;

        const stopButton = document.createElement('button');
        stopButton.id = 'stop-bot-btn';
        stopButton.textContent = 'Stop Bot';
        stopButton.style.cssText = `
            background: #f44336 !important;
            color: white !important;
            border: none !important;
            padding: 10px 20px !important;
            border-radius: 5px !important;
            cursor: pointer !important;
            font-size: 14px !important;
            transition: background 0.3s !important;
        `;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex !important;
            gap: 10px !important;
            justify-content: center !important;
        `;

        buttonContainer.appendChild(startButton);
        buttonContainer.appendChild(stopButton);
        uiContainer.appendChild(title);
        uiContainer.appendChild(status);
        uiContainer.appendChild(buttonContainer);

        document.body.appendChild(uiContainer);

        console.log('Standalone UI created');

        startButton.addEventListener('click', () => {
            console.log('Start button clicked');
            status.textContent = 'Status: Đang tìm kiếm trò chơi...';
            status.style.color = '#ffaa00';
        });

        stopButton.addEventListener('click', () => {
            console.log('Stop button clicked');
            status.textContent = 'Status: Stopped';
            status.style.color = '#ff4444';
        });

        return { uiContainer, startButton, stopButton, status };
    }

    function createBotUI() {
        const existingUI = document.getElementById('snake-bot-ui');
        if (existingUI) {
            existingUI.remove();
        }

        const uiContainer = document.createElement('div');
        uiContainer.id = 'snake-bot-ui';
        uiContainer.style.cssText = `
            position: fixed !important;
            top: 20px !important;
            right: 20px !important;
            z-index: 999999 !important;
            background: #1a1a1a !important;
            border: 2px solid #333 !important;
            border-radius: 10px !important;
            padding: 15px !important;
            font-family: Arial, sans-serif !important;
            color: white !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
            min-width: 200px !important;
            display: block !important;
            visibility: visible !important;
            opacity: 1 !important;
        `;

        const title = document.createElement('div');
        title.textContent = 'Snake Bot Control';
        title.style.cssText = `
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 10px;
            text-align: center;
            color: #4CAF50;
        `;

        const status = document.createElement('div');
        status.id = 'bot-status';
        status.textContent = 'Trạng thái: Đã dừng';
        status.style.cssText = `
            font-size: 14px;
            margin-bottom: 10px;
            text-align: center;
            color: #ff4444;
        `;

        const startButton = document.createElement('button');
        startButton.id = 'start-bot-btn';
        startButton.textContent = 'Start Bot';
        startButton.style.cssText = `
            background: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            margin-right: 5px;
            transition: background 0.3s;
        `;

        const stopButton = document.createElement('button');
        stopButton.id = 'stop-bot-btn';
        stopButton.textContent = 'Stop Bot';
        stopButton.style.cssText = `
            background: #f44336;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 14px;
            transition: background 0.3s;
        `;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = `
            display: flex;
            gap: 10px;
            justify-content: center;
        `;

        startButton.addEventListener('mouseenter', () => {
            startButton.style.background = '#45a049';
        });
        startButton.addEventListener('mouseleave', () => {
            startButton.style.background = '#4CAF50';
        });

        stopButton.addEventListener('mouseenter', () => {
            stopButton.style.background = '#da190b';
        });
        stopButton.addEventListener('mouseleave', () => {
            stopButton.style.background = '#f44336';
        });

        buttonContainer.appendChild(startButton);
        buttonContainer.appendChild(stopButton);
        uiContainer.appendChild(title);
        uiContainer.appendChild(status);
        uiContainer.appendChild(buttonContainer);

        document.body.appendChild(uiContainer);

        setTimeout(() => {
            uiContainer.style.display = 'block';
            uiContainer.style.visibility = 'visible';
            console.log('Bot UI created and added to page');
        }, 100);

        return {
            container: uiContainer,
            startButton: startButton,
            stopButton: stopButton,
            status: status
        };
    }

    function initializeBot(gameDiv) {
        console.log('Khởi tạo bot với UI...');

        const ui = createBotUI();

        console.log('UI created:', ui);
        console.log('UI container:', ui.container);
        console.log('UI in DOM:', document.getElementById('snake-bot-ui'));

        function updateStatus(text, color) {
            ui.status.textContent = `Status: ${text}`;
            ui.status.style.color = color;
        }

        function getReactFiber(element) {
            const keys = Object.keys(element);
            const reactFiberKey = keys.find(key => key.startsWith('__reactFiber$'));
            return reactFiberKey ? element[reactFiberKey] : null;
        }

        function getReactStates(element) {
            let fiber = getReactFiber(element);
            if (!fiber) return null;

            while (fiber) {
                let state = fiber.memoizedState;
                const states = [];

                while (state) {
                    if (state.memoizedState !== undefined) {
                        states.push(state.memoizedState);
                    }
                    state = state.next;
                }

                if (states.length > 10) return states;
                fiber = fiber.return;
            }

            return null;
        }

        function simulateKeyPress(key) {
            const event = new KeyboardEvent("keydown", {
                key: key,
                code: key,
                bubbles: true,
                cancelable: true
            });
            document.dispatchEvent(event);
        }

        function isSafeMove(snake, x, y, gridWidth, gridHeight) {
            if (x < 0 || x >= gridWidth || y < 0 || y >= gridHeight) return false;

            return !snake.slice(1).some(segment => segment[0] === x && segment[1] === y);
        }

        function aStarPath(snake, food, direction, gridWidth, gridHeight) {
            const head = snake[0];
            const target = [food.x, food.y];

            const oppositeDirection = {
                ArrowUp: "ArrowDown",
                ArrowDown: "ArrowUp",
                ArrowLeft: "ArrowRight",
                ArrowRight: "ArrowLeft"
            };

            const currentDirection = direction[1] === -1 ? "ArrowUp" :
                                   direction[1] === 1 ? "ArrowDown" :
                                   direction[0] === -1 ? "ArrowLeft" :
                                   direction[0] === 1 ? "ArrowRight" : null;

            const deltas = [
                [0, -1, "ArrowUp"],
                [0, 1, "ArrowDown"],
                [-1, 0, "ArrowLeft"],
                [1, 0, "ArrowRight"]
            ];

            const openSet = [];
            const visited = new Set();

            openSet.push({
                cost: 0,
                pos: head,
                path: [],
                g: 0,
                snakeSim: snake.slice()
            });

            visited.add(head[0] + "," + head[1]);

            const heuristic = (pos, target) => {
                return Math.abs(pos[0] - target[0]) + Math.abs(pos[1] - target[1]);
            };

            while (openSet.length > 0) {
                openSet.sort((a, b) => a.cost - b.cost);
                const current = openSet.shift();

                if (current.pos[0] === target[0] && current.pos[1] === target[1]) {
                    return current.path[0];
                }

                for (let [dx, dy, key] of deltas) {
                    if (current.path.length === 0 && key === oppositeDirection[currentDirection]) {
                        continue;
                    }

                    const nx = current.pos[0] + dx;
                    const ny = current.pos[1] + dy;
                    const visitKey = nx + "," + ny;

                    if (visited.has(visitKey)) continue;
                    if (!isSafeMove(current.snakeSim, nx, ny, gridWidth, gridHeight)) continue;

                    visited.add(visitKey);

                    const g = current.g + 1;
                    const h = heuristic([nx, ny], target);
                    const cost = g + h;
                    const path = [...current.path, key];

                    let newSnake = [[nx, ny], ...current.snakeSim.slice(0, -1)];

                    if (nx === target[0] && ny === target[1]) {
                        newSnake = [[nx, ny], ...current.snakeSim];
                    }

                    openSet.push({
                        cost: cost,
                        pos: [nx, ny],
                        path: path,
                        g: g,
                        snakeSim: newSnake
                    });
                }
            }

            return null;
        }

        function findSafeDirection(snake, direction, gridWidth, gridHeight) {
            const head = snake[0];
            const deltas = [
                [0, -1, "ArrowUp"],
                [0, 1, "ArrowDown"],
                [-1, 0, "ArrowLeft"],
                [1, 0, "ArrowRight"]
            ];

            const oppositeDirection = {
                ArrowUp: "ArrowDown",
                ArrowDown: "ArrowUp",
                ArrowLeft: "ArrowRight",
                ArrowRight: "ArrowLeft"
            };

            const currentDirection = direction[1] === -1 ? "ArrowUp" :
                                   direction[1] === 1 ? "ArrowDown" :
                                   direction[0] === -1 ? "ArrowLeft" :
                                   direction[0] === 1 ? "ArrowRight" : null;

            deltas.sort((a, b) => {
                if (a[2] === currentDirection) return -1;
                if (b[2] === currentDirection) return 1;
                return 0;
            });

            let bestKey = null;
            let maxSpace = 0;

            for (let [dx, dy, key] of deltas) {
                if (key === oppositeDirection[currentDirection]) continue;

                const nx = head[0] + dx;
                const ny = head[1] + dy;

                if (!isSafeMove(snake, nx, ny, gridWidth, gridHeight)) continue;

                const newHead = [nx, ny];
                const newSnake = [newHead, ...snake.slice(0, -1)];

                const space = calculateSpace(newSnake, gridWidth, gridHeight);

                if (space > maxSpace) {
                    maxSpace = space;
                    bestKey = key;
                }
            }

            return bestKey;
        }

        function calculateSpace(snake, gridWidth, gridHeight) {
            const head = snake[0];
            const queue = [head];
            const snakeSet = new Set(snake.map(segment => segment[0] + "," + segment[1]));
            let spaceCount = 0;

            while (queue.length > 0) {
                const [x, y] = queue.shift();
                spaceCount++;

                const directions = [[0, -1], [0, 1], [-1, 0], [1, 0]];

                for (let [dx, dy] of directions) {
                    const nx = x + dx;
                    const ny = y + dy;
                    const key = nx + "," + ny;

                    if (nx >= 0 && nx < gridWidth && ny >= 0 && ny < gridHeight && !snakeSet.has(key)) {
                        snakeSet.add(key);
                        queue.push([nx, ny]);
                    }
                }
            }

            return spaceCount;
        }

        function followTail(snake, direction, gridWidth, gridHeight) {
            const tail = snake[snake.length - 1];
            return aStarPath(snake, {x: tail[0], y: tail[1]}, direction, gridWidth, gridHeight) ||
                   findSafeDirection(snake, direction, gridWidth, gridHeight);
        }

        let botInterval = null;
        let lastKey = null;

        function startBot() {
            if (botInterval) {
                console.log('Bot đã chạy rồi');
                return;
            }

            const gridWidth = 15;
            const gridHeight = 17;

            botInterval = setInterval(() => {
                const states = getReactStates(gameDiv);

                if (!states || states.length < 8) {
                    console.error('Không thể lấy được trạng thái trò chơi');
                    return;
                }

                const snake = states[2];
                const food = states[3];
                const direction = states[4];
                const gameOver = states[6];
                const gameStarted = states[7];

                if (document.querySelector('button[class*="Submit Score"]')) {
                    stopBot();
                    return;
                }

                if (!gameStarted || gameOver) {
                    const button = gameDiv.querySelector('button');
                    if (button) {
                        button.click();
                        console.log('Starting/Restarting game');
                    }
                    return;
                }

                if (direction[0] === 0 && direction[1] === 0) {
                    let initialKey = aStarPath(snake, food, direction, gridWidth, gridHeight) || "ArrowRight";
                    simulateKeyPress(initialKey);
                    lastKey = initialKey;
                    return;
                }

                let nextKey = aStarPath(snake, food, direction, gridWidth, gridHeight);

                if (!nextKey) {
                    nextKey = followTail(snake, direction, gridWidth, gridHeight);
                }

                if (!nextKey) {
                    nextKey = findSafeDirection(snake, direction, gridWidth, gridHeight);
                }

                if (nextKey && nextKey !== lastKey) {
                    simulateKeyPress(nextKey);
                    lastKey = nextKey;
                }

            }, 30);

            updateStatus('Đang chạy', '#4CAF50');
            console.log('Bot started');
        }

        function stopBot() {
            if (botInterval) {
                clearInterval(botInterval);
                botInterval = null;
                updateStatus('Đã dừng', '#ff4444');
                console.log('Bot stopped');
            }
        }

        ui.startButton.addEventListener('click', () => {
            startBot();
        });

        ui.stopButton.addEventListener('click', () => {
            stopBot();
        });

        setTimeout(() => {
            startBot();
        }, 2000);

        console.log('Snake Bot initialized with UI controls.');
    }

    console.log('Dân cày airdrop');

    setTimeout(() => {
        if (!document.getElementById('snake-bot-ui')) {
            console.log('Force creating UI...');
            createStandaloneUI();
        }
    }, 1000);

    waitForGameContainer();
})();