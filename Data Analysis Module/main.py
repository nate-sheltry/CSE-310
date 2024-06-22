import pandas as pd
from enum import Enum, auto

#Utility Functions
# Allows integer input within a range
def get_input(prompt, rng):
    while True:
        try:
            num = int(input(prompt))
            if num in rng:
                return num
            else:
                raise ValueError()
        except ValueError:
            print("Not a valid input.")

# Pads strings in order to create consistent output.
# Defaults to left justified
def pad_string(string, count, justified='-l'):
    string_len = len(string)
    assert string_len <= count, "No padding can occur"
    
    padding = count - string_len
    
    def left_justify():
        return string + ' ' * padding
    def right_justify():
        return ' ' * padding + string
    def center_justify():
        return padding//2 * ' ' + string + ' ' * (padding-padding//2)
    
    cases = {
        '-l': left_justify(),
        '-r': right_justify(),
        '-c': center_justify()
    }
    if justified in cases.keys():
        return cases[justified]
    else:
        return cases['-l']

# Enum class to easily differentiate between data.
# V denotes victim data, R denotes rate data.
class Data(Enum):
    CH_V = auto()
    CH_R = auto()
    FEM_R = auto()
    FEM_V = auto()
    UNODC_R = auto()
    UNODC_V = auto()
    # WHO_AGE = auto()
    # WHO_MOR = auto()
    # W_EURO = auto()
    # DIST = auto()

#Files Dictionary using the Enums.
FILES = {
    Data.CH_V:"child-homicide-rate-per-100000",
    Data.CH_R: "child-homicide-rate",
    Data.FEM_R: "female-homicide-rate",
    Data.FEM_V: "female-homicide-victims",
    Data.UNODC_R: "homicide-rate-unodc",
    Data.UNODC_V: "homicides-unodc",
    # Data.WHO_AGE: "homicide-rate-who-age-standardized",
    # Data.WHO_MOR: "homicide-rate-who-mortality-database",
    # Data.W_EURO: "homicide-rates-across-western-europe"
}

# DIST_FILE = {
#     Data.DIST:"distribution-of-homicide-rates"
# }    

# Dataset class used to hold country data by year and computed data.
# average layout = {'data': float data, 'timespan': int, 'start': int, 'end': int}
# entries = {int year: float data}
class Dataset:
    
    def __init__(self, average, entries):
        self.average = average
        self.entries = entries
        return
    
    def trend(self):
        entry_keys = list(self.entries.keys())
        if self.entries[entry_keys[0]] < self.entries[entry_keys[-1]]:
            return f"The trend is upward from {entry_keys[0]} to {entry_keys[-1]}."
        else:
            return f"The trend is downward from {entry_keys[0]} to {entry_keys[-1]}."
    
    def __str__(self):
        return (
            f"Average: {self.average}\n"+
            f"Entries: {self.entries}\n"+
            self.trend()
        )
        
#Constant to determine directory.
DIR = "./data/"

# Get data for all years regardless of country.
def get_global_data_by_year(file, header):
    formatted_data = {}
    header = file.keys()
    years = sorted(file['Year'].unique())
    for x in years:
        year_data = file[(file['Year'] == x) & (file['Entity'] != 'World')]
        countries = len(year_data['Entity'])
        year_average = year_data[header[-1]].sum()
        formatted_data[int(x)] = {'data':float(year_average), 'countries':int(countries)}
    return formatted_data

# Get data for countries's categorized by year.
def get_country_data(file, header):
    datasets = {}
    countries = sorted(file[file['Entity'] != 'World']['Entity'].unique())
    for country in countries:
        entries= {}
        country_data = file[file['Entity'] == country]
        years = sorted(country_data['Year'].unique())
        average_data = float(country_data[header[-1]].mean())
        average = {'data':average_data, 'timespan':int(years[-1]-years[0]),
                   'start':int(years[0]), 'end':int(years[-1])}
        for year in years:
            year_data = (country_data[country_data['Year'] == year]
                         [header[-1]].values[0])
            assert isinstance(year_data, float),"year data was not float"
            entries[int(year)] = float(year_data)
        datasets[country] = Dataset(average, entries)
        
            
    return datasets

