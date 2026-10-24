import re,json,subprocess,html,base64,sys
src=open(sys.argv[1]).read()
script=re.search(r'data-dc-script[^>]*>(.*?)</script>',src,re.S).group(1)
js="class DCLogic{};\n"+script+"\nconsole.log(JSON.stringify(new Component().renderVals()));"
vals=json.loads(subprocess.run(['node','-e',js],capture_output=True,text=True,check=True).stdout)
body=re.search(r'<x-dc>(.*)</x-dc>',src,re.S).group(1)
helmet=re.search(r'<helmet>(.*?)</helmet>',body,re.S).group(1)
body=re.sub(r'<helmet>.*?</helmet>','',body,flags=re.S)
def sub_item(t,var,item):
    def rif(m):
        k=m.group(1); return m.group(2) if item.get(k) else ''
    t=re.sub(r'<sc-if value="\{\{'+var+r'\.(\w+)\}\}"[^>]*>(.*?)</sc-if>',rif,t,flags=re.S)
    t=re.sub(r'\{\{'+var+r'\.(\w+)\}\}',lambda m:html.escape(str(item[m.group(1)])),t)
    t=re.sub(r'\{\{'+var+r'\}\}',lambda m:html.escape(str(item)),t)
    return t
def rfor(m):
    lst=vals[m.group(1)]; var=m.group(2); inner=m.group(3)
    return ''.join(sub_item(inner,var,it) for it in lst)
body=re.sub(r'<sc-for list="\{\{(\w+)\}\}" as="(\w+)"[^>]*>(.*?)</sc-for>',rfor,body,flags=re.S)
assert '{{' not in body, re.findall(r'.{40}\{\{.{30}',body)
img=base64.b64encode(open(sys.argv[3],'rb').read()).decode()
body=body.replace('/_blob/dd4e07ee51876740828133a6cfdc7348','data:image/jpeg;base64,'+img)
open(sys.argv[2],'w').write('<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Parakh Report</title>'+helmet+'</head><body>'+body+'</body></html>')
