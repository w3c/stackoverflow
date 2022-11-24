#!/usr/bin/env python
from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup
import json
import os
import re
import time
import urllib.parse

driver=webdriver.Firefox()
tags = json.load(open("tags.json", "r"))
ranges = ["1d", "7d", "1m", "1y", "all"]
counts = {}
url = "https://stackoverflow.com/"
driver.get(url)
driver.add_cookie({"name": "acct",
                   "value": os.getenv("SO_ACCT_COOKIE")})
driver.get(url)
for category in [*tags]:
    if category == "Browsers":
        continue
    countsPerRange = {}
    print(category)
    query = urllib.parse.quote_plus(
        " or ".join(map(lambda x: "[{}]".format(x), tags[category])))
    for range in ranges:
        time.sleep(60)
        url = "https://stackoverflow.com/search?q=" + query \
            + "+is:question+created:" + range + ".."
        driver.get(url)
        wait = WebDriverWait(driver, 1)
        get_url = driver.current_url
        wait.until(EC.url_to_be(url))
        if get_url == url:
            page_source = driver.page_source
            soup = BeautifulSoup(page_source,features="html.parser")
            count = int(soup.find(string=re.compile('[0-9]+ result[s]?'))
                .strip().split(" ", 1)[0]
                .replace(",",""))
            countsPerRange[range] = count
            print("  " + range+ ": " + str(count))
    counts[category] = countsPerRange
    with open('counts.json', 'w', encoding='utf-8') as f:
        json.dump(counts, f, ensure_ascii=False, indent=4)
driver.quit()
with open('counts.json', 'w', encoding='utf-8') as f:
    json.dump(counts, f, ensure_ascii=False, indent=4)
