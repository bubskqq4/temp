import React, { useState, useRef, useEffect, useCallback } from "react";
import { Plus, ChevronDown, ArrowUp, X, FileText, Loader2, Check, Archive, Sparkles } from "lucide-react";

/* --- ICONS --- */
export const Icons = {
    Logo: (props: React.SVGProps<SVGSVGElement>) => (
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" role="presentation" {...props}>
            <defs>
                <ellipse id="petal-pair" cx="100" cy="100" rx="90" ry="22" />
            </defs>
            <g fill="#D46B4F" fillRule="evenodd">
                <use href="#petal-pair" transform="rotate(0 100 100)" />
                <use href="#petal-pair" transform="rotate(45 100 100)" />
                <use href="#petal-pair" transform="rotate(90 100 100)" />
                <use href="#petal-pair" transform="rotate(135 100 100)" />
            </g>
        </svg>
    ),
    Plus: Plus,
    Thinking: Sparkles, // Reusing Sparkles as "Thinking" icon placeholder or similar logic
    SelectArrow: ChevronDown,
    ArrowUp: ArrowUp,
    X: X,
    FileText: FileText,
    Loader2: Loader2,
    Check: Check,
    Archive: Archive,
};

/* --- UTILS --- */
const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

interface AttachedFile {
    id: string;
    file: File;
    type: string;
    preview: string | null;
    uploadStatus: string;
    content?: string;
}

interface FilePreviewCardProps {
    file: AttachedFile;
    onRemove: (id: string) => void;
}

