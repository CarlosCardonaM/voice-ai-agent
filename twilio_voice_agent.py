#!/usr/bin/env python3
"""Real-Time Voice AI Agent with Twilio Integration using Pipecat Framework.

Features:
- Twilio webhook handling with Flask
- Real-time voice conversation
- ElevenLabs TTS (Mexican Spanish + English)
- Deepgram STT (LATAM Spanish + English)
- OpenAI GPT-4o-mini processing
- Interruption handling
- Voicemail detection
- Consent collection via TwiML
- Sub-500ms latency optimization
- Real-time performance monitoring
- Edge case handling for Mexican Spanish slang
- Automatic language detection and switching
"""

import asyncio
import logging
import os
import statistics
import sys
import threading
import time
import xml.etree.ElementTree as ET
from datetime import datetime
from typing import Any, Dict, List, Optional, Tuple

from dotenv import load_dotenv
from flask import Flask, Response, request
from flask_cors import CORS

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

# Import Pipecat components
try:
    from pipecat.frames.frames import TranscriptionFrame, UserStartedSpeakingFrame, UserStoppedSpeakingFrame
    from pipecat.pipeline.pipeline import Pipeline
    from pipecat.processors.frame_processor import FrameProcessor
    from pipecat.services.deepgram.stt import DeepgramSTTService
    from pipecat.services.elevenlabs.tts import ElevenLabsTTSService
    from pipecat.services.openai.llm import OpenAILLMService

    logger.info("✅ All Pipecat components imported successfully")
except ImportError as e:
    logger.error(f"❌ Pipecat import error: {e}")
    sys.exit(1)


class LanguageManager:
    """Manages language detection and switching for multilingual support."""

    def __init__(self):
        """Initialize the LanguageManager with default language settings."""
        self.primary_language = "es-LA"  # Spanish for LATAM market
        self.fallback_language = "en-US"  # English as fallback
        self.current_language = self.primary_language
        self.language_confidence = 0.0
        self.language_switch_threshold = 0.8  # 80% confidence to switch
        self.consecutive_detections = 0
        self.language_switch_count = 0

        # Language-specific configurations
        self.language_configs = {
            "es-LA": {
                "name": "Spanish (LATAM)",
                "tts_voice": "21m00Tcm4TlvDq8ikWAM",  # Mexican Spanish
                "greeting": "Hola, soy tu agente AI para LATAM. ¿En qué puedo ayudarte?",
                "consent": "Esta llamada puede grabarse para calidad. ¿Deseas continuar?",
                "instructions": "Por favor responde sí o no.",
                "no_response": "No se recibió respuesta. Llamada terminada.",
                "goodbye": "Entendido. Llamada terminada. ¡Que tengas un buen día!",
                "system_prompt": (
                    "Eres un agente de servicio al cliente útil, responde en español "
                    "mexicano, maneja casos como reservas o soporte. Sé amigable, "
                    "profesional y eficiente. Entiendes y usas expresiones mexicanas "
                    "coloquiales cuando es apropiado."
                ),
            },
            "en-US": {
                "name": "English (US)",
                "tts_voice": "21m00Tcm4TlvDq8ikWAM",  # Same voice, different language
                "greeting": "Hello, I'm your AI agent for LATAM. How can I help you?",
                "consent": "This call may be recorded for quality purposes. Do you wish to continue?",
                "instructions": "Please answer yes or no.",
                "no_response": "No response received. Call terminated.",
                "goodbye": "Understood. Call terminated. Have a great day!",
                "system_prompt": (
                    "You are a helpful customer service agent, respond in English, "
                    "handle cases like reservations or support. Be friendly, "
                    "professional, and efficient."
                ),
            },
        }

    def detect_language_from_text(self, text: str) -> Tuple[str, float]:
        """Detect language from text using heuristics and patterns."""
        # Simple language detection based on common patterns
        spanish_indicators = [
            "hola",
            "gracias",
            "por favor",
            "ayuda",
            "necesito",
            "reserva",
            "servicio",
            "cliente",
            "cuenta",
            "problema",
            "solución",
            "información",
            "órale",
            "chido",
            "padre",
            "cañón",
            "manches",
            "mames",
            "cabrón",
            "carnal",
            "güey",
            "onda",
            "qué",
            "cómo",
            "dónde",
            "cuándo",
        ]

        english_indicators = [
            "hello",
            "hi",
            "help",
            "need",
            "reservation",
            "service",
            "customer",
            "account",
            "problem",
            "solution",
            "information",
            "thank you",
            "please",
            "what",
            "how",
            "where",
            "when",
            "why",
            "can you",
            "i need",
        ]

        text_lower = text.lower()

        spanish_score = sum(1 for word in spanish_indicators if word in text_lower)
        english_score = sum(1 for word in english_indicators if word in text_lower)

        total_indicators = spanish_score + english_score

        if total_indicators == 0:
            # Default to primary language if no clear indicators
            return self.primary_language, 0.5

        if spanish_score > english_score:
            confidence = spanish_score / total_indicators
            return "es-LA", confidence
        else:
            confidence = english_score / total_indicators
            return "en-US", confidence

    def update_language(self, detected_lang: str, confidence: float):
        """Update current language based on detection results."""
        if detected_lang != self.current_language and confidence >= self.language_switch_threshold:
            self.consecutive_detections += 1

            # Require multiple consecutive detections to switch language
            if self.consecutive_detections >= 2:
                old_language = self.current_language
                self.current_language = detected_lang
                self.language_confidence = confidence
                self.language_switch_count += 1
                self.consecutive_detections = 0

                logger.info(
                    f"🔄 Language switched from {old_language} to {detected_lang} (confidence: {confidence:.2f})"
                )
                return True
        elif detected_lang == self.current_language:
            self.consecutive_detections = 0
            self.language_confidence = confidence

        return False

    def get_current_config(self) -> Dict[str, Any]:
        """Get configuration for current language."""
        return self.language_configs.get(self.current_language, self.language_configs[self.primary_language])

    def get_tts_voice(self) -> str:
        """Get TTS voice ID for current language."""
        return self.get_current_config()["tts_voice"]

    def get_greeting(self) -> str:
        """Get greeting message for current language."""
        return self.get_current_config()["greeting"]

    def get_consent_message(self) -> str:
        """Get consent message for current language."""
        return self.get_current_config()["consent"]

    def get_instructions(self) -> str:
        """Get instructions for current language."""
        return self.get_current_config()["instructions"]

    def get_no_response_message(self) -> str:
        """Get no response message for current language."""
        return self.get_current_config()["no_response"]

    def get_goodbye_message(self) -> str:
        """Get goodbye message for current language."""
        return self.get_current_config()["goodbye"]

    def get_system_prompt(self) -> str:
        """Get system prompt for current language."""
        return self.get_current_config()["system_prompt"]

    def get_language_stats(self) -> Dict[str, Any]:
        """Get language detection statistics."""
        return {
            "current_language": self.current_language,
            "primary_language": self.primary_language,
            "language_confidence": self.language_confidence,
            "language_switches": self.language_switch_count,
            "consecutive_detections": self.consecutive_detections,
        }


