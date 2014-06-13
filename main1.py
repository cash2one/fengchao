# coding=utf-8 ##以utf-8编码储存中文字符
#!/usr/bin/env python
# -*- coding:utf-8 -*-

__author__ = 'xiaoghu@cisco.com'


from selenium import webdriver
from selenium.common.exceptions import NoSuchElementException
from selenium.webdriver.common.keys import Keys
import time
import traceback
import codecs, sys, codecs,os

login_url = 'http://cas.baidu.com/?tpl=www2&fromu=http%3A%2F%2Fwww2.baidu.com%2F'

#guess_page = 'http://fengchao.baidu.com/nirvana/main.html?userid=5967517#/manage/keyword~ignoreState=true&navLevel=account'
guess_page = 'http://fengchao.baidu.com/nirvana/main.html?userid=7396886&t=1402287234824&castk=c4712we77b6c9b4e0d094#/manage/plan~ignoreState=true&navLevel=account'
input_file_name =''
result_file_name =''
sleep_time=1
def run():
    input_file_name=os.getcwd()+os.sep+'words.txt'
    result_file_name=os.getcwd()+os.sep+'result.txt'
    print input_file_name
    print input_file_name
    reload(sys)
    sys.setdefaultencoding( "utf-8" )
    browser = webdriver.Firefox()   # Get local session of firefox
    browser.get(login_url)     # Load page

    while not 'tuiguang' in browser.current_url:
        print browser.current_url
        time.sleep(sleep_time)

    time.sleep(sleep_time)
    browser.get(guess_page)

    enter_guess_button = None
    while not enter_guess_button:
        try:
            enter_guess_button = browser.find_element_by_id('ctrlbuttonBidBtnlabel')
            time.sleep(sleep_time)
            pass
        except Exception as e:
            print e
            print traceback.format_exc()

    enter_guess_button.click()
    bigVale=100.00
    smallVale=0
    guessValue=100.00
    result2=''
    
    file_object = codecs.open(input_file_name, 'r','utf-8')
    result_file_object=codecs.open(result_file_name,'r','utf-8')
    result_file_object2=codecs.open(result_file_name,'a','utf-8')
    ind=makeIndex(result_file_name)
    printIndex(ind)

    try:
      for line in file_object:
        #look2 = codecs.lookup("utf-8")
        #b = look2.decode(line)
        _keyword = ''.join(line.split())
        print '读取内容：'+_keyword
#       t=visitfile(result_file_name,_keyword)
        t=indexQuery(ind,_keyword)
        print 'check :'+str(t)
        if t == '' :
        
		while True:
			try :
				browser.execute_script('document.getElementById("ctrltextkeywordBid").value = '+str(guessValue))
				keyword_textarea = browser.find_element_by_id('ctrltextareakeywordsToEstimate_textarea')
				keyword_textarea.clear()
				keyword_textarea.send_keys(_keyword)
				guest_button = browser.find_element_by_id('ctrlbuttonestimateButtonlabel')
				guest_button.click()
				time.sleep(sleep_time)
				guess_result1=browser.find_element_by_id('ctrltableestimatorResultcell0_3').find_element_by_class_name("ui_table_tdcell").text
				if (round(bigVale,2)-round(smallVale,2))<0.02 :
					print '成功价格：'+str(_keyword)
					if guess_result1!='1-3' :
						guessValue=guessValue+0.01
					result2=browser.find_element_by_id('ctrltableestimatorResultcell0_4').find_element_by_class_name("ui_table_tdcell").text
					
					if(result2=='-') :
						browser.execute_script('document.getElementById("ctrltextkeywordBid").value = '+str(guessValue))
						keyword_textarea = browser.find_element_by_id('ctrltextareakeywordsToEstimate_textarea')
						keyword_textarea.clear()
						keyword_textarea.send_keys(_keyword)
						guest_button = browser.find_element_by_id('ctrlbuttonestimateButtonlabel')
						guest_button.click()
						time.sleep(sleep_time)
						guess_result2=browser.find_element_by_id('ctrltableestimatorResultcell0_4').find_element_by_class_name("ui_table_tdcell").text
						print 'guess_result2'+guess_result2
						result2=guess_result2
					result_file_object2.write(_keyword+' '+str(guessValue)+' '+str(result2)+'\n')
					bigVale=100.00
					smallVale=0
					guessValue=100.00
					result2=''
					break
				elif  guess_result1 =='-':
					print '失败价格2：'
					smallVale =guessValue
					guessValue=round((bigVale+smallVale)/2,2)
					pass
				elif  int(guess_result1[0:1])==1 :
					print '失败价格0：'
					bigVale=guessValue
					guessValue=round((bigVale+smallVale)/2,2)
					pass
				elif  int(guess_result1[0:1])>1:
					print '失败价格1：'
					smallVale =guessValue
					guessValue=round((bigVale+smallVale)/2,2)
					pass
			except Exception as e:
				print e
				bigVale=100.00
				smallVale=0
				guessValue=100.00
				result2=''
				break
		pass
    finally:
		file_object.close()
		result_file_object.close()
		result_file_object2.close()
		

def visitfile(fname, searchKey):
      fcount=0
      try:
            if open(fname).read().find(searchKey) != -1:
                fcount += 1
      except: pass
      return fcount

def makeIndex(filename):
    i=0
    index = {}
    for line in open(filename) :
        word=line.split(" ")[0]
        print word
        index.setdefault(word)
        i=i+1
    return index
 
def printIndex(index):
    for word, lst in index.items():
        print 'index:'+word
 
def indexQuery(index, args):
    print 'args'+args
    found = ''
    for key in index.keys():
         if key==args:
            found=key
    return found

if __name__ == "__main__":
    print 'start'
    try:
        run()
        pass
    except Exception as e:
        print e
        print traceback.format_exc()
    print 'end'