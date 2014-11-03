#!/usr/bin/env python
# -*- coding:utf-8 -*-

__author__ = 'xiaoghu@cisco.com'

import os
import re
import urllib
import codecs
import time
import random
import datetime
from selenium import webdriver
from selenium.webdriver.support import expected_conditions as EC
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities

def search(word):
    try:
        driver.find_element_by_css_selector("a.qreset2").click()
        driver.find_element_by_id("upquery").send_keys(word)
        driver.find_element_by_id("searchBtn").click()
    except Exception as e:
        print "error click"
        pass
    time.sleep(random.randint(1, 4))
    i=0
    j=0
    k=0
    leftCount = 0
    rightCount = 0
    try:
        leftCount = len(driver.find_elements_by_css_selector(".business ol li"))
    except Exception as e:
        pass
    try:
        rightCount = len(driver.find_elements_by_css_selector(".atTrunk .b_rb"))
    except Exception as e:
        pass
    
    f = codecs.open('./result/sogou.txt','a','utf8')
    f.write(words[word]+","+str(leftCount)+","+str(rightCount)+"\n")
    f.close()
    print "%s: %d,%d" %(word,leftCount,rightCount)

driver = webdriver.Firefox()
words = {}
wordlist = []
def main():
    path = "./result/sogou.txt"
    if os.path.exists(path):
        doneItems = codecs.open(path,'r','utf8').readlines()
    else:
        doneItems = []
    print len(doneItems)
    done = {}
    for item in doneItems:
        word = item.split(',')[0]
        done[word]=True
    
    lines = codecs.open('./5755.txt', 'r', 'utf8').readlines()
    print len(lines)
    
    for line in lines:
        line = line.replace('\r','').replace('\n','')
        word = line.split(",")[0]
        words[word] = line

        try:
            x=done[word]
        except KeyError as e:
            wordlist.append(word)
        pass
    
    driver.get("http://www.sogou.com/web?query=hehe");
    time.sleep(2)
    for w in wordlist:
        search(w)
        time.sleep(random.randint(5, 9))
        
if __name__ == '__main__':
    print "start"
    main()
    print "finished"
    pass