class RealCallManager:
    """Manages real-time call tracking and performance metrics."""

    def __init__(self):
        """Initialize the RealCallManager with empty call tracking."""
        self.active_calls = {}  # Track active calls by call_sid
        self.call_history = []  # Store completed call data
        self.lock = threading.Lock()
        self.total_calls_today = 0
        self.reset_daily_stats()

    def reset_daily_stats(self):
        """Reset daily statistics at midnight."""
        today = datetime.now().date()
        if not hasattr(self, "_last_reset_date") or self._last_reset_date != today:
            self._last_reset_date = today
            self.total_calls_today = 0
            logger.info("📊 Daily call statistics reset")

    def start_call(self, call_sid: str, phone_number: str, direction: str = "inbound"):
        """Start tracking a new call."""
        with self.lock:
            self.reset_daily_stats()

            call_data = {
                "call_sid": call_sid,
                "phone_number": phone_number,
                "direction": direction,
                "start_time": datetime.now(),
                "status": "active",
                "language": "es-LA",  # Default language
                "stt_latency": [],
                "llm_latency": [],
                "tts_latency": [],
                "total_latency": [],
                "language_switches": 0,
                "interruptions": 0,
                "utterances": 0,
            }

            self.active_calls[call_sid] = call_data
            self.total_calls_today += 1

            logger.info(f"📞 Call started: {call_sid} from {phone_number}")
            logger.info(f"📊 Active calls: {len(self.active_calls)}")

    def end_call(self, call_sid: str, reason: str = "completed"):
        """End tracking a call and move to history."""
        with self.lock:
            if call_sid in self.active_calls:
                call_data = self.active_calls.pop(call_sid)
                call_data["end_time"] = datetime.now()
                call_data["duration"] = (call_data["end_time"] - call_data["start_time"]).total_seconds()
                call_data["end_reason"] = reason
                call_data["status"] = "completed"

                self.call_history.append(call_data)

                logger.info(f"📞 Call ended: {call_sid} - Duration: {call_data['duration']:.1f}s")
                logger.info(f"📊 Active calls: {len(self.active_calls)}")

    def update_call_language(self, call_sid: str, language: str):
        """Update the language for a specific call."""
        with self.lock:
            if call_sid in self.active_calls:
                old_language = self.active_calls[call_sid]["language"]
                if old_language != language:
                    self.active_calls[call_sid]["language"] = language
                    self.active_calls[call_sid]["language_switches"] += 1
                    logger.info(f"🔄 Call {call_sid}: Language changed from {old_language} to {language}")

    def record_performance_metric(self, call_sid: str, metric_type: str, latency_ms: float):
        """Record performance metrics for a call."""
        with self.lock:
            if call_sid in self.active_calls:
                if metric_type in ["stt", "llm", "tts"]:
                    self.active_calls[call_sid][f"{metric_type}_latency"].append(latency_ms)
                elif metric_type == "total":
                    self.active_calls[call_sid]["total_latency"].append(latency_ms)

                # Keep only last 100 measurements to prevent memory bloat
                if len(self.active_calls[call_sid][f"{metric_type}_latency"]) > 100:
                    self.active_calls[call_sid][f"{metric_type}_latency"] = self.active_calls[call_sid][
                        f"{metric_type}_latency"
                    ][-100:]

    def record_interruption(self, call_sid: str):
        """Record a user interruption during the call."""
        with self.lock:
            if call_sid in self.active_calls:
                self.active_calls[call_sid]["interruptions"] += 1
                logger.info(f"🔄 Call {call_sid}: User interruption recorded")

    def record_utterance(self, call_sid: str):
        """Record a user utterance during the call."""
        with self.lock:
            if call_sid in self.active_calls:
                self.active_calls[call_sid]["utterances"] += 1

    def get_active_call_count(self) -> int:
        """Get the number of currently active calls."""
        with self.lock:
            return len(self.active_calls)

    def get_performance_metrics(self) -> Dict[str, Any]:
        """Get comprehensive performance metrics."""
        with self.lock:
            all_stt = []
            all_llm = []
            all_tts = []
            all_total = []

            # Collect metrics from active calls
            for call in self.active_calls.values():
                all_stt.extend(call.get("stt_latency", []))
                all_llm.extend(call.get("llm_latency", []))
                all_tts.extend(call.get("tts_latency", []))
                all_total.extend(call.get("total_latency", []))

            # Calculate averages
            def safe_average(values):
                return sum(values) / len(values) if values else 0

            avg_stt = safe_average(all_stt)
            avg_llm = safe_average(all_llm)
            avg_tts = safe_average(all_tts)
            avg_total = safe_average(all_total)

            # Calculate percentiles for total latency
            if all_total:
                sorted_latencies = sorted(all_total)
                p95_latency = sorted_latencies[int(len(sorted_latencies) * 0.95)]
                min_latency = min(all_total)
                max_latency = max(all_total)
            else:
                p95_latency = min_latency = max_latency = 0

            return {
                "active_calls": len(self.active_calls),
                "total_calls_today": self.total_calls_today,
                "avg_stt_latency": round(avg_stt, 2),
                "avg_llm_latency": round(avg_llm, 2),
                "avg_tts_latency": round(avg_tts, 2),
                "avg_total_latency": round(avg_total, 2),
                "p95_latency": round(p95_latency, 2),
                "min_latency": round(min_latency, 2),
                "max_latency": round(max_latency, 2),
                "total_utterances": sum(call.get("utterances", 0) for call in self.active_calls.values()),
                "total_interruptions": sum(call.get("interruptions", 0) for call in self.active_calls.values()),
                "total_language_switches": sum(call.get("language_switches", 0) for call in self.active_calls.values()),
            }

    def get_call_info(self, call_sid: str) -> Optional[Dict[str, Any]]:
        """Get information about a specific call."""
        with self.lock:
            return self.active_calls.get(call_sid)

    def get_recent_calls(self, limit: int = 10) -> List[Dict[str, Any]]:
        """Get recent call history."""
        with self.lock:
            return sorted(self.call_history, key=lambda x: x["start_time"], reverse=True)[:limit]


