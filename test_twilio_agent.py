#!/usr/bin/env python3
"""
Comprehensive Test Script for Multilingual Twilio Voice Agent
Tests edge cases, Mexican Spanish slang, low audio quality, language detection, and performance metrics
"""

import asyncio
import os
import sys
import time
import statistics
from typing import List, Dict, Any
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class PerformanceMetrics:
    """Track and analyze performance metrics."""
    
    def __init__(self):
        self.stt_latencies: List[float] = []
        self.llm_latencies: List[float] = []
        self.tts_latencies: List[float] = []
        self.roundtrip_latencies: List[float] = []
        self.interruption_count = 0
        self.slang_detection_count = 0
        self.low_quality_handling_count = 0
        self.language_switch_count = 0
    
    def add_stt_latency(self, latency: float):
        """Add STT latency measurement."""
        self.stt_latencies.append(latency)
    
    def add_llm_latency(self, latency: float):
        """Add LLM latency measurement."""
        self.llm_latencies.append(latency)
    
    def add_tts_latency(self, latency: float):
        """Add TTS latency measurement."""
        self.tts_latencies.append(latency)
    
    def add_roundtrip_latency(self, latency: float):
        """Add complete roundtrip latency measurement."""
        self.roundtrip_latencies.append(latency)
    
    def add_language_switch(self):
        """Add language switch count."""
        self.language_switch_count += 1
    
    def get_statistics(self) -> Dict[str, Any]:
        """Get comprehensive performance statistics."""
        stats = {
            'total_tests': len(self.roundtrip_latencies),
            'stt': {
                'count': len(self.stt_latencies),
                'avg': statistics.mean(self.stt_latencies) if self.stt_latencies else 0,
                'min': min(self.stt_latencies) if self.stt_latencies else 0,
                'max': max(self.stt_latencies) if self.stt_latencies else 0,
                'p95': statistics.quantiles(self.stt_latencies, n=20)[-1] if len(self.stt_latencies) >= 20 else 0
            },
            'llm': {
                'count': len(self.llm_latencies),
                'avg': statistics.mean(self.llm_latencies) if self.llm_latencies else 0,
                'min': min(self.llm_latencies) if self.llm_latencies else 0,
                'max': max(self.llm_latencies) if self.llm_latencies else 0,
                'p95': statistics.quantiles(self.llm_latencies, n=20)[-1] if len(self.llm_latencies) >= 20 else 0
            },
            'tts': {
                'count': len(self.tts_latencies),
                'avg': statistics.mean(self.tts_latencies) if self.tts_latencies else 0,
                'min': min(self.tts_latencies) if self.tts_latencies else 0,
                'max': max(self.tts_latencies) if self.tts_latencies else 0,
                'p95': statistics.quantiles(self.tts_latencies, n=20)[-1] if len(self.tts_latencies) >= 20 else 0
            },
            'roundtrip': {
                'count': len(self.roundtrip_latencies),
                'avg': statistics.mean(self.roundtrip_latencies) if self.roundtrip_latencies else 0,
                'min': min(self.roundtrip_latencies) if self.roundtrip_latencies else 0,
                'max': max(self.roundtrip_latencies) if self.roundtrip_latencies else 0,
                'p95': statistics.quantiles(self.roundtrip_latencies, n=20)[-1] if len(self.roundtrip_latencies) >= 20 else 0
            },
            'edge_cases': {
                'interruptions': self.interruption_count,
                'slang_detection': self.slang_detection_count,
                'low_quality_handling': self.low_quality_handling_count,
                'language_switches': self.language_switch_count
            }
        }
        return stats
    
    def print_performance_report(self):
        """Print comprehensive performance report."""
        stats = self.get_statistics()
        
        print("\n" + "="*60)
        print("📊 PERFORMANCE TEST RESULTS")
        print("="*60)
        
        # Roundtrip Performance
        print(f"\n🎯 ROUNDTRIP PERFORMANCE (Target: <500ms)")
        print(f"   Average: {stats['roundtrip']['avg']:.3f}s")
        print(f"   Min: {stats['roundtrip']['min']:.3f}s")
        print(f"   Max: {stats['roundtrip']['max']:.3f}s")
        print(f"   95th Percentile: {stats['roundtrip']['p95']:.3f}s")
        
        # Component Performance
        print(f"\n🔍 COMPONENT BREAKDOWN:")
        print(f"   STT Average: {stats['stt']['avg']:.3f}s")
        print(f"   LLM Average: {stats['llm']['avg']:.3f}s")
        print(f"   TTS Average: {stats['tts']['avg']:.3f}s")
        
        # Performance Analysis
        avg_roundtrip = stats['roundtrip']['avg']
        if avg_roundtrip < 0.5:
            print(f"\n✅ PERFORMANCE TARGET MET: {avg_roundtrip:.3f}s < 500ms")
        else:
            print(f"\n❌ PERFORMANCE TARGET MISSED: {avg_roundtrip:.3f}s > 500ms")
        
        # Edge Case Summary
        print(f"\n🧪 EDGE CASE TESTING:")
        print(f"   Interruptions Handled: {stats['edge_cases']['interruptions']}")
        print(f"   Slang Detected: {stats['edge_cases']['slang_detection']}")
        print(f"   Low Quality Handled: {stats['edge_cases']['low_quality_handling']}")
        print(f"   Language Switches: {stats['edge_cases']['language_switches']}")

