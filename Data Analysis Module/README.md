# Overview

This module was made with the intention of learning basic data analysis using python and the pandas module. I try to integrate this module with custom classes for retaining computed data.

I am using the "Global Homicide Rates Dataset" which contains information on Homicide rates and victims on a global scale.
[Global Homicide Rates and Dataset](https://www.kaggle.com/datasets/programmerrdai/homicides)

This program is meant to find the total homicide rate globally per 100,000, as well as identify an average homicide rate for countries based off historical data, and identify if the homicide rate has gone done or up since the earliest data-point to the latest.


[Software Demo Video](https://youtu.be/TqlXZ2O1yLY?si=dY_Oj_W4DfocOKL3)

# Data Analysis Results

1. What is a Country's trend? Is it going up or down since data has started recording?
    This is done by comparing the earliest data point to the last and seeing if it has increased or decreased.
2. What is the Country's mean rate/victims?
    We combine the homicide rate over the years showcasing its time span, its from to end data and the average rate during that time span.
3. What is the Global homicide rate/victims per year?
    This is answered by summing the data of all countries by year and showing the sample size available for that year. Due to varying sample sizes, no trend's can be determine on a global scale.

# Development Environment

VSCode, Excel to view data

Python, Pandas, Python Classes

# Useful Websites

* [Kaggle](https://www.kaggle.com/)

# Future Work

* Graphing Country Data
* Determining Trends With Greater Detail
* Implementing Pandas further to supplement dictionary use in classes
* Use Pandas to output data that has been computed