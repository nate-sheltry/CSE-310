use std::collections::HashMap;
use std::io::{self, Read, Write};
use std::fs::File;

// Global variable determining the name of our file.
const TEXT_FILE : &str = "text.txt";

// Utilizing recursion we ask for a yes(y) or no(n) input until we receive one.
fn receive_answer() -> String{
    println!("Would you like to include punctuation and spaces? (y/n):");
    let mut input = String::new();
    _ = io::stdin().read_line(&mut input);
    input = input.trim().to_lowercase();
    if input != "y" && input != "n" {
        println!("Not a valid response.");
        return receive_answer();
    }
    else {
        return input;
    }
}

// We read in a file as a single string and return the response.
fn read_file(file_name:&str) -> io::Result<String> {
    let mut file = File::open(file_name)?;
    let mut content = String::new();
    file.read_to_string(&mut content)?;
    Ok(content)

}

// Simple function to convert a string to a vector (dynamic array).
fn string_to_array(string:&str) -> Vec<char> {
    let characters: Vec<char> = string.chars().collect();
    characters
}

// Here we are checking for alphanumeric characters until we have traversed
// the entire char array/vector. Each time the function is called recursively,
// it utilizes splicing to pass the array of characters without the last
// character we have just checked.
// This function does not return anything, but instead modifies the second
// argument, a Hashmap, to count how many times a letter shows up.
fn identify_letters(letters: &[char], my_hashmap:&mut HashMap<char,u32>){
    if let Some(last_letter) = letters.last(){
        if !last_letter.is_alphanumeric() {}
        else if my_hashmap.contains_key(last_letter){
            let letter = my_hashmap.get_mut(last_letter);
            *letter.unwrap() += 1;
        }
        else {
            my_hashmap.insert(*last_letter, 1);
        }
        identify_letters(&letters[..letters.len()-1], my_hashmap);
    }
}

// This function uses the same logic as the first without the alphanumeric
// distinction. This means it will use the Hashmap to count punctuation,
// spaces and other special characters as well as alphanumeric characters.
fn identify_characters(letters: &[char], my_hashmap:&mut HashMap<char,u32>){
    if let Some(last_letter) = letters.last(){
        if my_hashmap.contains_key(last_letter){
            let letter = my_hashmap.get_mut(last_letter);
            *letter.unwrap() += 1;
        }
        else {
            my_hashmap.insert(*last_letter, 1);
        }
        identify_characters(&letters[..letters.len()-1], my_hashmap);
    }
}

// Here we are using our first argument, a dynamic array of tuples,
// to write data to an output file. It returns the response when completed.
fn write_file(content: Vec<(char, u32)>) -> std::io::Result<()> {
    let mut file = File::create("results.txt")?;
    for (letter, count) in content {
        let line = format!("{}: {}\n", letter, count);
        file.write_all(line.as_bytes())?;
    }
    Ok(())
}


fn main() {
    println!("This program will count all the letters present in a text file.");
    
    // Ask whether to count special characters, spaces, and punctuation
    // or only alphanumeric content.
    let answer = receive_answer();

    // Read in our file and get the response.
    let file_response = read_file(TEXT_FILE);

    // If the file failed to read in exit out the program with an error message.
    if !file_response.is_ok() {
        println!("{}{}{}{}",
                 "File failed to read, please make sure you have a file",
                 " by the name \"",TEXT_FILE,"\" in the program's directory.");
        return;
    }

    // Break the file's string data into a dynamic character array.
    let char_array:Vec<char> = string_to_array(&file_response.unwrap().to_lowercase());

    // Prepare our Hashmap of characters and integers.
    let mut char_hashmap:HashMap<char,u32> = HashMap::new();

    // Determine whether to count more than alphanumeric content.
    if answer == "y" {
        identify_characters(&char_array, &mut char_hashmap);
    }
    else if answer == "n" {
        identify_letters(&char_array, &mut char_hashmap);
    }

    // convert the hashmap into a vector of characters and integers.
    let mut sorted_map : Vec<(char, u32)> = char_hashmap.into_iter().collect();
    
    // Sort our vector for better presentation.
    sorted_map.sort_by_key(|&(key, _)| key);

    // Output the results to the console.
    for (letter, count) in &sorted_map {
        println!("{}: {}", letter, count);
    }

    // Use sorted map here before the program closes to output our data
    // to a file.
    _ = write_file(sorted_map);
    println!("Results were saved in \"results.txt\" in the root directory.");
    return;
}