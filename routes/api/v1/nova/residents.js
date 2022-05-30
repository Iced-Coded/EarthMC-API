const express = require("express"),
      router = express.Router(),
      emc = require("earthmc"),
      cache = require("memory-cache")

var cacheTimeout = 30000

router.get("/", async (req, res) => {
    var cachedResidents = cache.get('residents')

    if (cachedResidents) res.status(200).json(cachedResidents)
    else {
        var residents = await emc.Nova.getResidents().catch(() => {})
        if (!residents) return res.status(500).json("An error occured fetching data, please try again.")
       
        cache.put('residents', residents, cacheTimeout)
        res.status(200).json(residents)
    }
})

router.get("/:residentName", async (req, res) => {
    var residentName = req.params.residentName,
        cachedResidents = cache.get('residents')
        
    if (cachedResidents) {
        var cachedResident = cachedResidents.find(res => res.name.toLowerCase() == residentName.toLowerCase())
        
        if (cachedResident) res.status(200).json(cachedResident)
        else res.status(404).json("That resident does not exist!")
    }
    else {
        var resident = await emc.Nova.getResident(residentName).catch(() => {})
        if (!resident) return res.status(404).json("That resident does not exist!")
        
        if (resident.name == "INVALID_PLAYER") res.status(404).json(resident.message)
        else res.status(200).json(resident)
    }
})

module.exports = router