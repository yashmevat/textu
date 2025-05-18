import React from 'react';

const ProfileModal = ({ user }) => {
    return (
        <div>
            <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header border-0">
                            <h5 className="modal-title" id="exampleModalLabel">
                                Profile
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body text-center">
                            <img
                                src={user?.pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"}
                                alt="Profile"
                                className="rounded-circle mb-3"
                                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                            />
                            <h4 className="mb-1">{user?.name}</h4>
                            <p className="text-muted">{user?.email}</p>
                        </div>
                        <div className="modal-footer border-0">
                            <button
                                type="button"
                                className="btn btn-outline-secondary w-100"
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

export default ProfileModal;
