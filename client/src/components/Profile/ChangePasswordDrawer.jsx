import "./ProfileDrawer.css";

const ChangePasswordDrawer = ({ onClose }) => {
  return (
    <>
      <div className="drawer-overlay" onClick={onClose} />

      <div className="drawer drawer-narrow">
        <div className="drawer-header">
          <h2>Change Password</h2>
          <span className="close-icon" onClick={onClose}>✕</span>
        </div>

        <div className="drawer-content">
          <input type="password" placeholder="Current password" />
          <input type="password" placeholder="New password" />
          <input type="password" placeholder="Confirm new password" />

          <button className="drawer-btn primary">
            Update Password
          </button>
        </div>
      </div>
    </>
  );
};

export default ChangePasswordDrawer;