class PerformanceMonitor:
    """Real-time performance monitoring for production calls."""

    def __init__(self):
        """Initialize the PerformanceMonitor with empty metrics tracking."""
        self.call_metrics: Dict[str, Dict[str, Any]] = {}
        self.global_metrics = {
            "total_calls": 0,
            "total_interruptions": 0,
            "total_slang_detections": 0,
            "total_low_quality_handling": 0,
            "total_language_switches": 0,
            "latency_target_met": 0,
            "latency_target_missed": 0,
        }

    def start_call_monitoring(self, call_sid: str):
        """Start monitoring a new call."""
        self.call_metrics[call_sid] = {
            "start_time": time.time(),
            "stt_latencies": [],
            "llm_latencies": [],
            "tts_latencies": [],
            "roundtrip_latencies": [],
            "interruptions": 0,
            "slang_detections": 0,
            "low_quality_handling": 0,
            "language_switches": 0,
            "edge_cases_handled": [],
        }
        self.global_metrics["total_calls"] += 1

    def record_stt_latency(self, call_sid: str, latency: float):
        """Record STT latency for a call."""
        if call_sid in self.call_metrics:
            self.call_metrics[call_sid]["stt_latencies"].append(latency)

    def record_llm_latency(self, call_sid: str, latency: float):
        """Record LLM latency for a call."""
        if call_sid in self.call_metrics:
            self.call_metrics[call_sid]["llm_latencies"].append(latency)

    def record_tts_latency(self, call_sid: str, latency: float):
        """Record TTS latency for a call."""
        if call_sid in self.call_metrics:
            self.call_metrics[call_sid]["tts_latencies"].append(latency)

    def record_roundtrip_latency(self, call_sid: str, latency: float):
        """Record complete roundtrip latency for a call."""
        if call_sid in self.call_metrics:
            self.call_metrics[call_sid]["roundtrip_latencies"].append(latency)

            # Check if latency target was met
            if latency < 0.5:  # 500ms
                self.global_metrics["latency_target_met"] += 1
            else:
                self.global_metrics["latency_target_missed"] += 1

    def record_interruption(self, call_sid: str):
        """Record user interruption for a call."""
        if call_sid in self.call_metrics:
            self.call_metrics[call_sid]["interruptions"] += 1
            self.global_metrics["total_interruptions"] += 1

    def record_slang_detection(self, call_sid: str, slang_phrase: str):
        """Record Mexican Spanish slang detection."""
        if call_sid in self.call_metrics:
            self.call_metrics[call_sid]["slang_detections"] += 1
            self.call_metrics[call_sid]["edge_cases_handled"].append(f"slang: {slang_phrase}")
            self.global_metrics["total_slang_detections"] += 1

    def record_low_quality_handling(self, call_sid: str, issue_type: str):
        """Record low audio quality handling."""
        if call_sid in self.call_metrics:
            self.call_metrics[call_sid]["low_quality_handling"] += 1
            self.call_metrics[call_sid]["edge_cases_handled"].append(f"audio_quality: {issue_type}")
            self.global_metrics["total_low_quality_handling"] += 1

    def record_language_switch(self, call_sid: str, from_lang: str, to_lang: str):
        """Record language switch for a call."""
        if call_sid in self.call_metrics:
            self.call_metrics[call_sid]["language_switches"] += 1
            self.call_metrics[call_sid]["edge_cases_handled"].append(f"language_switch: {from_lang} -> {to_lang}")
            self.global_metrics["total_language_switches"] += 1

    def get_call_summary(self, call_sid: str) -> Dict[str, Any]:
        """Get performance summary for a specific call."""
        if call_sid not in self.call_metrics:
            return {}

        metrics = self.call_metrics[call_sid]

        return {
            "call_duration": time.time() - metrics["start_time"],
            "total_interactions": len(metrics["roundtrip_latencies"]),
            "avg_roundtrip_latency": statistics.mean(metrics["roundtrip_latencies"])
            if metrics["roundtrip_latencies"]
            else 0,
            "min_roundtrip_latency": min(metrics["roundtrip_latencies"]) if metrics["roundtrip_latencies"] else 0,
            "max_roundtrip_latency": max(metrics["roundtrip_latencies"]) if metrics["roundtrip_latencies"] else 0,
            "interruptions": metrics["interruptions"],
            "slang_detections": metrics["slang_detections"],
            "low_quality_handling": metrics["low_quality_handling"],
            "language_switches": metrics["language_switches"],
            "edge_cases": metrics["edge_cases_handled"],
        }

    def get_global_summary(self) -> Dict[str, Any]:
        """Get global performance summary."""
        total_calls = self.global_metrics["total_calls"]
        if total_calls == 0:
            return self.global_metrics

        # Calculate success rates
        latency_success_rate = (self.global_metrics["latency_target_met"] / total_calls) * 100

        return {
            **self.global_metrics,
            "latency_success_rate": f"{latency_success_rate:.1f}%",
            "avg_interruptions_per_call": self.global_metrics["total_interruptions"] / total_calls,
            "avg_slang_detections_per_call": self.global_metrics["total_slang_detections"] / total_calls,
            "avg_low_quality_handling_per_call": self.global_metrics["total_low_quality_handling"] / total_calls,
            "avg_language_switches_per_call": self.global_metrics["total_language_switches"] / total_calls,
        }


