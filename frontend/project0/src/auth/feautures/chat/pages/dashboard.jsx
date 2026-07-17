import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LogOut, Menu, MessageSquarePlus, Search, Send, Trash2, X } from "lucide-react";
import { useChat } from "../../hook/use.chat";
import { useAuth } from "../../hook/use.auth";

const suggestions = [
    { label: "Explore an idea", prompt: "Help me explore an interesting idea and challenge my assumptions." },
    { label: "Build a plan", prompt: "Turn my goal into a practical step-by-step plan." },
    { label: "Explain a topic", prompt: "Explain a complex topic clearly with a useful example." },
    { label: "Compare options", prompt: "Help me compare my options and make a well-reasoned decision." },
];

const markdownComponents = {
    h1: ({ children }) => <h1 className="mb-3 text-xl font-semibold text-white">{children}</h1>,
    h2: ({ children }) => <h2 className="mb-2 mt-5 text-lg font-semibold text-white">{children}</h2>,
    h3: ({ children }) => <h3 className="mb-2 mt-4 font-semibold text-white">{children}</h3>,
    p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
    ul: ({ children }) => <ul className="mb-3 list-disc space-y-1 pl-5 last:mb-0">{children}</ul>,
    ol: ({ children }) => <ol className="mb-3 list-decimal space-y-1 pl-5 last:mb-0">{children}</ol>,
    blockquote: ({ children }) => <blockquote className="my-4 border-l-2 border-cyan-400 pl-4 text-zinc-400">{children}</blockquote>,
    a: ({ children, ...props }) => <a className="text-cyan-300 underline decoration-cyan-700 underline-offset-4" target="_blank" rel="noreferrer" {...props}>{children}</a>,
    table: ({ children }) => <div className="my-4 overflow-x-auto rounded-md border border-white/10"><table className="w-full border-collapse text-sm">{children}</table></div>,
    th: ({ children }) => <th className="border-b border-white/10 bg-white/5 px-3 py-2 text-left font-medium text-white">{children}</th>,
    td: ({ children }) => <td className="border-b border-white/5 px-3 py-2">{children}</td>,
    code: ({ children, className, ...props }) => className ? (
        <code className={`${className} block overflow-x-auto rounded-md bg-[#090b0e] p-4 font-mono text-sm text-zinc-200`} {...props}>{children}</code>
    ) : (
        <code className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-sm text-cyan-100" {...props}>{children}</code>
    ),
};

