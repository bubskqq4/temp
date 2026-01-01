'use client'

import React, { useState, useEffect, useRef } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { ClaudeChatInput } from '@/components/ClaudeChatInput'
import {
    Bot,
    Send,
    Terminal,
    Sparkles,
    Search,
    Brain,
    Zap,
    MessageSquare,
    User,
    ArrowRight,
    Command,
    Trash2,
    Clock,
    FolderKanban,
    Target,
    ChevronDown,
    Paperclip,
    Globe,
    ImageIcon
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Helper for classes
function cn(...inputs: any[]) {
    return inputs.filter(Boolean).join(' ')
}

interface Message {
    id: string
    role: 'user' | 'assistant'
    content: string
    timestamp: Date
    suggestions?: string[]
}

export default function AICompanionPage() {
    const [messages, setMessages] = useState<Message[]>([])
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const [context, setContext] = useState<any>({})

    // Load context from localStorage
    useEffect(() => {
        try {
            const tasks = JSON.parse(localStorage.getItem('lifepath_tasks') || '[]')
            const projects = JSON.parse(localStorage.getItem('lifepath_projects') || '[]')
            const clients = JSON.parse(localStorage.getItem('lifepath_clients') || '[]')
            setContext({ tasks, projects, clients })
        } catch (e) {
            console.error("Failed to load AI context", e)
        }
    }, [])

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(scrollToBottom, [messages])

    const handleSend = async (text: string) => {
        if (!text.trim()) return

        const userMsg: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: text,
            timestamp: new Date()
        }

        setMessages(prev => [...prev, userMsg])
        setInput('')
        setIsTyping(true)

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [...messages, userMsg],
                    context
                })
            })

            const data = await response.json()
            if (data.error) throw new Error(data.error)

            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.text,
                timestamp: new Date()
            }

            setMessages(prev => [...prev, aiMsg])
        } catch (error) {
            console.error("Chat Error:", error)
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: "I'm having trouble connecting to my strategic circuits. Please try again in a moment.",
                timestamp: new Date()
            }
            setMessages(prev => [...prev, errorMsg])
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <div className="layout-wrapper">
            <Sidebar />

            <main className="chatgpt-container">
                {/* Model Selector Header */}
                <div className="chat-header-minimal">
                    <button className="model-selector">
                        <span>Gemini 1.5 Flash</span>
                        <ChevronDown size={16} />
                    </button>
                    <div className="header-actions">
                        <Sparkles size={18} className="text-zinc-500" />
                    </div>
                </div>

                {/* Empty State / Welcome */}
                {messages.length === 0 && (
                    <div className="empty-state">
                        <div className="welcome-icon">
                            <Bot size={48} />
                        </div>
                        <h2 className="welcome-title">How can I help you build today?</h2>

                        <div className="prompt-grid">
                            <button className="prompt-card" onClick={() => handleSend("Analyze my project progress")}>
                                <div className="card-inner">
                                    <FolderKanban size={18} />
                                    <span>Analyze my project progress</span>
                                </div>
                            </button>
                            <button className="prompt-card" onClick={() => handleSend("Draft a strategic roadmap")}>
                                <div className="card-inner">
                                    <Target size={18} />
                                    <span>Draft a strategic roadmap</span>
                                </div>
                            </button>
                            <button className="prompt-card" onClick={() => handleSend("Optimize my task workload")}>
                                <div className="card-inner">
                                    <Zap size={18} />
                                    <span>Optimize my task workload</span>
                                </div>
                            </button>
                            <button className="prompt-card" onClick={() => handleSend("Brainstorm new business leads")}>
                                <div className="card-inner">
                                    <Brain size={18} />
                                    <span>Brainstorm business leads</span>
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* Chat Feed */}
                <div className="chat-feed custom-scrollbar">
                    <div className="feed-inner">
                        {messages.map((msg) => (
                            <div key={msg.id} className={cn("msg-row", msg.role)}>
                                <div className="msg-avatar">
                                    {msg.role === 'assistant' ? <Bot size={18} /> : <User size={18} />}
                                </div>
                                <div className="msg-content">
                                    <div className="msg-author">{msg.role === 'assistant' ? 'Founder-GPT' : 'You'}</div>
                                    <div className="msg-text">{msg.content}</div>
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="msg-row assistant typing">
                                <div className="msg-avatar"><Bot size={18} /></div>
                                <div className="msg-content">
                                    <div className="msg-author">Founder-GPT</div>
                                    <div className="typing-indicator">
                                        <span className="dot" />
                                        <span className="dot" />
                                        <span className="dot" />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Floating Input Area */}
                <div className="floating-input-container">
                    <div className="input-box-wrapper glass">
                        <div className="box-top">
                            <textarea
                                placeholder="Message Founder-GPT..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault()
                                        handleSend(input)
                                    }
                                }}
                                rows={1}
                            />
                        </div>
                        <div className="box-bottom">
                            <div className="bottom-tools">
                                <button title="Attach"><Paperclip size={18} /></button>
                                <button title="Web Search"><Globe size={18} /></button>
                                <button title="Generate Image"><ImageIcon size={18} /></button>
                            </div>
                            <button
                                className={cn("submit-btn", input.trim() && "active")}
                                onClick={() => handleSend(input)}
                                disabled={!input.trim() || isTyping}
                            >
                                <Send size={20} />
                            </button>
                        </div>
                    </div>
                    <p className="footer-disclaimer">Founder-GPT can make mistakes. Plan accordingly.</p>
                </div>
            </main>

            <style jsx>{`
                .chatgpt-container {
                    flex: 1;
                    height: 100vh;
                    display: flex;
                    flex-direction: column;
                    background: #0d0d0d;
                    color: #ececec;
                    position: relative;
                }

                .chat-header-minimal {
                    height: 60px;
                    padding: 0 1.5rem;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    position: absolute;
                    top: 0;
                    width: 100%;
                    z-index: 10;
                    background: rgba(13, 13, 13, 0.8);
                    backdrop-filter: blur(10px);
                }

                @media (max-width: 768px) {
                    .chatgpt-container {
                        height: calc(100vh - 60px); /* Account for bottom sidebar */
                        padding-bottom: 60px;
                    }
                    
                    .prompt-grid {
                        grid-template-columns: 1fr;
                        padding: 0 1rem;
                    }

                    .welcome-title {
                        font-size: 1.5rem;
                        padding: 0 1rem;
                    }

                    .floating-input-container {
                        padding: 1rem;
                        bottom: 60px; /* Above mobile nav */
                    }
                    
                    .chat-feed {
                        padding-bottom: 180px;
                        padding-top: 70px;
                    }
                    
                    .msg-row {
                        gap: 0.75rem;
                    }
                    
                    .msg-avatar {
                        width: 24px;
                        height: 24px;
                    }

                    .empty-state {
                        padding: 1rem;
                    }
                }
                .model-selector {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    font-weight: 600;
                    font-size: 1.1rem;
                    color: #b4b4b4;
                    padding: 0.5rem 0.75rem;
                    border-radius: 8px;
                    transition: all 0.2s;
                }

                .model-selector:hover {
                    background: rgba(255,255,255,0.05);
                    color: white;
                }

                .empty-state {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 2rem;
                    text-align: center;
                    max-width: 800px;
                    margin: 0 auto;
                }

                .welcome-icon {
                    width: 80px;
                    height: 80px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 2rem;
                    color: white;
                }

                .welcome-title {
                    font-size: 2.25rem;
                    font-weight: 700;
                    margin-bottom: 3rem;
                    font-family: var(--font-serif);
                }

                .prompt-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    width: 100%;
                }

                .prompt-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 12px;
                    padding: 1.25rem;
                    text-align: left;
                    transition: all 0.2s;
                }

                .prompt-card:hover {
                    background: rgba(255,255,255,0.06);
                    border-color: rgba(255,255,255,0.2);
                    transform: translateY(-2px);
                }

                .card-inner {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                    color: #b4b4b4;
                }

                .prompt-card:hover .card-inner {
                    color: white;
                }

                .prompt-card span {
                    font-size: 0.95rem;
                    font-weight: 500;
                }

                .chat-feed {
                    flex: 1;
                    overflow-y: auto;
                    padding-top: 80px;
                    padding-bottom: 200px;
                }

                .feed-inner {
                    max-width: 800px;
                    margin: 0 auto;
                    width: 100%;
                    padding: 0 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 2.5rem;
                }

                .msg-row {
                    display: flex;
                    gap: 1.5rem;
                }

                .msg-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }

                .msg-row.user .msg-avatar {
                    background: #2f2f2f;
                }

                .msg-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .msg-author {
                    font-weight: 700;
                    font-size: 0.85rem;
                    color: white;
                }

                .msg-text {
                    font-size: 1.05rem;
                    line-height: 1.6;
                    color: #d1d1d1;
                    white-space: pre-wrap;
                }

                .floating-input-container {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    padding: 2rem 1.5rem 1.5rem;
                    background: linear-gradient(to top, #0d0d0d 60%, transparent);
                    z-index: 20;
                }

                .input-box-wrapper {
                    max-width: 800px;
                    margin: 0 auto;
                    background: #212121;
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 20px;
                    padding: 1rem 1.25rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .box-top textarea {
                    width: 100%;
                    background: transparent;
                    border: none;
                    outline: none;
                    color: white;
                    font-size: 1.1rem;
                    font-family: inherit;
                    resize: none;
                    max-height: 20rem;
                }

                .box-top textarea::placeholder {
                    color: #676767;
                }

                .box-bottom {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .bottom-tools {
                    display: flex;
                    gap: 0.75rem;
                }

                .bottom-tools button {
                    width: 32px;
                    height: 32px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 6px;
                    color: #676767;
                    transition: all 0.2s;
                }

                .bottom-tools button:hover {
                    background: rgba(255,255,255,0.05);
                    color: white;
                }

                .submit-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    background: #676767;
                    color: #0d0d0d;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.2s;
                }

                .submit-btn.active {
                    background: white;
                    color: black;
                }

                .footer-disclaimer {
                    text-align: center;
                    font-size: 0.75rem;
                    color: #676767;
                    margin-top: 1rem;
                }

                .typing-indicator {
                    display: flex;
                    gap: 4px;
                    padding: 4px 0;
                }

                .dot {
                    width: 4px;
                    height: 4px;
                    background: #676767;
                    border-radius: 50%;
                    animation: typing 1s infinite alternate;
                }

                .dot:nth-child(2) { animation-delay: 0.2s; }
                .dot:nth-child(3) { animation-delay: 0.4s; }

                @keyframes typing {
                    from { opacity: 0.3; transform: translateY(0); }
                    to { opacity: 1; transform: translateY(-4px); }
                }

                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
            `}</style>
        </div>
    )
}
