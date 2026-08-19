# Autonomous Agent
from dotenv import load_dotenv
load_dotenv()

import os
import requests
from bs4 import BeautifulSoup 
from tavily import TavilyClient
from rich import print
from langchain.tools import tool




tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))

@tool 
def web_search(query: str)->str:
    """search the web for the given query and return the title, urls and snippets"""
    response = tavily_client.search(
            query=query,
            # search_depth="basic",
            max_results=3
            # topic="news"
        )
    
    output = []

    for r in response['results']:
        output.append(
            f"Title: {r['title']}\nURL: {r['url']}\nSnippet: {r['content'][:300]}\n"
        )
    
    return "\n---\n".join(output)

@tool
def scrap_url(url: str)-> str:
    """Scraps and return clean text content from the given URL"""
    try:
        resp = requests.get(url, timeout=8, headers={"User-Agent": "Mozilla/5.0"})
        soup = BeautifulSoup(resp.text, "html.parser")
        for tag in soup(["script", "style","nav", "footer"]):
            tag.decompose()
        return soup.get_text(separator=" ", strip=True)[:3000]
    except Exception as e:
        return f"Could Not scrap Url: {str(e)}"


