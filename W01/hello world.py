import time
def custom_print(msg):
    for c in msg:
        time.sleep(.05)
        print(c, end='')
    print()

def custom_input(msg):
    for c in msg:
        time.sleep(.05)
        print(c, end='')
    return input('\n> ')
        
custom_print('hello world')
response = custom_input('how are you doing?')
custom_print('Swell!')
custom_print('I\'m looking forward to a wonderful semester!')