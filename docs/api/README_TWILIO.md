# 🎤 Twilio Voice AI Agent with Pipecat

A production-ready real-time voice AI agent integrated with Twilio, featuring sub-500ms latency, Mexican Spanish voice, and intelligent conversation handling.

## ✨ Features

- **🌐 Twilio Integration**: Full webhook handling with Flask
- **🎯 Real-time Voice**: Sub-500ms latency optimization
- **🇲🇽 Mexican Spanish**: Native LATAM Spanish support
- **🤖 AI-Powered**: OpenAI GPT-4o-mini integration
- **🎤 Smart STT**: Deepgram speech-to-text (es-LA)
- **🔊 Natural TTS**: ElevenLabs text-to-speech
- **⏰ Voicemail Detection**: Automatic call termination
- **🔄 Interruption Handling**: Seamless conversation flow
- **📋 Consent Collection**: GDPR-compliant call recording
- **📊 Health Monitoring**: Real-time system status

## 🚀 Quick Start

### 1. Prerequisites

- Python 3.9+
- Twilio account with phone number
- ngrok for local development
- All API keys in `.env` file

### 2. Install Dependencies

```bash
source venv/bin/activate
pip install -r requirements.txt
```

### 3. Configure Environment

Ensure your `.env` file contains:

```env
# Twilio API Credentials
TWILIO_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token

# ElevenLabs API Key
ELEVENLABS_API_KEY=your_elevenlabs_key

# Deepgram API Key
DEEPGRAM_API_KEY=your_deepgram_key

# OpenAI API Key
OPENAI_API_KEY=your_openai_key
```

### 4. Run the Agent

```bash
python twilio_voice_agent.py
```

The server will start on port 5000.

### 5. Expose with ngrok

```bash
ngrok http 5000
```

Copy the HTTPS URL for Twilio webhook configuration.

## 🔧 Twilio Configuration

### 1. Phone Number Setup