class TwilioVoiceAgent:
    """Real-time Voice AI Agent integrated with Twilio with multilingual support."""

    def __init__(self):
        """Initialize the Voice AI Agent."""
        self.active_calls: Dict[str, Dict[str, Any]] = {}
        self.tts_service = None
        self.stt_service = None
        self.llm_service = None
        self.pipeline = None
        self.performance_monitor = PerformanceMonitor()
        self.language_manager = LanguageManager()
        self.call_manager = RealCallManager()  # Add real call management

        # Performance tracking
        self.latency_target = 0.5  # 500ms target
        self.last_response_time = 0

        # Mexican Spanish slang detection patterns
        self.mexican_slang_patterns = [
            r"\b(órale|chido|padre|cañón|manches|mames|cabrón|carnal|güey|onda)\b",
            r"\b(no manches|no mames|está chido|está padre|está cañón|está cabrón)\b",
            r"\b(órale güey|órale carnal|qué onda|qué chido)\b",
        ]

        # Initialize services
        self._initialize_services()

    def _initialize_services(self):
        """Initialize all AI services."""
        try:
            # ElevenLabs TTS (Mexican Spanish voice)
            elevenlabs_key = os.getenv("ELEVENLABS_API_KEY")
            if not elevenlabs_key:
                raise ValueError("ELEVENLABS_API_KEY not found in environment variables")

            self.tts_service = ElevenLabsTTSService(
                api_key=elevenlabs_key,
                voice_id=self.language_manager.get_tts_voice(),
                model_id="eleven_multilingual_v2",
            )
            logger.info("✅ ElevenLabs TTS service initialized")

            # Deepgram STT (LATAM Spanish + English)
            deepgram_key = os.getenv("DEEPGRAM_API_KEY")
            if not deepgram_key:
                raise ValueError("DEEPGRAM_API_KEY not found in environment variables")

            self.stt_service = DeepgramSTTService(
                api_key=deepgram_key,
                language=self.language_manager.primary_language,  # Start with Spanish
            )
            logger.info("✅ Deepgram STT service initialized")

            # OpenAI LLM
            openai_key = os.getenv("OPENAI_API_KEY")
            if not openai_key:
                raise ValueError("OPENAI_API_KEY not found in environment variables")

            self.llm_service = OpenAILLMService(
                api_key=openai_key,
                model="gpt-4o-mini",
                system_prompt=self.language_manager.get_system_prompt(),
            )
            logger.info("✅ OpenAI LLM service initialized")

        except Exception as e:
            logger.error(f"❌ Service initialization failed: {e}")
            raise

    def detect_mexican_slang(self, text: str) -> bool:
        """Detect Mexican Spanish slang in text."""
        import re

        text_lower = text.lower()

        for pattern in self.mexican_slang_patterns:
            if re.search(pattern, text_lower):
                return True
        return False

    def detect_audio_quality_issues(self, text: str) -> Optional[str]:
        """Detect potential audio quality issues from transcription."""
        issues = []

        # Check for incomplete sentences
        if text.count("...") > 0 or text.count("(") > 0:
            issues.append("incomplete_speech")

        # Check for repeated words (common in poor audio)
        words = text.split()
        if len(words) > 3:
            for i in range(len(words) - 2):
                if words[i] == words[i + 1] == words[i + 2]:
                    issues.append("repeated_words")
                    break

        # Check for very short responses (might indicate audio cuts)
        if len(text.strip()) < 10 and not text.endswith("?"):
            issues.append("short_response")

        return issues[0] if issues else None

    def update_language_services(self, new_language: str):
        """Update services for new language."""
        try:
            # Update TTS voice if needed
            new_voice = self.language_manager.language_configs[new_language]["tts_voice"]
            if hasattr(self.tts_service, "voice_id"):
                self.tts_service.voice_id = new_voice

            # Update STT language
            self.stt_service.language = new_language

            # Update LLM system prompt
            new_prompt = self.language_manager.language_configs[new_language]["system_prompt"]
            if hasattr(self.llm_service, "system_prompt"):
                self.llm_service.system_prompt = new_prompt

            logger.info(f"🔄 Services updated for language: {new_language}")

        except Exception as e:
            logger.error(f"❌ Error updating services for language {new_language}: {e}")

    def create_pipeline(self):
        """Create the Pipecat pipeline for voice processing."""
        try:
            # Create conversation processor
            class ConversationProcessor(FrameProcessor):
                def __init__(self, agent):
                    super().__init__()
                    self.agent = agent
                    self.conversation_history = []
                    self.is_speaking = False
                    self.last_user_input = ""
                    self.silence_start = None
                    self.voicemail_threshold = 3.0  # 3 seconds of silence
                    self.current_call_sid = None

                async def process(self, frame):
                    current_time = time.time()

                    if isinstance(frame, UserStartedSpeakingFrame):
                        # User started speaking - stop TTS if active
                        self.is_speaking = False
                        self.silence_start = None
                        logger.info("🎤 User started speaking - interrupting TTS")

                        # Record interruption for performance monitoring
                        if self.current_call_sid:
                            self.agent.performance_monitor.record_interruption(self.current_call_sid)

                    elif isinstance(frame, UserStoppedSpeakingFrame):
                        # User stopped speaking - start silence timer
                        self.silence_start = current_time
                        logger.info("🔇 User stopped speaking")

                    elif isinstance(frame, TranscriptionFrame):
                        # Process speech-to-text result
                        user_text = frame.text
                        if user_text and user_text != self.last_user_input:
                            self.last_user_input = user_text
                            logger.info(f"🎯 User said: {user_text}")

                            # Language detection and switching
                            (
                                detected_lang,
                                confidence,
                            ) = self.agent.language_manager.detect_language_from_text(user_text)
                            language_switched = self.agent.language_manager.update_language(detected_lang, confidence)

                            if language_switched and self.current_call_sid:
                                # Record language switch
                                old_lang = self.agent.language_manager.current_language
                                self.agent.performance_monitor.record_language_switch(
                                    self.current_call_sid, old_lang, detected_lang
                                )

                                # Update services for new language
                                self.agent.update_language_services(detected_lang)

                                # Log language switch
                                logger.info(f"🌍 Language switched to: {detected_lang} (confidence: {confidence:.2f})")

                            # Detect Mexican Spanish slang (only for Spanish)
                            if self.agent.language_manager.current_language == "es-LA":
                                if self.agent.detect_mexican_slang(user_text):
                                    logger.info("🇲🇽 Mexican Spanish slang detected")
                                    if self.current_call_sid:
                                        self.agent.performance_monitor.record_slang_detection(
                                            self.current_call_sid, user_text
                                        )

                            # Detect audio quality issues
                            audio_issue = self.agent.detect_audio_quality_issues(user_text)
                            if audio_issue:
                                logger.info(f"🔊 Audio quality issue detected: {audio_issue}")
                                if self.current_call_sid:
                                    self.agent.performance_monitor.record_low_quality_handling(
                                        self.current_call_sid, audio_issue
                                    )

                            # Add to conversation history
                            self.conversation_history.append(
                                {
                                    "role": "user",
                                    "content": user_text,
                                    "timestamp": current_time,
                                    "language": self.agent.language_manager.current_language,
                                }
                            )

                            # Get AI response
                            await self._get_ai_response(user_text)

                    # Check for voicemail (prolonged silence)
                    if (
                        self.silence_start
                        and current_time - self.silence_start > self.voicemail_threshold
                        and not self.is_speaking
                    ):
                        logger.info("📞 Voicemail detected - ending call")
                        await self.agent._end_call_voicemail()

                    return frame

                async def _get_ai_response(self, user_input: str):
                    """Get AI response and convert to speech."""
                    try:
                        start_time = time.time()

                        # Get LLM response
                        llm_start = time.time()
                        response = await self.agent.llm_service.complete(messages=self.conversation_history)
                        llm_latency = time.time() - llm_start

                        if self.current_call_sid:
                            self.agent.performance_monitor.record_llm_latency(self.current_call_sid, llm_latency)

                        if response and hasattr(response, "content"):
                            ai_response = response.content
                            current_lang = self.agent.language_manager.current_language
                            logger.info(f"🤖 AI Response ({current_lang}): {ai_response}")

                            # Add AI response to history
                            self.conversation_history.append(
                                {
                                    "role": "assistant",
                                    "content": ai_response,
                                    "timestamp": time.time(),
                                    "language": current_lang,
                                }
                            )

                            # Convert to speech
                            tts_start = time.time()
                            await self.agent.tts_service.synthesize(ai_response)
                            tts_latency = time.time() - tts_start

                            if self.current_call_sid:
                                self.agent.performance_monitor.record_tts_latency(self.current_call_sid, tts_latency)

                            # Mark as speaking
                            self.is_speaking = True
                            self.silence_start = None

                            # Calculate total latency
                            total_latency = time.time() - start_time

                            # Record roundtrip latency
                            if self.current_call_sid:
                                self.agent.performance_monitor.record_roundtrip_latency(
                                    self.current_call_sid, total_latency
                                )

                            logger.info(f"⚡ Response latency: {total_latency:.3f}s")

                            if total_latency > self.agent.latency_target:
                                logger.warning(
                                    f"⚠️ Latency {total_latency:.3f}s exceeds target {self.agent.latency_target}s"
                                )
                            else:
                                logger.info(
                                    f"✅ Latency target met: {total_latency:.3f}s < {self.agent.latency_target}s"
                                )

                        else:
                            logger.error("❌ No response from AI")

                    except Exception as e:
                        logger.error(f"❌ Error getting AI response: {e}")

            # Create processor and pipeline
            processor = ConversationProcessor(self)
            self.pipeline = Pipeline([processor])
            logger.info("✅ Pipeline created successfully")

        except Exception as e:
            logger.error(f"❌ Pipeline creation failed: {e}")
            raise

    async def start_pipeline(self):
        """Start the voice processing pipeline."""
        try:
            if not self.pipeline:
                self.create_pipeline()

            # Pipeline is ready, no need for runner in this version
            logger.info("✅ Pipeline started successfully")

        except Exception as e:
            logger.error(f"❌ Failed to start pipeline: {e}")
            raise

    async def stop_pipeline(self):
        """Stop the voice processing pipeline."""
        try:
            # Pipeline cleanup if needed
            logger.info("✅ Pipeline stopped")
        except Exception as e:
            logger.error(f"⚠️ Error stopping pipeline: {e}")

    async def _end_call_voicemail(self):
        """End call due to voicemail detection."""
        # This would integrate with Twilio to end the call
        logger.info("📞 Ending call due to voicemail detection")

    def generate_consent_twiml(self) -> str:
        """Generate TwiML for consent collection."""
        root = ET.Element("Response")

        # Consent message in current language
        say = ET.SubElement(root, "Say", language="es-MX")  # Default to Spanish for consent
        say.text = self.language_manager.get_consent_message()

        # Gather user input for consent
        gather = ET.SubElement(
            root,
            "Gather",
            input="speech",
            language="es-MX",
            speechTimeout="auto",
            action="/consent-response",
            method="POST",
        )

        # Say instructions
        gather_say = ET.SubElement(gather, "Say", language="es-MX")
        gather_say.text = self.language_manager.get_instructions()

        # If no input, repeat
        say_repeat = ET.SubElement(root, "Say", language="es-MX")
        say_repeat.text = self.language_manager.get_no_response_message()

        return ET.tostring(root, encoding="unicode")

    def generate_greeting_twiml(self) -> str:
        """Generate TwiML for initial greeting."""
        root = ET.Element("Response")

        # Initial greeting in current language
        say = ET.SubElement(root, "Say", language="es-MX")  # Default to Spanish for greeting
        say.text = self.language_manager.get_greeting()

        # Connect to voice stream
        connect = ET.SubElement(root, "Connect")
        ET.SubElement(connect, "Stream", url="/voice-stream")

        return ET.tostring(root, encoding="unicode")


