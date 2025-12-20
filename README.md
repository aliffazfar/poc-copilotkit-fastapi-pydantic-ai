# JomKira - Banking POC Speedrun 🚧

> **Status:** ✅ POC Complete

A Proof of Concept (POC) banking assistant designed to evaluate **CopilotKit** and **PydanticAI** in a fintech context. **This project is a POC focused on exploring CopilotKit's capabilities. Neither the frontend nor the backend are intended to be production-grade implementations.** It demonstrates how to build a fully custom chat interface with deep AI integration, moving beyond standard chatbots to interactive financial tools.

<table>
  <tr>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/e45baa3e-d1b2-4686-a01f-fa18fa26c0e7" width="100%" alt="Bill Payment Demo">
    </td>
    <td width="50%">
      <img src="https://github.com/user-attachments/assets/c4f948e2-76b7-4451-b138-ac2bf1b2d337" width="100%" alt="Transfer Demo">
    </td>
  </tr>
</table>

## Core Highlights

### CopilotKit Integration

Utilizes CopilotKit to power a custom-built chat drawer. The framework handles **Server-Sent Events (SSE)**, state management, and tool execution out of the box, allowing for a seamless integration of AI capabilities into custom UI components.

### Generative UI

Renders interactive React components directly within the chat stream. Instead of simple text responses, the agent presents dynamic UI elements (like transfer confirmation cards), enabling rich Human-in-the-Loop workflows.

### Custom Guardrails Middleware

Implements a bespoke middleware layer on the backend to sanitize inputs and filter noise before requests reach the LLM. This approach significantly optimizes token usage and ensures data security by stripping unnecessary information early in the pipeline.

## Technical Stack

- **Frontend:** Next.js 16 (App Router), Tailwind CSS 4, shadcn/ui
- **Backend:** FastAPI, PydanticAI, Pydantic v2
- **Infrastructure:** Custom SSE implementation via CopilotKit

## Features

- **Vision-Powered Bill Analysis:** Automatically extracts payment details from receipt images using LLM vision capabilities.
- **Smart Transfers:** Processes natural language transaction requests and prepares execution details for user confirmation.
- **Structured Reasoning:** Enforces strict schemas for tool outputs using PydanticAI, ensuring reliable backend operations.

## Quick Start

1. **Install Dependencies**

   ```bash
   pnpm install
   ```

2. **Environment Setup**

   Configure `OPENAI_API_KEY` in `.env` at the project root.

   Refer to `.env.example` or check `agent/src/config/settings.py` for all available configuration options.

3. **Run Development Server**

   ```bash
   pnpm dev
   ```
