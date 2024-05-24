# Flat App 

Welcome to the FlatApp Repository!\
Built to streamline chores and task in your flat, the following instructions can be used to help set up your flat app.

### Running Locally

This will be a local set up so please make sure you have Node installed on your device. This [link](https://nodejs.org/en/learn/getting-started/how-to-install-nodejs) should provide sufficient help if needed.

Using a terminal of your choice (e.g PowerShell for Windows or Terminal for MacOs), in the command line :\
git clone the repository into a folder of your choice\

In  the terminal of this folder:
```
cd WeAreNumber1
git checkout tags/Heroku.1.4
```

You are now on our most recent release, which uses an online persistent MYSQL database on ClearDB.


```
npm install
npm start
```

You can now click/copy the local host to run the application. (Tested on Windows, Mac and also Linux systems)



### Hosted Online

It can also be found online here. HOWEVER, the db sleeps after inactivity and sometimes fails to connect.
https://info310flatapp-3341a741facc.herokuapp.com/


## Test Data


### Users
|ID| Name          | Email             | Phone Number | Address             | Password     |
|--|---------------|-------------------|--------------|---------------------|--------------|
|1| John Doe      | john@example.com  | 123456789    | 123 Main St, City   | password123  |
|2| Jane Smith    | jane@example.com  | 987654321    | 456 Oak St, Town    | qwerty456    |
|3| Alice Johnson | alice@example.com | 5551234567   | 789 Elm St, Village | pass123      |

### Groups
|ID| Name        | Join Code |
|-|-------------|-----------|
|1 |Group 1     | 123456    |
| 2|Group 2     | 234567    |
| 3|Team Alpha  | 345678    |

### Tasks
| Title  | Description             |
|--------|-------------------------|
| Task 1 | Description for Task 1  |
| Task 2 | Description for Task 2  |
| Task 3 | Description for Task 3  |

### Group User Relationships
| User ID | Group ID |
|---------|----------|
| 1       | 1        |
| 2       | 1        |
| 3       | 1        |
| 1       | 2        |
| 2       | 3        |

### Group Task Assignments
| Status       | Due Date   | Task ID | User ID | Group ID |
|--------------|------------|---------|---------|----------|
| Pending      | 2024-05-10 | 1       | 1       | 1        |
| In Progress  | 2024-05-15 | 2       | 2       | 1        |
| Completed    | 2024-05-20 | 3       | 3       | 1        |
| Pending      | 2024-05-12 | 1       | 1       | 2        |
| Pending      | 2024-05-18 | 2       | 2       | 3        |




