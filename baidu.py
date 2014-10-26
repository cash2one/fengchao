#!/usr/bin/env python
# -*- coding:utf-8 -*-

__author__ = 'xiaoghu@cisco.com'

import os
import re
import urllib
#import multiprocessing as mp
import codecs
import time
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



def search(word):
    try:
        driver.find_element_by_id("kw").clear()
        driver.find_element_by_id("kw").send_keys(word)
        driver.find_element_by_id("su").click()
    except Exception as e:
        pass
    i=0
    j=0
    for i in range(0,9):
        try:
            driver.find_element_by_id("bdfs"+i)
        except Exception as e:
            print e
            break

    print i;
    for j in range(0,9):
        try:
            driver.find_element_by_id("300"+j)
        except Exception as e:
            print e
            break
    if j==0:
        print "in gray box"
        for j in range(0,9):
            try:
                driver.find_element_by_id("400"+j)
            except Exception as e:
                print e
                break
    print j

driver = webdriver.Firefox()
def main():
    lines = codecs.open('./5755.txt', 'r', 'utf8').readlines()
    print len(lines)
    words = {}
    for line in lines:
        line = line.replace('\r','').replace('\n','')
        word = line.split(",")[0]
        words[word] = line
        pass
    
    driver.get("http://www.baidu.com");
    for (d,x) in words.items():
        search(d)
        time.sleep(8)
        
if __name__ == '__main__':
    print "start"
    main()
    print "finished"
    pass
