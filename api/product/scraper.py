"""
Function for web scraping.
"""
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from bs4 import BeautifulSoup as bs

from core.models import Product
from product.serializers import ProductSerializer


def get_driver():
    options = Options()
    options.add_argument('--headless')
    options.add_argument('--no-sandbox')
    options.add_argument("--disable-dev-shm-usage")
    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    return driver


def scrape_mercari(soup):
    try:
        if (soup.find("mer-item-thumbnail")["sticker"] == 'sold'):
            payload = {'has_stock': False}
    except:
        if soup.find("mer-price"):
            name = soup.find("title").text
            price = soup.find("mer-price")["value"]
            payload = {'market': 'メルカリ', 'name': name, 'price': price}
        else:
            payload = {'has_stock': False}

    return payload


def scrape_rakuma(soup):
    try:
        if (soup.find("span",{"class":"soldout"}).text == 'SOLDOUT'):
            payload = {'has_stock': False}
    except:
        try:
            name = soup.find("h1",{"class":"item__name"}).text
            price = soup.find("span",{"class":"item__value"}).text.split('￥')[1]
            payload = {'market': 'ラクマ', 'name': name, 'price': price}
        except:
            payload = {'has_stock': False}

    return payload


def scrape_paypay(soup):
    if soup.find("img",{"alt":"sold"}):
        payload = {'has_stock': False}
    else:
        try:
            name = soup.find("h1",{"class":"ItemTitle__Component"}).text
            price = soup.find("span",{"class":"ItemPrice__Component"}).text.replace('円','')
            payload = {'market': 'paypayフリマ', 'name': name, 'price': price}
        except:
            payload = {'has_stock': False}

    return payload

def update_with_payload(product, payload):

    serializer = ProductSerializer()

    if 'has_stock' in payload:
        serializer.update(product, payload)

    elif product.name == "":
        data = {
            'market': payload['market'],
            'name': payload['name'],
            'current_price': payload['price'],
            'initial_price': payload['price']
        }
        serializer.update(product, data)

    else:
        data = {
            'name': payload['name'],
            'current_price': payload['price'],
        }
        serializer.update(product, data)

def scrape(request):
    driver = get_driver()
    products = Product.objects.get(user=request.user)
    for product in products:

        if product.has_stock == False:
            continue

        url = product.url
        driver.get(url)
        soup = bs(driver.page_source,"html.parser")

        if 'mercari' in url:
            WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, 'item-info')))
            payload = scrape_mercari(soup)

        elif 'fril' in url:
            payload = scrape_rakuma(soup)

        elif 'paypay' in url:
            payload = scrape_paypay(soup)

        update_with_payload(product, payload)
