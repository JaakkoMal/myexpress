var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display Opintorekisteri page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM Opintorekisteri ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/opintorekisteri/index.ejs
            res.render('Opintorekisteri',{data:''});   
        } else {
            // render to views/opintorekisteri/index.ejs
            res.render('Opintorekisteri',{data:rows});
        }
    });
});

// display add opintorekisteri page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('Opintorekisteri/add', {
        opiskelija: '',
        opintojakso: '',
        arviointi: ''        
    })
})

// add a new opintorekisteri
router.post('/add', function(req, res, next) {    

    let opiskelija = req.body.opiskelija;
    let opintojakso = req.body.opintojakso;
    let arviointi = req.body.arviointi;
    let errors = false;

    if(opiskelija.length === 0 || opintojakso.length === 0 | arviointi.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter name and author");
        // render to add.ejs with flash message
        res.render('books/add', {
            name: opiskelija,
            opintojakso: opintojakso,
            arviointi: arviointi
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            opiskelija: opiskelija,
            opintojakso: opintojakso,
            arviointi: arviointi
        }
        
        // insert query
        dbConn.query('INSERT INTO Opintorekisteri SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('Opintorekisteri/add', {
                    opiskelija: form_data.opiskelija,
                    opintojakso: form_data.opintojakso,
                    arviointi: form_data.arviointi               
                })
            } else {                
                req.flash('success', 'information successfully added');
                res.redirect('/Opintorekisteri');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM Opintorekisteri WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'Info not found with id = ' + id)
            res.redirect('/Opintorekisteri')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('Opintorekisteri/edit', {
                title: 'Edit Opintorekisteri', 
                id: rows[0].id,
                opiskelija: rows[0].opiskelija,
                opintojakso: rows[0].opintojakso,
                arviointi: rows[0].arviointi
            })
        }
    })
})

// update book data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let opiskelija = req.body.opiskelija;
    let opintojakso = req.body.opintojakso;
    let arviointi = req.body.arviointi;
    let errors = false;

    if(opiskelija.length === 0 || opintojakso.length === 0 | arviointi.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter information");
        // render to add.ejs with flash message
        res.render('Opintorekisteri/edit', {
            id: req.params.id,
            opiskelija: opiskelija,
            opintojakso: opintojakso,
            arviointi: arviointi
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            opiskelija: opiskelija,
            opintojakso: opintojakso,
            arviointi: arviointi
        }
        // update query
        dbConn.query('UPDATE Opintorekisteri SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('Opintorekisteri/edit', {
                    id: req.params.id,
                    opiskelija: form_data.opiskelija,
                    opintojakso: form_data.opintojakso,
                    arviointi: form_data.arviointi
                })
            } else {
                req.flash('success', 'Info successfully updated');
                res.redirect('/Opintorekisteri');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM Opintorekisteri WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/Opintorekisteri')
        } else {
            // set flash message
            req.flash('success', 'Info successfully deleted! ID = ' + id)
            // redirect to books page
            res.redirect('/Opintorekisteri')
        }
    })
})

module.exports = router;