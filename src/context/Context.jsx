import { createContext, useState, useEffect } from "react";
import api from "../api/axiosConfig";

export const Context = createContext();

const ContextProvider = (props) => {
    const [prevChats, setPrevChats] = useState(() => {
        const savedChats = localStorage.getItem('prevChats');
        return savedChats ? JSON.parse(savedChats) : [];
    });
    const [currentChatId, setCurrentChatId] = useState(() => {
        const savedCurrentChatId = localStorage.getItem('currentChatId');
        return savedCurrentChatId ? JSON.parse(savedCurrentChatId) : null;
    });
    const [chatHistory, setChatHistory] = useState(() => {
        const savedChatHistory = localStorage.getItem('chatHistory');
        return savedChatHistory ? JSON.parse(savedChatHistory) : [];
    });
    const [input, setInput] = useState("");
    const [showResult, setShowResult] = useState(() => {
        const savedShowResult = localStorage.getItem('showResult');
        return savedShowResult ? JSON.parse(savedShowResult) : false;
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        localStorage.setItem('prevChats', JSON.stringify(prevChats));
    }, [prevChats]);

    useEffect(() => {
        localStorage.setItem('currentChatId', JSON.stringify(currentChatId));
    }, [currentChatId]);

    useEffect(() => {
        localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
    }, [chatHistory]);

    useEffect(() => {
        localStorage.setItem('showResult', JSON.stringify(showResult));
    }, [showResult]);

    function delayPara(index, nextWord, currentResponse) {
        setTimeout(function () {
            setChatHistory(prev => {
                const updated = [...prev];
                updated[updated.length - 1].response += nextWord + " ";
                return updated;
            });
        }, 75 * index);
    }

    const onSent = async (prompt) => {
        setLoading(true)
        setShowResult(true)
        const newPrompt = prompt || input;
        
        let chatId = currentChatId;
        if (!chatId) {
            chatId = Date.now().toString();
            setCurrentChatId(chatId);
            setPrevChats(prev => [...prev, { id: chatId, title: newPrompt, history: [] }]);
        }
        
        const newEntry = { prompt: newPrompt, response: "", showVirtualTour: false, virtualTourUrl: "", images: [], showBookDoctor: false };
        setChatHistory(prev => [...prev, newEntry]);
        
        try {
            const response = await api.post('/create', { query: newPrompt });
            
            const { response: responseText, url, about, images, name, result } = response.data;
            
            const updatedEntry = {
                ...newEntry,
                response: responseText,
                showVirtualTour: about !== "general" && url ? true : false,
                virtualTourUrl: url || "",
                images: images || [],
                name: name || [],
                showBookDoctor: result !== null
            };
            
            setChatHistory(prev => [...prev.slice(0, -1), updatedEntry]);
            
            // Update prevChats with the new history
            setPrevChats(prev => prev.map(chat => 
                chat.id === chatId 
                    ? { ...chat, history: [...(chat.history || []), updatedEntry] }
                    : chat
            ));

        } catch (error) {
            console.error("Error fetching response:", error);
            setChatHistory(prev => {
                const updated = [...prev];
                updated[updated.length - 1].response = "An error occurred while fetching the response. Please try again.";
                return updated;
            });
        } finally {
            setLoading(false);
            setInput("")
        }
    }

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setChatHistory([]);
        setCurrentChatId(null);
    }

    const setCurrentChat = (chatId) => {
        setCurrentChatId(chatId);
        const chat = prevChats.find(chat => chat.id === chatId);
        if (chat) {
            setChatHistory(chat.history || []);
            setShowResult(true);
        }
    }

    const deleteChat = (chatId) => {
        setPrevChats(prev => prev.filter(chat => chat.id !== chatId));
        if (currentChatId === chatId) {
            setCurrentChatId(null);
            setChatHistory([]);
            setShowResult(false);
        }
    }

    const contextValue = {
        chatHistory,
        onSent,
        showResult,
        loading,
        input,
        setInput,
        newChat,
        prevChats,
        setCurrentChat,
        currentChatId,
        deleteChat
    }

    return (
        <Context.Provider value={contextValue}>
            {props.children}
        </Context.Provider>
    )
}

export default ContextProvider
