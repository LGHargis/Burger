var express = require("express");

var app = express();
var PORT = process.env.PORT || 8080;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "Terminalgirl16",
    database: "burger_db"
});
//connects to the database----------------
connection.connect(function (err) {
    if (err) {
        console.error("error connecting: " + err.stack);
        return;
    }
    console.log("connected as id " + connection.threadId);
});

//display all burgers in the database-------------------
app.get("/", function (req, res) {
    connection.query("SELECT * FROM burgers;", function (err, data) {
        if (err) {
            return res.status(500).end();
        }
        res.render("index", { burgers: data });
    });
});

//delete a burger will remove completely from database---------------------------
app.delete("/burgers/:id", function (req, res) {
    connection.query("DELETE FROM burgers WHERE id = ?", [req.params.id], function (err, result) {
        if (err) {
            return res.status(500).end();
        }
        else if (result.affectedRows === 0) {

            return res.status(404).end();
        }
        res.status(200).end();
    });
});
//create burger adds to database-------------------------------
app.post("/burgers", function (req, res) {
    connection.query("INSERT INTO burgers (burger_name) VALUES (?)", [req.body.burger_name], function (err, result) {
        if (err) {
            return res.status(500).end();
        }
        res.json({ id: result.insertId });
    });
});

//update the database. Will remove or change the name but not the id---------------------------------------------
app.put("/burgers/:id", function (req, res) {
    connection.query("UPDATE burgers SET burger_name = ? WHERE id = ?", [req.body.burger_name, req.params.id], function (err, result) {
        if (err) {
            return res.status(500).end();
        }
        else if (result.changedRows === 0) {
            return res.status(404).end();
        }
        res.status(200).end();

    });
});
//----------------------------------------------
app.listen(PORT, function () {
    console.log("Server listening on: http://localhost:" + PORT);
});
