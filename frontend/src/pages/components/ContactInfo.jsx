import { getConversationName, getConversationAvatar, getConversationAbout, getOtherParticipant } from '../../utils/chatHelpers';
import StatusIndicator from '../../components/StatusIndicator';

function ContactInfo({ selectedConversation, user, onClose, isUserOnline }) {
  if (!selectedConversation) return null;

  return (
    <div className="contact-info">
      <div className="contact-header">
        <h3>Contact info</h3>
        <div className="close-info" onClick={onClose}>
          <svg width="16" height="16" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.00001 1.00518L11.0114 11.9948" stroke="#BEBEBE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="bevel"/>
            <path d="M11.0057 1.00001L1.00566 12" stroke="#BEBEBE" strokeWidth="2" strokeLinecap="round" strokeLinejoin="bevel"/>
          </svg>
        </div>
      </div>
      
      <div className="contact-profile">
        <div className="contact-avatar">
          <img src={getConversationAvatar(selectedConversation, user?._id)} alt={getConversationName(selectedConversation, user?._id)} />
        </div>
        <h2>{getConversationName(selectedConversation, user?._id)}</h2>
        {selectedConversation.type !== 'group' && (() => {
          const otherUser = getOtherParticipant(selectedConversation, user?._id);
          const online = otherUser && isUserOnline && isUserOnline(otherUser._id);
          return (
            <span className="online-status">
              <StatusIndicator isOnline={online} showText={true} size="medium" />
            </span>
          );
        })()}
      </div>

      <div className="contact-actions">
        <div className="action-btn">
          <svg width="28" height="28" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.4011 4.6875C14.9241 4.6875 16.6856 6.42608 16.6856 8.91762V16.0824C16.6856 18.5739 14.9241 20.3125 12.4011 20.3125H4.70109C2.17814 20.3125 0.416668 18.5739 0.416668 16.0824V8.91762C0.416668 6.42608 2.17814 4.6875 4.70109 4.6875H12.4011ZM20.7896 7.16561C21.2469 6.93295 21.7833 6.95728 22.2198 7.23223C22.6562 7.50613 22.9167 7.98202 22.9167 8.50233V16.4983C22.9167 17.0197 22.6562 17.4945 22.2198 17.7684C21.9812 17.9175 21.7146 17.9937 21.4458 17.9937C21.2219 17.9937 20.9979 17.9408 20.7885 17.834L19.2458 17.0556C18.675 16.7659 18.3208 16.1842 18.3208 15.5381V9.46151C18.3208 8.8143 18.675 8.23266 19.2458 7.94501L20.7896 7.16561Z" fill="#BEBEBE"/>
          </svg>
        </div>
        <div className="action-btn">
          <svg width="28" height="28" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12.0122 12.9921C16.1675 17.1462 17.1102 12.3403 19.7559 14.9842C22.3065 17.5341 23.7725 18.045 20.5409 21.2758C20.1361 21.6011 17.5642 25.5149 8.52562 16.4788C-0.514042 7.44167 3.39748 4.86713 3.72288 4.46245C6.96236 1.22275 7.46444 2.69727 10.0151 5.24722C12.6608 7.89218 7.85693 8.83793 12.0122 12.9921Z" fill="#BEBEBE"/>
          </svg>
        </div>
      </div>

      <div className='contact-content'>
        <div className="contact-section">
          <h3>About</h3>
          <p>{getConversationAbout(selectedConversation, user?._id)}</p>
        </div>

        <div className="contact-section">
          <h3>Media,links and doc</h3>
          <div className="media-grid">
            <img src="https://picsum.photos/200/200?random=1" alt="Media 1" />
            <img src="https://picsum.photos/200/200?random=2" alt="Media 2" />
            <img src="https://picsum.photos/200/200?random=3" alt="Media 3" />
            <img src="https://picsum.photos/200/200?random=4" alt="Media 4" />
          </div>
        </div>

        <div className="contact-section">
          <div className="toggle-option">
            <h3>Mute notifications</h3>
            <label className="toggle">
              <input type="checkbox" />
              <span className="slider"></span>
            </label>
          </div>
        </div>

        <div className="contact-section">
          <div className="option">
            <h3>Disappearing messages</h3>
            <p className="option-value">Off</p>
          </div>
        </div>
      </div>

      <div className="danger-zone">
        <div className="danger-btn">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11 19.25C15.5563 19.25 19.25 15.5563 19.25 11C19.25 6.44365 15.5563 2.75 11 2.75C6.44365 2.75 2.75 6.44365 2.75 11C2.75 15.5563 6.44365 19.25 11 19.25Z" stroke="#CC3169" strokeWidth="2" strokeMiterlimit="10"/>
            <path d="M5.16486 5.16486L16.8352 16.8352" stroke="#CC3169" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Block {getConversationName(selectedConversation, user?._id)}
        </div>
        <div className="danger-btn">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.75002 4.125H6.87502V13.0625H2.75002C2.56768 13.0625 2.39281 12.9901 2.26388 12.8611C2.13495 12.7322 2.06252 12.5573 2.06252 12.375V4.8125C2.06252 4.63016 2.13495 4.4553 2.26388 4.32636C2.39281 4.19743 2.56768 4.125 2.75002 4.125V4.125Z" stroke="#CC3169" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6.87502 13.0625L10.3125 19.9375C11.0419 19.9375 11.7413 19.6478 12.2571 19.132C12.7728 18.6163 13.0625 17.9168 13.0625 17.1875V15.125H18.382C18.577 15.1255 18.7698 15.0842 18.9475 15.004C19.1252 14.9238 19.2837 14.8065 19.4123 14.66C19.541 14.5135 19.6367 14.3411 19.6932 14.1545C19.7497 13.9679 19.7656 13.7714 19.7399 13.5781L18.7086 5.32812C18.6669 4.99694 18.5061 4.69224 18.2563 4.47086C18.0064 4.24949 17.6846 4.12655 17.3508 4.125H6.87502" stroke="#CC3169" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Report {getConversationName(selectedConversation, user?._id)}
        </div>
        <div className="danger-btn">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.5625 4.8125H3.43752" stroke="#CC3169" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.93752 8.9375V14.4375" stroke="#CC3169" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13.0625 8.9375V14.4375" stroke="#CC3169" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17.1875 4.8125V17.875C17.1875 18.0573 17.1151 18.2322 16.9862 18.3611C16.8572 18.4901 16.6824 18.5625 16.5 18.5625H5.50002C5.31768 18.5625 5.14281 18.4901 5.01388 18.3611C4.88495 18.2322 4.81252 18.0573 4.81252 17.875V4.8125" stroke="#CC3169" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14.4375 4.8125V3.4375C14.4375 3.07283 14.2926 2.72309 14.0348 2.46523C13.7769 2.20737 13.4272 2.0625 13.0625 2.0625H8.9375C8.57283 2.0625 8.22309 2.20737 7.96523 2.46523C7.70737 2.72309 7.5625 3.07283 7.5625 3.4375V4.8125" stroke="#CC3169" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Delete chat
        </div>
      </div>
    </div>
  );
}

export default ContactInfo;
