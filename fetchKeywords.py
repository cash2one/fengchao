#!/usr/bin/env python
# -*- coding:utf-8 -*-

from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys
import time
import traceback
import codecs

login_url = 'http://cas.baidu.com/?tpl=www2&fromu=http%3A%2F%2Fwww2.baidu.com%2F'
guess_page = 'http://fengchao.baidu.com/nirvana/main.html?userid=7396886#/manage/plan'
keyword_list = [u'健康',u'QA']

def run():
    browser = webdriver.Firefox()   # Get local session of firefox
    browser.get(login_url)     # Load page
    
    while not 'tuiguang' in browser.current_url:
        time.sleep(1)
        pass
        
    browser.get(guess_page)
    time.sleep(2)
    enter_guess_button = None
    while not enter_guess_button:
        try:
            enter_guess_button = browser.find_element_by_id('ctrlbuttonKrBtnlabel')
            time.sleep(1)
            pass
        except Exception as e:
            print e

    print 'find kr btn,ready to click'
    enter_guess_button.click()

    time.sleep(2)
    inputCtrl = None
    while not inputCtrl:
        try:
            inputCtrl = browser.find_elements_by_xpath("//div[@id='krSuggestion'/div/input")
            time.sleep(1)
            pass
        except Exception as e:
            print e
            
    inputCtrl.send_keys(keyword_list[0])
    browser.find_element_by_id('krSearchBtn').click()
    time.sleep(1)
    resultTable =  browser.find_element_by_css_selector('.table-group-list')
    
    while not resultTable:
        time.sleep(2)
        resultTable =  browser.find_element_by_css_selector('.table-group')

    tables = resultTable.get_attribute('innerHTML')
    print u"get source"

    f = codecs.open('result/'+keyword_list[0]+'.html','w+','utf8')
    f.write(tables)
    f.close()


if __name__ == "__main__":
    print 'start'
    try:
        run()
        pass
    except Exception as e:
        print e
        print traceback.format_exc()
    print 'end'

