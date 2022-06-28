const express = require("express"),
      router = express.Router(),
      endpoint = require("earthmc/endpoint")

router.get("/", async (req, res) => filterUpdate(res).then(data => res.status(200).send(data)))

async function filterUpdate(res) { 
    let raw = await endpoint.playerData('aurora')
    if (!raw) return sendError(res)

    raw.updates = raw.updates?.filter(e => e.msg != "areaupdated" && e.msg != "markerupdated")
    return raw
}

const sendError = res => res.status(500).json("Error fetching player update, please try again.")

module.exports = router