import React, { useContext, useRef, useEffect, useState } from 'react'
import './Main.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Context'
import { toast } from 'react-toastify';
import api from '../../api/axiosConfig';

const Main = () => {
  const {
    onSent,
    showResult,
    loading,
    setInput,
    input,
    chatHistory
  } = useContext(Context);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      onSent();
    }
  }
  const [showDropdown, setShowDropdown] = useState(false);

  const handleIconClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleCardClick = (text) => {
    setInput(text);
    onSent(text); // Pass the text directly to onSent
  };

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    preferredDate: '',
    location: '',
    description: ''
  });

  const handleBookDoctor = () => {
    setShowForm(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      // Make API call to submit form data
      await api.post('/send', formData);
      
      // Show success toast
      toast.success('Appointment request sent successfully!', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });

      // Reset form and close it
      setShowForm(false);
      setFormData({ name: '', email: '', phone: '', preferredDate: '', location: '', description: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      
      // Show error toast
      toast.error('Failed to send appointment request. Please try again.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const formatResponse = (text) => {
    const boldPattern = /\*\*(.*?)\*\*/g;
    return text.replace(boldPattern, '<strong>$1</strong>').replace(/\n/g, '<br>');
  };

  return (
    <div className='main'>
      <video autoPlay loop muted className="background-video">
        <source src={assets.bg_2} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="background-overlay"></div>
      <div className="content-wrapper">
        <div className="nav">
          <p>HEAL-O</p>
          <img className='user-icon' src={assets.user_icon} alt="" onClick={handleIconClick} />
          {showDropdown && (
            <div className="dropdown-menu">
              <p>Edit Profile</p>
              <p>Sign Out</p>
            </div>
          )}
        </div>
        <div className="main-container">
          {showResult ? (
            <div className="chat-container" ref={chatContainerRef}>
              {chatHistory.map((entry, index) => (
                <div key={index} className="chat-entry">
                  <div className='user-message'>
                    <img src={assets.user_icon} alt="" />
                    <p>{entry.prompt}</p>
                  </div>
                  <div className="bot-response">
                    <img src={assets.doc_logo} alt="" />
                    <div className="bot-content">
                      <p dangerouslySetInnerHTML={{ __html: formatResponse(entry.response) }}></p>
                      {entry.images && entry.images.length > 0 && (
                        <div className="image-gallery">
                          {entry.images.map((imageUrl, imgIndex) => (
                            <div key={imgIndex} className="image-container">
                              <img src={imageUrl} alt={`Response image ${imgIndex + 1}`} />
                              <p className="image-caption">
                                {entry.name && entry.name[imgIndex] ? entry.name[imgIndex] : `Image ${imgIndex + 1}`}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                      {entry.showVirtualTour && (
                        <div className="virtual-tour-card">
                          <p>Visit this URL for virtual tour:</p>
                          <a href={entry.virtualTourUrl} target="_blank" rel="noopener noreferrer">{entry.virtualTourUrl}</a>
                        </div>
                      )}
                      {entry.showBookDoctor && (
                        <button className="book-doctor-btn" onClick={handleBookDoctor}>Book a doctor</button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="loader">
                  <hr className="animated-bg" />
                  <hr className="animated-bg" />
                  <hr className="animated-bg" />
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="greet">
                <p><span>Hello, Health Seekers.</span></p>
                <p>Health insights, just a message away!</p>
              </div>
              <div className="cards" >
                {[
                  "What are the common symptoms of diabetes?",
                  "Can you suggest some home remedies for headaches?",
                  "What should I do if I experience persistent cough?",
                  "When should I see a doctor about my symptoms of fatigue?"
                ].map((text, index) => (
                  <div key={index} className="card" onClick={() => handleCardClick(text)}>
                    <p>{text}</p>
                    <img src={assets.message_icon} alt="" />
                  </div>
                ))}
              </div>
            </>
          )}

          <div className="main-bottom">
            <form onSubmit={handleSubmit} className="search-box">
              <input 
                onChange={(e) => setInput(e.target.value)} 
                value={input} 
                type="text" 
                placeholder='Enter your query'
              />
              <div>
                <img src={assets.gallery_icon} width={30} alt="" />
                <img src={assets.mic_icon} width={30} alt="" />
                {input && <button type="submit"><img src={assets.send_icon} width={30} alt="" /></button>}
              </div>
            </form>
            <p className="bottom-info">
            Your personal health assistant, always ready to help you stay informed and healthy.
            </p>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="form-overlay">
          <div className="form-container">
            <h2>Book a Doctor</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="preferredDate">Preferred Date of Appointment</label>
                <input
                  type="date"
                  id="preferredDate"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="location">Preferred Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleFormChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleFormChange}
                  rows="4"
                  placeholder="Please describe your symptoms or reason for the appointment"
                ></textarea>
              </div>
              <div className="form-buttons">
                <button type="submit" onClick={handleFormSubmit}>Submit</button>
                <button type="button" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Main
