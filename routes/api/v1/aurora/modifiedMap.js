const express = require("express"),
      router = express.Router(),
      cache = require("memory-cache"),
      modify = require("earthmc-dynmap-plus")

var cacheTimeout = 30000

async function sendModified(cacheKey, res) {
    let cachedMapData = cache.get(cacheKey),
        allianceType = cacheKey.replace('aurora', '')

    if (cachedMapData) res.status(200).send(cachedMapData)
    else {
        var mapData = await endpoint.mapData('aurora')
        if (!mapData) return sendError(res)

        let modified = modify(mapData, 'aurora', allianceType)
        cache.put(cacheKey, modified, cacheTimeout)
        res.status(200).send(modified)
    }
}

router.get("/mega", async (req, res) => sendModified('aurora_mega', res))
router.get("/pact", async (req, res) => sendModified('aurora_pact', res))

const sendError = res => res.status(500).json("Error fetching modified map data, please try again.")

module.exports = router