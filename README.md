# iEDC NSSCE Website in NodeJS app
## iEDC Website rebuild from php to NodeJS with MongoDB
The real website is at [edc website](https://edc.nssce.ac.in)
### Read available comments in the page carefully while development
*Many dependencies have been installed nodemon,multer(file upload),nodemailer,email-templates being some important ones. The app itself has many routes and also has an authenticated login system with a database access. The template engine is Express Handlebars many conditional statements used inside hbs template(which could've done in the backend itself but it created page duplication for different kinds of users), that involves hiding(not really,but not showing even in developer browser) of many parts of the page.*
## Things to take care of during development
### Mongodb uri string is in the app.js file, install mongodb in your machine and add data from the json files given in the public/assets/backupdb folder. Database names can be got from the schema sets in db folder.
### Dont mess with the apply date and pass review buttons if you are giving a vaild email and password in the routes/dashboard/creds.json file as it will hopefully sent a mail to the email from the data(Dont do this please ;))
### Most important of all, DO NOT UPDATE THE DEPENDENCIES OR NODE unless you really know what mess are you getting into, Codes will require new syntax and also if you somehow do that unknowingly , dont push the changes, instead remove your repository-clone again-start new. 
## Steps for Running the project
### Clone the project
### Navigate to the cloned location
```
cd edcnssce/
npm install
npm start
```
### This will do the magic
*If above doesn't work turn on your internet connection and try since there are many web CDNs that need network connection to fetch data*
### Also try 
```
npm run dev
```
## Contributors
* **[Sachin Dev](https://github.com/heysachin)**  - Was an Engineering student at NSSCE - 2015-19 Batch
* **[Clince Joshy](https://github.com/clincejoshy)**  - Was an Engineering student at NSSCE - 2015-19 Batch
* **[Rakesh Kumar T](https://github.com/Rk1229)**  - Was an Engineering student at NSSCE - 2016-20 Batch(Created nodejs app from the  original html-php project)
* **[Jain Mj](https://github.com/Jainmj1234)** - Was an Engineering student at NSSCE - 2016-20 Batch
* **[Amarnath K](https://github.com/RoyalBlood153)** - Was an Engineering student at NSSCE - 2016-20 Batch
* **[Akarsh Ashok](https://github.com/Akchy)** - Was an Engineering student at NSSCE - 2016-20 Batch
* **[Achinth](https://github.com/achinthz)** - Was an Engineering student at NSSCE - 2016-20 Batch