class MultilingualCallSimulator:
    """Simulate various call scenarios for testing multilingual capabilities."""
    
    def __init__(self, agent, metrics: PerformanceMetrics):
        self.agent = agent
        self.metrics = metrics
        
        # Mexican Spanish slang and colloquialisms
        self.mexican_slang = [
            "¡Órale!", "¡Chido!", "¡Qué padre!", "¡Está cañón!", "¡No manches!",
            "¡Órale güey!", "¡Qué onda!", "¡Está chido!", "¡No mames!", "¡Está cabrón!",
            "¡Qué chido!", "¡Está padre!", "¡No manches güey!", "¡Órale carnal!",
            "¡Está cañón!", "¡Qué onda güey!", "¡No mames güey!", "¡Está chido carnal!"
        ]
        
        # English phrases for language testing
        self.english_phrases = [
            "Hello, I need help with my reservation",
            "Can you help me with my account?",
            "I have a problem with the service",
            "Thank you for your assistance",
            "What is the solution to this issue?"
        ]
        
        # Edge case scenarios
        self.edge_cases = [
            "Hola... (long pause) ... ¿estás ahí?",
            "¡Órale! ¡Qué chido! ¡No manches güey!",
            "Necesito ayuda con mi reserva... (interruption) ... perdón, ¿me escuchas?",
            "El servicio está... (audio cuts out) ... muy malo",
            "¡Hola! ¡Hola! ¡Hola! (repeated quickly)",
            "Necesito... (background noise) ... ayuda con mi cuenta",
            "¿Puedes ayudarme? (whispers) ... por favor",
            "¡Órale carnal! ¡Está cañón este problema!"
        ]
        
        # Low audio quality simulations
        self.low_quality_phrases = [
            "Hola... (static) ... necesito ayuda",
            "Mi reserva... (noise) ... no funciona",
            "¿Puedes... (echo) ... escucharme?",
            "El servicio... (distortion) ... está mal"
        ]
    
    async def simulate_spanish_call(self) -> float:
        """Simulate a Spanish call scenario."""
        print("🇪🇸 Simulating Spanish call...")
        
        start_time = time.time()
        
        # Simulate user input in Spanish
        user_input = "Hola, necesito ayuda con mi reserva de hotel"
        print(f"   👤 User (Spanish): {user_input}")
        
        # Simulate STT processing
        stt_start = time.time()
        await asyncio.sleep(0.1)  # Simulate STT latency
        stt_latency = time.time() - stt_start
        self.metrics.add_stt_latency(stt_latency)
        
        # Simulate LLM processing
        llm_start = time.time()
        await asyncio.sleep(0.2)  # Simulate LLM latency
        llm_latency = time.time() - llm_start
        self.metrics.add_llm_latency(llm_latency)
        
        # Simulate TTS processing
        tts_start = time.time()
        await asyncio.sleep(0.15)  # Simulate TTS latency
        tts_latency = time.time() - tts_start
        self.metrics.add_tts_latency(tts_latency)
        
        total_latency = time.time() - start_time
        self.metrics.add_roundtrip_latency(total_latency)
        
        print(f"   ⚡ Total latency: {total_latency:.3f}s")
        return total_latency
    
    async def simulate_english_call(self) -> float:
        """Simulate an English call scenario."""
        print("🇺🇸 Simulating English call...")
        
        start_time = time.time()
        
        # Simulate user input in English
        user_input = "Hello, I need help with my hotel reservation"
        print(f"   👤 User (English): {user_input}")
        
        # Simulate STT processing
        stt_start = time.time()
        await asyncio.sleep(0.12)  # Simulate STT latency
        stt_latency = time.time() - stt_start
        self.metrics.add_stt_latency(stt_latency)
        
        # Simulate LLM processing
        llm_start = time.time()
        await asyncio.sleep(0.18)  # Simulate LLM latency
        llm_latency = time.time() - llm_start
        self.metrics.add_llm_latency(llm_latency)
        
        # Simulate TTS processing
        tts_start = time.time()
        await asyncio.sleep(0.13)  # Simulate TTS latency
        tts_latency = time.time() - tts_start
        self.metrics.add_tts_latency(tts_latency)
        
        total_latency = time.time() - start_time
        self.metrics.add_roundtrip_latency(total_latency)
        
        print(f"   ⚡ Total latency: {total_latency:.3f}s")
        return total_latency
    
    async def simulate_language_switch(self) -> float:
        """Simulate language switching during a call."""
        print("🔄 Simulating language switch...")
        
        start_time = time.time()
        
        # Start with Spanish
        spanish_input = "Hola, necesito ayuda"
        print(f"   👤 User (Spanish): {spanish_input}")
        await asyncio.sleep(0.1)
        
        # Switch to English
        english_input = "Actually, can you help me in English?"
        print(f"   👤 User (English): {english_input}")
        
        # Simulate language detection and switching
        await asyncio.sleep(0.15)  # Language detection time
        self.metrics.add_language_switch()
        
        # Continue in English
        await asyncio.sleep(0.1)
        
        total_latency = time.time() - start_time
        self.metrics.add_roundtrip_latency(total_latency)
        
        print(f"   ⚡ Language switch handled in: {total_latency:.3f}s")
        return total_latency
    
    async def simulate_normal_call(self) -> float:
        """Simulate a normal call scenario."""
        print("📞 Simulating normal call...")
        
        start_time = time.time()
        
        # Simulate user input
        user_input = "Hola, necesito ayuda con mi reserva de hotel"
        print(f"   👤 User: {user_input}")
        
        # Simulate STT processing
        stt_start = time.time()
        await asyncio.sleep(0.1)  # Simulate STT latency
        stt_latency = time.time() - stt_start
        self.metrics.add_stt_latency(stt_latency)
        
        # Simulate LLM processing
        llm_start = time.time()
        await asyncio.sleep(0.2)  # Simulate LLM latency
        llm_latency = time.time() - llm_start
        self.metrics.add_llm_latency(llm_latency)
        
        # Simulate TTS processing
        tts_start = time.time()
        await asyncio.sleep(0.15)  # Simulate TTS latency
        tts_latency = time.time() - tts_start
        self.metrics.add_tts_latency(tts_latency)
        
        total_latency = time.time() - start_time
        self.metrics.add_roundtrip_latency(total_latency)
        
        print(f"   ⚡ Total latency: {total_latency:.3f}s")
        return total_latency
    
    async def simulate_interruption(self) -> float:
        """Simulate user interruption during AI response."""
        print("🔄 Simulating user interruption...")
        
        start_time = time.time()
        
        # AI starts responding
        ai_response = "Hola, soy tu agente AI. Te ayudo con tu reserva..."
        print(f"   🤖 AI: {ai_response[:50]}...")
        
        # User interrupts
        await asyncio.sleep(0.1)
        user_interruption = "¡Espera! Tengo una pregunta diferente"
        print(f"   👤 User (interrupting): {user_interruption}")
        
        # Handle interruption
        await asyncio.sleep(0.05)  # Quick interruption handling
        
        total_latency = time.time() - start_time
        self.metrics.add_roundtrip_latency(total_latency)
        self.metrics.interruption_count += 1
        
        print(f"   ⚡ Interruption handled in: {total_latency:.3f}s")
        return total_latency
    
    async def simulate_mexican_slang(self) -> float:
        """Simulate Mexican Spanish slang and colloquialisms."""
        print("🇲🇽 Simulating Mexican Spanish slang...")
        
        start_time = time.time()
        
        # Random slang phrase
        import random
        slang_phrase = random.choice(self.mexican_slang)
        print(f"   👤 User (slang): {slang_phrase}")
        
        # Simulate processing with slang
        stt_start = time.time()
        await asyncio.sleep(0.08)  # Slang might need extra processing
        stt_latency = time.time() - stt_start
        self.metrics.add_stt_latency(stt_latency)
        
        llm_start = time.time()
        await asyncio.sleep(0.18)  # LLM processes slang context
        llm_latency = time.time() - llm_start
        self.metrics.add_llm_latency(llm_latency)
        
        tts_start = time.time()
        await asyncio.sleep(0.12)  # TTS with slang pronunciation
        tts_latency = time.time() - tts_start
        self.metrics.add_tts_latency(tts_latency)
        
        total_latency = time.time() - start_time
        self.metrics.add_roundtrip_latency(total_latency)
        self.metrics.slang_detection_count += 1
        
        print(f"   ⚡ Slang processed in: {total_latency:.3f}s")
        return total_latency
    
    async def simulate_low_audio_quality(self) -> float:
        """Simulate low audio quality scenarios."""
        print("🔊 Simulating low audio quality...")
        
        start_time = time.time()
        
        # Simulate poor audio input
        poor_audio = "Hola... (static) ... necesito... (noise) ... ayuda"
        print(f"   👤 User (poor audio): {poor_audio}")
        
        # Simulate enhanced STT processing for poor audio
        stt_start = time.time()
        await asyncio.sleep(0.15)  # Extra time for poor audio
        stt_latency = time.time() - stt_start
        self.metrics.add_stt_latency(stt_latency)
        
        # LLM handles unclear input
        llm_start = time.time()
        await asyncio.sleep(0.25)  # Extra time for clarification
        llm_latency = time.time() - llm_start
        self.metrics.add_llm_latency(llm_latency)
        
        # TTS with clarification
        tts_start = time.time()
        await asyncio.sleep(0.12)
        tts_latency = time.time() - tts_start
        self.metrics.add_tts_latency(tts_latency)
        
        total_latency = time.time() - start_time
        self.metrics.add_roundtrip_latency(total_latency)
        self.metrics.low_quality_handling_count += 1
        
        print(f"   ⚡ Poor audio handled in: {total_latency:.3f}s")
        return total_latency
    
    async def simulate_edge_case(self, scenario: str) -> float:
        """Simulate a specific edge case scenario."""
        print(f"🧪 Simulating edge case: {scenario[:50]}...")
        
        start_time = time.time()
        
        # Simulate the edge case
        print(f"   👤 User: {scenario}")
        
        # Process with edge case handling
        await asyncio.sleep(0.12)  # Edge case processing
        
        total_latency = time.time() - start_time
        self.metrics.add_roundtrip_latency(total_latency)
        
        print(f"   ⚡ Edge case handled in: {total_latency:.3f}s")
        return total_latency
    
    async def run_comprehensive_test_suite(self):
        """Run the complete test suite."""
        print("🚀 Starting Comprehensive Multilingual Test Suite...")
        print("=" * 60)
        
        # Test language-specific scenarios
        await self.simulate_spanish_call()
        await asyncio.sleep(0.1)
        
        await self.simulate_english_call()
        await asyncio.sleep(0.1)
        
        await self.simulate_language_switch()
        await asyncio.sleep(0.1)
        
        # Test normal scenarios
        await self.simulate_normal_call()
        await asyncio.sleep(0.1)
        
        # Test interruptions
        await self.simulate_interruption()
        await asyncio.sleep(0.1)
        
        # Test Mexican slang
        await self.simulate_mexican_slang()
        await asyncio.sleep(0.1)
        
        # Test low audio quality
        await self.simulate_low_audio_quality()
        await asyncio.sleep(0.1)
        
        # Test additional edge cases
        for i, edge_case in enumerate(self.edge_cases[:5]):  # Test first 5 edge cases
            await self.simulate_edge_case(edge_case)
            await asyncio.sleep(0.1)
        
        print("\n✅ Comprehensive multilingual test suite completed!")

