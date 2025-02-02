const express = require('express');
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const QRCode = require('qrcode');
const cors = require('cors');
const qrcode = require('qrcode-terminal');

const app = express();
app.use(express.json());
app.use(cors());

console.log('Iniciando servidor...');

let sock = null;
let qrCode = null;

// Função para formatar número de telefone
function formatPhoneNumber(number) {
    try {
        // Remove todos os caracteres não numéricos
        let cleaned = number.replace(/\D/g, '');

        // Se o número não começar com 55 (código do Brasil), adiciona
        if (!cleaned.startsWith('55')) {
            cleaned = '55' + cleaned;
        }

        // Se o número começar com 0 depois do 55, remove o 0
        if (cleaned.length > 2 && cleaned.charAt(2) === '0') {
            cleaned = cleaned.substring(0, 2) + cleaned.substring(3);
        }

        // Garante que o número tem o formato correto (55 + DDD + número)
        // Exemplo: 5511999999999
        if (cleaned.length < 12 || cleaned.length > 13) {
            throw new Error(`Número de telefone inválido: ${cleaned}. Deve ter entre 12 e 13 dígitos incluindo o código do país (55)`);
        }

        // Verifica se o número tem exatamente 12 dígitos (sem o 9)
        if (cleaned.length === 12) {
            // Adiciona o 9 depois do DDD
            cleaned = cleaned.substring(0, 4) + '9' + cleaned.substring(4);
        }

        console.log('Número formatado:', cleaned);
        return cleaned;
    } catch (error) {
        console.error('Erro ao formatar número:', error);
        throw error;
    }
}

// Função para adicionar @s.whatsapp.net ao número
function formatWhatsAppId(number) {
    const cleaned = formatPhoneNumber(number);
    return `${cleaned}@s.whatsapp.net`;
}

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
            printQRInTerminal: true,
            defaultQueryTimeoutMs: undefined,
        });

        // Eventos de conexão
        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;
            
            if (qr) {
                try {
                    // Gera a URL do QR code
                    qrCode = await QRCode.toDataURL(qr);
                    console.log('QR Code gerado com sucesso');
                } catch (err) {
                    console.error('Erro ao gerar QR code:', err);
                    qrCode = null;
                }
            }

            if (connection === 'close') {
                const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
                console.log('Conexão fechada devido a', lastDisconnect?.error, 'Reconectando:', shouldReconnect);
                
                if (shouldReconnect) {
                    connectToWhatsApp();
                }
            } else if (connection === 'open') {
                console.log('Conectado ao WhatsApp!');
                qrCode = null;
            }

            console.log('Status da conexão:', connection, 'QR:', qr ? 'Disponível' : 'Não disponível');
        });

        // Salvar credenciais quando atualizadas
        sock.ev.on('creds.update', saveCreds);
    } catch (error) {
        console.error('Erro ao conectar ao WhatsApp:', error);
        throw error;
    }
}

// Conectar ao WhatsApp ao iniciar
connectToWhatsApp();

// Rota para verificar status
app.get('/status', authenticateApiKey, async (req, res) => {
    try {
        if (!sock) {
            return res.status(500).json({ 
                isReady: false, 
                qrCode: null,
                error: 'WhatsApp não inicializado' 
            });
        }

        const isReady = sock.user != null;

        // Se não estiver pronto e não tiver QR code, tenta reconectar
        if (!isReady && !qrCode) {
            await connectToWhatsApp();
        }

        res.json({ 
            isReady, 
            qrCode: !isReady ? qrCode : null 
        });
    } catch (error) {
        console.error('Erro ao verificar status:', error);
        res.status(500).json({ 
            isReady: false, 
            qrCode: null,
            error: error.message 
        });
    }
});

// Rota para criar um grupo
app.post('/group/create', authenticateApiKey, async (req, res) => {
    try {
        const { subject, participants } = req.body;

        if (!subject) {
            throw new Error('O nome do grupo é obrigatório');
        }

        if (!Array.isArray(participants) || participants.length === 0) {
            throw new Error('A lista de participantes é obrigatória e deve conter pelo menos um número');
        }

        // Formata os números dos participantes
        const formattedParticipants = participants.map(p => {
            try {
                const formattedNumber = formatWhatsAppId(p);
                console.log(`Número original: ${p}, Formatado: ${formattedNumber}`);
                return formattedNumber;
            } catch (error) {
                console.error(`Erro ao formatar número ${p}:`, error);
                throw error;
            }
        });

        console.log('Participantes formatados:', formattedParticipants);

        // Verifica se o WhatsApp está conectado
        if (!sock || !sock.user) {
            throw new Error('WhatsApp não está conectado. Por favor, escaneie o QR code');
        }

        console.log('Criando grupo com:', {
            subject,
            participants: formattedParticipants
        });

        const group = await sock.groupCreate(subject, formattedParticipants);
        console.log('Resposta da criação do grupo:', group);

        if (!group || !group.id) {
            throw new Error('Falha ao criar grupo: resposta inválida');
        }

        let inviteCode;
        try {
            inviteCode = await sock.groupInviteCode(group.id);
            console.log('Código de convite:', inviteCode);
        } catch (error) {
            console.error('Erro ao gerar código de convite:', error);
            // Não vamos falhar se não conseguir gerar o convite
        }

        res.json({
            id: group.id,
            inviteLink: inviteCode ? `https://chat.whatsapp.com/${inviteCode}` : undefined,
            qrCode: null
        });
    } catch (error) {
        console.error('Erro ao criar grupo:', error);
        res.status(500).json({ 
            error: error.name || 'bad-request',
            details: error.message || 'Erro desconhecido'
        });
    }
});

// Rota para enviar mensagem
app.post('/message/text', authenticateApiKey, async (req, res) => {
    if (!sock || !sock.user) {
        return res.status(503).json({ error: 'WhatsApp client not ready' });
    }

    try {
        const { number, textMessage, options } = req.body;
        console.log('Enviando mensagem:', { number, textMessage, options });

        // Formata o número
        const formattedNumber = formatWhatsAppId(number);
        const jid = formattedNumber;

        console.log('Número formatado:', jid);

        const result = await sock.sendMessage(jid, { text: textMessage }, options);
        console.log('Mensagem enviada:', result);

        res.json(result);
    } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
        res.status(500).json({ 
            error: error.message || 'Internal Server Error',
            details: error.stack
        });
    }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
