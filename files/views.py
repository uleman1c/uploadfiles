import datetime
import json
import locale
from django.shortcuts import render, redirect
from django.http import HttpResponse, FileResponse, JsonResponse
import requests

import urllib.parse

addr = 'http://localhost:8011/'

# Create your views here.

def files(request, slug):

    filespath = 'I:\\Files\\'
    
    if request.method == 'POST':

        curUid = request.headers.get('id')
        curparent_id = request.headers.get('parentid')
        part = request.headers.get('part')
        getuid = request.headers.get('getuid')

        if not curparent_id:
            curparent_id = ''

        if getuid != None:

            res = requests.post(addr + 'ulgf/', json={'mode': 'getuid', 'filename': request.headers.get('filename'), 'ulid': slug})

            return JsonResponse(json.loads(res.text))

        else:

            if int(part) >= 0:
                # cfp = FilePart.objects.create(file=co, number=part)
                curName = str(curUid) + ".tmp"
            
                destination = open(filespath + curName, 'ab+')
                destination.write(request.body)
                destination.close()
                    
                res = requests.post(addr + 'ulgf/', json={'mode': 'setsize', 'size': request.headers.get('size'), 'id': curUid})

            
                # stat = os.stat(filespath + curName)
            
   #             co.size = co.size + int(request.headers.get('size'))
    #            co.save()
                        
                # if part:
                    # cfp.size = stat.st_size
                    # cfp.save()
                        
            else:
                size = request.headers.get('size')
                
#                if co.size != int(size):
 #                   co.size = 0
  #                  co.save()

            res = dict()
            res['success'] = True

            return JsonResponse(res)
                        
    elif request.method == 'GET':

        res = requests.get(addr + 'ul?id=' + slug)

        try:

            resdict = json.loads(res.text)

            elements = resdict['files']

            setStrSizeDate(elements)

            return render(request, 'index.html', locals())

        except:

            return render(request, '404.html')
            
def setStrSizeDate(allfiles):

    cnt = 0
    for f in allfiles:
        if f['size'] > 1024 * 1024 * 1024:
            f['size2'] = str(round(f['size'] / (1024 * 1024 * 1024), 1)) + " Gb"

        elif f['size'] > 1024 * 1024:
            f['size2'] = str(round(f['size'] / (1024 * 1024), 1)) + " Mb"

        elif f['size'] > 1024:
            f['size2'] = str(round(f['size'] / (1024), 1)) + " Kb"

        else:
            f['size2'] = str(f['size']) + " b"

        f['size'] = locale.format_string('%.0f', f['size'], grouping=False)

        f['created'] = datetime.datetime.strptime(f['created'], "%Y%m%d%H%M%S").strftime("%d.%m.%Y %H:%M:%S")

        if cnt % 2 == 1:
            f['backgroundcolor'] = 'lightgrey'
        else:
            f['backgroundcolor'] = 'white'

        cnt = cnt + 1

