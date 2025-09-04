#!/usr/bin/env python3
"""
Test script to verify all required packages and environment variables are properly set up
for the Voice AI Agent project.
"""

import sys
from typing import Dict, Any

def test_imports() -> Dict[str, Any]:
    """Test all required imports and return status."""
    results = {}
    
    # Test python-dotenv
    try:
        from dotenv import load_dotenv
        import os
        results['python-dotenv'] = {'status': 'success', 'module': load_dotenv}
        print("✅ python-dotenv imported successfully")
    except ImportError as e:
        results['python-dotenv'] = {'status': 'failed', 'error': str(e)}
        print(f"❌ python-dotenv import failed: {e}")
    
    # Test pipecat
    try:
        import pipecat
        results['pipecat'] = {'status': 'success', 'module': pipecat}
        print("✅ pipecat imported successfully")
    except ImportError as e:
        results['pipecat'] = {'status': 'failed', 'error': str(e)}
        print(f"❌ pipecat import failed: {e}")
    
    # Test twilio
    try:
        import twilio
        results['twilio'] = {'status': 'success', 'module': twilio}
        print("✅ twilio imported successfully")
    except ImportError as e:
        results['twilio'] = {'status': 'failed', 'error': str(e)}
        print(f"❌ twilio import failed: {e}")
    
    # Test deepgram
    try:
        import deepgram
        results['deepgram'] = {'status': 'success', 'module': deepgram}
        print("✅ deepgram imported successfully")
    except ImportError as e:
        results['deepgram'] = {'status': 'failed', 'error': str(e)}
        print(f"❌ deepgram import failed: {e}")
    
    # Test elevenlabs
    try:
        import elevenlabs
        results['elevenlabs'] = {'status': 'success', 'module': elevenlabs}
        print("✅ elevenlabs imported successfully")
    except ImportError as e:
        results['elevenlabs'] = {'status': 'failed', 'error': str(e)}
        print(f"❌ elevenlabs import failed: {e}")
    
    # Test openai
    try:
        import openai
        results['openai'] = {'status': 'success', 'module': openai}
        print("✅ openai imported successfully")
    except ImportError as e:
        results['openai'] = {'status': 'failed', 'error': str(e)}
        print(f"❌ openai import failed: {e}")
    
    # Test flask
    try:
        import flask
        results['flask'] = {'status': 'success', 'module': flask}
        print("✅ flask imported successfully")
    except ImportError as e:
        results['flask'] = {'status': 'failed', 'error': str(e)}
        print(f"❌ flask import failed: {e}")
    
    return results

def test_environment_variables() -> Dict[str, bool]:
    """Test if all required environment variables are loaded."""
    env_vars = {}
    
    required_vars = [
        'TWILIO_SID',
        'TWILIO_AUTH_TOKEN', 
        'ELEVENLABS_API_KEY',
        'DEEPGRAM_API_KEY',
        'OPENAI_API_KEY'
    ]
    
    for var in required_vars:
        value = os.getenv(var)
        if value:
            env_vars[var] = True
            print(f"✅ {var} loaded successfully")
        else:
            env_vars[var] = False
            print(f"❌ {var} not found in environment")
    
    return env_vars

def main():
    """Main function to run all tests."""
    print("🚀 Testing Voice AI Agent Setup...")
    print("=" * 50)
    
    # Test imports first
    print("\n📦 Testing Package Imports:")
    print("-" * 30)
    import_results = test_imports()
    
    # Test environment variables
    print("\n🔐 Testing Environment Variables:")
    print("-" * 30)
    env_results = test_environment_variables()
    
    # Summary
    print("\n📊 Setup Summary:")
    print("=" * 50)
    
    successful_imports = sum(1 for result in import_results.values() if result['status'] == 'success')
    total_imports = len(import_results)
    
    successful_env_vars = sum(1 for result in env_results.values() if result)
    total_env_vars = len(env_results)
    
    print(f"Packages: {successful_imports}/{total_imports} imported successfully")
    print(f"Environment Variables: {successful_env_vars}/{total_env_vars} loaded successfully")
    
    # Final result
    if successful_imports == total_imports and successful_env_vars == total_env_vars:
        print("\n🎉 Setup successful! All packages and environment variables are ready.")
        return True
    else:
        print("\n⚠️  Setup incomplete. Please check the failed items above.")
        return False

if __name__ == "__main__":
    # Load environment variables first
    try:
        from dotenv import load_dotenv
        import os
        load_dotenv()
        print("✅ Environment variables loaded from .env file")
    except ImportError:
        print("❌ Could not load environment variables - python-dotenv not available")
        sys.exit(1)
    
    success = main()
    sys.exit(0 if success else 1)
