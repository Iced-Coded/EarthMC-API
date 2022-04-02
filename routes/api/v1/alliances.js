const express = require("express"),
      router = express.Router(),
      cache = require("memory-cache"),
      cors = require('cors')

var timeout = 60000

require("dotenv").config()

// PUT = CREATE/UPDATE
// POST = CREATE/OVERWRITE
// GET = READ

router.get('/', function (req, res) 
{
    var cachedAlliances = cache.get('alliances')

    if (cachedAlliances) send200(res, cachedAlliances)
    else send202(res)
})

router.get('/:allianceName', function (req, res) 
{
    var cachedAlliances = cache.get('alliances'),
        allianceName = req.params.allianceName

    if (cachedAlliances) {
        switch(allianceName) {
            case "submeganations":
                let submeganations = cachedAlliances.filter(alliance => alliance.type == 'sub')
                send200(res, submeganations)
                
                break
            case "meganations":
                let meganations = cachedAlliances.filter(alliance => alliance.type == 'mega')
                send200(res, meganations)
                
                break
            default:
                let alliance = cachedAlliances.find(cur => cur.allianceName.toLowerCase() == allianceName.toLowerCase())

                if (!alliance) res.status(404).json("That alliance does not exist!")
                else send200(res, alliance)
        }
    }
    else send202(res)
})

router.put('/', cors(), function (req, res) 
{
    if (req.header('AUTH_KEY') == process.env.AUTH_KEY) {
        var alliances = req.body

        cache.put('alliances', alliances)
        res.status(200).json(alliances).setTimeout(timeout)
    }
    else res.status(401).send("PUT request unauthorized!")
})

function send200(res, data) {
    res.status(200).json(data).setTimeout(timeout)
}

function send202(res) {
    res.status(202).send("Alliances are not updated yet.")
}

module.exports = router