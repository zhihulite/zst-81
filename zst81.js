// 独立的核心逻辑函数
class ZST81Generator {
    constructor() {
        // 初始化工具函数
        this.utils = {
            random: () => Math.random(),
            randomInt: (min, max) => Math.floor(this.utils.random() * (max - min + 1)) + min,
            randomFloat: (min, max) => +(this.utils.random() * (max - min) + min).toFixed(2),
            randomHex: (length) => Array(length).fill().map(() => '0123456789abcdef'[this.utils.randomInt(0, 15)]).join(''),
            randomString: (length, chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') => 
                Array(length).fill().map(() => chars[this.utils.randomInt(0, chars.length - 1)]).join('')
        };
    }

    // 解码自定义Base64格式
    decodeCustomBase64(encodedStr) {
        const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=";
        let decodedStr = "";

        for (let i = 0; i < encodedStr.length; i += 4) {
            const char1 = encodedStr.charAt(i);
            const char2 = encodedStr.charAt(i + 1);
            const char3 = encodedStr.charAt(i + 2);
            const char4 = encodedStr.charAt(i + 3);

            const index1 = charset.indexOf(char1);
            const index2 = charset.indexOf(char2);
            const index3 = charset.indexOf(char3);
            const index4 = charset.indexOf(char4);

            const byte1 = (index1 << 2) | (index2 >>> 4);
            const byte2 = ((index2 & 15) << 4) | (index3 >>> 2);
            const byte3 = ((index3 & 3) << 6) | index4;

            decodedStr += String.fromCharCode(byte1);
            if (index3 !== 64) decodedStr += String.fromCharCode(byte2);
            if (index4 !== 64) decodedStr += String.fromCharCode(byte3);
        }

        return decodedStr;
    }

    // 使用随机密钥进行XOR加密
    xorEncryptWithRandomKey(inputStr) {
        const encryptionKey = this.utils.random().toString().substring(2, 7);
        let encryptedStr = "";

        for (let i = 0; i < inputStr.length; i++) {
            const keyCharCode = encryptionKey.charCodeAt(i % encryptionKey.length);
            const inputCharCode = inputStr.charCodeAt(i);
            encryptedStr += String.fromCharCode(keyCharCode ^ inputCharCode);
        }

        return encryptedStr;
    }

    // 自定义Base64编码
    encodeCustomBase64(inputStr) {
        const base64Charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_=";
        let encodedStr = "";

        for (let i = 0; i < inputStr.length; i += 3) {
            const byte1 = inputStr.charCodeAt(i) || 0;
            const byte2 = inputStr.charCodeAt(i + 1) || 0;
            const byte3 = inputStr.charCodeAt(i + 2) || 0;

            const enc1 = byte1 >> 2;
            const enc2 = ((byte1 & 3) << 4) | (byte2 >> 4);
            const enc3 = ((byte2 & 15) << 2) | (byte3 >> 6);
            const enc4 = byte3 & 63;

            encodedStr += base64Charset.charAt(enc1) +
                base64Charset.charAt(enc2) +
                (i + 1 < inputStr.length ? base64Charset.charAt(enc3) : '=') +
                (i + 2 < inputStr.length ? base64Charset.charAt(enc4) : '=');
        }

        return encodedStr;
    }

    // 生成加密数组
    generateEncryptedArray(inputStr) {
        const encryptedResults = [];

        for (let count = 0; count < 10; count++) {
            const decodedStr = this.decodeCustomBase64(inputStr);
            const keyPart1 = this.xorEncryptWithRandomKey("ci$2z");
            const keyPart2 = this.xorEncryptWithRandomKey(decodedStr);
            const combinedStr = keyPart1 + keyPart2;
            const encodedStr = this.encodeCustomBase64(combinedStr);
            encryptedResults.push(encodedStr);
        }

        return encryptedResults;
    }

    // 加密函数
    customEncrypt(plainText) {
        const charset = 'RuPtXwxpThIZ0qyz_9fYLCOV8B1mMGKs7UnFHgN3iDaWAJE-Qrk2ecSo6bjd4vl5';
        const unsignedRightShift = (n, shift) => n >>> shift;

        const byteArray = Array.from(plainText, char => char.charCodeAt(0));
        
        while (byteArray.length % 3 !== 0) {
            byteArray.push(0);
        }

        let result = '';
        let counter = 0;
        const shiftValues = [0, 8, 16, 24];

        for (let i = byteArray.length - 1; i >= 0; i -= 3) {
            const shift1 = shiftValues[counter % 4];
            const xor1 = (unsignedRightShift(42, shift1) & 255) ^ byteArray[i];
            let combinedValue = xor1;
            counter += 1;

            const shift2 = shiftValues[counter % 4];
            const xor2 = (unsignedRightShift(42, shift2) & 255) ^ byteArray[i - 1];
            combinedValue |= xor2 << 8;
            counter += 1;

            const shift3 = shiftValues[counter % 4];
            const xor3 = (unsignedRightShift(42, shift3) & 255) ^ byteArray[i - 2];
            combinedValue |= xor3 << 16;
            counter += 1;

            result += charset[(combinedValue >> 0) & 63];
            result += charset[(combinedValue >> 6) & 63];
            result += charset[(combinedValue >> 12) & 63];
            result += charset[(combinedValue >> 18) & 63];
        }

        return result;
    }

    // 生成设备信息
    generateDeviceInfo(userAgent) {
        return {
            color_depth: 24, dpi_x: 96, dpi_y: 96, device_pixel_ratio: this.utils.randomFloat(1, 2),
            client_rects: { 0: { x: this.utils.randomFloat(0, 20), y: this.utils.randomFloat(0, 50), width: this.utils.randomFloat(500, 1000), height: this.utils.randomFloat(50, 200) } },
            inner_height: this.utils.randomInt(600, 1080), max_touch_points: 0, outer_height: this.utils.randomInt(700, 1200),
            screen_orientation: this.utils.random() > 0.5 ? "landscape" : "portrait", screen_width: this.utils.randomInt(1200, 2000),
            screen_height: this.utils.randomInt(800, 1200), screen_vail_width: this.utils.randomInt(1200, 2000), screen_vail_heigth: this.utils.randomInt(800, 1200),
            language: "zh-CN", navigator_properties_num: this.utils.randomInt(70, 100), track: false,
            flash_enabled: false, js_enabled: true, cookie_enabled: true, touch_support: false,
            vb_enable: false, webrtc_enable: true, battery: { charging: true, chargingTime: 0, dischargingTime: null, level: 1 },
            platform: "Win32", created: Date.now(), connection_type: "wifi",
            user_agent: userAgent, websocket_enable: true, debug_enable: true, memory: this.utils.randomInt(4, 16),
            plugins: [["PDF Viewer", "Portable Document Format", [["application/pdf", "pdf"]]]],
            canvas_fp: this.utils.randomHex(32), webgl_fp: this.utils.randomHex(32), graphics: "Google Inc. (Intel)~ANGLE (Intel(R) Iris(R) Xe Graphics)",
            adblock: false, audio_fp: this.utils.randomHex(32), audio_enable: true, nonce: "", SESSIONID: this.utils.randomString(43)
        };
    }

    // 主要生成函数
    async generate(userAgent) {
        try {
            const deviceInfo = JSON.stringify(this.generateDeviceInfo(userAgent));
            const additionalInfo = JSON.stringify({ r1: userAgent, reason: "" });
            const sessionId = this.utils.randomString(43);
            const apiUrl = "https://www.zhihu.com/zbst/events/r";

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'x-zse-83': '3_2.0',
                    'Content-Type': 'application/json',
                },
                body: this.customEncrypt(`${deviceInfo}##@@$$##${additionalInfo}`),
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();

            if (responseData && responseData.nonce) {
                const nonce = responseData.nonce;
                const encryptedArray = this.generateEncryptedArray(nonce);

                const osa = encryptedArray[0];
                const osd = encryptedArray[1];
                const finalEncryptedInput = `${osa}#${osd}#${sessionId}`;

                const finalPayload = finalEncryptedInput + '##@@$$##$' + additionalInfo;
                const encryptedResult = this.customEncrypt(finalPayload);

                return encryptedResult;
            } else {
                throw new Error('生成失败 未找到nonce字段');
            }
        } catch (error) {
            throw new Error(`生成失败: ${error.message}`);
        }
    }
}

