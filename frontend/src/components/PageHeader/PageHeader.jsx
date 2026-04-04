import "./PageHeader.css";

const PageHeader = ({ title, subtitle, buttonText, onClick }) => {
  return (
    <div className="page-header">

      <div>
        <h2>{title}</h2>
        <p>{subtitle}</p>
      </div>

      {buttonText && (
        <button className="header-btn" onClick={onClick}>
          + {buttonText}
        </button>
      )}

    </div>
  );
};

export default PageHeader;
