#!/usr/bin/env python
# -*- coding:utf-8 -*-

__author__ = 'xiaoghu@cisco.com'

import os
import re
import urllib
#import multiprocessing as mp
import codecs
import time
import random
#import ipaddr
import datetime
#import traceback
from selenium import webdriver
#from selenium.webdriver.common.proxy import *
#from selenium.common.exceptions import TimeoutException
#from selenium.webdriver.support.ui import WebDriverWait # available since 2.4.0
from selenium.webdriver.support import expected_conditions as EC
import time
from selenium.webdriver.common.by import By
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities


def search(word):
    try:
        driver.find_element_by_id("keyword").clear()
        driver.find_element_by_id("keyword").send_keys(word)
        driver.find_element_by_id("su").click()
    except Exception as e:
        print "error click"
        pass
    time.sleep(random.randint(1, 1))
    elem = driver.find_element_by_xpath("//*")
    source_code = elem.get_attribute("outerHTML")
    leftCount = 0
    rightCount = 0
    try:
        leftCount = len(driver.find_elements_by_css_selector("#m-spread-left ul li"))
    except Exception as e:
        pass
    try:
        rightCount = len(driver.find_elements_by_css_selector("#rightbox li"))
    except Exception as e:
        pass
    
    f = codecs.open('./result/360.txt','a','utf8')
    f.write(words[word]+","+str(leftCount)+","+str(rightCount)+"\n")
    f.close()
    print "%s: %d,%d" %(word,leftCount,rightCount)
#dc=DesiredCapabilities.HTMLUNIT
#test_host =
#test_port = 
#server_url = "http://%s:%s/wd/hub" % (test_host, test_port)
driver = webdriver.Firefox()
#driver = webdriver.Remote(
words = {}
wordlist = []
def main():
    path = "./result/360.txt"
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
    
    driver.get("http://www.so.com/s?q=hehe");
    time.sleep(2)
    for w in wordlist:
        search(w)
        time.sleep(random.randint(2,5))
        
if __name__ == '__main__':
    print "start"
    main()
    print "finished"
    pass
