import socket

host = 8418
hello = socket.socket()


name = input('enter master id: ').strip()
typ = 'm'
name = 'MASTER ' + 'master ' + name

print('the protocol:')
print('GAME_BEGIN                 : starts the game.')
print('SELECT {category} {amount} : selects a question.')
print('QUESTION_SKIP              : skips the question.')
print('QUESTION_CORRECT           : marks the question as correct.')
print('QUESTION_INCORRECT         : marks the question as wrong.')




hello.connect(('localhost', host))

ins = hello.makefile('r')
out = hello.makefile('w')
    
out.write(name + '\r\n')
out.flush()

msg = ''

while msg != 'GAME_EXIT':
    msg = input()
    out.write(msg + '\r\n')
    out.flush()

ins.close()
out.close()
hello.close()
