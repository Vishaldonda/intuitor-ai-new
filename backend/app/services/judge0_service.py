"""
Judge0 API integration for code execution and testing.
Runs user code against test cases in a sandboxed environment.
"""
import httpx
import asyncio
import base64
from app.core.config import settings
from typing import List, Dict, Any

class Judge0Service:
    """Handles code execution via Judge0 API"""
    
    def __init__(self):
        self.api_url = settings.JUDGE0_API_URL
        self.api_key = settings.JUDGE0_API_KEY
        self.headers = {
            "X-RapidAPI-Key": self.api_key,
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "Content-Type": "application/json"
        }
        
        # Language ID mapping
        self.language_ids = {
            "python": 71,
            "javascript": 63,
            "java": 62,
            "cpp": 54,
            "c": 50
        }
    
    async def run_test_cases(
        self,
        code: str,
        language: str,
        test_cases: List[Dict[str, Any]]
    ) -> List[Dict[str, Any]]:
        """
        Run code against multiple test cases.
        
        Args:
            code: User's source code
            language: Programming language
            test_cases: List of test cases with input/expected_output
        
        Returns:
            List of test results with pass/fail status
        """
        results = []
        
        for test_case in test_cases:
            result = await self.execute_code(
                code=code,
                language=language,
                stdin=test_case.get("input", ""),
                expected_output=test_case.get("expected_output", "")
            )
            
            results.append({
                "input": test_case.get("input"),
                "expected_output": test_case.get("expected_output"),
                "actual_output": result.get("stdout", ""),
                "passed": result.get("passed", False),
                "error": result.get("stderr", ""),
                "execution_time": result.get("time", 0),
                "memory_used": result.get("memory", 0)
            })
        
        return results
    
    async def execute_code(
        self,
        code: str,
        language: str,
        stdin: str = "",
        expected_output: str = ""
    ) -> Dict[str, Any]:
        """
        Execute code with Judge0.
        
        Args:
            code: Source code to execute
            language: Programming language
            stdin: Standard input for the program
            expected_output: Expected output for comparison
        
        Returns:
            Execution result with output, errors, and status
        """
        language_id = self.language_ids.get(language.lower(), 71)
        
        # Encode code and input
        encoded_code = base64.b64encode(code.encode()).decode()
        encoded_stdin = base64.b64encode(stdin.encode()).decode()
        encoded_expected = base64.b64encode(expected_output.encode()).decode()
        
        # Submit code for execution
        submission_data = {
            "source_code": encoded_code,
            "language_id": language_id,
            "stdin": encoded_stdin,
            "expected_output": encoded_expected
        }
        
        async with httpx.AsyncClient() as client:
            # Submit code
            response = await client.post(
                f"{self.api_url}/submissions",
                json=submission_data,
                headers=self.headers,
                params={"base64_encoded": "true", "wait": "false"}
            )
            
            if response.status_code != 201:
                return {
                    "error": "Submission failed",
                    "passed": False
                }
            
            token = response.json().get("token")
            
            # Poll for result
            result = await self._poll_result(client, token)
            
            return result
    
    async def _poll_result(
        self,
        client: httpx.AsyncClient,
        token: str,
        max_attempts: int = 10
    ) -> Dict[str, Any]:
        """
        Poll Judge0 for execution result.
        
        Args:
            client: HTTP client
            token: Submission token
            max_attempts: Maximum polling attempts
        
        Returns:
            Execution result
        """
        for _ in range(max_attempts):
            response = await client.get(
                f"{self.api_url}/submissions/{token}",
                headers=self.headers,
                params={"base64_encoded": "true"}
            )
            
            if response.status_code != 200:
                await asyncio.sleep(0.5)
                continue
            
            result = response.json()
            status_id = result.get("status", {}).get("id")
            
            # Status 1-2 = In Queue/Processing, 3 = Accepted
            if status_id in [1, 2]:
                await asyncio.sleep(0.5)
                continue
            
            # Decode outputs
            stdout = self._decode_base64(result.get("stdout", ""))
            stderr = self._decode_base64(result.get("stderr", ""))
            compile_output = self._decode_base64(result.get("compile_output", ""))
            
            return {
                "stdout": stdout,
                "stderr": stderr,
                "compile_output": compile_output,
                "status": result.get("status", {}).get("description", "Unknown"),
                "time": result.get("time"),
                "memory": result.get("memory"),
                "passed": status_id == 3,  # 3 = Accepted
                "status_id": status_id
            }
        
        return {
            "error": "Execution timeout",
            "passed": False
        }
    
    def _decode_base64(self, encoded: str) -> str:
        """Safely decode base64 string"""
        if not encoded:
            return ""
        try:
            return base64.b64decode(encoded).decode()
        except Exception:
            return encoded

# Global Judge0 service instance
judge0_service = Judge0Service()
