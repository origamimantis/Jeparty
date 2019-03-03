import socket

host = 8791
hello = socket.socket()

hello.connect(('localhost', host))
ins = hello.makefile('r')
out = hello.makefile('w')


print('\n'*35)

while True:
    yee = ins.readline()[:-1].strip()
    if yee != '':
        print(yee)
        print()

ins.close()
out.close()
hello.close()
