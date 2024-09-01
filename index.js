import express from "express"
import { exec } from "child_process"
import path from "path"
const app = express()

app.use(express.json())

app.post("/webhook", (req, res) => {
  const payload = req.body
  const url = payload.url

  res.sendStatus(200)

  console.log("send to webhook 200")

  if (payload.ref === "refs/heads/main") {
    exec(
      `bash ${path.join(__dirname, "script.sh")} ${url}`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`Error: ${error.message}`)
          return
        }
        if (stderr) {
          console.error(`Stderr: ${stderr}`)
          return
        }
        console.log(stdout)
      }
    )
  }
})

app.listen(5000, () => console.log("server started"))
