import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

// Traducciones
const translations = {
  es: {
    // Dashboard
    dashboard: {
      title: '📊 Panel de Control',
      subtitle: 'Monitorea el rendimiento de tu Voice AI Agent y gestiona las operaciones',
      backendConnected: 'Backend Conectado',
      backendDisconnected: 'Backend Desconectado',
      realTimeData: 'Datos en tiempo real del backend Python',
      fallbackData: 'Usando datos de respaldo',
      refresh: 'Actualizar',
      quickActions: '🚀 Acciones Rápidas',
      recentActivity: '📈 Actividad Reciente',
      systemStatus: '🔧 Estado del Sistema',
      startNewCall: 'Iniciar Nueva Llamada',
      startNewCallDesc: 'Iniciar una sesión de llamada de prueba',
      configureAgent: 'Configurar Agente',
      configureAgentDesc: 'Personalizar voz y comportamiento',
      viewAnalytics: 'Ver Analíticas',
      viewAnalyticsDesc: 'Métricas detalladas de rendimiento',
      systemSettings: 'Configuración del Sistema',
      systemSettingsDesc: 'Gestionar integraciones y claves API',
      callStarted: 'Llamada Iniciada',
      callStartedDesc: 'Llamada entrante de +1 (555) 123-4567',
      languageSwitch: 'Cambio de Idioma',
      languageSwitchDesc: 'Cambió de español a inglés',
      callEnded: 'Llamada Terminada',
      callEndedDesc: 'Llamada con +1 (555) 987-6543 completada',
      performanceAlert: 'Alerta de Rendimiento',
      performanceAlertDesc: 'Tiempo de respuesta excedió el umbral de 500ms',
      minutesAgo: 'hace {count} minutos',
      online: 'En línea',
      allServicesOperational: 'Todos los servicios operativos',
      // Stats cards
      activeCalls: 'Llamadas Activas',
      activeCallsDesc: 'Actualmente en progreso',
      avgResponseTime: 'Tiempo Promedio de Respuesta',
      avgResponseTimeDesc: 'Objetivo: <500ms',
      languageSwitches: 'Cambios de Idioma',
      languageSwitchesDesc: 'Español ↔ Inglés',
      successRate: 'Tasa de Éxito',
      successRateDesc: 'Últimas 24 horas'
    },
    // Navigation
    navigation: {
      dashboard: 'Dashboard',
      builder: 'Constructor',
      phoneNumbers: 'Base de Datos',
      testing: 'Pruebas',
      deploy: 'Desplegar',
      monitor: 'Monitoreo',
      settings: 'Configuración'
    },
    // Testing Page
    testing: {
      title: '🧪 Testing & Simulación',
      subtitle: 'Prueba tu Voice AI Agent con diferentes escenarios y casos extremos',
      realPhoneTesting: '📞 Pruebas Telefónicas Reales',
      insertPhoneNumbers: 'Inserta los números telefónicos a marcar para probar el sistema',
      phoneNumber: 'Número de Teléfono',
      startRealCall: 'Iniciar Llamada Real',
      endCall: 'Terminar Llamada',
      activeCall: '📞 Llamada Activa',
      backendConnected: 'Backend conectado',
      backendDisconnected: 'Backend desconectado',
      checkingConnection: 'Verificando conexión...',
      connectionError: 'Error de conexión',
      verifyConnection: 'Verificar Conexión'
    },
    // Testing Page - Additional translations
    testingAdditional: {
      testConfiguration: 'Configuración de Prueba',
      configureParameters: 'Configura los parámetros para tus escenarios de prueba',
      testScenario: 'Escenario de Prueba',
      languageSwitching: 'Cambio de Idioma',
      stressTest: 'Prueba de Estrés (Alta Carga)',
      primaryLanguage: 'Idioma Principal',
      spanishLatam: 'Español (LATAM)',
      englishUs: 'Inglés (US)',
      spanishMexican: 'Español (Mexicano)',
      voiceType: 'Tipo de Voz',
      mexicanSpanish: 'Español Mexicano',
      colombianSpanish: 'Español Colombiano',
      argentineSpanish: 'Español Argentino',
      neutralSpanish: 'Español Neutral',
      testDuration: 'Duración de Prueba (segundos)',
      testProgress: 'Progreso de Prueba',
      testLogs: 'Registros de Prueba',
      noLogsYet: 'Aún no hay registros. Inicia una prueba para ver actualizaciones en tiempo real.',
      voiceAgentActivated: 'Voice AI Agent activado',
      languageDetectionConfidence: 'Confianza de detección de idioma: 95%'
    },
    // Deploy Page
    deploy: {
      title: '🚀 Desplegar tu Agente',
      subtitle: 'Sigue estos pasos para desplegar tu Voice AI Agent en un entorno de producción',
      deploymentChecklist: 'Lista de Verificación de Despliegue',
      prepareEnvironment: 'Preparar Entorno',
      buildApplication: 'Compilar Aplicación',
      configureEnvironment: 'Configurar Entorno',
      deployToServer: 'Desplegar al Servidor',
      setupWebhooks: 'Configurar Webhooks',
      verifyDeployment: 'Verificar Despliegue',
      startDeployment: 'Iniciar Despliegue',
      deploymentStatus: 'Estado del Despliegue',
      environment: 'Entorno',
      region: 'Región',
      instanceType: 'Tipo de Instancia',
      autoScaling: 'Escalado Automático',
      healthCheck: 'Verificación de Salud',
      sslEnabled: 'SSL Habilitado',
      deploymentLogs: 'Registros de Despliegue',
      noDeploymentLogs: 'Aún no hay registros de despliegue. Inicia un despliegue para ver actividad.',
      deploymentSuccessful: 'Despliegue exitoso',
      deploymentFailed: 'Despliegue fallido'
    },
    // Monitor Page
    monitor: {
      title: '📈 Monitoreo en Tiempo Real',
      subtitle: 'Monitorea el rendimiento y la actividad en vivo de tu Voice AI Agent',
      activeCalls: 'Llamadas Activas',
      averageResponseTime: 'Tiempo Promedio de Respuesta',
      successRate: 'Tasa de Éxito',
      languageSwitches: 'Cambios de Idioma',
      callId: 'ID de Llamada',
      duration: 'Duración',
      language: 'Idioma',
      status: 'Estado',
      connecting: 'Conectando',
      active: 'Activa',
      recentActivity: 'Actividad Reciente',
      performanceMetrics: 'Métricas de Rendimiento',
      systemStatus: 'Estado del Sistema',
      allSystemsOperational: 'Todos los sistemas operativos',
      lastUpdated: 'Última actualización',
      minutesAgo: 'hace {count} minutos',
      hoursAgo: 'hace {count} horas'
    },
    // Settings Page
    settings: {
      title: '⚙️ Configuración del Sistema',
      subtitle: 'Gestiona tus claves API, configuraciones del sistema y preferencias',
      apiKeys: 'Claves API',
      twilioAccountSid: 'Twilio Account SID',
      twilioAuthToken: 'Twilio Auth Token',
      elevenLabsApiKey: 'ElevenLabs API Key',
      deepgramApiKey: 'Deepgram API Key',
      openaiApiKey: 'OpenAI API Key',
      twilioAccountSidHelper: 'Tu Twilio Account SID desde la Consola de Twilio',
      twilioAuthTokenHelper: 'Tu Twilio Auth Token desde la Consola de Twilio',
      showApiKeys: 'Mostrar',
      hideApiKeys: 'Ocultar',
      testConnections: 'Probar Conexiones',
      testing: 'Probando...',
      systemSettings: 'Configuración del Sistema',
      enableLogging: 'Habilitar Registro',
      enableAnalytics: 'Habilitar Analíticas',
      enableNotifications: 'Habilitar Notificaciones',
      enableAutoBackup: 'Habilitar Respaldo Automático',
      backupFrequency: 'Frecuencia de Respaldo',
      daily: 'Diario',
      weekly: 'Semanal',
      monthly: 'Mensual',
      testAllConnections: 'Probar Todas las Conexiones',
      saveSettings: 'Guardar Configuración',
      settingsSavedSuccessfully: 'Configuración guardada exitosamente',
      connectionTestSuccessful: 'Prueba de conexión exitosa',
      connectionTestFailed: 'Prueba de conexión fallida',
      testConnectionsHelper: 'Haz clic en "Probar Conexiones" para verificar que tus claves API funcionan correctamente.'
    },
    // Database Page
    phoneNumbers: {
      title: 'Base de Datos',
      subtitle: 'Gestiona y organiza los números telefónicos para tus llamadas automáticas',
      totalNumbers: 'Total de Números',
      refresh: 'Actualizar',
      addNumber: 'Agregar Número',
      name: 'Nombre',
      phoneNumber: 'Número Telefónico',
      type: 'Tipo',
      location: 'Ubicación',
      tags: 'Etiquetas',
      lastCalled: 'Última Llamada',
      actions: 'Acciones',
      personal: 'Personal',
      business: 'Empresarial',
      neverCalled: 'Nunca',
      call: 'Llamar',
      edit: 'Editar',
      delete: 'Eliminar',
      editNumber: 'Editar Número',
      cancel: 'Cancelar',
      save: 'Guardar',
      noNumbers: 'No hay números telefónicos registrados'
    },
    // Builder Page
    builder: {
      title: 'Constructor de Agente',
      subtitle: 'Configura el comportamiento, voz y capacidades de tu Voice AI Agent',
      saveConfiguration: 'Guardar Configuración',
      testConfiguration: 'Probar Configuración',
      basicSettings: 'Configuración Básica',
      agentName: 'Nombre del Agente',
      description: 'Descripción',
      primaryLanguage: 'Idioma Principal',
      secondaryLanguage: 'Idioma Secundario',
      languageSettings: 'Configuración de Idioma',
      autoLanguageDetection: 'Detección Automática de Idioma',
      languageSwitchThreshold: 'Umbral de Cambio de Idioma',
      languageSwitchThresholdDesc: 'Un umbral más alto requiere más confianza para cambiar idiomas',
      spanish: 'Español (es-LA)',
      english: 'Inglés (en-US)',
      autoSwitch: 'Cambio Automático',
      voiceSettings: 'Configuración de Voz',
      ttsVoice: 'Voz TTS',
      speechRate: 'Velocidad del Habla',
      voiceClarity: 'Claridad de Voz',
      sttSettings: 'Configuración de Voz a Texto',
      sttModel: 'Modelo STT',
      enablePunctuation: 'Habilitar Puntuación',
      profanityFilter: 'Filtro de Palabras Vulgares',
      sttWarning: 'Los modelos de mayor precisión pueden aumentar la latencia',
      aiModelSettings: 'Configuración del Modelo de IA',
      llmModel: 'Modelo LLM',
      maxTokens: 'Tokens Máximos',
      tokens: 'tokens',
      temperature: 'Temperatura',
      systemPrompt: 'Prompt del Sistema',
      systemPromptDesc: 'Define la personalidad y comportamiento del agente de IA',
      performanceSettings: 'Configuración de Rendimiento',
      targetLatency: 'Latencia Objetivo',
      voicemailThreshold: 'Umbral de Buzón de Voz',
      enableInterruptionHandling: 'Habilitar Manejo de Interrupciones',
      voicemailDetection: 'Detección de Buzón de Voz',
      mexicanSlangDetection: 'Detección de Jerga Mexicana',
      audioQualityAnalysis: 'Análisis de Calidad de Audio'
    }
  },
  en: {
    // Dashboard
    dashboard: {
      title: '📊 Dashboard',
      subtitle: 'Monitor your Voice AI Agent performance and manage operations',
      backendConnected: 'Backend Connected',
      backendDisconnected: 'Backend Disconnected',
      realTimeData: 'Real-time data from Python backend',
      fallbackData: 'Using fallback data',
      refresh: 'Refresh',
      quickActions: '🚀 Quick Actions',
      recentActivity: '📈 Recent Activity',
      systemStatus: '🔧 System Status',
      startNewCall: 'Start New Call',
      startNewCallDesc: 'Initiate a test call session',
      configureAgent: 'Configure Agent',
      configureAgentDesc: 'Customize voice and behavior',
      viewAnalytics: 'View Analytics',
      viewAnalyticsDesc: 'Detailed performance metrics',
      systemSettings: 'System Settings',
      systemSettingsDesc: 'Manage integrations and API keys',
      callStarted: 'Call Started',
      callStartedDesc: 'Incoming call from +1 (555) 123-4567',
      languageSwitch: 'Language Switch',
      languageSwitchDesc: 'Switched from Spanish to English',
      callEnded: 'Call Ended',
      callEndedDesc: 'Call with +1 (555) 987-6543 completed',
      performanceAlert: 'Performance Alert',
      performanceAlertDesc: 'Response time exceeded 500ms threshold',
      minutesAgo: '{count} minutes ago',
      online: 'Online',
      allServicesOperational: 'All services operational',
      // Stats cards
      activeCalls: 'Active Calls',
      activeCallsDesc: 'Currently in progress',
      avgResponseTime: 'Avg Response Time',
      avgResponseTimeDesc: 'Target: <500ms',
      languageSwitches: 'Language Switches',
      languageSwitchesDesc: 'Spanish ↔ English',
      successRate: 'Success Rate',
      successRateDesc: 'Last 24 hours'
    },
    // Navigation
    navigation: {
      dashboard: 'Dashboard',
      builder: 'Builder',
      phoneNumbers: 'Database',
      testing: 'Testing',
      deploy: 'Deploy',
      monitor: 'Monitor',
      settings: 'Settings'
    },
    // Layout
    layout: {
      appTitle: 'Voice AI Agent',
      appSubtitle: 'Professional Voice AI Platform'
    },
    // Testing Page
    testing: {
      title: '🧪 Testing & Simulation',
      subtitle: 'Test your Voice AI Agent with various scenarios and edge cases',
      realPhoneTesting: '📞 Real Phone Testing',
      insertPhoneNumbers: 'Insert phone numbers to call for testing the system',
      phoneNumber: 'Phone Number',
      startRealCall: 'Start Real Call',
      endCall: 'End Call',
      activeCall: '📞 Active Call',
      backendConnected: 'Backend connected',
      backendDisconnected: 'Backend disconnected',
      checkingConnection: 'Checking connection...',
      connectionError: 'Connection error',
      verifyConnection: 'Verify Connection'
    },
    // Builder Page
    builder: {
      title: 'Agent Builder',
      subtitle: 'Configure your Voice AI Agent\'s behavior, voice, and capabilities',
      saveConfiguration: 'Save Configuration',
      testConfiguration: 'Test Configuration',
      basicSettings: 'Basic Settings',
      agentName: 'Agent Name',
      description: 'Description',
      primaryLanguage: 'Primary Language',
      secondaryLanguage: 'Secondary Language',
      languageSettings: 'Language Settings',
      autoLanguageDetection: 'Auto Language Detection',
      languageSwitchThreshold: 'Language Switch Threshold',
      languageSwitchThresholdDesc: 'Higher threshold requires more confidence to switch languages',
      spanish: 'Spanish (es-LA)',
      english: 'English (en-US)',
      autoSwitch: 'Auto-switch',
      voiceSettings: 'Voice Settings',
      ttsVoice: 'TTS Voice',
      speechRate: 'Speech Rate',
      voiceClarity: 'Voice Clarity',
      sttSettings: 'Speech-to-Text Settings',
      sttModel: 'STT Model',
      enablePunctuation: 'Enable Punctuation',
      profanityFilter: 'Profanity Filter',
      sttWarning: 'Higher accuracy models may increase latency',
      aiModelSettings: 'AI Language Model Settings',
      llmModel: 'LLM Model',
      maxTokens: 'Max Tokens',
      tokens: 'tokens',
      temperature: 'Temperature',
      systemPrompt: 'System Prompt',
      systemPromptDesc: 'Define the AI agent\'s personality and behavior',
      performanceSettings: 'Performance Settings',
      targetLatency: 'Target Latency',
      voicemailThreshold: 'Voicemail Threshold',
      enableInterruptionHandling: 'Enable Interruption Handling',
      voicemailDetection: 'Voicemail Detection',
      mexicanSlangDetection: 'Mexican Slang Detection',
      audioQualityAnalysis: 'Audio Quality Analysis'
    },
    // Testing Page - Additional translations
    testingAdditional: {
      testConfiguration: 'Test Configuration',
      configureParameters: 'Configure the parameters for your test scenarios',
      testScenario: 'Test Scenario',
      languageSwitching: 'Language Switching',
      stressTest: 'Stress Test (High Load)',
      primaryLanguage: 'Primary Language',
      spanishLatam: 'Spanish (LATAM)',
      englishUs: 'English (US)',
      spanishMexican: 'Spanish (Mexican)',
      voiceType: 'Voice Type',
      mexicanSpanish: 'Mexican Spanish',
      colombianSpanish: 'Colombian Spanish',
      argentineSpanish: 'Argentine Spanish',
      neutralSpanish: 'Neutral Spanish',
      testDuration: 'Test Duration (seconds)',
      testProgress: 'Test Progress',
      testLogs: 'Test Logs',
      noLogsYet: 'No logs yet. Start a test to see real-time updates.',
      voiceAgentActivated: 'Voice AI Agent activated',
      languageDetectionConfidence: 'Language detection confidence: 95%'
    },
    // Deploy Page
    deploy: {
      title: '🚀 Deploy Your Agent',
      subtitle: 'Follow these steps to deploy your Voice AI Agent to a production environment',
      deploymentChecklist: 'Deployment Checklist',
      prepareEnvironment: 'Prepare Environment',
      buildApplication: 'Build Application',
      configureEnvironment: 'Configure Environment',
      deployToServer: 'Deploy to Server',
      setupWebhooks: 'Set up Webhooks',
      verifyDeployment: 'Verify Deployment',
      startDeployment: 'Start Deployment',
      deploymentStatus: 'Deployment Status',
      environment: 'Environment',
      region: 'Region',
      instanceType: 'Instance Type',
      autoScaling: 'Auto Scaling',
      healthCheck: 'Health Check',
      sslEnabled: 'SSL Enabled',
      deploymentLogs: 'Deployment Logs',
      noDeploymentLogs: 'No deployment logs yet. Start a deployment to see activity.',
      deploymentSuccessful: 'Deployment successful',
      deploymentFailed: 'Deployment failed'
    },
    // Monitor Page
    monitor: {
      title: '📈 Real-time Monitoring',
      subtitle: 'Monitor the live performance and activity of your Voice AI Agent',
      activeCalls: 'Active Calls',
      averageResponseTime: 'Average Response Time',
      successRate: 'Success Rate',
      languageSwitches: 'Language Switches',
      callId: 'Call ID',
      duration: 'Duration',
      language: 'Language',
      status: 'Status',
      connecting: 'Connecting',
      active: 'Active',
      recentActivity: 'Recent Activity',
      performanceMetrics: 'Performance Metrics',
      systemStatus: 'System Status',
      allSystemsOperational: 'All systems operational',
      lastUpdated: 'Last updated',
      minutesAgo: '{count} minutes ago',
      hoursAgo: '{count} hours ago'
    },
    // Settings Page
    settings: {
      title: '⚙️ System Settings',
      subtitle: 'Manage your API keys, system configurations, and preferences',
      apiKeys: 'API Keys',
      twilioAccountSid: 'Twilio Account SID',
      twilioAuthToken: 'Twilio Auth Token',
      elevenLabsApiKey: 'ElevenLabs API Key',
      deepgramApiKey: 'Deepgram API Key',
      openaiApiKey: 'OpenAI API Key',
      twilioAccountSidHelper: 'Your Twilio Account SID from the Twilio Console',
      twilioAuthTokenHelper: 'Your Twilio Auth Token from the Twilio Console',
      showApiKeys: 'Show',
      hideApiKeys: 'Hide',
      testConnections: 'Test Connections',
      testing: 'Testing...',
      systemSettings: 'System Settings',
      enableLogging: 'Enable Logging',
      enableAnalytics: 'Enable Analytics',
      enableNotifications: 'Enable Notifications',
      enableAutoBackup: 'Enable Auto Backup',
      backupFrequency: 'Backup Frequency',
      daily: 'Daily',
      weekly: 'Weekly',
      monthly: 'Monthly',
      testAllConnections: 'Test All Connections',
      saveSettings: 'Save Settings',
      settingsSavedSuccessfully: 'Settings saved successfully',
      connectionTestSuccessful: 'Connection test successful',
      connectionTestFailed: 'Connection test failed',
      testConnectionsHelper: 'Click "Test Connections" to verify your API keys are working correctly.'
    },
    // Database Page
    phoneNumbers: {
      title: 'Database',
      subtitle: 'Manage and organize phone numbers for your automated calls',
      totalNumbers: 'Total Numbers',
      refresh: 'Refresh',
      addNumber: 'Add Number',
      name: 'Name',
      phoneNumber: 'Phone Number',
      type: 'Type',
      location: 'Location',
      tags: 'Tags',
      lastCalled: 'Last Called',
      actions: 'Actions',
      personal: 'Personal',
      business: 'Business',
      neverCalled: 'Never',
      call: 'Call',
      edit: 'Edit',
      delete: 'Delete',
      editNumber: 'Edit Number',
      cancel: 'Cancel',
      save: 'Save',
      noNumbers: 'No phone numbers registered'
    }
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Cargar idioma desde localStorage o usar español por defecto
    return localStorage.getItem('selectedLanguage') || 'es';
  });

  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
    localStorage.setItem('selectedLanguage', newLanguage);
  };

  const t = (key, params = {}) => {
    const keys = key.split('.');
    let translation = translations[language];
    
    for (const k of keys) {
      translation = translation?.[k];
    }
    
    if (!translation) {
      console.warn(`Translation missing for key: ${key}`);
      return key;
    }
    
    // Reemplazar parámetros en la traducción
    if (typeof translation === 'string') {
      return translation.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param] || match;
      });
    }
    
    return translation;
  };

  const value = {
    language,
    changeLanguage,
    t,
    languages: [
      { code: 'es', name: 'Español', flag: '🇪🇸' },
      { code: 'en', name: 'English', flag: '🇺🇸' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