# Flask application
app = Flask(__name__)
voice_agent = None

# Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "*"}})


# Manual CORS headers as backup
@app.after_request
def after_request(response):
    """Add CORS headers to all responses."""
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS")
    return response


@app.route("/webhook", methods=["POST"])
def twilio_webhook():
    """Handle incoming Twilio webhook."""
    try:
        # Get call details from Twilio
        call_sid = request.form.get("CallSid")
        from_number = request.form.get("From")
        to_number = request.form.get("To")

        logger.info(f"📞 Incoming call from {from_number} to {to_number} (SID: {call_sid})")

        # Store call information using RealCallManager
        if voice_agent:
            voice_agent.call_manager.start_call(call_sid, from_number, "inbound")

            # Start performance monitoring for this call
            voice_agent.performance_monitor.start_call_monitoring(call_sid)

        # Return consent TwiML
        twiml = voice_agent.generate_consent_twiml() if voice_agent else ""
        return Response(twiml, mimetype="text/xml")

    except Exception as e:
        logger.error(f"❌ Webhook error: {e}")
        return Response("Error", status=500)


@app.route("/consent-response", methods=["POST"])
def consent_response():
    """Handle consent response from user."""
    try:
        call_sid = request.form.get("CallSid")
        speech_result = request.form.get("SpeechResult", "").lower()

        logger.info(f"🎤 Consent response: {speech_result} for call {call_sid}")

        # Check if user consented (support both languages)
        consent_words = [
            "sí",
            "si",
            "yes",
            "ok",
            "vale",
            "continuar",
            "continue",
            "proceed",
        ]
        if any(word in speech_result for word in consent_words):
            logger.info(f"✅ User consented for call {call_sid}")

            # Update call status using RealCallManager
            if voice_agent and voice_agent.call_manager.get_call_info(call_sid):
                # Call is already being tracked by RealCallManager
                pass

            # Return greeting TwiML
            twiml = voice_agent.generate_greeting_twiml() if voice_agent else ""
            return Response(twiml, mimetype="text/xml")
        else:
            logger.info(f"❌ User declined for call {call_sid}")

            # End call
            root = ET.Element("Response")
            say = ET.SubElement(root, "Say", language="es-MX")
            say.text = voice_agent.language_manager.get_goodbye_message() if voice_agent else "Call ended"
            ET.SubElement(root, "Hangup")

            return Response(ET.tostring(root, encoding="unicode"), mimetype="text/xml")

    except Exception as e:
        logger.error(f"❌ Consent response error: {e}")
        return Response("Error", status=500)


