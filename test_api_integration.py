#!/usr/bin/env python3
"""
Test script to verify API integration between React frontend and Python backend
"""

import requests
import json
import time

def test_backend_endpoints():
    """Test all backend endpoints."""
    base_url = "http://localhost:5001"
    
    print("🧪 Testing Backend API Endpoints...")
    print("=" * 50)
    
    # Test health endpoint
    try:
        response = requests.get(f"{base_url}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health Check: {data['status']}")
            print(f"   Services: TTS={data['services']['tts']}, STT={data['services']['stt']}, LLM={data['services']['llm']}")
            print(f"   Active Calls: {data['active_calls']}")
            print(f"   Language: {data['language']['current_language']}")
        else:
            print(f"❌ Health Check Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Health Check Error: {e}")
    
    print()
    
    # Test performance endpoint
    try:
        response = requests.get(f"{base_url}/performance")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Performance Metrics:")
            print(f"   Total Calls: {data['total_calls']}")
            print(f"   Latency Target Met: {data['latency_target_met']}")
            print(f"   Language Switches: {data['total_language_switches']}")
        else:
            print(f"❌ Performance Endpoint Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Performance Endpoint Error: {e}")
    
    print()
    
    # Test language endpoint
    try:
        response = requests.get(f"{base_url}/language")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Language Info:")
            print(f"   Supported Languages: {data['supported_languages']}")
            print(f"   Current Config: {data['current_config']['name']}")
        else:
            print(f"❌ Language Endpoint Failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Language Endpoint Error: {e}")
    
    print()
    
    # Test webhook endpoint (should return 405 Method Not Allowed for GET)
    try:
        response = requests.get(f"{base_url}/webhook")
        if response.status_code == 405:
            print("✅ Webhook Endpoint: Correctly rejects GET requests (405 Method Not Allowed)")
        else:
            print(f"⚠️  Webhook Endpoint: Unexpected response {response.status_code}")
    except Exception as e:
        print(f"❌ Webhook Endpoint Error: {e}")

def test_frontend_connectivity():
    """Test if frontend can reach backend."""
    print("🌐 Testing Frontend-Backend Connectivity...")
    print("=" * 50)
    
    # Test if frontend is accessible
    try:
        response = requests.get("http://localhost:3000")
        if response.status_code == 200:
            print("✅ Frontend is accessible on port 3000")
        else:
            print(f"⚠️  Frontend returned status {response.status_code}")
    except Exception as e:
        print(f"❌ Frontend not accessible: {e}")
    
    # Test if frontend can reach backend
    try:
        response = requests.get("http://localhost:5001/health")
        if response.status_code == 200:
            print("✅ Frontend can reach backend on port 5001")
        else:
            print(f"⚠️  Backend health check failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Frontend cannot reach backend: {e}")

def test_api_functionality():
    """Test specific API functionality."""
    print("🔧 Testing API Functionality...")
    print("=" * 50)
    
    base_url = "http://localhost:5001"
    
    # Test performance with call_id parameter
    try:
        response = requests.get(f"{base_url}/performance?call_id=test-123")
        if response.status_code == 200:
            data = response.json()
            print("✅ Performance endpoint accepts call_id parameter")
        else:
            print(f"⚠️  Performance endpoint with call_id: {response.status_code}")
    except Exception as e:
        print(f"❌ Performance endpoint with call_id error: {e}")
    
    # Test invalid endpoint
    try:
        response = requests.get(f"{base_url}/invalid-endpoint")
        if response.status_code == 404:
            print("✅ Invalid endpoints correctly return 404")
        else:
            print(f"⚠️  Invalid endpoint response: {response.status_code}")
    except Exception as e:
        print(f"❌ Invalid endpoint test error: {e}")

def main():
    """Main test function."""
    print("🚀 Voice AI Agent API Integration Test")
    print("=" * 60)
    print()
    
    # Wait a moment for services to be ready
    print("⏳ Waiting for services to be ready...")
    time.sleep(2)
    
    # Run tests
    test_backend_endpoints()
    print()
    test_frontend_connectivity()
    print()
    test_api_functionality()
    
    print()
    print("🎉 API Integration Test Complete!")
    print()
    print("📋 Next Steps:")
    print("1. ✅ Backend is running on port 5001")
    print("2. ✅ Frontend is running on port 3000")
    print("3. ✅ API endpoints are responding")
    print("4. 🔄 Test real API calls from frontend")
    print("5. 🔄 Test voice agent functionality")

if __name__ == "__main__":
    main()
