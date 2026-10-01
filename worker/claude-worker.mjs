import { createClient } from '@supabase/supabase-js'
import { spawn } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_PUBLISHABLE_KEY
const token = process.env.RESEARCH_OS_WORKER_TOKEN
const model = process.env.CLAUDE_MODEL || 'sonnet'
const pollSeconds = Math.max(5, Number(process.env.RESEARCH_OS_POLL_SECONDS || 8))

if (!url || !key || !token) {
  console.error('Missing SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY / RESEARCH_OS_WORKER_TOKEN in .env.worker')
  process.exit(1)
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
})

const sandbox = resolve(process.cwd(), 'worker', '.sandbox')
mkdirSync(sandbox, { recursive: true })

const sleep = ms => new Promise(r => setTimeout(r, ms))

async function rpc(name, args) {
  const { data, error } = await supabase.rpc(name, args)
  if (error) throw new Error(`${name}: ${error.message}`)
  return data
}

async function heartbeat() {
  try { await rpc('worker_heartbeat', { p_token: token }) }
  catch (e) { console.error('[heartbeat]', e.message) }
}

function runClaude(prompt) {
  return new Promise((resolvePromise, reject) => {
    const env = { ...process.env }
    // Subscription login should win over API billing.
    delete env.ANTHROPIC_API_KEY
    delete env.ANTHROPIC_AUTH_TOKEN
    env.CLAUDE_CODE_DISABLE_GIT_INSTRUCTIONS = '1'
    env.ENABLE_CLAUDEAI_MCP_SERVERS = 'false'

    const child = spawn('claude', ['-p', '--model', model, '--permission-mode', 'dontAsk'], {
      cwd: sandbox,
      env,
      shell: false,
      windowsHide: true,
    })
    let out = ''
    let err = ''
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', d => { out += d })
    child.stderr.on('data', d => { err += d })
    child.on('error', reject)
    child.on('close', code => {
      if (code === 0) resolvePromise(out.trim())
      else reject(new Error(err.trim() || `Claude exited with code ${code}`))
    })
    child.stdin.end(prompt)
  })
}

console.log(`Research OS Claude worker started. model=${model}, poll=${pollSeconds}s`)
console.log('Claude Code must already be logged in with this researcher\'s own Pro/Max account.')
await heartbeat()
setInterval(heartbeat, 30000).unref()

while (true) {
  try {
    const job = await rpc('worker_claim', { p_token: token })
    if (!job?.job_id) {
      await sleep(pollSeconds * 1000)
      continue
    }

    console.log(`[job ${job.job_id}] ${job.job_type} started`)
    try {
      const result = await runClaude(job.prompt)
      await rpc('worker_complete', { p_token: token, p_job_id: job.job_id, p_result: result })
      console.log(`[job ${job.job_id}] completed`)
    } catch (e) {
      await rpc('worker_fail', { p_token: token, p_job_id: job.job_id, p_error: String(e?.message || e) })
      console.error(`[job ${job.job_id}] failed:`, e?.message || e)
    }
  } catch (e) {
    console.error('[worker]', e?.message || e)
    await sleep(Math.max(10, pollSeconds) * 1000)
  }
}