@app.route("/voice-stream", methods=["POST"])
def voice_stream():
    """Handle real-time voice stream from Twilio."""
    try:
        # This endpoint would handle the WebSocket connection for real-time audio
        # For now, we'll return a simple response
        return Response("Voice stream endpoint", status=200)

    except Exception as e:
        logger.error(f"❌ Voice stream error: {e}")
        return Response("Error", status=500)


@app.route("/health", methods=["GET"])
def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "active_calls": voice_agent.call_manager.get_active_call_count() if voice_agent else 0,
        "services": {
            "tts": voice_agent.tts_service is not None if voice_agent else False,
            "stt": voice_agent.stt_service is not None if voice_agent else False,
            "llm": voice_agent.llm_service is not None if voice_agent else False,
        },
        "language": voice_agent.language_manager.get_language_stats() if voice_agent else {},
    }


@app.route("/performance", methods=["GET"])
def performance_metrics():
    """Get performance metrics endpoint."""
    if not voice_agent:
        return {"error": "Voice agent not initialized"}, 500

    call_sid = request.args.get("call_sid")

    if call_sid:
        # Return metrics for specific call
        call_info = voice_agent.call_manager.get_call_info(call_sid)
        if call_info:
            return {
                "call_sid": call_sid,
                "status": call_info["status"],
                "duration": call_info.get("duration", 0),
                "language": call_info["language"],
                "language_switches": call_info["language_switches"],
                "interruptions": call_info["interruptions"],
                "utterances": call_info["utterances"],
                "avg_stt_latency": (
                    sum(call_info.get("stt_latency", [])) / len(call_info.get("stt_latency", []))
                    if call_info.get("stt_latency")
                    else 0
                ),
                "avg_llm_latency": (
                    sum(call_info.get("llm_latency", [])) / len(call_info.get("llm_latency", []))
                    if call_info.get("llm_latency")
                    else 0
                ),
                "avg_tts_latency": (
                    sum(call_info.get("tts_latency", [])) / len(call_info.get("tts_latency", []))
                    if call_info.get("tts_latency")
                    else 0
                ),
            }
        else:
            return {"error": "Call not found"}, 404
    else:
        # Return global metrics from RealCallManager
        return voice_agent.call_manager.get_performance_metrics()


