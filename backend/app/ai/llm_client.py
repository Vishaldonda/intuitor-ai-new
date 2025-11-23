"""
Gemini LLM client for AI-powered question generation and evaluation.
Handles all interactions with Google's Gemini API.
"""
import google.generativeai as genai
from app.core.config import settings
from typing import Dict, Any, Optional
import json

class GeminiClient:
    """Wrapper around Google Gemini API"""
    
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel(settings.GEMINI_MODEL)
        
        # Generation config for consistent outputs
        self.generation_config = {
            "temperature": 0.7,
            "top_p": 0.95,
            "top_k": 40,
            "max_output_tokens": 2048,
        }
    
    async def generate_content(
        self, 
        prompt: str, 
        temperature: float = 0.7,
        json_mode: bool = False
    ) -> str:
        """
        Generate content using Gemini.
        
        Args:
            prompt: The prompt to send to the model
            temperature: Controls randomness (0.0 = deterministic, 1.0 = creative)
            json_mode: If True, instructs model to return valid JSON
        
        Returns:
            Generated text response
        """
        try:
            config = self.generation_config.copy()
            config["temperature"] = temperature
            
            if json_mode:
                prompt = f"{prompt}\n\nIMPORTANT: Return ONLY valid JSON, no markdown or extra text."
            
            response = self.model.generate_content(
                prompt,
                generation_config=config
            )
            
            return response.text
        
        except Exception as e:
            print(f"❌ Gemini API Error: {e}")
            raise
    
    async def generate_json(self, prompt: str, temperature: float = 0.7) -> Dict[str, Any]:
        """
        Generate structured JSON output.
        Automatically parses and validates JSON response.
        """
        response_text = await self.generate_content(prompt, temperature, json_mode=True)
        
        # Clean markdown code blocks if present
        response_text = response_text.strip()
        if response_text.startswith("```json"):
            response_text = response_text[7:]
        if response_text.startswith("```"):
            response_text = response_text[3:]
        if response_text.endswith("```"):
            response_text = response_text[:-3]
        
        try:
            return json.loads(response_text.strip())
        except json.JSONDecodeError as e:
            print(f"❌ JSON Parse Error: {e}")
            print(f"Response: {response_text}")
            raise ValueError("Failed to parse JSON from LLM response")
    
    async def chat(self, messages: list[Dict[str, str]]) -> str:
        """
        Multi-turn conversation with context.
        
        Args:
            messages: List of {"role": "user/model", "parts": "text"}
        """
        chat = self.model.start_chat(history=messages[:-1])
        response = chat.send_message(messages[-1]["parts"])
        return response.text

# Global Gemini client instance
gemini_client = GeminiClient()
