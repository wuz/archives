# archives: a new way to do code documentation

[![Documentation style: archives](https://img.shields.io/badge/docstyle-archives-lightblue.svg)](https://github.com/wuz/archives)

**archives** is a new style of code documentation, as well as a linter for the documentation itself. It can help you ensure that your docstrings in your classes and functions stay up to date, and that they adequately explain their purpose, arguments, and return value.

![Perhaps the archives are incomplete](https://i.kym-cdn.com/entries/icons/original/000/023/967/obiwan.jpg)

## Features

- linter for jsdoc style strings (work in progress, but usable)
- (coming soon) documentation generator

## Usage

### Installation

```bash
npm install archives
```

### Run the Linter

```bash

# run archives (on itself!)

archives archives.js

```

## Todo

- more rules
- better system for multi-check rules
- more output formats
- potentially spell-checking inside desc?
- documentation generator
- tests
- publish
