import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/userService';
import './Settings.css';

const Settings = ({ user, onLogout, onUserUpdate }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('edit-profile');
  const [formData, setFormData] = useState({
    username: '',
    phoneNumber: '',
    about: ''
  });
  const [profileImage, setProfileImage] = useState(user?.avatarUrl || null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      // Build update object with only changed fields
      const updates = {};
      
      if (formData.username && formData.username !== user?.username) {
        updates.username = formData.username;
      }
      
      if (formData.phoneNumber && formData.phoneNumber !== user?.phoneNumber) {
        updates.phoneNumber = formData.phoneNumber;
      }
      
      // Update about if it has been changed (including setting it to empty or updating to new text)
      if (formData.about !== '' && formData.about !== user?.about) {
        updates.about = formData.about;
      }

      // Include avatar if changed
      if (profileImage && profileImage !== user?.avatarUrl) {
        updates.avatarUrl = profileImage;
      }

      // Only make API call if there are changes
      if (Object.keys(updates).length === 0) {
        alert('No changes to save');
        return;
      }

      console.log('Sending updates:', updates);
      const response = await userService.updateProfile(updates);
      
      // Update user state in parent component
      if (onUserUpdate) {
        onUserUpdate(updates);
      }
      
      alert('Profile updated successfully!');
      
      // Reset form
      setFormData({
        username: '',
        phoneNumber: '',
        about: ''
      });
      
      // Optionally navigate back to chat
      // navigate('/chat');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleCancel = () => {
    // Reset form
    setFormData({
      username: '',
      phoneNumber: '',
      about: ''
    });
    navigate('/chat');
  };

  return (
    <div className="settings-container">
      <div className="settings-sidebar">
        <div className="settings-header" onClick={() => navigate('/chat')}>
          <button className="back-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h2>Settings</h2>
        </div>
        
        <nav className="settings-nav">
          <button 
            className={`nav-item ${activeTab === 'edit-profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('edit-profile')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Edit profile</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'notification' ? 'active' : ''}`}
            onClick={() => setActiveTab('notification')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Notification</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Account</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'chats' ? 'active' : ''}`}
            onClick={() => setActiveTab('chats')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Chats</span>
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'help' ? 'active' : ''}`}
            onClick={() => setActiveTab('help')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="12" y1="17" x2="12.01" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Help</span>
          </button>
        </nav>
      </div>

      <div className="settings-content">
        {activeTab === 'edit-profile' && (
          <div className="edit-profile">
            <h1>Edit profile</h1>
            
            <div className="profile-image-section">
              <div className="profile-image">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" />
                ) : user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="Profile" />
                ) : (
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.displayName || user?.username || 'User')}&background=random&size=150`} alt="Profile" />
                )}
              </div>
              <input 
                type="file" 
                id="profile-upload" 
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <label htmlFor="profile-upload" className="upload-button">
                Change Photo
              </label>
            </div>

            <form className="profile-form">
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder={user?.username || "Enter username"}
                />
              </div>

              <div className="form-group">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  placeholder={user?.phoneNumber || "097********"}
                />
              </div>

              <div className="form-group">
                <label htmlFor="about">About</label>
                <textarea
                  id="about"
                  name="about"
                  value={formData.about}
                  onChange={handleInputChange}
                  placeholder={user?.about || "Tell us about yourself..."}
                  rows="4"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-cancel" onClick={handleCancel}>
                  Cancel
                </button>
                <button type="button" className="btn-save" onClick={handleSave}>
                  Save
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'notification' && (
          <div className="tab-content">
            <h1>Notification</h1>
            <p>Notification settings will be displayed here.</p>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="tab-content">
            <h1>Account</h1>
            <p>Account settings will be displayed here.</p>
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="tab-content">
            <h1>Chats</h1>
            <p>Chat settings will be displayed here.</p>
          </div>
        )}

        {activeTab === 'help' && (
          <div className="tab-content">
            <h1>Help</h1>
            <p>Help and support information will be displayed here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