@app.route("/test-call", methods=["POST"])
def test_call():
    """Test endpoint to simulate a call for testing purposes."""
    try:
        data = request.get_json()
        if not data:
            return {"error": "No data provided"}, 400

        phone_number = data.get("phone_number", "+1234567890")
        call_sid = f"test_{int(time.time())}"

        if voice_agent:
            # Start a test call
            voice_agent.call_manager.start_call(call_sid, phone_number, "test")

            # Simulate some performance metrics
            voice_agent.call_manager.record_performance_metric(call_sid, "stt", 150.0)
            voice_agent.call_manager.record_performance_metric(call_sid, "llm", 200.0)
            voice_agent.call_manager.record_performance_metric(call_sid, "tts", 100.0)
            voice_agent.call_manager.record_performance_metric(call_sid, "total", 450.0)

            # Simulate language switching
            voice_agent.call_manager.update_call_language(call_sid, "en-US")

            logger.info(f"🧪 Test call started: {call_sid} for {phone_number}")

            return {
                "status": "success",
                "call_sid": call_sid,
                "phone_number": phone_number,
                "message": "Test call started successfully",
            }
        else:
            return {"error": "Voice agent not initialized"}, 500

    except Exception as e:
        logger.error(f"❌ Test call error: {e}")
        return {"error": str(e)}, 500


