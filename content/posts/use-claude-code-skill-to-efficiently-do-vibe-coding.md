---
title: "Use Claude Code Skill to Efficiently Do Vibe Coding"
date: 2025-01-22
draft: false
tags: ["claude-code", "ai-coding", "productivity", "developer-tools"]
categories: ["Engineering"]
---

## Introduction: The World with Claude Code

We are living in an exciting era of AI-assisted development. Claude Code has emerged as a powerful CLI tool that transforms how developers interact with codebases. Unlike traditional autocomplete tools, Claude Code understands context, executes commands, reads files, and can even make complex multi-file changes autonomously.

But with great power comes great complexity. As teams adopt Claude Code, a critical question emerges: **How do we ensure consistent, high-quality outputs across different developers and tasks?**

This is where **Skills** become essential.

Think of Claude Code as a highly capable assistant who just joined your team. They're intelligent and eager to help, but they don't know your team's conventions, your coding standards, or your preferred workflows. You could explain everything from scratch each time—or you could create a comprehensive onboarding document that captures all this knowledge.

Skills are exactly that: structured instruction sets that guide Claude Code through specific tasks with precision and consistency.

## Problem Setup: Why Do We Need Skills?

### The Challenges of AI-Assisted Development

When teams start using Claude Code for complex tasks, several problems emerge:

**1. Inconsistent Outputs**

Without structured guidance, different team members get different results for similar tasks. One developer might get a well-structured implementation following team conventions, while another gets a technically correct but stylistically inconsistent solution.

**2. Knowledge Fragmentation**

Your team has accumulated valuable knowledge:
- Coding conventions and patterns
- Testing standards
- Internal libraries and utilities
- Review and approval workflows

This knowledge lives in documentation, Confluence pages, and tribal knowledge. Claude Code doesn't automatically know about these resources.

**3. Context Window Limitations**

Complex tasks require reading many files, understanding patterns, and planning implementations. Without careful management, the context window gets overwhelmed—leading to forgotten details and inconsistent implementations.

**4. Repetitive Instructions**

For common workflows like "implement a Jira ticket," developers find themselves repeating the same instructions:
- "First read the ticket from Jira"
- "Check the acceptance criteria"
- "Look at similar implementations"
- "Follow our testing patterns"

This is inefficient and error-prone.

### The Scaling Challenge

As your organization grows, these problems multiply:
- More developers using Claude Code
- More conventions to follow
- More internal tools to leverage
- More complex workflows to execute

You need a systematic solution—not just better prompts.

## Claude Skill Solution: Structured Intelligence

### What Are Skills?

Skills are collections of instructions that tell Claude Code what to do for specific tasks. They consist of three critical components:

| Component | Purpose |
|-----------|---------|
| **Name** | Clear identifier that describes the skill's purpose |
| **Description** | Explains when the skill should be used—Claude Code reads this to determine applicability |
| **Instructions** | Step-by-step workflow with phases, checkpoints, and expected outputs |

### Why Skills Matter

**1. Automatic Invocation**

Claude Code reads skill descriptions and automatically determines which skill applies to the current task. When a developer says "implement HORIZON-1234," Claude Code recognizes this matches the implement-python-ticket skill and invokes it.

**2. Consistent Workflows**

Skills encode your team's best practices into repeatable workflows. Every implementation follows the same phases, every test meets the same standards, every code review checks the same criteria.

**3. Knowledge Integration**

Skills can reference:
- Confluence documentation
- Internal libraries and packages
- Team conventions
- Approval gates and checkpoints

This turns scattered knowledge into actionable guidance.

**4. Context Management**

Well-designed skills use **subagents**—isolated processes that handle specific phases without bloating the main context window. This allows Claude Code to explore large codebases without losing track of earlier decisions.

### The Skill Architecture

```
┌─────────────────────────────────────────────┐
│              SKILL INVOCATION               │
├─────────────────────────────────────────────┤
│  User: "implement HORIZON-1234"             │
│                                             │
│  Claude Code reads skill descriptions       │
│  → Matches implement-python-ticket skill    │
│  → Loads skill instructions                 │
│  → Begins structured workflow               │
└─────────────────────────────────────────────┘
```

## Example: The Implement Python Ticket Skill

