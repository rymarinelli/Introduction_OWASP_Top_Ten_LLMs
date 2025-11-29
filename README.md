# Introduction to the OWASP Top 10 for LLM Applications

## Room Introduction
Welcome to the TryHackMe room focused on the OWASP Top 10 for Large Language Model (LLM) applications. In this guided lab you will explore common LLM-specific security weaknesses, practice spotting flawed prompt flows, and learn how to secure generative AI workloads. The room uses lightweight challenges to demonstrate issues hands-on before you apply the same mindset to your own projects.

### Stack and launch options
- The challenge runs on a single **Node.js + Express** service. There is no Flask component; you only need Node to host the game.
- To start locally, install dependencies with `npm install` (once) and run `npm start` to serve the UI at `http://localhost:3000`.
- If you are packaging this for a platform that prefers Python, keep the Node service as-is and reverse-proxy to it instead of mixing runtimes.

## Learning Objectives
- Recognize the OWASP Top 10 for LLMs and why they matter for real-world deployments.
- Identify vulnerable LLM behaviors in conversation, code samples, and system configurations.
- Practice safe interaction patterns, mitigations, and validation steps for each category.
- Understand how to run the room’s services, submit flags, and verify your answers.

## Quick OWASP Top 10 LLMs Primer
- **LLM01: Prompt Injection** – Untrusted input alters system prompts or policy instructions.
- **LLM02: Insecure Output Handling** – Generated content is executed or trusted without validation.
- **LLM03: Training Data Poisoning** – Malicious or low-quality data leads to harmful model behavior.
- **LLM04: Model Denial of Service** – Resource exhaustion through prompt abuse or expensive requests.
- **LLM05: Supply Chain Vulnerabilities** – Risky dependencies, models, or plugins compromise the system.
- **LLM06: Sensitive Information Disclosure** – Secrets or personal data leaked via prompts or responses.
- **LLM07: Insecure Plugin Design** – Plugins expose unsafe actions or weak auth/authorization.
- **LLM08: Excessive Agency** – Over-privileged agents take unintended or dangerous actions.
- **LLM09: Overreliance on LLMs** – Trusting unverified outputs without human or automated checks.
- **LLM10: Model Theft** – Unauthorized access to model weights, APIs, or inference pipelines.

## Room Walkthrough
1. **Start the machine** from the TryHackMe task to boot the lab environment. Wait for the status to show the machine is running.
2. **Open the provided URL/port** (usually `http://MACHINE_IP:PORT`) in your browser. If a split-pane preview is offered, you can interact directly in the tab.
3. **Follow the task text** for each OWASP category. Tasks include a short description, the interactive “mix-and-match” panel, and a question that expects a flag.
4. **Trigger the behavior** by following the prompt guidance in the panel. Some tasks require you to submit an injection payload; others involve inspecting provided output or request logs.
5. **Collect the flag** shown after you exploit or mitigate the scenario. Flags appear as `THM{...}` or short codes displayed in the panel or terminal output.
6. **Submit the flag** in the corresponding task answer box. If the answer is rejected, re-run the step and make sure whitespace and braces match exactly.
7. **Reset if stuck**: if the service becomes unresponsive, stop/start the machine or use the room-provided reset script, then revisit the URL/port.

### Quick Start Checklist
- Machine is running and IP/port is visible in the task banner.
- Browser or preview tab is open to `http://MACHINE_IP:PORT`.
- Mix-and-match panel responds to prompts (refresh if not).
- Flag format confirmed as `THM{...}` before submission.

## Preview the UI
- The web page is a single-screen matching game that lists the ten OWASP categories with hints and explanations. Each category has a dropdown containing the shuffled descriptions.
- When you click **Check my matches**, correct pairings are highlighted with per-category flags; once all ten are correct you see the final flag.
- To see it in action locally, run `npm start` and browse to `http://localhost:3000`.

## Hints by Category
- **LLM01 Prompt Injection**: Look for ways user input can override system or developer instructions; try classic “ignore previous instructions” style payloads.
- **LLM02 Insecure Output Handling**: Check where generated code or URLs are auto-executed—try injecting extra commands or scripts.
- **LLM03 Training Data Poisoning**: Identify sources where users contribute data; see if tampered examples change the model’s answers.
- **LLM04 Model Denial of Service**: Submit long, nested, or computation-heavy prompts to observe latency spikes or failures.
- **LLM05 Supply Chain Vulnerabilities**: Inspect dependencies, model downloads, or plugin sources for unsigned or outdated packages.
- **LLM06 Sensitive Information Disclosure**: Probe for secrets in logs, memory dumps, or verbose prompts; try role-play to coax hidden data.
- **LLM07 Insecure Plugin Design**: Review plugin manifests or API calls for missing auth, broad scopes, or insufficient input validation.
- **LLM08 Excessive Agency**: Check how the agent chooses tools; attempt to make it perform unintended file or network actions.
- **LLM09 Overreliance on LLMs**: Seek places where outputs are used without verification; propose validation rules or sanity checks.
- **LLM10 Model Theft**: Look for exposed model endpoints, download links, or weak access controls around weights and configs.

## Next Steps
- Read the OWASP Top 10 for LLM Applications overview: https://owasp.org/www-project-top-10-for-large-language-model-applications/
- Explore the OWASP LLM AI Security & Governance documents: https://owasp.org/llm-ai-security/
- Review mitigation patterns and prompts in the OWASP Cheat Sheet Series: https://cheatsheetseries.owasp.org/
- Follow the OWASP AI Exchange for new community playbooks and controls: https://owaspai.org/