const Dashboard = () => {
    const user = useSelector((state) => state.auth.user);
    const { chats, currentChatId, isLoading, error } = useSelector((state) => state.chat);
    const [message, setMessage] = useState("");
    const [search, setSearch] = useState("");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const loadedChatsRef = useRef(false);
    const navigate = useNavigate();
    const chat = useChat();
    const { handleLogout: logout } = useAuth();

    const chatList = useMemo(() => Object.values(chats)
        .filter((item) => (item.title || "Untitled chat").toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0)), [chats, search]);
    const currentChat = currentChatId ? chats[currentChatId] : null;
    const messages = currentChat?.messages || [];
    const displayName = user?.username || user?.name || user?.email?.split("@")[0] || "Explorer";
    const initial = displayName.charAt(0).toUpperCase();

    useEffect(() => {
        const socket = chat.connectSocket();
        return () => socket.disconnect();
    }, [chat]);

    useEffect(() => {
        if (loadedChatsRef.current) return;
        loadedChatsRef.current = true;
        chat.handleGetChats().then((response) => {
            const firstChat = response.data[0];
            return firstChat ? chat.handleOpenChat(firstChat._id) : null;
        }).catch(() => {});
    }, [chat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    const handleLogout = async () => {
        await logout();
        navigate("/login", { replace: true });
    };

    const submitMessage = async (text = message) => {
        const trimmedMessage = text.trim();
        if (!trimmedMessage || isLoading) return;
        try {
            await chat.handleSendMessage({ message: trimmedMessage, chatId: currentChatId });
            setMessage("");
        } catch {
            // Redux displays the API error.
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        submitMessage();
    };

    const handleKeyDown = (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            submitMessage();
        }
    };

    const handleDelete = async (event, chatId) => {
        event.stopPropagation();
        if (!window.confirm("Delete this chat permanently?")) return;
        try {
            await chat.handleDeleteChat(chatId);
        } catch {
            // Redux displays the API error.
        }
    };

    const startNewChat = () => {
        chat.handleNewChat();
        setSidebarOpen(false);
    };

    const openChat = (chatId) => {
        chat.handleOpenChat(chatId).catch(() => {});
        setSidebarOpen(false);
    };

    return (
        <div className="flex h-[100dvh] overflow-hidden bg-[#0b0d10] text-zinc-100">
            {sidebarOpen && <button type="button" aria-label="Close navigation" className="fixed inset-0 z-30 bg-black/70 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            <aside className={`fixed inset-y-0 left-0 z-40 flex w-[290px] flex-col border-r border-white/10 bg-[#111318] transition-transform duration-200 lg:static lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
                <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
                    <div className="flex items-center gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-md bg-cyan-300 font-black text-[#071014]">P</div>
                        <div>
                            <p className="font-semibold leading-tight">Perplexity</p>
                            <p className="text-[11px] uppercase tracking-widest text-zinc-500">Research space</p>
                        </div>
                    </div>
                    <button type="button" className="grid h-9 w-9 place-items-center rounded-md text-zinc-400 hover:bg-white/5 hover:text-white lg:hidden" onClick={() => setSidebarOpen(false)} title="Close navigation"><X size={18} /></button>
                </div>

                <div className="space-y-3 p-3">
                    <button type="button" onClick={startNewChat} className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-cyan-300 px-4 font-semibold text-[#071014] transition hover:bg-cyan-200">
                        <MessageSquarePlus size={17} /> New thread
                    </button>
                    <label className="flex h-10 items-center gap-2 rounded-md border border-white/10 bg-black/20 px-3 focus-within:border-cyan-400/60">
                        <Search size={16} className="text-zinc-500" />
                        <input value={search} onChange={(event) => setSearch(event.target.value)} className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-600" placeholder="Search threads" />
                    </label>
                </div>

                <div className="flex-1 overflow-y-auto px-3 pb-3">
                    <p className="px-2 py-2 text-[11px] font-semibold uppercase tracking-widest text-zinc-600">Recent</p>
                    {chatList.length === 0 && !isLoading && <p className="px-2 py-5 text-sm text-zinc-500">{search ? "No matching threads" : "Your conversations will appear here."}</p>}
                    <div className="space-y-1">
                        {chatList.map((item) => (
                            <div key={item._id} className={`group flex items-center rounded-md border transition ${currentChatId === item._id ? "border-white/10 bg-white/10" : "border-transparent hover:bg-white/5"}`}>
                                <button type="button" onClick={() => openChat(item._id)} className="min-w-0 flex-1 px-3 py-2.5 text-left">
                                    <p className="truncate text-sm text-zinc-200">{item.title || "Untitled chat"}</p>
                                    <p className="mt-1 text-xs text-zinc-600">Thread</p>
                                </button>
                                <button type="button" onClick={(event) => handleDelete(event, item._id)} className="mr-2 grid h-8 w-8 shrink-0 place-items-center rounded text-zinc-500 opacity-0 hover:bg-red-500/15 hover:text-red-300 focus:opacity-100 group-hover:opacity-100" aria-label={`Delete ${item.title || "chat"}`} title="Delete thread"><Trash2 size={15} /></button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="border-t border-white/10 p-3">
                    <div className="flex items-center gap-3 rounded-md p-2">
                        <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-lime-300 font-semibold text-lime-950">{initial}</div>
                        <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-medium">{displayName}</p>
                            <p className="text-xs text-zinc-500">Personal workspace</p>
                        </div>
                        <button type="button" onClick={handleLogout} className="grid h-9 w-9 place-items-center rounded-md text-zinc-500 hover:bg-white/5 hover:text-white" title="Log out" aria-label="Log out"><LogOut size={17} /></button>
                    </div>
                </div>
            </aside>

            <main className="flex min-w-0 flex-1 flex-col">
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-white/10 px-4 sm:px-6">
                    <div className="flex min-w-0 items-center gap-3">
                        <button type="button" onClick={() => setSidebarOpen(true)} className="grid h-9 w-9 shrink-0 place-items-center rounded-md border border-white/10 text-zinc-300 lg:hidden" title="Open navigation" aria-label="Open navigation"><Menu size={18} /></button>
                        <div className="min-w-0">
                            <h1 className="truncate text-sm font-medium sm:text-base">{currentChat?.title || "New conversation"}</h1>
                            <p className="flex items-center gap-1.5 text-xs text-zinc-500"><span className="h-1.5 w-1.5 rounded-full bg-lime-300" /> AI online</p>
                        </div>
                    </div>
                    <div className="hidden items-center gap-2 text-xs text-zinc-500 sm:flex"><span className="rounded border border-white/10 px-2 py-1">Enter to send</span><span>Shift + Enter for line break</span></div>
                </header>

                {error && <div role="alert" className="mx-4 mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200 sm:mx-6">{error}</div>}

                <section className="flex-1 overflow-y-auto">
                    {messages.length === 0 && !isLoading ? (
                        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center px-5 py-12">
                            <div className="mb-8">
                                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">Ask with depth</p>
                                <h2 className="max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-5xl">What are we figuring out today, {displayName}?</h2>
                                <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-500 sm:text-base">Start with a question, a half-formed thought, or something you want to understand better.</p>
                            </div>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {suggestions.map((item, index) => (
                                    <button key={item.label} type="button" onClick={() => submitMessage(item.prompt)} className="group flex min-h-20 items-center justify-between rounded-md border border-white/10 bg-white/[0.025] px-4 py-3 text-left transition hover:border-cyan-300/40 hover:bg-cyan-300/5">
                                        <span><span className="block text-sm font-medium text-zinc-200">{item.label}</span><span className="mt-1 block text-xs text-zinc-600">Use a guided starting point</span></span>
                                        <span className="text-zinc-700 transition group-hover:translate-x-0.5 group-hover:text-cyan-300">0{index + 1}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
                            {messages.map((chatMessage, index) => {
                                const isUser = (chatMessage.sender || chatMessage.role) === "user";
                                const content = chatMessage.text || chatMessage.content || "";
                                return (
                                    <article key={chatMessage._id || index} className={`mb-8 flex gap-3 sm:gap-4 ${isUser ? "flex-row-reverse" : ""}`}>
                                        <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-md text-xs font-bold ${isUser ? "bg-lime-300 text-lime-950" : "bg-cyan-300 text-cyan-950"}`}>{isUser ? initial : "P"}</div>
                                        <div className={`min-w-0 max-w-[calc(100%-3rem)] ${isUser ? "rounded-md bg-white/10 px-4 py-3 text-zinc-100" : "flex-1 pt-1 text-zinc-300"}`}>
                                            {isUser ? content : <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{content}</ReactMarkdown>}
                                        </div>
                                    </article>
                                );
                            })}
                            {isLoading && <div className="flex items-center gap-4 text-sm text-zinc-500"><div className="grid h-8 w-8 place-items-center rounded-md bg-cyan-300 font-bold text-cyan-950">P</div><span className="flex gap-1"><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300" /><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 [animation-delay:150ms]" /><i className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-300 [animation-delay:300ms]" /></span></div>}
                            <div ref={messagesEndRef} />
                        </div>
                    )}
                </section>

                <div className="shrink-0 border-t border-white/10 bg-[#0b0d10] px-4 py-3 sm:px-6 sm:py-4">
                    <form onSubmit={handleSubmit} className="mx-auto max-w-3xl rounded-md border border-white/15 bg-[#15181d] p-2 shadow-2xl shadow-black/30 focus-within:border-cyan-300/50">
                        <textarea value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={handleKeyDown} rows={1} maxLength={4000} placeholder="Ask anything..." disabled={isLoading} className="max-h-36 min-h-12 w-full resize-none bg-transparent px-3 py-3 text-sm leading-6 text-white outline-none placeholder:text-zinc-600 disabled:opacity-60" />
                        <div className="flex h-9 items-center justify-between px-2">
                            <span className="text-xs text-zinc-600">{message.length > 0 ? `${message.length} / 4000` : "Perplexity AI"}</span>
                            <button type="submit" disabled={!message.trim() || isLoading} className="grid h-9 w-9 place-items-center rounded-md bg-cyan-300 font-bold text-cyan-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-500" title="Send message" aria-label="Send message"><Send size={17} /></button>
                        </div>
                    </form>
                    <p className="mx-auto mt-2 max-w-3xl text-center text-[11px] text-zinc-700">AI can make mistakes. Check important information.</p>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
