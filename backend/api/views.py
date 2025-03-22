from django.shortcuts import render
import json
import requests
import google.generativeai as genai
from django.http import StreamingHttpResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.views import View
import time
from bs4 import BeautifulSoup
import re

genai.configure(api_key='AIzaSyDquJr4Ph35GmvfNeKihNxGVMurky_NYqU')

generation_config = {
    "temperature": 0.5,
    "top_p": 1,
    "top_k": 1,
    "max_output_tokens": 2048,
}

def scrape_link_content(url):
    try:
        response = requests.get(url, timeout=10)
        soup = BeautifulSoup(response.text, 'html.parser')
        return soup.get_text(separator=' ', strip=True)[:5000]
    except Exception as e:
        print(f"Error scraping {url}: {e}")
        return None

def generate_gemini_response(prompt, link_contents=None):
    try:
        model = genai.GenerativeModel(model_name="gemini-1.5-pro", 
                                    generation_config=generation_config)
        base_prompt = (
            "Assume that your name is Vox, a helpful AI assistant. Respond in a friendly and "
            "engaging way. Do not mention that you are associated with Google. Act like a "
            "personal assistant named Vox. Here is the user's query: "
        )
        
        if link_contents:
            link_context = "\n\nLink Contexts:\n" + "\n".join(
                [f"Content from {url}:\n{content}" 
                 for url, content in link_contents.items() if content]
            )
            full_prompt = base_prompt + prompt + link_context
        else:
            full_prompt = base_prompt + prompt

        response = model.generate_content(full_prompt, stream=True)
        return response
    except Exception as e:
        raise Exception("Error generating response: " + str(e))

def event_stream(prompt):
    try:
        url_pattern = r'https?://\S+'
        urls = re.findall(url_pattern, prompt)
        unique_urls = list(set(urls))

        link_contents = {}
        
        if unique_urls:
            yield "data: Scraping links...\n\n"
            
            for url in unique_urls:
                content = scrape_link_content(url)
                if content:
                    link_contents[url] = content
                else:
                    link_contents[url] = "Could not retrieve content from this link"

        yield "data: Thinking...\n\n"
        
        response = generate_gemini_response(prompt, link_contents if unique_urls else None)
        
        for chunk in response:

            yield f"data: {chunk.text.replace('\n', '\\n')}\n\n"
        yield "data: [DONE]\n\n"
    except Exception as e:

        yield f"data: Error: {str(e)}\n\n"
        yield "data: [DONE]\n\n"

@method_decorator(csrf_exempt, name='dispatch')
class ChatSSE(View):
    def get(self, request):
        prompt = request.GET.get('message', '')
        return StreamingHttpResponse(event_stream(prompt), 
               content_type='text/event-stream')