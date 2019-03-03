import socket

host = 8016
hello = socket.socket()
typ = 'p'
name = 'name'

choice = input('(m)aster or (p)layer: ').strip().lower()
if choice == 'm' or choice == 'master':
    name = input('enter master id: ').strip()
    typ = 'm'
    name = 'MASTER ' + 'master ' + name
    host = 8418
else:
    name = input('enter player name: ').strip()
    if name == '':
        name = 'player'
    s = ''
    for x in name:
        if x.isspace():
            s += '_'
        else:
            s += x

    name =  'PLAYER '+s
print(name)

hello.connect(('localhost', host))
ins = hello.makefile('r')
out = hello.makefile('w')
    
out.write(name + '\r\n')
out.flush()

msg = ''
while msg != 'GAME_EXIT':
    msg = input()
    if typ == 'm':
        out.write(msg + '\r\n')
    else:
        out.write('ping\r\n')
    out.flush()
input()
ins.close()
out.close()
hello.close()
