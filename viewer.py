import socket

host = 'localhost'
port = 8791

hello = socket.socket()

hello.connect((host, port))
ins = hello.makefile('r')


print('\n'*35)

while True:
    yee = ins.readline()[:-1].strip()
    if yee != '':
        print(yee)
        print()

ins.close()
hello.close()
