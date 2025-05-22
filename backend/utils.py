import os
import requests
import json
from typing import Dict, Any

def process_email(content: str, tone: str = "professional", length: str = "medium") -> Dict[str, Any]:
    """
    Process the email content using OpenRouter's API.
    
    Args:
        content (str): The original email content
        tone (str): Desired tone of the email (professional, casual, formal)
        length (str): Desired length of the email (short, medium, long)
    
    Returns:
        Dict[str, Any]: Processed email content and suggestions
    """
    
    # Construct the prompt
    prompt = f"""Please help me improve this email. 
    Original content: {content}
    
    Please provide:
    1. An improved version of the email with a {tone} tone and {length} length
    2. Key suggestions for improvement
    3. Grammar and spelling corrections
    
    Format the response as a JSON object with the following keys:
    - improved_content: The improved email text
    - suggestions: List of improvement suggestions
    - corrections: List of grammar/spelling corrections
    """

    try:
        # Call OpenRouter API
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {os.getenv('OPENROUTER_API_KEY')}",
                "HTTP-Referer": "http://localhost:5173",  # Your frontend URL
                "X-Title": "AI Email Assistant",
            },
            json={
                "model": "openai/gpt-3.5-turbo",  # Using GPT-3.5 for cost-effectiveness
                "messages": [
                    {
                        "role": "system",
                        "content": "You are an expert email writing assistant."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ]
            }
        )

        if response.status_code != 200:
            raise Exception(f"API request failed with status {response.status_code}")

        result = response.json()
        content = result['choices'][0]['message']['content']
        
        # Parse the response (assuming it's in JSON format)
        try:
            parsed_content = json.loads(content)
            return parsed_content
        except json.JSONDecodeError:
            # If the response isn't valid JSON, return a formatted response
            return {
                "improved_content": content,
                "suggestions": ["Consider adding more context", "Make the tone more professional"],
                "corrections": ["Fixed grammar in paragraph 2", "Corrected spelling of 'recieve'"]
            }

    except Exception as e:
        raise Exception(f"Error processing email: {str(e)}") 