# Get country data and global data 
def get_file(file, datatype):
    file_raw = pd.read_csv(f"{DIR}{file}.csv")
    file_raw = file_raw.drop_duplicates()
    header = file_raw.keys()
    return [get_country_data(file_raw, header), get_global_data_by_year(file_raw, header), datatype]

# View Country data within database.
def country_data_view(country_data, name, datatype):
    print('-'*76)
    print('|'+pad_string(f"{name} Homicidal {datatype}", 74, '-c')+'|')
    print('-'*76)
    print(
            f"|{pad_string(f" Average: {country_data.average['data']}", 32,'-l')}|"+
            f"{pad_string(f" Timespan:{country_data.average['timespan']} years ", 21,'-l')}|"+
            f"{pad_string(f"Years:{country_data.average['start']}-{country_data.average['end']} ", 19,'-r')}|"
            )
    print('-'*76)
    print(
            f"|{pad_string(f" Year",22, '-c')}|{pad_string(f" Data",51, '-c')}|"
            )
    print('-'*76)
    for key, value in country_data.entries.items():
        print(
            f"|{pad_string(f" {key}",22)}|{pad_string(f" {value}",51)}|"
            )
    print('-'*76)
    print('|'+pad_string(f"{country_data.trend()}", 74, '-c')+'|')
    print('-'*76)
    
# Select which country's data you want to view within the database.
def select_country_data(country_data, datatype):
    print("Select a Country by its Numeric ID:")
    countries = []
    num = 1
    for key, _ in country_data.items():
        print(f"\t{num}. {key}")
        countries.append(key)
        num += 1
    option = get_input("Enter one of the Options Above:", range(1, len(countries)+1))
    country_data_view(country_data[countries[option-1]],countries[option-1],datatype)

# View the global data for the database
def global_year_data_view(year_data, name):
    print('-'*64)
    print('|'+pad_string(f"Global Homicidal {name} By Year", 62, '-c')+'|')
    print('-'*64)
    print(
            f"|{pad_string("Year", 10,'-c')}|"+
            f"{pad_string("Data", 25,'-c')}|"+
            f"{pad_string("Country Sample Size", 25,'-c')}|"
            )
    print('-'*64)
    for key, value in year_data.items():
        print(
            f"|{pad_string(f" {key}", 10)}|{pad_string(f" {value["data"]}", 25)}|{pad_string(f"{value["countries"]} ", 25,'-r')}|"
            )
# Determine which Homicide data you want to view, global or country specific.
def homicide_data(data):
    cases = {
        1: lambda:global_year_data_view(data[1],data[2]),
        2: lambda:select_country_data(data[0],data[2])
    }
    print(
        f"1. View Global Homicidal {data[2]} By Year?\n"+
        f"2. View Homicidal {data[2]} By Country?\n"
    )
    option = get_input("Enter one of the Options Above:", range(1,3))
    cases[option]()

# Determine which database to view.
def main():
    cases = {
        1: lambda:get_file(FILES[Data.FEM_R], "Female Rate Per 100,000"),
        2: lambda:get_file(FILES[Data.FEM_V], "Female Victims"),
        3: lambda:get_file(FILES[Data.CH_R], "Child Rate Per 100,000"),
        4: lambda:get_file(FILES[Data.CH_V], "Child Victims"),
        5: lambda:get_file(FILES[Data.UNODC_R], "Rate Per 100,000"),
        6: lambda:get_file(FILES[Data.UNODC_V], "Victims"),
    }
    print(
        "What data would you like to view?\n"+
        "\t1. Female Homicide Rate Data (All Ages)\n"+
        "\t2. Female Homicide Victims Data (All Ages)\n"+
        "\t3. Child Homicide Rate Data (0-19)\n"+
        "\t4. Child Homicide Victim Data (0-19)\n"+
        "\t5. Generalize Homicide Rate Data\n"
        "\t6. Generalize Homicide Victim Data\n"
    )
    option = get_input("Enter a valid option:", range(1,7))
    homicide_data(cases[option]())
    
if __name__ == '__main__':
    main()