1. Go to [Twilio Console](https://console.twilio.com/)
2. Navigate to Phone Numbers → Manage → Active numbers
3. Click on your phone number
4. Set webhook URL: `https://your-ngrok-url.ngrok.io/webhook`
5. Set HTTP method: `POST`

### 2. Webhook Endpoints

- **`/webhook`**: Main Twilio webhook for incoming calls
- **`/consent-response`**: Handles user consent for recording
- **`/voice-stream`**: Real-time voice streaming endpoint
- **`/health`**: System health check

## 🎯 How It Works

### 1. Call Flow

```
📞 Incoming Call
    ↓
🔐 Consent Collection (TwiML)
    ↓
✅ User Consent
    ↓
🎤 AI Greeting (Mexican Spanish)
    ↓
🔄 Real-time Conversation
    ↓
📞 Call End (or Voicemail Detection)
```

### 2. Voice Processing Pipeline

```
🎤 User Speech → Deepgram STT → OpenAI LLM → ElevenLabs TTS → 🔊 Audio Output
```

### 3. Interruption Handling

- **User starts speaking**: TTS automatically stops
- **Seamless transition**: No audio overlap
- **Context preservation**: Conversation history maintained

### 4. Voicemail Detection

- **Silence threshold**: 3 seconds of no speech
- **Automatic termination**: Prevents wasted resources
- **Smart detection**: Only when AI is not speaking

## 📱 TwiML Examples

### Consent Collection

```xml
<Response>
    <Say language="es-MX">Esta llamada puede grabarse para calidad. ¿Deseas continuar?</Say>
    <Gather input="speech" language="es-MX" speechTimeout="auto" action="/consent-response" method="POST">
        <Say language="es-MX">Por favor responde sí o no.</Say>
    </Gather>
    <Say language="es-MX">No se recibió respuesta. Llamada terminada.</Say>
</Response>
```

### AI Greeting

```xml
<Response>
    <Say language="es-MX">Hola, soy tu agente AI para LATAM. ¿En qué puedo ayudarte?</Say>
    <Connect>
        <Stream url="/voice-stream"/>
    </Connect>
</Response>
```

## 🎨 Customization

### Voice Configuration

```python
# Mexican Spanish voice
self.tts_service = ElevenLabsTTSService(
    api_key=elevenlabs_key,
    voice_id="21m00Tcm4TlvDq8ikWAM",  # Mexican Spanish
    model_id="eleven_multilingual_v2"
)
```

### Language Settings

```python
# LATAM Spanish STT
self.stt_service = DeepgramSTTService(
    api_key=deepgram_key,
    language="es-LA"  # Spanish Latin America
)
```

### AI Personality

```python
# Customize AI behavior
self.llm_service = OpenAILLMService(
    api_key=openai_key,
    model="gpt-4o-mini",
    system_prompt="Eres un agente de servicio al cliente útil, responde en español mexicano, maneja casos como reservas o soporte. Sé amigable, profesional y eficiente."
)
```

## 📊 Performance Monitoring

### Latency Tracking

- **Target**: <500ms response time
- **Real-time monitoring**: Every AI response logged
- **Performance alerts**: Warnings when latency exceeds target

### Health Endpoint

```bash
curl http://localhost:5000/health
```

Response:
```json
{
    "status": "healthy",
    "timestamp": "2025-01-04T12:00:00",
    "active_calls": 2,
    "services": {
        "tts": true,
        "stt": true,
        "llm": true
    }
}
```

## 🚨 Error Handling

### Graceful Degradation

- **Service failures**: Individual service errors don't crash system
- **Call recovery**: Failed calls are logged and handled gracefully
- **Logging**: Comprehensive error logging for debugging

### Common Issues

1. **API Key Errors**: Check `.env` file and API key validity
2. **Network Issues**: Ensure stable internet connection
3. **Twilio Configuration**: Verify webhook URLs and phone number setup

## 🔒 Security Features

- **Environment variables**: API keys never hardcoded
- **Input validation**: All webhook inputs validated
- **Error sanitization**: No sensitive data in error messages
- **Rate limiting**: Built-in protection against abuse

## 📈 Scaling Considerations

### Horizontal Scaling

- **Load balancer**: Multiple instances behind nginx
- **Database**: Store call history in PostgreSQL/Redis
- **Monitoring**: Prometheus + Grafana for metrics

### Performance Optimization

- **Connection pooling**: Reuse API connections
- **Caching**: Cache common AI responses
- **Async processing**: Non-blocking I/O operations

## 🧪 Testing

### Local Testing

```bash
# Test health endpoint
curl http://localhost:5000/health

# Test with Twilio CLI
twilio phone-numbers:update +1234567890 --webhook-url=http://localhost:5000/webhook
```

### Production Testing

1. **Test calls**: Use test phone numbers
2. **Load testing**: Simulate multiple concurrent calls
3. **Error scenarios**: Test various failure modes

## 📚 API Reference

### Webhook Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/webhook` | POST | Main Twilio webhook |
| `/consent-response` | POST | Handle user consent |
| `/voice-stream` | POST | Real-time audio stream |
| `/health` | GET | System health check |

### Request Parameters

#### `/webhook`
- `CallSid`: Unique call identifier
- `From`: Caller phone number
- `To`: Recipient phone number

#### `/consent-response`
- `CallSid`: Unique call identifier
- `SpeechResult`: User's consent response

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Add tests for new functionality
4. Submit pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- **Issues**: GitHub Issues
- **Documentation**: This README
- **Community**: Pipecat Discord/Forum

## 🔮 Future Enhancements

- [ ] Multi-language support
- [ ] Sentiment analysis
- [ ] Call analytics dashboard
- [ ] Integration with CRM systems
- [ ] Advanced interruption handling
- [ ] Custom voice cloning
- [ ] Real-time transcription display

---

**Built with ❤️ using Pipecat Framework and Twilio**
