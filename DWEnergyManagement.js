// ==UserScript==
// @name         Energy Management Tool
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Dark-themed energy refiller with cyberpunk aesthetics
// @author       Ping ( https://cracked.sh/ping )
// @match        https://kong.playmage.com/dream/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Cyberpunk UI Elements
    const guiHTML = `
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500&family=Roboto+Mono:wght@300;500&display=swap');

        #neon-manager {
            position: fixed;
            top: 60px;
            right: 30px;
            background: #0a0a12;
            border-radius: 16px;
            padding: 25px;
            box-shadow: 0 0 30px rgba(41, 182, 246, 0.3);
            width: 320px;
            border: 2px solid #29b6f6;
            font-family: 'Roboto Mono', monospace;
            z-index: 10000;
            backdrop-filter: blur(8px);
            transform: translateZ(0);
        }

        .neon-title {
            font-family: 'Orbitron', sans-serif;
            text-align: center;
            color: #29b6f6;
            text-shadow: 0 0 15px #29b6f6;
            margin: 0 0 25px 0;
            font-size: 1.8em;
            letter-spacing: 2px;
        }

        .cyber-input {
            width: 90%;
            padding: 14px;
            background: #1a1a2f;
            border: 1px solid #29b6f6;
            border-radius: 8px;
            color: #81d4fa;
            font-size: 16px;
            margin-bottom: 20px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .cyber-input:focus {
            outline: none;
            box-shadow: 0 0 15px #29b6f6;
        }

        #cyber-button {
            width: 100%;
            padding: 16px;
            background: linear-gradient(135deg, #29b6f6 0%, #1565c0 100%);
            border: none;
            border-radius: 12px;
            color: #fff;
            font-size: 18px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
        }

        #cyber-button::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: linear-gradient(45deg,
                transparent 25%,
                rgba(41, 182, 246, 0.4) 50%,
                transparent 75%);
            animation: scan 4s linear infinite;
        }

        @keyframes scan {
            0% { transform: translate(-25%, -25%) rotate(0deg); }
            100% { transform: translate(-25%, -25%) rotate(360deg); }
        }

        #progress-container {
            margin-top: 25px;
            background: #1a1a2f;
            border-radius: 8px;
            padding: 3px;
        }

        #neon-progress {
            height: 14px;
            background: linear-gradient(90deg, #29b6f6, #4caf50);
            border-radius: 6px;
            width: 0%;
            transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
        }

        #neon-progress::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(90deg,
                transparent 0%,
                rgba(255,255,255,0.2) 50%,
                transparent 100%);
            animation: shine 2s infinite;
        }

        @keyframes shine {
            0% { background-position: -200% 0; }
            100% { background-position: 200% 0; }
        }

        .pulse {
            animation: pulse 1.5s infinite;
        }

        @keyframes pulse {
            0% { filter: drop-shadow(0 0 5px #4caf50); }
            50% { filter: drop-shadow(0 0 15px #4caf50); }
            100% { filter: drop-shadow(0 0 5px #4caf50); }
        }
    </style>

    <div id="neon-manager">
        <h2 class="neon-title"> ⚡AUTO REFILL⚡</h2><hr/>

        <input type="number" class="cyber-input" id="energy-target"
               min="1" value="10" placeholder="QUANTITY">
        <button id="cyber-button">
            <span id="button-text">INITIALIZE SEQUENCE</span>
            <div id="status-led" class="pulse"></div>
        </button>
        <div id="progress-container">
            <div id="neon-progress"></div>
        </div>
        <h6 align="center"> <i> *Empty inventory before using* </i> </h6>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', guiHTML);

    // Holographic Functionality
    let isActive = false;
    let target = 0;
    let progress = 0;
    let currentTimeout = null;

    const elements = {
        button: document.getElementById('cyber-button'),
        text: document.getElementById('button-text'),
        progress: document.getElementById('neon-progress'),
        input: document.getElementById('energy-target'),
        led: document.getElementById('status-led')
    };

    async function energize() {
        if (progress >= target) {
            terminateSequence();
            return;
        }

        try {
            // Phase 1: Acquire Resource
            await fetch('https://kong.playmage.com/dream/healer?buy=mp', {
                credentials: 'include',
                headers: { 'Cache-Control': 'no-cache' },
                method: 'GET'
            });

            // Phase 2: Activate Resource
            await fetch('https://kong.playmage.com/dream/inventory?use=0', {
                credentials: 'include',
                headers: { 'Cache-Control': 'no-cache' },
                method: 'GET'
            });

            progress++;
            updateHUD();

            // Randomized cooldown (2-3.5s)
            if (isActive) {
                currentTimeout = setTimeout(
                    energize,
                    350 + Math.random() * 280
                );
            }
        } catch (error) {
            console.error('refill error:', error);
            terminateSequence();
            criticalError();
        }
    }

    function updateHUD() {
        const percent = (progress / target) * 100;
        elements.progress.style.width = `${percent}%`;
        elements.text.textContent = `refilling ${Math.round(percent)}%`;
        elements.led.style.background = `hsl(${percent * 1.2}, 80%, 50%)`;
    }

    function criticalError() {
        elements.button.style.background = '#e53935';
        elements.text.textContent = 'SYSTEM FAILURE';
        elements.led.style.background = '#e53935';
        setTimeout(resetUI, 2000);
    }

    function terminateSequence() {
        isActive = false;
        clearTimeout(currentTimeout);
        elements.text.textContent = 'SEQUENCE COMPLETE';
        elements.led.classList.add('pulse');
        setTimeout(resetUI, 2000);
    }

    function resetUI() {
        elements.button.style.background = 'linear-gradient(135deg, #29b6f6 0%, #1565c0 100%)';
        elements.text.textContent = 'INITIALIZE SEQUENCE';
        elements.led.style.background = '#29b6f6';
        elements.led.classList.remove('pulse');
    }

    elements.button.addEventListener('click', () => {
        if (!isActive) {
            target = parseInt(elements.input.value);
            if (target > 0) {
                isActive = true;
                progress = 0;
                elements.led.classList.remove('pulse');
                elements.button.style.background = '#4caf50';
                energize();
            }
        }
    });
})();
