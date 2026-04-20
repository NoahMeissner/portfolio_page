---
title: ScopeWeaver System Architecture
config:
  flowchart:
    curve: cardinal
---
flowchart TB
    accDescr: Three-layer architecture. Frontend sends requests to API. The 5-Phase Pipeline (Thinker, Retrieval, Reranker, Planner) generates a strict JSON plan. The Orchestrator handles deployment back to the frontend and execution in the sandbox.

    subgraph Frontend["Phase 5: Deploy (Frontend)"]
        swift["SwiftUI macOS App<br/>(Spotlight UI + HITL confirm)"]
        cyto["Graphenbaum Viz<br/>(Rot/Grün Marker)"]
        swift --- cyto
    end

    subgraph API["API Layer"]
        run["POST /run"]
        stream["WS /stream"]
    end

    subgraph Pipeline["Agent Pipeline (Zero-Hallucination)"]
        thinker["1. Thinker<br/>(Abstrakter Plan)"]
        retrieval["2. Retrieval<br/>(Vektor-Suche)"]
        reranker["3. Reranker<br/>(Logik-Korrektur)"]
        planner["4. Planner<br/>(JSON Parameter-Mapping)"]
        
        thinker --> retrieval --> reranker --> planner
    end

    subgraph Orchestration["Execution"]
        orchestrator["Orchestrator<br/>(Plan Runner)"]
    end

    subgraph Sandbox["Sandbox + Storage"]
        fsgraph@{ shape: cyl, label: "FileSystemGraph" }
        indexes@{ shape: cyl, label: "Skill-Store (/skills/)" }
    end

    ollama@{ shape: cloud, label: "Ollama (on-device, 100% lokal)" }

    Frontend -->|"Natural Language Query"| API
    API --> thinker
    planner -->|"Sicheres JSON-Schema"| orchestrator
    orchestrator -->|"Ausführung"| Sandbox
    orchestrator -->|"Graph- & Status-Updates"| API
    
    retrieval -.->|"Skill-Matching"| indexes
    
    thinker -.->|"Prompt: Plan Generierung"| ollama
    reranker -.->|"Prompt: Werkzeug-Validierung"| ollama
    planner -.->|"Prompt: Parameter ausfüllen"| ollama

    classDef frontendLayer stroke:#6b5cd6,stroke-width:3px
    classDef apiLayer stroke:#2d9b4a,stroke-width:3px
    classDef pipelineLayer stroke:#d48806,stroke-width:3px
    classDef sandboxLayer stroke:#595959,stroke-width:3px
    classDef externalLayer stroke:#1a1a1a,stroke-width:3px

    class Frontend frontendLayer
    class API apiLayer
    class Pipeline pipelineLayer
    class Sandbox,Orchestration sandboxLayer
    class ollama externalLayer
