// API Service Layer for Voice AI Agent
// Connects React frontend to Python backend

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

class VoiceAIApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.headers = {
      'Content-Type': 'application/json',
    };
  }

  // Generic API call method
  async apiCall(endpoint, options = {}) {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config = {
        headers: this.headers,
        ...options,
      };

      const response = await fetch(url, config);

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API Call Error (${endpoint}):`, error);
      throw error;
    }
  }

  // Health Check
  async getHealth() {
    return this.apiCall('/health');
  }

  // Performance Metrics
  async getPerformanceMetrics(callId = null) {
    const endpoint = callId ? `/performance?call_id=${callId}` : '/performance';
    return this.apiCall(endpoint);
  }

  // Language Manager Status
  async getLanguageStatus() {
    return this.apiCall('/language');
  }

  // Test API Connections
  async testApiConnections(apiKeys) {
    const results = {};

    try {
      // Test OpenAI
      if (apiKeys.openai) {
        results.openai = await this.testOpenAI(apiKeys.openai);
      }

      // Test ElevenLabs
      if (apiKeys.elevenlabs) {
        results.elevenlabs = await this.testElevenLabs(apiKeys.elevenlabs);
      }

      // Test Deepgram
      if (apiKeys.deepgram) {
        results.deepgram = await this.testDeepgram(apiKeys.deepgram);
      }

      // Test Twilio
      if (apiKeys.twilio) {
        results.twilio = await this.testTwilio(apiKeys.twilio);
      }

    } catch (error) {
      console.error('API Connection Test Error:', error);
    }

    return results;
  }

  // Test OpenAI API
  async testOpenAI(apiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          status: 'success',
          message: 'OpenAI API connection successful',
          models: data.data?.length || 0,
        };
      } else {
        return {
          status: 'error',
          message: `OpenAI API error: ${response.status}`,
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: `OpenAI API connection failed: ${error.message}`,
      };
    }
  }

  // Test ElevenLabs API
  async testElevenLabs(apiKey) {
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/voices', {
        headers: {
          'xi-api-key': apiKey,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          status: 'success',
          message: 'ElevenLabs API connection successful',
          voices: data.voices?.length || 0,
        };
      } else {
        return {
          status: 'error',
          message: `ElevenLabs API error: ${response.status}`,
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: `ElevenLabs API connection failed: ${error.message}`,
      };
    }
  }

  // Test Deepgram API
  async testDeepgram(apiKey) {
    try {
      const response = await fetch('https://api.deepgram.com/v1/projects', {
        headers: {
          'Authorization': `Token ${apiKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        return {
          status: 'success',
          message: 'Deepgram API connection successful',
          projects: data.projects?.length || 0,
        };
      } else if (response.status === 401) {
        return {
          status: 'error',
          message: 'Deepgram API key is invalid or expired',
        };
      } else if (response.status === 403) {
        return {
          status: 'error',
          message: 'Deepgram account has insufficient funds or access denied',
        };
      } else if (response.status === 429) {
        return {
          status: 'error',
          message: 'Deepgram API rate limit exceeded',
        };
      } else {
        return {
          status: 'error',
          message: `Deepgram API error: ${response.status} - ${response.statusText}`,
        };
      }
    } catch (error) {
      if (error.message.includes('Load failed')) {
        return {
          status: 'error',
          message: 'Deepgram API connection failed: Check account balance and API key',
        };
      }
      return {
        status: 'error',
        message: `Deepgram API connection failed: ${error.message}`,
      };
    }
  }

  // Test Twilio API
  async testTwilio(credentials) {
    try {
      const { accountSid, authToken } = credentials;
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Calls.json`, {
        headers: {
          'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        },
      });

      if (response.ok) {
        return {
          status: 'success',
          message: 'Twilio API connection successful',
        };
      } else {
        return {
          status: 'error',
          message: `Twilio API error: ${response.status}`,
        };
      }
    } catch (error) {
      return {
        status: 'error',
        message: `Twilio API connection failed: ${error.message}`,
      };
    }
  }

  // Start Test Call
  async startTestCall(testConfig) {
    return this.apiCall('/test-call', {
      method: 'POST',
      body: JSON.stringify(testConfig),
    });
  }

  // Get Test Results
  async getTestResults(testId) {
    return this.apiCall(`/api/test/results/${testId}`);
  }

  // End Test Call
  async endTestCall(callSid) {
    return this.apiCall('/end-test-call', {
      method: 'POST',
      body: JSON.stringify({ call_sid: callSid }),
    });
  }

  // Update Agent Configuration
  async updateAgentConfig(config) {
    return this.apiCall('/api/config', {
      method: 'PUT',
      body: JSON.stringify(config),
    });
  }

  // Get Agent Configuration
  async getAgentConfig() {
    return this.apiCall('/api/config');
  }

  // Start Deployment
  async startDeployment(deploymentConfig) {
    return this.apiCall('/api/deploy', {
      method: 'POST',
      body: JSON.stringify(deploymentConfig),
    });
  }

  // Get Deployment Status
  async getDeploymentStatus(deploymentId) {
    return this.apiCall(`/api/deploy/status/${deploymentId}`);
  }

  // Get Active Calls
  async getActiveCalls() {
    return this.apiCall('/api/calls/active');
  }

  // Get Call Details
  async getCallDetails(callId) {
    return this.apiCall(`/api/calls/${callId}`);
  }

  // End Call
  async endCall(callId) {
    return this.apiCall(`/api/calls/${callId}/end`, {
      method: 'POST',
    });
  }

  // Get System Logs
  async getSystemLogs(limit = 100) {
    return this.apiCall(`/api/logs?limit=${limit}`);
  }

  // Get Analytics
  async getAnalytics(timeRange = '24h') {
    return this.apiCall(`/api/analytics?range=${timeRange}`);
  }
}

// Create singleton instance
const apiService = new VoiceAIApiService();

export default apiService;
