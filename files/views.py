import json
from django.shortcuts import render, redirect
from django.http import HttpResponse, FileResponse, JsonResponse
import requests

import urllib.parse

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

            res = requests.post('http://localhost:8000/ulgf/', json={'mode': 'getuid', 'filename': request.headers.get('filename'), 'ulid': slug})

            return JsonResponse(json.loads(res.text))

        else:

            if int(part) >= 0:
                # cfp = FilePart.objects.create(file=co, number=part)
                curName = str(curUid) + ".tmp"
            
                destination = open(filespath + curName, 'ab+')
                destination.write(request.body)
                destination.close()
                    
                res = requests.post('http://localhost:8000/ulgf/', json={'mode': 'setsize', 'size': request.headers.get('size'), 'id': curUid})

            
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

        res = requests.get('http://localhost:8000/ul?id=' + slug)

        try:

            resdict = json.loads(res.text)

            return render(request, 'index.html')

        except:

            return render(request, '404.html')
            
