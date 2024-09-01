import express from "express"
import { spawn } from "child_process"
import path from "path"
import { fileURLToPath } from "url"

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log("Current directory:", __dirname)

app.use(express.json())

app.post("/webhook", (req, res) => {
  const payload = req.body
  const url = payload.repository?.url

  // Send the response immediately
  res.sendStatus(200)

  if (url && payload.ref === "refs/heads/main") {
    console.log(`Updating repository: ${url}`)

    try {
      const child = spawn("bash", [path.join(__dirname, "script.sh"), url], {
        stdio: "inherit",
      })

      child.on("error", (error) => {
        console.error(`Failed to start subprocess: ${error}`)
      })

      child.on("close", (code) => {
        console.log(`Child process exited with code ${code}`)
      })
    } catch (error) {
      console.error(`Error spawning child process: ${error}`)
    }
  } else {
    console.log("Invalid webhook payload or not for the main branch. Ignoring.")
  }
})

app.listen(5000, () => console.log("Server started on port 5000"))
