const { firefox } = require('playwright');
const { WebhookClient } = require('discord.js');
const fs = require('fs');
const WebSocket = require('ws');

const startTime = Date.now();
const characterLimit = 1900;

const webhookId = '1248718355620302949';
const webhookToken = 'qPTecJDSZ_8U4S_V6SvlkWjYkloX4kCY7Ej1JI_pyaCwmEbH-c2B-wVhN_uNvfYMMVUk';

const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });

function formatMessage(timestamp, url, data) {
    const formattedTimestamp = `${timestamp.toFixed(3)} s`;
    const formattedData = data.toString('hex').match(/.{1,2}/g).join(' '); // Hexadecimal format'a dönüştür
    return `${formattedTimestamp} WebSocket frame received from ${url}: ${formattedData}`;
}

(async () => {
    const targetWebSocketUrls = [
        "wss://territorial.io/s52/",
        "wss://npfp3p.territorial.io/s52/",
        "wss://zpb5n9.territorial.io/s52/",
        "wss://r1fx7d.territorial.io/s52/",
        "wss://3dn5v5.territorial.io/s52/",
        "wss://territorial.io/i31/",
        "wss://territorial.io/i32/",
        "wss://territorial.io/i33/",
        "wss://territorial.io/i34/"
    ];

    const browser = await firefox.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Kullanıcı adını depolamak için bir değişken
    let userName = '';

    page.on('websocket', async ws => {
        const url = ws.url();
        if (targetWebSocketUrls.includes(url)) {
            console.log(`WebSocket created: ${url}`);

            ws.on('framesent', event => {
                let data = event.payload;
                if (typeof data === 'string') {
                    console.log(`${(Date.now() - startTime) / 1000} s WebSocket frame sent to ${url}: ${data}`);
                } else {
                    console.log(`${(Date.now() - startTime) / 1000} s WebSocket frame sent to ${url}: ${data.toString('hex')}`);
                }

                const message = formatMessage((Date.now() - startTime) / 1000, url, data);
                sendDiscordMessage(message);
            });

            ws.on('framereceived', event => {
                let data = event.payload;
                if (typeof data === 'string') {
                    console.log(`${(Date.now() - startTime) / 1000} s WebSocket frame received from ${url}: ${data}`);
                } else {
                    console.log(`${(Date.now() - startTime) / 1000} s WebSocket frame received from ${url}: ${data.toString('hex')}`);
                }

                const message = formatMessage((Date.now() - startTime) / 1000, url, data);
                sendDiscordMessage(message);
            });

            ws.on('close', () => {
                console.log(`${(Date.now() - startTime) / 1000} s WebSocket closed: ${url}`);
                // Kullanıcının adını kontrol ederek bağlantıyı kapatma
                if (userName !== 'shellbee') {
                    ws.close();
                }
            });

            // Kullanıcı adını almak için bir JavaScript kodunu çalıştırma
            userName = await page.evaluate(() => {
                // Kullanıcı adını burada alabilirsiniz, örneğin bir HTML elementinden veya bir JavaScript nesnesinden
                return 'kullanıcı_adı';
            });
        }
    });

    await page.goto('https://territorial.io');
    await page.waitForTimeout(5000);

    // Kapatma butonunu eklemek ve bu butona tıklamada doğrulama eklemek
    await page.evaluate(() => {
        const button = document.createElement('button');
        button.textContent = 'Bağlantıyı Kapat';
        button.style.position = 'fixed';
        button.style.top = '50px';
        button.style.right = '50px';
        button.style.backgroundColor = 'red';
        button.style.color = 'white';
        button.style.padding = '10px';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        document.body.appendChild(button);

        button.addEventListener('click', () => {
            // Kapatma işlemini yalnızca belirli bir doğrulama yapıldığında gerçekleştirin
            // Burada doğrulama yapabilirsiniz, örneğin bir onay kutusu veya şifre doğrulaması ekleyebilirsiniz
            // Şu anda, örnek olarak bir onay kutusu kullanıyoruz
            const confirmation = confirm('Bağlantıyı kapatmak istediğinize emin misiniz?');
            if (confirmation) {
                // WebSocket bağlantısını kapatma yerine, kullanıcıya bir mesaj gönderebilir veya işlem yapabilirsiniz
                alert('WebSocket bağlantısı kapatıldı.');
            }
        });
    });

    // WebSocket bağlantısını kapatmadan önce 08 hexadecimal kodunu gönderme
    setInterval(() => {
        const ws = new WebSocket('wss://npfp3p.territorial.io/s52/');
        ws.on('open', () => {
            const message = '08'; // Göndermek istediğiniz hexadecimal mesaj
            ws.send(message);
            console.log(`Sent 08 hexadecimal code to WebSocket: wss://npfp3p.territorial.io/s52/`);
        });
    }, 5000); // Her 5 saniyede bir 08 hexadecimal kodunu gönder

})();

function sendDiscordMessage(message) {
    if (message.length > characterLimit) {
        fs.appendFile('discord_messages.txt', message + '\n', (err) => {
            if (err) throw err;
            console.log('Message written to file.');
        });
    } else {
        webhookClient.send(message);
    }
}
