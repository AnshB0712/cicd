import express from "express"
const app = express()

app.use(express.json())

app.post("/webhook", (req, res) => {
  const payload = req.body

  console.log(payload)

  return res.sendStatus(200)
})

app.listen(5000, () => console.log("server started"))
