#!/usr/bin/env python
# encoding: utf-8
"""
startup.py

Python script to handle daily startup for rideplannr.

@author  Zach Galant  February 9, 2012
"""

import subprocess
import getpass
from time import sleep

def mongo_directory():
    """
    Returns the bin directory in the mongo module. 
    To use this script, add the following: 
    
    if user == 'YOUR USER NAME':
        return 'ABSOLUTE PATH OF THE MONGO bin DIRECTORY'
    """
    user = getpass.getuser()
    if user == 'zgalant':
        return '/Users/zgalant/Dropbox/Downloads/packages/mongodb-osx-x86_64-2.0.0/bin'

def main():
    subprocess.Popen(["./mongod"], stdout=subprocess.PIPE, cwd=mongo_directory())
    sleep(3)
    subprocess.call(["node", "web.js"], cwd=".")
    
if __name__ == '__main__':
	main()

