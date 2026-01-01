import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: Request) {
    try {
        const { messages, context } = await req.json();

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            systemInstruction: `You are Founder-GPT, an AI companion for the Founder's Route OS. 
You have access to the user's workspace context. Keep your responses concise, strategic, and high-fidelity. 
Focus on helping the user build their empire, manage their trajectory, and optimize their daily rituals.
Always reference specific tasks or projects if relevant to the query.`
        });

        // Build context summary
        const taskCount = context.tasks ? Object.values(context.tasks).flat().length : 0;
        const projectCount = context.projects?.length || 0;
        const clientCount = context.clients?.length || 0;

        const contextSummary = `Current workspace: ${projectCount} projects, ${taskCount} tasks, ${clientCount} clients.`;

        // Prepare chat history
        const history = messages.slice(0, -1).map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content }],
        }));

        const chat = model.startChat({ history });

        const latestMessage = messages[messages.length - 1].content;
        const enrichedMessage = `${contextSummary}\n\nUser query: ${latestMessage}`;

        const result = await chat.sendMessage(enrichedMessage);
        const response = await result.response;
        const text = response.text();

        return NextResponse.json({ text });
    } catch (error: any) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