Let's examine a real-world skill that transforms how teams implement Jira tickets. This skill guides Claude Code through a systematic workflow from ticket analysis to tested code.

### Workflow Overview

```
┌─────────────────────────────────────────────────────────────┐
│                   IMPLEMENTATION WORKFLOW                   │
└─────────────────────────────────────────────────────────────┘

Phase 0: Authentication & Environment
   ↓ Verify MCP connection, detect project type

Phase 1: Ticket Analysis
   ↓ Fetch ticket, identify gaps in requirements

Phase 2: Requirement Clarification
   ↓ Clarify business requirements (NO code reading yet)
   ↓ ┌─────────────────────────────────────┐
     │    REQUIREMENT CONFIRMATION GATE   │
     │  User confirms understanding       │
     └─────────────────────────────────────┘

Phase 3: Codebase Exploration & Planning (SUBAGENT)
   ↓ ┌─────────────────────────────────────┐
     │  SUBAGENT: Explore → Plan → Approve │
     │                                     │
     │  • Discover patterns from code      │
     │  • Create implementation plan       │
     │  • Present plan to user             │
     │  • Handle revision if needed        │
     │  • Return only when approved        │
     └─────────────────────────────────────┘
   ↓ Save plan to docs/{TICKET_ID}-{slug}.md

Phase 4: Implementation
   ↓ Execute approved plan, match patterns

Phase 5: Testing & Verification
   ↓ Write tests, verify acceptance criteria

Result: Working code + tests + ready for PR
```

### Step-by-Step Walkthrough

#### Phase 0: Authentication & Environment

Before any work begins, the skill verifies prerequisites:

1. **MCP Authentication**: Checks the Atlassian MCP connection. If authentication fails, the skill stops and shows instructions rather than proceeding with incomplete access.

2. **Project Detection**: Identifies the project type from indicators:
   - Django: `manage.py`, `settings.py`, `models.py`
   - Kafka: `kafka/` directory, consumer/producer patterns
   - Generic Python: `pyproject.toml`, standard package structure

3. **Context Loading**: Locates `CLAUDE.md` files and shared utility directories that contain team-specific guidance.

**Why This Matters**: Starting with environment verification prevents wasted effort on tasks that would fail later due to missing access or incorrect assumptions.

#### Phase 1: Ticket Analysis

The skill fetches the Jira ticket and performs a structured analysis:

1. **Extract Information**: Issue key, title, description, acceptance criteria, linked documents
2. **Assess Completeness**: Are the requirements clear? Are acceptance criteria testable?
3. **Categorize Gaps**:
   - Minor (1-2 unknowns): Proceed with clarifying questions
   - Major (3+ unknowns): Suggest requesting a Technical Design document

**Why This Matters**: This prevents the "butterfly effect" where small ambiguities in requirements cascade into significant rework during implementation.

#### Phase 2: Requirement Clarification

This phase focuses purely on **WHAT** needs to be built—not **HOW**.

Key principle: Questions about behavior, edge cases, and business context belong here. Questions about code locations and existing patterns belong in Phase 3.

The skill:
1. Batches clarifying questions (asked all at once for efficiency)
2. Gathers user domain knowledge
3. Consolidates requirements into a summary
4. **GATE**: Requires explicit user confirmation before proceeding

**Why This Matters**: Separating business understanding from implementation details ensures you solve the right problem before investing in exploration.

#### Phase 3: Codebase Exploration & Planning

This is where the skill's architecture shines. A **subagent** handles exploration and planning in an isolated context:

**Why Use a Subagent?**
- Exploration requires reading many files
- Keeping this in the main session would bloat the context window
- If the user requests plan revisions, the subagent can adjust without re-reading files

The subagent workflow:
1. **Explore Codebase**: Find patterns, conventions, utilities, and similar implementations
2. **Load Pattern References**: Fetch established patterns from Confluence documentation
3. **Create Implementation Plan**: Structured plan with files to create/modify, steps, and test strategy
4. **Get User Approval**: Present plan and iterate until approved
5. **Return**: Only exits when the user explicitly approves

The output is saved to `docs/{TICKET_ID}-{slug}.md` as a checkpoint—if implementation needs to restart, this plan serves as the recovery point.

#### Phase 4: Implementation

With an approved plan, implementation becomes straightforward:

