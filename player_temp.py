import socket

host = 'localhost'
port = 8016
hello = socket.socket()

name = input('enter player name: ').strip()
if name == '':
    name = 'player'

name =  'PLAYER '+ '_'.join(name.split())

hello.connect((host, port))
ins = hello.makefile('r')
out = hello.makefile('w')
    
out.write(name + '\r\n')
out.flush()

msg = ''
while msg != 'GAME_EXIT':
    msg = input()
    out.write('ping\r\n')
    out.flush()

ins.close()
out.close()
hello.close()
