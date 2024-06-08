const { firefox } = require('playwright');
const { WebhookClient } = require('discord.js');
const fs = require('fs');

// Başlangıç zamanını tutmak için
const startTime = Date.now();

// Karakter sınırı
const characterLimit = 1900;

// Discord Webhook ID ve Token'ı
const webhookId = 'YOUR_WEBHOOK_ID';
const webhookToken = 'YOUR_WEBHOOK_TOKEN';

// Discord WebhookClient oluştur
const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });

// Mesaj formatını düzenleme işlevi
function formatMessage(timestamp, url, data) {
    const formattedTimestamp = `${timestamp.toFixed(3)} s`;
    const formattedData = data.toString('hex').match(/.{1,2}/g).join(' '); // Hexadecimal formata dönüştür
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

    page.on('websocket', ws => {
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

                // Discord Webhook'a gönder
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

                // Discord Webhook'a gönder
                const message = formatMessage((Date.now() - startTime) / 1000, url, data);
                sendDiscordMessage(message);
            });

            ws.on('close', () => {
                console.log(`${(Date.now() - startTime) / 1000} s WebSocket closed: ${url}`);
            });
        }
    });

    // İlgili web sitesine gidin
    await page.goto('https://territorial.io');

    // Sayfanın tam yüklendiğinden emin olmak için bekleyin
    await page.waitForTimeout(5000);

    // Tarayıcıyı kapatmamak için sonsuz döngüde bekletin
    await new Promise(() => {});
})();

function sendDiscordMessage(message) {
    if (message.length > characterLimit) {
        // Mesaj dosyaya yaz
        fs.appendFile('discord_messages.txt', message + '\n', (err) => {
            if (err) throw err;
            console.log('Mesaj dosyaya yazıldı.');
        });
    } else {
        // Küçük mesajlar için doğrudan Discord'a gönder
        webhookClient.send(message);
    }
}
