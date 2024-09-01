import express from "express"
import { exec } from "child_process"
import path from "path"
import { fileURLToPath } from "url"

const app = express()

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log(__dirname)

app.use(express.json())

app.post("/webhook", (req, res) => {
  const payload = req.body
  const url = payload.url

  // Send the response immediately
  res.sendStatus(200)

  if (payload.ref === "refs/heads/main") {
    // Execute the shell script asynchronously
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
