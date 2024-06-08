-module(recursive_search).
-export([main/1]).

% Get User Input and verify it is a valid Directory.
get_dir() ->
    io:fwrite("Enter a Directory: ~n"),
    Input = io:get_line(""),
    CleanInput = string:strip(Input, right, $\n),
    case filelib:is_dir(CleanInput) of
        true ->
            CleanInput;
        false ->
            io:fwrite("Not a valid directory, please enter a new one.~n"),
            get_dir()
    end.

% Pattern matching so when there is no more characters to search it returns,
% the position of the last found "." inside the string.
find_extension_index([], _, LastPos) -> 
    LastPos;

% Finds the last "." inside the string, if there is none it returns,
% the first index passed to LastPos.
find_extension_index([Char | Rest], CurrentPos, LastPos) ->
    NewPos = case Char  of
        $. -> CurrentPos;
        _ -> LastPos
    end,
    find_extension_index(Rest, CurrentPos+1, NewPos).

% Used to get the file's type, once finding its location.
substring(String, Start) when is_list(String),
    is_integer(Start), Start >= 0 ->
        Length = length(String) - Start + 1,
        ReducedString = lists:nthtail(Start, String),
        lists:sublist(ReducedString, Length).

% Gets the index of the file's type "." then returns the file type.
% 0 means no file type was found.
get_extension(String) ->
    Index = find_extension_index(String, 1, 0),
    case Index of
        0 -> "";
        _ -> substring(String, Index)
    end.

% Get the files within a directory and ignore folders.
get_files(Dir) ->
    {ok, Results} = file:list_dir(Dir),
    FilteredResults = lists:filter(
        fun(Element) ->
            FullPath = filename:join(Dir, Element),
            Bool = filelib:is_regular(FullPath),
            if
                Bool -> true;
                true -> false
            end
        end,
        Results),
    FilteredResults.

% Gets the file types present in the directory, adding enumeration as well.
get_file_extensions(Dir) ->
    Filenames = get_files(Dir),
    HashSet = lists:foldl(
        fun(Filename, Map) ->
            Name = string:lowercase(Filename),
            Extension = get_extension(Name),
            case Extension of
                "" -> Map;
                _  -> maps:put(Extension, true, Map)
            end
        end,
        maps:new(),
        Filenames),
    Keys = maps:keys(HashSet),
    lists:enumerate(Keys).

% Get the user input and determine if it is a valid index to enter.
get_input(Length) ->
    try 
        {ok, Result} = io:fread("Entry: ","~d"),
        [Int] = Result,
        if
            Int =< Length, Int > 0 ->
                Int;
            true ->
                io:fwrite("Enter an integer between 1 and ~p ~n", [Length]),
                get_input(Length)
        end
    catch
        error:badarg ->
            io:fwrite("Error, please enter a valid integer option.~n"),
            get_input(Length)
    end.

% Determine's which file type to search for based upon the user's input,
% and the enumerated list.
determine_search(Extensions) ->
    io:fwrite("Please enter one of the following file extensions to search for:\n"),
    lists:foreach(
        fun({Index, Value}) ->
            io:format("\t ~p. ~s \n", [Index, Value])
        end,
        Extensions),
    Index = get_input(length(Extensions)),
    {_, Value} = lists:nth(Index, Extensions),
    Value.

% Returns files in the directory of the chosen file type.
get_files_by_extension(Dir, Ext) ->
    Filenames = get_files(Dir),
    lists:filtermap(
        fun(Filename) ->
            Name = string:lowercase(Filename),
            Extension = get_extension(Name),
            case Extension of
                Ext -> {true, Filename};
                _   -> false
            end
        end,
        Filenames).

% Executes the program calling functions as necessary.
main(_) ->
    DIRECTORY = get_dir(),
    Extensions = get_file_extensions(DIRECTORY),
    Ext = determine_search(Extensions),
    FilteredResults = get_files_by_extension(DIRECTORY, Ext),
    io:format("Results for ~s file types:~n", [Ext]),
    lists:foreach(
        fun(Filename) ->
            io:format("\t~s ~n",[Filename])
        end,
        FilteredResults).
