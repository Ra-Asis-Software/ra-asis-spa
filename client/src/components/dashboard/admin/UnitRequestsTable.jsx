import { useState } from "react";
import styles from "./UnitRequestsTable.module.css";
import tableStyles from "./UsersTable.module.css";
import Modal from "../../ui/Modal";
import {
  approveUnitRequest,
  rejectUnitRequest,
} from "../../../services/unitService";

const UnitRequestsTable = ({ requests, onRequestProcessed, loading }) => {
  const [resultMessage, setResultMessage] = useState("");
  const [showResultModal, setShowResultModal] = useState(false);
  const [loadingStates, setLoadingStates] = useState({});

  // Filter requests to show only pending ones
  const pendingRequests = requests.filter(
    (request) => request.status === "pending"
  );

  const handleApproveRequest = async (requestId) => {
    setLoadingStates((prev) => ({ ...prev, [requestId]: "approving" }));

    try {
      await approveUnitRequest(requestId);
      setResultMessage("Unit request approved successfully!");
      setShowResultModal(true);
      onRequestProcessed();
    } catch (err) {
      setResultMessage(err.message || "Failed to approve request");
      setShowResultModal(true);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [requestId]: null }));
    }
  };

  const handleRejectRequest = async (requestId) => {
    setLoadingStates((prev) => ({ ...prev, [requestId]: "rejecting" }));

    try {
      await rejectUnitRequest(requestId);
      setResultMessage("Unit request rejected successfully!");
      setShowResultModal(true);
      onRequestProcessed();
    } catch (err) {
      setResultMessage(err.message || "Failed to reject request");
      setShowResultModal(true);
    } finally {
      setLoadingStates((prev) => ({ ...prev, [requestId]: null }));
    }
  };

  const closeResultModal = () => {
    setShowResultModal(false);
    setResultMessage("");
  };

  if (pendingRequests.length === 0) {
    return (
      <div className={styles.noRequests}>
        <p>No pending unit assignment requests</p>
      </div>
    );
  }

  return (
    <div
      className={`${styles.requestsTableContainer} ${tableStyles.tableContainer}`}
    >
      {loading ? (
        <div className={tableStyles.loadingContainer}>
          <video
            src="/assets/spin_loader.mp4"
            autoPlay
            muted
            loop
            className={tableStyles.containerLoader}
          />
          <span>Loading requests...</span>
        </div>
      ) : (
        <>
          <table
            className={`${styles.requestsTable} ${tableStyles.usersTable}`}
          >
            <thead>
              <tr>
                <th>Teacher</th>
                <th>Email</th>
                <th className={tableStyles.noWrap}>Unit Code</th>
                <th>Unit Name</th>
                <th className={tableStyles.noWrap}>Request Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pendingRequests.map((request) => (
                <tr key={request._id}>
                  <td className={`${tableStyles.name} ${tableStyles.noWrap}`}>
                    {request.teacher?.firstName} {request.teacher?.lastName}
                  </td>
                  <td>
                    <a
                      href={`mailto:${request.teacher?.email}`}
                      className={tableStyles.emailLink}
                    >
                      {request.teacher?.email}
                    </a>
                  </td>
                  <td>{request.unit?.unitCode}</td>
                  <td>{request.unit?.unitName}</td>
                  <td>{new Date(request.createdAt).toLocaleDateString()}</td>
                  <td>
                    <div
                      className={`${tableStyles.actionsCell} ${styles.actionsCell}`}
                    >
                      <button
                        onClick={() => handleApproveRequest(request._id)}
                        className={styles.approveButton}
                        disabled={loadingStates[request._id]}
                      >
                        {loadingStates[request._id] === "approving" ? (
                          <video
                            src="/assets/spin_loader.mp4"
                            autoPlay
                            muted
                            loop
                            className={tableStyles.buttonLoader}
                          />
                        ) : (
                          "Approve"
                        )}
                      </button>
                      <button
                        onClick={() => handleRejectRequest(request._id)}
                        className={styles.rejectButton}
                        disabled={loadingStates[request._id]}
                      >
                        {loadingStates[request._id] === "rejecting" ? (
                          <video
                            src="/assets/spin_loader.mp4"
                            autoPlay
                            muted
                            loop
                            className={tableStyles.buttonLoader}
                          />
                        ) : (
                          "Reject"
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Result Modal */}
          <Modal isOpen={showResultModal} onClose={closeResultModal}>
            <div className={tableStyles.resultModal}>
              <h3>
                <i className="fa-solid fa-circle-check" />
                Operation Completed
              </h3>
              <p>{resultMessage}</p>
              <div className={tableStyles.resultModalActions}>
                <button
                  onClick={closeResultModal}
                  className={tableStyles.modalCloseBtn}
                >
                  Close
                </button>
              </div>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default UnitRequestsTable;
