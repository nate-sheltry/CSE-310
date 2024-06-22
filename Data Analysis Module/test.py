from main import main

end = ''

while(end.lower() != 'end'):
    print(f"\033[H\033[2J")
    main()
    print()
    end = input()