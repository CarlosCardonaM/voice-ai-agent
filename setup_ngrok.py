#!/usr/bin/env python3
"""
Ngrok Setup and Twilio Webhook Configuration Script

This script helps set up ngrok for local development and provides
instructions for configuring Twilio webhooks.
"""

import json
import os
import subprocess
import time
from typing import Any, Dict, Optional

import requests


class NgrokManager:
    """Manages ngrok tunnel and Twilio webhook configuration."""

    def __init__(self, local_port: int = 5001):
        self.local_port = local_port
        self.ngrok_url: Optional[str] = None
        self.ngrok_process: Optional[subprocess.Popen] = None

    def start_ngrok(self) -> bool:
        """Start ngrok tunnel for the local port."""
        try:
            print(f"🚀 Starting ngrok tunnel for port {self.local_port}...")

            # Start ngrok in the background
            self.ngrok_process = subprocess.Popen(
                ["ngrok", "http", str(self.local_port)], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True
            )

            # Wait a moment for ngrok to start
            time.sleep(3)

            # Get the public URL
            self.ngrok_url = self.get_ngrok_url()

            if self.ngrok_url:
                print(f"✅ Ngrok tunnel started successfully!")
                print(f"🌐 Public URL: {self.ngrok_url}")
                print(f"🔗 Local URL: http://localhost:{self.local_port}")
                return True
            else:
                print("❌ Failed to get ngrok URL")
                return False

        except Exception as e:
            print(f"❌ Error starting ngrok: {e}")
            return False

    def get_ngrok_url(self) -> Optional[str]:
        """Get the public ngrok URL from the ngrok API."""
        try:
            response = requests.get("http://localhost:4040/api/tunnels", timeout=5)
            if response.status_code == 200:
                data = response.json()
                tunnels = data.get("tunnels", [])

                for tunnel in tunnels:
                    if tunnel.get("proto") == "https":
                        return tunnel.get("public_url")

                # Fallback to http if https not available
                for tunnel in tunnels:
                    if tunnel.get("proto") == "http":
                        return tunnel.get("public_url")

        except Exception as e:
            print(f"⚠️  Could not get ngrok URL from API: {e}")

        return None

    def stop_ngrok(self):
        """Stop the ngrok tunnel."""
        if self.ngrok_process:
            print("🛑 Stopping ngrok tunnel...")
            self.ngrok_process.terminate()
            self.ngrok_process.wait()
            self.ngrok_process = None
            self.ngrok_url = None
            print("✅ Ngrok tunnel stopped")

    def get_webhook_urls(self) -> Dict[str, str]:
        """Get the webhook URLs for Twilio configuration."""
        if not self.ngrok_url:
            return {}

        base_url = self.ngrok_url.rstrip("/")
        return {
            "voice_webhook": f"{base_url}/webhook",
            "status_webhook": f"{base_url}/status",
            "health_check": f"{base_url}/health",
            "performance": f"{base_url}/performance",
        }

    def test_webhooks(self) -> bool:
        """Test if the webhooks are accessible."""
        if not self.ngrok_url:
            print("❌ No ngrok URL available")
            return False

        webhook_urls = self.get_webhook_urls()

        print("🧪 Testing webhook endpoints...")

        for name, url in webhook_urls.items():
            try:
                response = requests.get(url, timeout=10)
                if response.status_code == 200:
                    print(f"✅ {name}: {url} - OK")
                else:
                    print(f"⚠️  {name}: {url} - Status {response.status_code}")
            except Exception as e:
                print(f"❌ {name}: {url} - Error: {e}")

        return True


def print_twilio_setup_instructions(ngrok_url: str):
    """Print instructions for setting up Twilio webhooks."""
    webhook_urls = {
        "voice_webhook": f"{ngrok_url.rstrip('/')}/webhook",
        "status_webhook": f"{ngrok_url.rstrip('/')}/status",
    }

    print("\n" + "=" * 80)
    print("📞 TWILIO WEBHOOK CONFIGURATION")
    print("=" * 80)
    print()
    print("1. Go to your Twilio Console: https://console.twilio.com/")
    print("2. Navigate to Phone Numbers > Manage > Active numbers")
    print("3. Click on your Twilio phone number")
    print("4. Configure the following webhooks:")
    print()
    print(f"   Voice URL: {webhook_urls['voice_webhook']}")
    print(f"   Status Callback URL: {webhook_urls['status_webhook']}")
    print()
    print("5. Set HTTP method to 'POST' for both")
    print("6. Save the configuration")
    print()
    print("🔧 Alternative: Use Twilio CLI")
    print("   twilio phone-numbers:update YOUR_TWILIO_NUMBER \\")
    print(f"     --voice-url={webhook_urls['voice_webhook']} \\")
    print(f"     --status-callback-url={webhook_urls['status_webhook']}")
    print()
    print("=" * 80)


def main():
    """Main function to set up ngrok and provide Twilio instructions."""
    print("🌐 Ngrok Setup for Twilio Voice AI Agent")
    print("=" * 50)

    # Check if backend is running
    try:
        response = requests.get("http://localhost:5001/health", timeout=5)
        if response.status_code != 200:
            print("❌ Backend server is not running on port 5001")
            print("   Please start the backend first: python twilio_voice_agent.py")
            return
    except Exception:
        print("❌ Backend server is not running on port 5001")
        print("   Please start the backend first: python twilio_voice_agent.py")
        return

    print("✅ Backend server is running")

    # Start ngrok
    ngrok_manager = NgrokManager()

    if not ngrok_manager.start_ngrok():
        print("❌ Failed to start ngrok")
        return

    # Test webhooks
    ngrok_manager.test_webhooks()

    # Print Twilio setup instructions
    if ngrok_manager.ngrok_url:
        print_twilio_setup_instructions(ngrok_manager.ngrok_url)

        print("\n🎯 NEXT STEPS:")
        print("1. Configure your Twilio webhooks using the URLs above")
        print("2. Call your Twilio phone number to test")
        print("3. Check the backend logs for call activity")
        print("4. Use the frontend dashboard to monitor performance")
        print()
        print("💡 Keep this script running to maintain the ngrok tunnel")
        print("   Press Ctrl+C to stop ngrok when done")

        try:
            # Keep the script running
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            print("\n🛑 Shutting down...")
            ngrok_manager.stop_ngrok()
            print("✅ Done!")


if __name__ == "__main__":
    main()