const FilePreviewCard: React.FC<FilePreviewCardProps> = ({ file, onRemove }) => {
    const isImage = file.type.startsWith("image/") && file.preview;

    return (
        <div className={`relative group flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-[#454540] bg-[#30302E] animate-fade-in transition-all hover:border-[#8A8A88]`}>
            {isImage ? (
                <div className="w-full h-full relative">
                    <img src={file.preview!} alt={file.file.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                </div>
            ) : (
                <div className="w-full h-full p-3 flex flex-col justify-between">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-[#454540] rounded">
                            <Icons.FileText className="w-4 h-4 text-[#B4B4B4]" />
                        </div>
                        <span className="text-[10px] font-medium text-[#888888] uppercase tracking-wider truncate">
                            {file.file.name.split('.').pop()}
                        </span>
                    </div>
                    <div className="space-y-0.5">
                        <p className="text-xs font-medium text-[#E1E1E0] truncate" title={file.file.name}>
                            {file.file.name}
                        </p>
                        <p className="text-[10px] text-[#6B6B65]">
                            {formatFileSize(file.file.size)}
                        </p>
                    </div>
                </div>
            )}

            <button
                onClick={() => onRemove(file.id)}
                className="absolute top-1 right-1 p-1 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <Icons.X className="w-3 h-3" />
            </button>

            {file.uploadStatus === 'uploading' && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Icons.Loader2 className="w-5 h-5 text-white animate-spin" />
                </div>
            )}
        </div>
    );
};

interface PastedContentCardProps {
    content: {
        id: string;
        content: string;
        timestamp: Date;
    };
    onRemove: (id: string) => void;
}

const PastedContentCard: React.FC<PastedContentCardProps> = ({ content, onRemove }) => {
    return (
        <div className="relative group flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden border border-[#454540] bg-[#262624] animate-fade-in p-3 flex flex-col justify-between shadow-sm">
            <div className="overflow-hidden w-full">
                <p className="text-[10px] text-[#8A8A88] leading-[1.4] font-mono break-words whitespace-pre-wrap line-clamp-4 select-none">
                    {content.content}
                </p>
            </div>

            <div className="flex items-center justify-between w-full mt-2">
                <div className="inline-flex items-center justify-center px-1.5 py-[2px] rounded border border-[#454540] bg-[#050505]">
                    <span className="text-[9px] font-bold text-[#8A8A88] uppercase tracking-wider font-sans">PASTED</span>
                </div>
            </div>

            <button
                onClick={() => onRemove(content.id)}
                className="absolute top-2 right-2 p-[3px] bg-[#262624] border border-[#454540] rounded-full text-[#8A8A88] hover:text-[#E1E1E0] transition-colors shadow-sm opacity-0 group-hover:opacity-100"
            >
                <Icons.X className="w-2 h-2" />
            </button>
        </div>
    );
};

interface Model {
    id: string;
    name: string;
    description: string;
    badge?: string;
}

interface ModelSelectorProps {
    models: Model[];
    selectedModel: string;
    onSelect: (modelId: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ models, selectedModel, onSelect }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentModel = models.find(m => m.id === selectedModel) || models[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`inline-flex items-center justify-center relative shrink-0 transition font-base duration-300 h-8 rounded-xl px-3 min-w-[4rem] active:scale-[0.98] whitespace-nowrap !text-xs pl-2.5 pr-2 gap-1 
                ${isOpen
                        ? 'bg-[#30302E] text-[#ECECEC]'
                        : 'text-[#B4B4B4] hover:text-[#E1E1E0] hover:bg-[#30302E]'}`}
            >
                <div className="font-ui inline-flex gap-[3px] text-[14px] h-[14px] leading-none items-baseline">
                    <div className="flex items-center gap-[4px]">
                        <div className="whitespace-nowrap select-none font-medium">{currentModel.name}</div>
                    </div>
                </div>
                <div className="flex items-center justify-center opacity-75" style={{ width: '20px', height: '20px' }}>
                    <Icons.SelectArrow className={`shrink-0 opacity-75 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
            </button>

            {isOpen && (
                <div className="absolute bottom-full right-0 mb-2 w-[260px] bg-[#262624] border border-[#454540] rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col p-1.5 animate-fade-in origin-bottom-right">
                    {models.map(model => (
                        <button
                            key={model.id}
                            onClick={() => {
                                onSelect(model.id);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl flex items-start justify-between group transition-colors hover:bg-[#30302E]`}
                        >
                            <div className="flex flex-col gap-0.5">
                                <div className="flex items-center gap-2">
                                    <span className="text-[13px] font-semibold text-[#ECECEC]">
                                        {model.name}
                                    </span>
                                    {model.badge && (
                                        <span className="px-1.5 py-[1px] rounded-full text-[10px] font-medium border border-[#454540] text-[#B4B4B4]">
                                            {model.badge}
                                        </span>
                                    )}
                                </div>
                                <span className="text-[11px] text-[#B4B4B4]">
                                    {model.description}
                                </span>
                            </div>
                            {selectedModel === model.id && (
                                <Icons.Check className="w-4 h-4 text-[#D2996E] mt-1" />
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

interface ClaudeChatInputProps {
    onSendMessage: (data: string) => void;
    isTyping?: boolean;
}

export const ClaudeChatInput: React.FC<ClaudeChatInputProps> = ({ onSendMessage, isTyping = false }) => {
    const [message, setMessage] = useState("");
    const [files, setFiles] = useState<AttachedFile[]>([]);
    const [pastedContent, setPastedContent] = useState<any[]>([]);
    const [isDragging, setIsDragging] = useState(false);
    const [selectedModel, setSelectedModel] = useState("gemini-1.5-flash");
    const [isThinkingEnabled, setIsThinkingEnabled] = useState(false);

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const models = [
        { id: "gemini-1.5-flash", name: "Gemini 1.5 Flash", description: "Fast & versatile" },
        { id: "gemini-1.5-pro", name: "Gemini 1.5 Pro", description: "Complex reasoning" },
    ];

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 384) + "px";
        }
    }, [message]);

    const handleSend = () => {
        if (!message.trim() && files.length === 0) return;
        onSendMessage(message); // Start simple with just string message for compatibility
        setMessage("");
        setFiles([]);
        setPastedContent([]);
        if (textareaRef.current) textareaRef.current.style.height = 'auto';
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const hasContent = message.trim() || files.length > 0 || pastedContent.length > 0;

    return (
        <div className="w-full max-w-2xl mx-auto font-sans text-white">
            <div className={`
                flex flex-col mx-2 md:mx-0 items-stretch transition-all duration-200 relative z-10 rounded-2xl cursor-text
                border border-[#262626] bg-[#1a1a1a]
                shadow-lg hover:shadow-xl
                font-sans antialiased
            `}>

                <div className="flex flex-col px-3 pt-3 pb-2 gap-2">
                    {/* Files Preview */}
                    {(files.length > 0 || pastedContent.length > 0) && (
                        <div className="flex gap-3 overflow-x-auto custom-scrollbar pb-2 px-1">
                            {files.map(file => (
                                <FilePreviewCard
                                    key={file.id}
                                    file={file}
                                    onRemove={id => setFiles(prev => prev.filter(f => f.id !== id))}
                                />
                            ))}
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="relative mb-1">
                        <div className="max-h-96 w-full overflow-y-auto custom-scrollbar font-sans break-words transition-opacity duration-200 min-h-[2.5rem] pl-1">
                            <textarea
                                ref={textareaRef}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="How can I help you build today?"
                                className="w-full bg-transparent border-0 outline-none text-[#ECECEC] text-[16px] placeholder:text-[#888888] resize-none overflow-hidden py-0 leading-relaxed block font-normal antialiased"
                                rows={1}
                                autoFocus
                                style={{ minHeight: '1.5em' }}
                            />
                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex gap-2 w-full items-center">
                        <div className="relative flex-1 flex items-center shrink min-w-0 gap-1">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="inline-flex items-center justify-center relative shrink-0 transition-colors duration-200 h-8 w-8 rounded-lg active:scale-95 text-[#888888] hover:text-[#ECECEC] hover:bg-[#333333]"
                            >
                                <Icons.Plus className="w-5 h-5" />
                            </button>

                            <button
                                onClick={() => setIsThinkingEnabled(!isThinkingEnabled)}
                                className={`transition-all duration-200 h-8 w-8 flex items-center justify-center rounded-lg active:scale-95
                                        ${isThinkingEnabled
                                        ? 'text-[#D97757] bg-[#D97757]/10'
                                        : 'text-[#888888] hover:text-[#ECECEC] hover:bg-[#333333]'}
                                    `}
                            >
                                <Icons.Thinking className="w-4 h-4" />
                            </button>
                        </div>

                        <div className="flex flex-row items-center min-w-0 gap-1">
                            <ModelSelector
                                models={models}
                                selectedModel={selectedModel}
                                onSelect={setSelectedModel}
                            />

                            <button
                                onClick={handleSend}
                                disabled={!hasContent || isTyping}
                                className={`
                                    inline-flex items-center justify-center relative shrink-0 transition-colors h-8 w-8 rounded-md active:scale-95 !rounded-xl !h-8 !w-8
                                    ${hasContent
                                        ? 'bg-[#ffffff] text-black hover:bg-[#e0e0e0] shadow-md'
                                        : 'bg-[#333333] text-[#666666] cursor-default'}
                                `}
                            >
                                <Icons.ArrowUp className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                    // File handling stub
                }}
            />

            <div className="text-center mt-3">
                <p className="text-[11px] text-[#8A8A88] opacity-60">
                    Founder-GPT can make mistakes. Plan accordingly.
                </p>
            </div>
        </div>
    );
};
