#!/usr/bin/env python
# -*- coding:utf-8 -*-

__author__ = 'xiaoghu@cisco.com'


from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys
import time
import traceback

login_url = 'http://cas.baidu.com/?tpl=www2&fromu=http%3A%2F%2Fwww2.baidu.com%2F'

guess_page = 'http://fengchao.baidu.com/nirvana/main.html?userid=5967517#/manage/keyword~ignoreState=true&navLevel=account'

keyword_list = [u'鲜花', u'鞋子']


def run():
    browser = webdriver.Firefox()   # Get local session of firefox
    browser.get(login_url)     # Load page

    while not 'tuiguang' in browser.current_url:
        print browser.current_url
        time.sleep(1)

    browser.get(guess_page)

    enter_guess_button = None
    while not enter_guess_button:
        try:
            enter_guess_button = browser.find_element_by_id('ctrlbuttonBidBtnlabel')
            time.sleep(1)
            pass
        except Exception as e:
            print e
            print traceback.format_exc()

    enter_guess_button.click()

    while not (u'输入关键词' in browser.page_source and u'每次点击最高出价' in browser.page_source):
        print u'等待输入关键词'
        time.sleep(1)

    print u"报价"
    browser.execute_script('document.getElementById("ctrltextkeywordBid").value = 10')

    print u"填词"
    keyword_textarea = browser.find_element_by_id('ctrltextareakeywordsToEstimate_textarea')
    keyword_textarea.send_keys(u'鲜花\n鞋子')

    guest_button = browser.find_element_by_id('ctrlbuttonestimateButtonlabel')
    print u'开始估价'
    guest_button.click()

    while 1:
        time.sleep(1)
    pass


if __name__ == "__main__":
    print 'start'
    try:
        run()
        pass
    except Exception as e:
        print e
        print traceback.format_exc()
    print 'end'
