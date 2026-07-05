import React from 'react';

export default function GeoLocalCTA() {
  const hotlineDisplay = '0899 19 13 13';
  const hotlineTel = 'tel:0899191313';
  const zaloUrl = 'https://zalo.me/0899191313';
  
  // Official map embed URL for 659A Lạc Long Quân, Tây Hồ, Hà Nội
  const mapEmbedUrl = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.473977526786!2d105.8115797749219!3d21.05373808060017!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135aa32a55a6d59%3A0x6a2c262a4d339f4e!2zNjU5QSBM4bqhYyBMb25nIFF1w6JuLCBUw6J5IEjhu5MsIEjDoCBO4buZaSwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1720165440000!5m2!1svi!2s";

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .geo-cta-card {
          background-color: var(--web-navy);
          border: 1px solid var(--web-gold);
          border-radius: var(--web-radius-lg);
          padding: 32px;
          margin-top: 60px;
          box-shadow: var(--web-shadow-xl);
          color: #ffffff;
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 32px;
          align-items: center;
          position: relative;
          overflow: hidden;
        }
        .geo-cta-card::before {
          content: '';
          position: absolute;
          top: 0; right: 0;
          width: 250px; height: 250px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0) 70%);
          pointer-events: none;
        }
        .geo-cta-badge {
          font-size: 11px;
          letter-spacing: 2px;
          color: var(--web-gold);
          text-transform: uppercase;
          font-weight: 700;
          margin-bottom: 8px;
          display: inline-block;
        }
        .geo-cta-title {
          font-family: var(--font-serif);
          font-size: 26px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 12px;
          line-height: 1.3;
        }
        .geo-cta-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin-bottom: 20px;
        }
        .geo-cta-info {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }
        .geo-cta-info-item {
          display: flex;
          gap: 12px;
          align-items: flex-start;
        }
        .geo-cta-icon-wrapper {
          color: var(--web-gold);
          flex-shrink: 0;
          margin-top: 3px;
        }
        .geo-cta-info-text {
          font-size: 14px;
          line-height: 1.5;
          color: rgba(255, 255, 255, 0.9);
        }
        .geo-cta-info-text strong {
          color: var(--web-gold-light);
          font-weight: 600;
        }
        .geo-cta-actions {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
        }
        .geo-cta-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 22px;
          border-radius: var(--web-radius);
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          cursor: pointer;
        }
        .geo-cta-btn-primary {
          background: linear-gradient(90deg, var(--web-gold), var(--web-gold-light));
          color: var(--web-navy) !important;
          border: none;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.15);
        }
        .geo-cta-btn-primary:hover {
          background: linear-gradient(90deg, var(--web-gold-hover), var(--web-gold));
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.3);
        }
        .geo-cta-btn-outline {
          background: transparent;
          color: #ffffff !important;
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        .geo-cta-btn-outline:hover {
          border-color: var(--web-gold);
          color: var(--web-gold-light) !important;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255, 255, 255, 0.05);
        }
        .geo-cta-map-container {
          width: 100%;
          height: 100%;
          min-height: 250px;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(212, 175, 55, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          position: relative;
        }
        .geo-cta-iframe {
          border: 0;
          width: 100%;
          height: 100%;
          min-height: 250px;
          display: block;
        }
        @media (max-width: 768px) {
          .geo-cta-card {
            grid-template-columns: 1fr;
            padding: 24px;
            gap: 24px;
            margin-top: 40px;
          }
          .geo-cta-map-container {
            min-height: 200px;
          }
          .geo-cta-iframe {
            min-height: 200px;
          }
          .geo-cta-actions {
            flex-direction: column;
          }
          .geo-cta-btn {
            width: 100%;
          }
        }
      `}} />
      
      <div className="geo-cta-card">
        <div>
          <span className="geo-cta-badge">Trải nghiệm trực tiếp</span>
          <h3 className="geo-cta-title">Ghé Thăm Showroom Bia Thầy Tu</h3>
          <p className="geo-cta-desc">
            Trải nghiệm không gian trưng bày sang trọng và nhận tư vấn chuyên nghiệp về dòng bia Đức nhập khẩu thượng hạng.
          </p>
          
          <div className="geo-cta-info">
            <div className="geo-cta-info-item">
              <div className="geo-cta-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2ZM12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="geo-cta-info-text">
                <strong>Showroom Hà Nội:</strong> 659A Lạc Long Quân, Phường Xuân La, Quận Tây Hồ, Hà Nội.
              </div>
            </div>
            
            <div className="geo-cta-info-item">
              <div className="geo-cta-icon-wrapper">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z" fill="currentColor"/>
                </svg>
              </div>
              <div className="geo-cta-info-text">
                <strong>Hotline / Zalo:</strong> {hotlineDisplay} (8:00 - 22:00)
              </div>
            </div>
          </div>
          
          <div className="geo-cta-actions">
            <a href={hotlineTel} className="geo-cta-btn geo-cta-btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.01 15.38C18.78 15.38 17.59 15.18 16.48 14.82C16.13 14.7 15.74 14.79 15.47 15.06L13.9 17.03C11.07 15.68 8.42 13.13 7.01 10.2L8.96 8.54C9.23 8.26 9.31 7.87 9.2 7.52C8.83 6.41 8.64 5.22 8.64 3.99C8.64 3.45 8.19 3 7.65 3H4.19C3.65 3 3 3.24 3 3.99C3 13.28 10.73 21 20.01 21C20.72 21 21 20.37 21 19.82V16.37C21 15.83 20.55 15.38 20.01 15.38Z" fill="currentColor"/>
              </svg>
              Gọi Hotline Ngay
            </a>
            <a href={zaloUrl} target="_blank" rel="noopener noreferrer" className="geo-cta-btn geo-cta-btn-outline">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.03 2 11C2 13.06 2.84 14.96 4.23 16.51L3.08 19.86C3.02 20.04 3.07 20.24 3.2 20.37C3.33 20.5 3.53 20.54 3.71 20.48L7.33 19.31C8.75 19.76 10.33 20 12 20C17.52 20 22 15.97 22 11C22 6.03 17.52 2 12 2Z" fill="currentColor"/>
              </svg>
              Chat qua Zalo
            </a>
          </div>
        </div>
        
        <div className="geo-cta-map-container">
          <iframe 
            src={mapEmbedUrl}
            className="geo-cta-iframe"
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bia Thầy Tu Showroom Map"
          />
        </div>
      </div>
    </>
  );
}
