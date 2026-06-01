export default function FloatingZaloCTA() {
  const message = 'Chào Bia Thầy Tu, mình cần tư vấn đặt hàng bia Đức';
  const zaloUrl = `https://zalo.me/0899191313?text=${encodeURIComponent(message)}`;

  return (
    <div className="floating-contact-stack" aria-label="Liên hệ nhanh">
      <a
        href={zaloUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-contact-button floating-zalo-cta"
        aria-label="Chat Zalo với Bia Thầy Tu"
        title="Chat Zalo"
      >
        <span className="floating-zalo-logo" aria-hidden="true">Zalo</span>
      </a>

      <a
        href="tel:0899191313"
        className="floating-contact-button floating-phone-cta"
        aria-label="Gọi Bia Thầy Tu"
        title="Gọi 0899.191.313"
      >
        <svg
          className="floating-phone-icon"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M6.62 10.79c1.44 2.83 3.76 5.15 6.59 6.59l2.2-2.2c.31-.31.76-.42 1.17-.28 1.29.43 2.66.66 4.07.66.63 0 1.14.51 1.14 1.14v3.5c0 .63-.51 1.14-1.14 1.14C10.79 21.34 2.66 13.21 2.66 3.35c0-.63.51-1.14 1.14-1.14h3.5c.63 0 1.14.51 1.14 1.14 0 1.41.23 2.78.66 4.07.13.41.03.86-.28 1.17l-2.2 2.2Z"
            fill="currentColor"
          />
        </svg>
      </a>
    </div>
  );
}