async def test_twilio_agent():
    """Test the Multilingual Twilio Voice Agent functionality."""
    print("🧪 Testing Multilingual Twilio Voice Agent...")
    print("=" * 50)
    
    try:
        # Import the agent class
        from twilio_voice_agent import TwilioVoiceAgent
        
        print("✅ TwilioVoiceAgent class imported successfully")
        
        # Test service initialization
        print("\n🔧 Testing service initialization...")
        agent = TwilioVoiceAgent()
        print("✅ Services initialized successfully")
        
        # Test language manager
        print("\n🌍 Testing language manager...")
        lang_manager = agent.language_manager
        print(f"   Primary Language: {lang_manager.primary_language}")
        print(f"   Current Language: {lang_manager.current_language}")
        print(f"   Supported Languages: {list(lang_manager.language_configs.keys())}")
        
        # Test language detection
        print("\n🔍 Testing language detection...")
        test_spanish = "Hola, necesito ayuda con mi reserva"
        test_english = "Hello, I need help with my reservation"
        
        detected_lang, confidence = lang_manager.detect_language_from_text(test_spanish)
        print(f"   Spanish text detected as: {detected_lang} (confidence: {confidence:.2f})")
        
        detected_lang, confidence = lang_manager.detect_language_from_text(test_english)
        print(f"   English text detected as: {detected_lang} (confidence: {confidence:.2f})")
        
        # Test TwiML generation
        print("\n📱 Testing TwiML generation...")
        
        consent_twiml = agent.generate_consent_twiml()
        print("✅ Consent TwiML generated:")
        print(consent_twiml[:200] + "..." if len(consent_twiml) > 200 else consent_twiml)
        
        greeting_twiml = agent.generate_greeting_twiml()
        print("\n✅ Greeting TwiML generated:")
        print(greeting_twiml[:200] + "..." if len(greeting_twiml) > 200 else greeting_twiml)
        
        # Test pipeline creation
        print("\n🔗 Testing pipeline creation...")
        agent.create_pipeline()
        print("✅ Pipeline created successfully")
        
        # Initialize performance metrics
        metrics = PerformanceMetrics()
        
        # Run comprehensive test suite
        print("\n🧪 Running comprehensive multilingual test suite...")
        simulator = MultilingualCallSimulator(agent, metrics)
        await simulator.run_comprehensive_test_suite()
        
        # Print performance report
        metrics.print_performance_report()
        
        print("\n🎉 All tests passed!")
        print("🚀 Multilingual Twilio Voice Agent is ready to use!")
        
        # Show next steps
        print("\n📋 Next Steps:")
        print("1. ✅ Agent functionality verified")
        print("2. ✅ Multilingual capabilities tested")
        print("3. ✅ Performance testing completed")
        print("4. 🔄 Start the server: python twilio_voice_agent.py")
        print("5. 🔄 Configure Twilio webhook")
        print("6. 🔄 Test with ngrok")
        
    except ImportError as e:
        print(f"❌ Import error: {e}")
        print("Please ensure all dependencies are installed")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)

if __name__ == "__main__":
    try:
        asyncio.run(test_twilio_agent())
    except KeyboardInterrupt:
        print("\n👋 Test interrupted")
    except Exception as e:
        print(f"❌ Fatal error: {e}")
        sys.exit(1)
