import React, { useContext, useState } from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context';

const Sidebar = () => {
    const [extended, setExtended] = useState(false);
    const { prevChats, setCurrentChat, newChat, currentChatId, deleteChat } = useContext(Context);

    const loadChat = (chatId) => {
        setCurrentChat(chatId);
    }

    const toggleSidebar = () => {
        setExtended(!extended);
    }

    const handleDeleteChat = (e, chatId) => {
        e.stopPropagation();  // Prevent the click from bubbling up to the parent div
        deleteChat(chatId);
    }

    return (
        <div className={`sidebar ${extended ? 'extended' : ''}`}>
            <div className="top">
                <img 
                    src={assets.menu_icon} 
                    alt="" 
                    className="menu" 
                    style={{marginTop:"20px"}}
                    onClick={toggleSidebar}
                />
                <div onClick={()=>newChat()} className="new-chat">
                    <img src={assets.plus_icon} alt="" />
                    {extended ? <p>New Chat</p> : null}
                </div>
                {extended
                    ? <div className="recent">
                        <p className='recent-title'>Previous Chats</p>
                        {prevChats.map((chat, index) => (
                            <div 
                                key={index} 
                                onClick={() => loadChat(chat.id)} 
                                className={`recent-entry ${chat.id === currentChatId ? 'active' : ''}`}
                            >
                                <img src={assets.message_icon} alt="" />
                                <p>{chat.title.slice(0,18)} {"..."}</p>
                                <button 
                                    className="delete-chat-btn"
                                    onClick={(e) => handleDeleteChat(e, chat.id)}
                                >
                                    X
                                </button>
                            </div>
                        ))}
                    </div>
                    : null}
            </div>
            <div className="bottom">
                <div className="bottom-item recent-entry">
                    <img src={assets.question_icon} alt="" />
                    {extended ? <p>Help</p> : null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.history_icon} alt="" />
                    {extended ? <p>Activity</p> : null}
                </div>
                <div className="bottom-item recent-entry">
                    <img src={assets.setting_icon} alt="" />
                    {extended ? <p>Settings</p> : null}
                </div>
            </div>
        </div>
    )
}

export default Sidebar
