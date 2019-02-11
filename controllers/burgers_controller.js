var express = require("express");

var router = express.Router();

var burgers = require("../models/burger.js");

router.get("/", function (req, res) {
    burgers.all(function (data) {
        var hbsObject = {
            burgers: data
        };
        console.log(hbsObject);
        res.render("index", hbsObject);
    });
});


router.post("/api/burgers", function (req, res) {
    burgers.create([
        "burger_name", "devoured"
    ], [
            req.body.burger_name, req.body.devoured
        ], function (result) {

            res.json({ id: result.insertId });
        });
});

router.put("/api/burgers/:id", function (req, res) {
    console.log(req.body);

    var condition = "id = " + req.params.id;

    console.log("condition", condition);

    burgers.update({
        devoured: req.body.devoured
    }, condition, function (result) {
        if (result.changedRows == 0) {
            return res.status(404).end();
        } else {
            res.redirect('/');
        }

    });
});
router.delete("/api/burgers/:id", function (req, res) {
    var condition = "id = " + req.params.id;

    burgers.delete(condition, function (result) {
        if (result.affectedRows == 0) {
            return res.status(404).end();
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;
