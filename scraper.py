import requests
from bs4 import BeautifulSoup

def scrape_wikipedia(url):
    headers = {
        "User-Agent": "Mozilla/5.0"
    }

    response = requests.get(url, headers=headers)

    if response.status_code != 200:
        return {"error": f"Failed with status {response.status_code}"}

    soup = BeautifulSoup(response.text, "html.parser")

    title = soup.find("h1").text

    paragraphs = soup.find_all("p")
    content = " ".join([p.text for p in paragraphs])

    return {
        "title": title,
        "content": content[:1500]
    }