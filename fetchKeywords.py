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

keyword_list = [u'医生在线咨询',u'症状',u'药',u'养生',u'健康',u'保健',u'医疗事故',u'医疗器械',u'医改',u'医院',u'养老',u'手术',u'医保',u'教育',u'培训',u'考研',u'MBA',u'在职',u'移民',u'留学',u'出国',u'签证',u'英语',u'团购',u'打折',u'买鞋',u'买衣服',u'买包',u'买电器',u'商城',u'淘宝',u'旅游',u'机票',u'礼品',u'酒店',u'旅馆',u'加盟',u'代理',u'连锁',u'招商',u'小本创业',u'小本投资',u'机械加工',u'信用卡',u'保险',u'理财',u'网贷',u'投资',u'汽配',u'汽车美容',u'SUV',u'租车',u'食品批发',u'进口食品',u'饮料批发',u'热门游戏',u'游戏排行',u'OA',u'财务软件']

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
            print "wait for loading page."

    print 'find kr btn,ready to click'
    enter_guess_button.click()

    inputCtrl = None
    while not inputCtrl:
        try:
            inputCtrl = browser.find_element_by_css_selector("#krSuggestion div.ui-wrapper input")
            #inputCtrl = browser.find_element_by_css_selector(".fc-ui-input.CSS3.ui-skin-default.input-placeholder")
            #inputCtrl = browser.find_elements_by_xpath("//div[@id='krSuggestion']/div/input")
            time.sleep(1)
            pass
        except Exception as e:
            print "wait for input control be ready."

    print "search input found."
    #if len(inputCtrl) == 0:
    #    return;
    lastValue = inputCtrl.get_attribute('value')

    for word in keyword_list:
        while inputCtrl.get_attribute('value') == lastValue:
            inputCtrl.clear()            
            inputCtrl.send_keys(word)
            print "input value: "
            print inputCtrl.get_attribute('value')
            time.sleep(1)
        lastValue = word
        browser.find_element_by_id('krSearchBtn').click()
        time.sleep(1)
        resultTable = None
        while not resultTable:
            time.sleep(1)
            try:
                resultTable =  browser.find_element_by_css_selector('.table-group')
            except Exception as e:
                print "wait for loading search result."

        tables = resultTable.get_attribute('innerHTML')
        print word
    
        f = codecs.open('result/htmlTargetWords/'+word+'.html','w+','utf8')
        f.write(tables)
        f.close()
        time.sleep(10)

if __name__ == "__main__":
    print 'start'
    try:
        run()
        pass
    except Exception as e:
        print e
        print traceback.format_exc()
    print 'end'

