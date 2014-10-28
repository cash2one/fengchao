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
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities


def search(word):
    try:
        driver.find_element_by_id("kw").clear()
        driver.find_element_by_id("kw").send_keys(word)
        time.sleep(3)
        driver.find_element_by_id("su").click()
    except Exception as e:
        print "error click"
        pass
    
    i=0
    j=0
    k=0
    regexp = re.compile(r'bdfs\d')
    elem = driver.find_element_by_xpath("//*")
    source_code = elem.get_attribute("outerHTML")
    arrRight = regexp.findall(source_code)
    i= len(arrRight) / 2
    #for i in range(0,9):
    #    try:
    #        driver.find_element_by_id("bdfs"+str(i))
    #    except Exception as e:
    #        #print "error detact right ad"
    #        break
    regexp = re.compile(r'[\"|\']300\d[\"\']')
    arrLeft = regexp.findall(source_code)
    j = len(arrLeft)/2
    #print i;
    #for j in range(0,9):
    #    try:
    #        driver.find_element_by_id("300"+str(j))
    #    except Exception as e:
            #print "error detact left ad"
    #        break
    if j==0:
        print "in gray box"
        k=1
        try:
            elems = driver.find_elements_by_css_selector("#content_left > table")
            j=len(elems)/2
        except Exception as e:
            print "error detact left ad"
        #regexp = re.compile(r'[\"|\']400\d[\"\']')
        #regexp = re.compile(r'<table.*?<\/table>(?=<br\/>)')
        #arrLeft = regexp.findall(source_code)
        #j == len(arrLeft)/2
        #print j
    m=0
    try:
        borders = driver.find_elements_by_css_selector(".c-border")
        m = len(borders)
    except Exception as e:
        pass
    if m > 0:
        m=1
    f = codecs.open('./result/baidu.txt','a','utf8')
    f.write(words[word]+","+str(j)+","+str(i)+","+str(k)+","+str(m)+"\n")
    f.close()
    print "%s: %d,%d,%d,%d" %(word,j,i,k,m)
#dc=DesiredCapabilities.HTMLUNIT
#test_host =
#test_port = 
#server_url = "http://%s:%s/wd/hub" % (test_host, test_port)
driver = webdriver.Firefox()
#driver = webdriver.Remote(
words = {}
wordlist = []
def main():
    path = "./result/baidu.txt"
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
    
    driver.get("http://www.baidu.com");
    time.sleep(60)
    for w in wordlist:
        search(w)
        time.sleep(5)
        
if __name__ == '__main__':
    print "start"
    main()
    print "finished"
    pass
