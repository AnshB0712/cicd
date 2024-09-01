import express from "express"
import { spawn } from "child_process"
import path from "path"
import { fileURLToPath } from "url"

const app = express()

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log("Current directory:", __dirname)

app.use(express.json())

app.post("/webhook", (req, res) => {
  const payload = req.body
  const url = payload.repository.url

  // Send the response immediately
  res.sendStatus(200)

  if (payload.ref === "refs/heads/main") {
    console.log(`Updating repository: ${url}`)

    // Use spawn instead of exec
    const child = spawn("bash", [path.join(__dirname, "script.sh"), url], {
      stdio: "inherit",
    })

    // Log output in real-time
    child.stdout.on("data", (data) => {
      console.log(`${data}`)
    })

    child.stderr.on("data", (data) => {
      console.error(`stderr: ${data}`)
    })

    child.on("close", (code) => {
      console.log(`child process exited with code ${code}`)
    })

    child.on("error", (error) => {
      console.error(`Failed to start subprocess: ${error}`)
    })
  } else {
    console.log("Received webhook, but not for the main branch. Ignoring.")
  }
})

app.listen(5000, () => console.log("Server started on port 5000"))
