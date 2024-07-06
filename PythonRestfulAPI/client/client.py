import http.client
import json

domain = "127.0.0.1:8080"

conn = http.client.HTTPConnection(domain)
print(f"Connection Established with Server: {domain}")

# makes a GET request from the server.
def get_request(path):
    conn.request('GET', path)
    response = conn.getresponse()
    return {
        "code": response.status,
        "data": json.loads(response.read().decode())
        }

# get an option within a numeric range.
def get_option(prompt, range):
    while(True):
        try:
            answer = int(input(prompt))
            if answer in range: return answer
            else: raise ValueError()
        except ValueError:
            print(f"Not a valid option. Please enter a number from"
                  +f" ({range[0]}-{range[-1]})\n")

# displays data in a more organized and viewable manner.
def display_data(data, indent=''):
    for key,value in data.items():
        print(f"\n{indent}{key}:", end='')
        if isinstance(value, dict):
            print(f'\n{indent+"\t"}'+"{", end='')
            display_data(value, indent+'\t')
            print(f'\n{indent+"\t"}'+"},", end='')
        elif isinstance(value, list):
            print(f"{indent}[", end='')
            for item in value:
                if isinstance(item, dict):
                    print(f'\n{indent+"\t"}'+"{", end='')
                    display_data(item, indent+'\t')
                    print(f'\n{indent+"\t"}'+"},", end='')
                else:
                    print(f"\n{indent}\t{item},", end='')
            print(f"\n{indent*2}],", end='')
        else:
            print(f"{indent}{value}", end='')
        
# get a yes or no response from the user.      
def get_answer(prompt):
    while(True):
        answer = input(prompt)
        if answer == 'y' or answer == 'n':
            return answer
        else:
            print("Invalid Input: Please enter (y/n)\n")

# determines whether to rerun the program or not utilizing a recursive call.            
def rerun_or_not():
    answer = get_answer("Would you like to make another request? (y/n): ")
    if answer == 'n':
        conn.close()
        print(f"Connection Closed with Server: {domain}")
        print("Thank you for using our program :)")
        return
    elif answer == 'y':
        menu()

# main menu where the user gets some data via a request to the server.
def menu():
    print(
        "Please Select an Option:\n"
        +"\t1. GET\n"
        +"\t2. EXIT\n"
    )
    option = get_option("Please enter an option: ", range(1,3))
    if option == 1:
        print(
            "Please Select an Option:\n"
            +"\t1. Get Items Data\n"
            +"\t2. Get Weapons Data\n"
            +"\t3. Broken Get Test\n"
        )
        option2 = get_option("Please enter an option: ", range(1,4))
        if option2 == 1:
            response = get_request('/items')
            if response['code'] != 200:
                print(f"Error Occurred on the Server: Code {response['code']}")
                return rerun_or_not()
            display_data(response['data'])
            print()
            return rerun_or_not()
        elif option2 == 2:
            response = get_request('/weapons')
            if response['code'] != 200:
                print(f"Error Occurred on the Server: Code {response['code']}")
                return rerun_or_not()
            display_data(response['data'])
            print()
            return rerun_or_not()
        elif option2 == 3:
            response = get_request('/broken')
            if response['code'] != 200:
                print(f"Error Occurred on the Server: Code {response['code']}")
                return rerun_or_not()
        return
    
def run():
    menu()

if __name__ == "__main__":
    run()