// UI 控制类
class ZST81UI {
    constructor(generator) {
        this.generator = generator;
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.bindEvents();
            this.setDefaultValues();
        });
    }

    bindEvents() {
        document.getElementById('generateBtn').addEventListener('click', () => this.handleGenerate());
    }

    setDefaultValues() {
        document.getElementById('userAgent').value = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138.0.0.0 Safari/537.36 Edg/138.0.0.0";
    }

    showStatus(message, type = 'loading') {
        const statusEl = document.getElementById('status');
        statusEl.textContent = message;
        statusEl.className = `status status-${type}`;
        statusEl.classList.remove('hidden');
    }

    hideStatus() {
        document.getElementById('status').classList.add('hidden');
    }

    showResult(result) {
        document.getElementById('resultField').value = result;
        document.getElementById('resultSection').classList.remove('hidden');
    }

    async handleGenerate() {
        const generateBtn = document.getElementById('generateBtn');
        const userAgent = document.getElementById('userAgent').value;

        if (!userAgent) {
            this.showStatus('请填写ua', 'error');
            return;
        }

        try {
            generateBtn.disabled = true;
            this.showStatus('正在生成 zst-81...');

            const result = await this.generator.generate(userAgent);
            
            this.showResult(result);
            this.showStatus('zst-81 生成成功', 'success');
        } catch (error) {
            console.error('Error:', error);
            this.showStatus(error.message, 'error');
        } finally {
            generateBtn.disabled = false;
            setTimeout(() => this.hideStatus(), 3000);
        }
    }
}