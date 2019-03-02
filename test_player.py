import socket



name = 'name'

choice = input('(m)aster or (p)layer: ').strip().lower()
if choice == 'm' or choice == 'master':
    name = 'master 1'
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

    name =  s
    
hello = socket.socket()


hello.connect(('localhost', 8016))
ins = hello.makefile('r')
out = hello.makefile('w')
out.write(name + '\r\n')
out.flush()

msg = ''
while msg != 'GAME_EXIT':
    msg = input()
    if name == 'master 1':
        out.write(msg + '\r\n')
    else:
        out.write('ping\r\n')
    out.flush()
input()
ins.close()
out.close()
hello.close()
