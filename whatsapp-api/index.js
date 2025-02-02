const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');

const app = express();
app.use(express.json());

console.log('Iniciando servidor...');

let sock = null;
let qrCodeDataUrl = null;
let isReady = false;

// Middleware para verificar a chave API
const authenticateApiKey = (req, res, next) => {
    const apiKey = req.headers['apikey'];
    if (apiKey !== process.env.API_KEY) {
        return res.status(401).json({ error: 'Invalid API Key' });
    }
    next();
};

// Função para conectar ao WhatsApp
async function connectToWhatsApp() {
    try {
        const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
        
        sock = makeWASocket({
            auth: state,
            printQRInTerminal: true
        });

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                console.log('QR Code recebido');
                try {
                    qrCodeDataUrl = await QRCode.toDataURL(qr);
                    isReady = false;
                } catch (err) {
                    console.error('Erro ao gerar QR code:', err);
                }
            }

            if (connection === 'close') {
                const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log('Conexão fechada devido a', lastDisconnect.error, 'Reconectando:', shouldReconnect);
                if (shouldReconnect) {
                    connectToWhatsApp();
                }
            } else if (connection === 'open') {
                console.log('WhatsApp conectado!');
                isReady = true;
                qrCodeDataUrl = null;
            }
        });

        sock.ev.on('creds.update', saveCreds);
    } catch (err) {
        console.error('Erro ao conectar:', err);
        setTimeout(connectToWhatsApp, 5000);
    }
}

// Rota para a página inicial
app.get('/', (req, res) => {
    console.log('Página inicial acessada');
    res.send(`
        <html>
            <head>
                <title>WhatsApp API - QR Code</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                        background-color: #f0f2f5;
                    }
                    .container {
                        text-align: center;
                        padding: 20px;
                        background-color: white;
                        border-radius: 10px;
                        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                    }
                    #qrcode {
                        margin: 20px 0;
                    }
                    #qrcode img {
                        max-width: 300px;
                    }
                    .status {
                        margin: 10px 0;
                        padding: 10px;
                        border-radius: 5px;
                    }
                    .connected {
                        background-color: #e7f3e5;
                        color: #2e7d32;
                    }
                    .waiting {
                        background-color: #fff3e0;
                        color: #e65100;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>WhatsApp API</h1>
                    <div id="status" class="${isReady ? 'status connected' : 'status waiting'}">
                        ${isReady ? 'WhatsApp Conectado!' : 'Aguardando escaneamento do QR Code...'}
                    </div>
                    <div id="qrcode"></div>
                </div>
                <script>
                    function updateQRCode() {
                        console.log('Atualizando QR Code...');
                        fetch('/qrcode')
                            .then(response => response.json())
                            .then(data => {
                                console.log('Dados recebidos:', data);
                                const qrcodeDiv = document.getElementById('qrcode');
                                const statusDiv = document.getElementById('status');
                                
                                if (data.connected) {
                                    qrcodeDiv.innerHTML = '';
                                    statusDiv.className = 'status connected';
                                    statusDiv.textContent = 'WhatsApp Conectado!';
                                } else if (data.qrCode) {
                                    qrcodeDiv.innerHTML = '<img src="' + data.qrCode + '" />';
                                    statusDiv.className = 'status waiting';
                                    statusDiv.textContent = 'Aguardando escaneamento do QR Code...';
                                }
                                
                                if (!data.connected) {
                                    setTimeout(updateQRCode, 5000);
                                }
                            })
                            .catch(error => {
                                console.error('Erro ao atualizar QR Code:', error);
                                setTimeout(updateQRCode, 5000);
                            });
                    }
                    updateQRCode();
                </script>
            </body>
        </html>
    `);
});

// Rota para obter o QR Code
app.get('/qrcode', (req, res) => {
    console.log('Solicitação de QR Code recebida');
    console.log('Status:', isReady ? 'Conectado' : 'Aguardando');
    console.log('QR Code disponível:', qrCodeDataUrl ? 'Sim' : 'Não');
    
    res.json({
        qrCode: qrCodeDataUrl,
        connected: isReady
    });
});

// Rota para criar um grupo
app.post('/group/create', authenticateApiKey, async (req, res) => {
    if (!isReady || !sock) {
        return res.status(503).json({ error: 'WhatsApp client not ready' });
    }

    const { name, participants } = req.body;
    
    try {
        const group = await sock.groupCreate(name, participants.map(p => p + '@s.whatsapp.net'));
        return res.json({ groupId: group.id });
    } catch (error) {
        console.error('Error creating group:', error);
        return res.status(500).json({ error: error.message });
    }
});

// Rota para enviar mensagem
app.post('/message/send', authenticateApiKey, async (req, res) => {
    if (!isReady || !sock) {
        return res.status(503).json({ error: 'WhatsApp client not ready' });
    }

    const { number, message } = req.body;
    
    try {
        await sock.sendMessage(number + '@s.whatsapp.net', { text: message });
        return res.json({ success: true });
    } catch (error) {
        console.error('Error sending message:', error);
        return res.status(500).json({ error: error.message });
    }
});

// Inicia o servidor
const port = process.env.PORT || 8080;
const server = app.listen(port, '0.0.0.0', () => {
    console.log(`Servidor rodando na porta ${port}`);
    connectToWhatsApp().catch(err => console.error('Erro inicial:', err));
});
