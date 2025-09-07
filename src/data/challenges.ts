import { Challenge } from "../../@types";

export const challenges: Challenge[] = [
    {
        id: 'hello_world',
        title: 'Hello World',
        description: 'Print "hello world" to the terminal.',
        hint: 'There are many ways to print text on the command line, one way is with the \'echo\' command.',
        difficulty: 'easy',
        completed: false,
        validation: {
            type: 'output',
            expected: 'hello world'
        }
    },
    {
        id: 'current_directory',
        title: 'Print Working Directory',
        description: 'Print the current working directory.',
        hint: 'Use the command that shows your present working directory.',
        difficulty: 'easy',
        completed: false,
        validation: {
            type: 'output',
            expected: '/challenge'
        }
    },
    {
        id: 'list_files',
        title: 'List Files',
        description: 'List all files in the current directory, one file per line.',
        hint: 'Use the command to list directory contents.',
        difficulty: 'easy',
        completed: false,
        setup: {
            files: {
                'file1.txt': 'Content of file 1',
                'file2.txt': 'Content of file 2',
                'README.md': '# Sample README'
            }
        },
        validation: {
            type: 'custom',
            validator: 'ls | sort'
        }
    },
    {
        id: 'find_files',
        title: 'Find Text Files',
        description: 'Find all files that have the extension .txt in the current directory.',
        hint: 'Use find command with appropriate pattern matching.',
        difficulty: 'medium',
        completed: false,
        setup: {
            files: {
                'document.txt': 'Text document',
                'notes.txt': 'My notes',
                'README.md': '# Documentation',
                'script.sh': '#!/bin/bash\necho "Hello"'
            },
            directories: ['subdir']
        },
        validation: {
            type: 'custom',
            validator: 'find . -name "*.txt" | sort'
        }
    },
    {
        id: 'count_lines',
        title: 'Count Lines',
        description: 'Count the number of lines in the file "data.txt".',
        hint: 'Use wc command to count lines.',
        difficulty: 'medium',
        completed: false,
        setup: {
            files: {
                'data.txt': 'Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\nLine 7\nLine 8\nLine 9\nLine 10'
            }
        },
        validation: {
            type: 'output',
            expected: '10'
        }
    },
    {
        id: 'create_file',
        title: 'Create File',
        description: 'Create a file named "solution.txt" with the content "Hello World".',
        hint: 'Use echo command with redirection or touch and echo.',
        difficulty: 'medium',
        completed: false,
        validation: {
            type: 'file_content',
            files: ['solution.txt'],
            expected: 'Hello World'
        }
    },
    {
        id: 'grep_pattern',
        title: 'Search Pattern',
        description: 'Find all lines containing the word "error" (case insensitive) in the file "log.txt".',
        hint: 'Use grep to search for patterns in files.',
        difficulty: 'medium',
        completed: false,
        setup: {
            files: {
                'log.txt': 'INFO: Starting application\nERROR: Connection failed\nINFO: Retrying connection\nerror: File not found\nINFO: Process completed\nError: Database timeout'
            }
        },
        validation: {
            type: 'custom',
            validator: 'grep -i "error" log.txt | sort'
        }
    },
    {
        id: 'count_unique_words',
        title: 'Count Unique Words',
        description: 'Count the number of unique words in "text.txt".',
        hint: 'Use a combination of tr, sort, uniq, and wc commands.',
        difficulty: 'hard',
        completed: false,
        setup: {
            files: {
                'text.txt': 'hello world this is a test file with some words hello world test file words some'
            }
        },
        validation: {
            type: 'output',
            expected: '10'
        }
    },
    {
        id: 'largest_file',
        title: 'Find Largest File',
        description: 'Find the largest file by size in the current directory and print its name.',
        hint: 'Use ls with size sorting.',
        difficulty: 'hard',
        completed: false,
        setup: {
            files: {
                'small.txt': 'small',
                'medium.txt': 'This is a medium sized file with more content',
                'large.txt': 'This is a large file with lots of content that makes it bigger than the other files in this directory'
            }
        },
        validation: {
            type: 'output',
            expected: 'large.txt'
        }
    },
    {
        id: 'directory_structure',
        title: 'Create Directory Structure',
        description: 'Create a directory called "project" with subdirectories "src" and "docs", then create an empty file "README.md" in the project directory.',
        hint: 'Use mkdir -p for nested directories and touch for empty files.',
        difficulty: 'medium',
        completed: false,
        validation: {
            type: 'file_exists',
            files: ['project/README.md', 'project/src', 'project/docs']
        }
    }
];