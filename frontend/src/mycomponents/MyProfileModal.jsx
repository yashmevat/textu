import React from 'react';

const MyProfileModal = ({ user }) => {
  return (
    <div>
      <div
        className="modal fade"
        id="mypmodal"
        tabIndex="-1"
        aria-labelledby="profileModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">

            {/* Header */}
            <div className="modal-header bg-dark text-white rounded-top-4">
              <h5 className="modal-title" id="profileModalLabel">
                {user?.name}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            {/* Body */}
            <div className="modal-body text-center">
              <img
                src={user?.pic}
                className="rounded-circle border border-3 border-secondary shadow-sm mb-3"
                alt="Profile"
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
              />
              <h6 className="text-muted">{user?.email}</h6>
            </div>

            {/* Footer */}
            <div className="modal-footer justify-content-center bg-light rounded-bottom-4">
              <button
                type="button"
                className="btn btn-outline-secondary px-4"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfileModal;
