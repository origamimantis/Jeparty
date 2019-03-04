import socket

host = 'localhost'
port = 8791

hello = socket.socket()

hello.connect((host, port))
ins = hello.makefile('r')


print('\n'*35)

while True:
    yee = ins.readline()[:-1]
    if yee != '':
        print(yee)

ins.close()
hello.close()
