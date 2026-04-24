const fs = require('fs');
const path = require('path');

const talksDir = path.join('/Users/noah/Documents/github/noah-s-ai-compass', 'talks');
const outputDataPath = path.join('/Users/noah/Documents/github/noah-s-ai-compass', 'src', 'data', 'biasData.json');
const biases = ['no_biase', 'both_biase', 'search_biase', 'system_biase'];

let summaryData = {
    biases: biases,
    queries: {},
    stats: {}
};

biases.forEach(bias => {
    summaryData.stats[bias] = {
        totalRequests: 0,
        accepted: 0,
        rejected: 0,
        totalIterations: 0
    };

    const biasPath = path.join(talksDir, bias);
    if (!fs.existsSync(biasPath)) return;

    const files = fs.readdirSync(biasPath).filter(f => f.endsWith('.jsonl'));

    files.forEach(file => {
        const filePath = path.join(biasPath, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const lines = content.split('\n').filter(l => l.trim().length > 0);

        let userQuery = '';
        let iterations = 0;
        let finalDecision = 'UNKNOWN';
        let chatId = '';

        let firstAnalyst = null;
        let firstReflector = null;
        let finalAssistant = null;

        for (const line of lines) {
            try {
                const obj = JSON.parse(line);
                if (obj.role === 'user') {
                    userQuery = obj.content;
                }
                if (obj.chat_id) {
                    chatId = obj.chat_id;
                }

                if (obj.role === 'ITEM_ANALYST' && !firstAnalyst) {
                    if (obj.content && obj.content.ordered_recipes) {
                        firstAnalyst = "Top Suggestions:\n" + obj.content.explanations.slice(0, 3).map((e, i) => `${i + 1}. ${e}`).join('\n');
                    } else if (typeof obj.content === 'string') {
                        firstAnalyst = obj.content.substring(0, 200) + '...';
                    }
                }

                if (obj.role === 'REFLECTOR') {
                    if (!firstReflector) {
                        if (obj.meta && obj.meta.feedback) {
                            firstReflector = obj.meta.feedback;
                        } else if (typeof obj.content === 'string') {
                            firstReflector = obj.content;
                        }
                    }

                    if (obj.meta && obj.meta.decision) {
                        finalDecision = obj.meta.decision;
                        iterations++;
                    } else if (obj.content && typeof obj.content === 'string' && obj.content.includes('"DECISION": "ACCEPT"')) {
                        finalDecision = 'ACCEPT';
                        iterations++;
                    } else if (obj.content && typeof obj.content === 'string' && obj.content.includes('"DECISION": "REJECT"')) {
                        finalDecision = 'REJECT';
                        iterations++;
                    }
                }

                if (obj.role === 'assistant') {
                    if (Array.isArray(obj.content)) {
                        finalAssistant = "Final Validated Output:\n" + obj.content.slice(0, 3).map(r => `- ${r.title || 'Recipe'}`).join('\n');
                    } else if (typeof obj.content === 'string') {
                        finalAssistant = "Final Validated Output:\n" + obj.content.substring(0, 200) + '...';
                    }
                }
            } catch (e) {
                // ignore parse errors for a single line
            }
        }

        if (!chatId) return;

        if (!summaryData.queries[chatId]) {
            summaryData.queries[chatId] = {
                id: chatId,
                query: userQuery,
                results: {}
            };
        }

        summaryData.queries[chatId].results[bias] = {
            decision: finalDecision,
            iterations: iterations,
            plannerDraft: firstAnalyst || "Agent generated a draft plan analyzing search results.",
            reflectorAnalysis: firstReflector || "Reflector validated the plan.",
            finalPlan: finalAssistant || "Agent confirmed final generation to user."
        };

        summaryData.stats[bias].totalRequests++;
        if (finalDecision === 'ACCEPT') summaryData.stats[bias].accepted++;
        else if (finalDecision === 'REJECT') summaryData.stats[bias].rejected++;
        summaryData.stats[bias].totalIterations += iterations;
    });
});

fs.mkdirSync(path.dirname(outputDataPath), { recursive: true });
fs.writeFileSync(outputDataPath, JSON.stringify(summaryData, null, 2));
console.log(`Parsed ${Object.keys(summaryData.queries).length} queries and wrote to ${outputDataPath}`);
