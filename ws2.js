const { firefox } = require('playwright');

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
                    console.log(`WebSocket frame sent to ${url}: ${data}`);
                } else {
                    console.log(`WebSocket frame sent to ${url}: ${data.toString('hex')}`);
                }
            });

            ws.on('framereceived', event => {
                let data = event.payload;
                if (typeof data === 'string') {
                    console.log(`WebSocket frame received from ${url}: ${data}`);
                } else {
                    console.log(`WebSocket frame received from ${url}: ${data.toString('hex')}`);
                }
            });

            ws.on('close', () => {
                console.log(`WebSocket closed: ${url}`);
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