1. Follow the approved step order
2. Match discovered patterns and conventions
3. Apply clean code principles
4. Document progress

**Key Principle**: The implementation should fit the codebase, not impose new conventions.

#### Phase 5: Testing & Verification

The skill enforces testing standards:

**Test Structure**:
- AAA pattern (Arrange → Act → Assert)
- Descriptive names: `test_should_{expected_behavior}_when_{scenario}`
- One scenario per test

**What to Test**:
- Behavior, not implementation
- Mock only external boundaries
- Every bug fix requires a regression test

**Quality Targets**:
- 80%+ coverage for new code
- All acceptance criteria verified

### Why This Skill Works

The implement-python-ticket skill succeeds because it:

1. **Separates Concerns**: Requirements → Exploration → Planning → Implementation → Testing
2. **Uses Checkpoints**: Confirmation gates prevent cascading errors
3. **Manages Context**: Subagents isolate heavy exploration from the main session
4. **Encodes Standards**: Testing patterns, code conventions, and approval workflows are built-in
5. **Enables Recovery**: Saved plans allow restart without losing progress

## Claude Skill Best Practices

Based on Anthropic's official recommendations and practical experience, here are the key practices for creating effective skills:

### 1. Invest in Naming and Description

The skill name and description determine whether Claude Code invokes the skill correctly. Be specific:

| Quality | Example |
|---------|---------|
| **Poor** | "python-helper" |
| **Good** | "implement-jira-ticket" |
| **Description** | "Proactively use when user wants to implement a Jira ticket (e.g., 'implement HORIZON-1999', 'work on PROJ-123')" |

### 2. Design Clear Phase Boundaries

Break workflows into distinct phases with specific purposes:

- **Phase separation**: Don't mix requirements gathering with code exploration
- **Clear handoffs**: Define what each phase produces and what the next phase expects
- **Checkpoints**: Add confirmation gates at critical transitions

### 3. Use Subagents for Heavy Exploration

When a task requires reading many files:

```
Task(
  description: "Explore and plan for TICKET-123",
  subagent_type: "Plan",
  model: "opus",
  prompt: <structured template>
)
```

Benefits:
- Isolated context window
- Enables extended thinking
- Supports revision without re-exploration

### 4. Encode Your Team's Knowledge

Reference your actual documentation:
- Confluence pages with coding patterns
- Internal library documentation
- Team conventions and standards

Skills should know where to find authoritative guidance.

### 5. Build in Recovery Points

Save important outputs (like implementation plans) to files:
- Allows restart without losing progress
- Creates audit trail
- Enables handoff between sessions

### 6. Follow the Explore → Plan → Code → Commit Pattern

Anthropic's recommended workflow:

1. **Explore**: Read relevant files without writing code
2. **Plan**: Create documented plan before implementation
3. **Code**: Implement with explicit verification steps
4. **Commit**: Document changes properly

### 7. Be Specific in Instructions

Vague instructions reduce accuracy. Instead of:
> "Add appropriate tests"

Specify:
> "Write tests using AAA pattern. Name tests `test_should_{behavior}_when_{scenario}`. Cover all acceptance criteria behaviors. Target 80%+ coverage."

### 8. Test Incrementally

After creating or updating skills:
- Test with representative tasks
- Observe where Claude Code struggles
- Refine instructions based on actual behavior
- Iterate like prompt engineering

## Conclusion

Claude Code skills transform AI-assisted development from a novelty into a reliable engineering practice. By encoding your team's knowledge, standards, and workflows into structured instructions, you achieve:

- **Consistency**: Every implementation follows the same high-quality process
- **Efficiency**: No more repeating instructions or losing context
- **Scalability**: New team members benefit from accumulated expertise immediately
- **Quality**: Built-in checkpoints and standards prevent common mistakes

The implement-python-ticket skill demonstrates these principles in action: from ticket analysis through tested code, each phase has clear purpose, the workflow manages complexity through subagents, and team standards are enforced automatically.

As your team adopts Claude Code, investing in well-designed skills pays dividends across every task they handle. Start with your most common workflows, encode your best practices, and iterate based on results.

The future of development isn't just AI-assisted—it's AI-augmented with your team's collective intelligence.

---

*This post was prepared for the Engineering Open Space session on Claude Code Skills.*