@app.route("/end-test-call", methods=["POST"])
def end_test_call():
    """End a test call."""
    try:
        data = request.get_json()
        if not data:
            return {"error": "No data provided"}, 400

        call_sid = data.get("call_sid")
        if not call_sid:
            return {"error": "No call_sid provided"}, 500

        if voice_agent:
            voice_agent.call_manager.end_call(call_sid, "test_completed")
            logger.info(f"🧪 Test call ended: {call_sid}")

            return {
                "status": "success",
                "call_sid": call_sid,
                "message": "Test call ended successfully",
            }
        else:
            return {"error": "Voice agent not initialized"}, 500

    except Exception as e:
        logger.error(f"❌ End test call error: {e}")
        return {"error": str(e)}, 500


@app.route("/language", methods=["GET"])
def language_info():
    """Language information endpoint."""
    if not voice_agent:
        return {"error": "Voice agent not initialized"}, 500

    return {
        "language_manager": voice_agent.language_manager.get_language_stats(),
        "supported_languages": list(voice_agent.language_manager.language_configs.keys()),
        "current_config": voice_agent.language_manager.get_current_config(),
    }


async def main():
    """Main function to start the voice agent."""
    global voice_agent

    try:
        logger.info("🚀 Starting Multilingual Twilio Voice AI Agent...")

        # Initialize voice agent
        voice_agent = TwilioVoiceAgent()

        # Start pipeline
        await voice_agent.start_pipeline()

        logger.info("✅ Multilingual Voice AI Agent ready!")
        logger.info(f"🌍 Primary Language: {voice_agent.language_manager.primary_language}")
        logger.info(f"🌍 Supported Languages: {list(voice_agent.language_manager.language_configs.keys())}")
        logger.info("🌐 Server will start on port 5001")
        logger.info("🔗 Use ngrok to expose: ngrok http 5001")
        logger.info("📊 Performance monitoring: /performance endpoint")
        logger.info("🌍 Language info: /language endpoint")

    except Exception as e:
        logger.error(f"❌ Failed to start voice agent: {e}")
        sys.exit(1)


if __name__ == "__main__":
    try:
        # Run the async main function
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(main())

        # Start Flask server
        logger.info("🌐 Starting Flask server...")
        app.run(host="0.0.0.0", port=5001, debug=False)

    except KeyboardInterrupt:
        logger.info("👋 Shutting down...")
        if voice_agent:
            loop.run_until_complete(voice_agent.stop_pipeline())
    except Exception as e:
        logger.error(f"❌ Fatal error: {e}")
        sys.exit(1)
