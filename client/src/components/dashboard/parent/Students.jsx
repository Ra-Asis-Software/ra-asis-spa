import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Students.module.css";
import extraStyles from "../css/Units.module.css";
import {
  getParentDetails,
  linkStudentToParent,
  searchStudentByEmail,
} from "../../../services/userService";

const Students = ({ user }) => {
  const [allStudents, setAllStudents] = useState([]);
  const [linkedStudents, setLinkedStudents] = useState([]);
  const [searchParam, setSearchParam] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch parent's linked students on component mount
  useEffect(() => {
    const fetchLinkedStudents = async () => {
      try {
        const result = await getParentDetails(user.id);
        if (result.error) {
          setError(result.error.message);
        } else {
          setLinkedStudents(result.data?.children || []);
        }
      } catch (err) {
        setError("Failed to fetch your students");
        console.error(err);
      }
    };

    fetchLinkedStudents();
  }, [user.id]);

  // Fetch students when search term changes (email only)
  useEffect(() => {
    const fetchStudentsByEmail = async () => {
      if (!searchParam.includes("@")) return; // Only search when email is being entered

      setIsLoading(true);
      setError(null);
      try {
        const result = await searchStudentByEmail(searchParam);
        if (result.error) {
          setError(result.error.message || "Search failed");
        } else {
          setAllStudents([
            {
              _id: result.data.profile._id,
              firstName: result.data.profile.firstName,
              lastName: result.data.profile.lastName,
              email: result.data.profile.email,
            },
          ]);
        }
      } catch (err) {
        setError("Failed to fetch students");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      if (searchParam.length > 0) {
        fetchStudentsByEmail();
      } else {
        setAllStudents([]);
      }
    }, 10);

    return () => clearTimeout(debounceTimer);
  }, [searchParam]);

  // Handle linking a student to the parent
  const handleLinkStudent = async (studentId) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await linkStudentToParent(user.id, studentId);
      if (result.error) {
        setError(result.error.message || "Failed to link student");
      } else {
        // Refresh the linked students list
        const updatedParent = await getParentDetails(user.id);
        setLinkedStudents(updatedParent.data?.children || []);
        setSearchParam("");
        setAllStudents([]);
      }
    } catch (err) {
      setError(err.message || "Failed to link student");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle selecting a student to view
  const handleStudentSelect = (studentId) => {
    navigate(`/dashboard?student=${studentId}`);
  };

  // Helper to render error messages safely
  const renderError = () => {
    if (!error) return null;

    const errorMessage =
      typeof error === "string" ? error : error.message || "An error occurred";

    return <p className={styles.errorMessage}>{errorMessage}</p>;
  };

  return (
    <div className={styles.studentsContainer}>
      <h3>Search Students</h3>
      <div className={extraStyles.searchBox}>
        <i className={`fa-solid fa-search ${extraStyles.faSearch}`}></i>
        <input
          type="text"
          placeholder="Search by student email"
          value={searchParam}
          onChange={(e) => setSearchParam(e.target.value)}
        />
        <i
          className={`fa-solid fa-xmark ${extraStyles.faCancel}`}
          onClick={() => {
            setSearchParam("");
            setAllStudents([]);
          }}
        ></i>
      </div>

      {/* Search Results (appears below search box) */}
      {searchParam && (
        <div className={styles.searchResults}>
          {isLoading ? (
            <p className={styles.loadingMessage}>Searching...</p>
          ) : allStudents.length > 0 ? (
            allStudents.map((student) => (
              <div
                key={student._id}
                className={styles.searchResultItem}
                onClick={() => handleLinkStudent(student._id)}
              >
                {`${student.firstName} ${student.lastName}`}
              </div>
            ))
          ) : (
            <p className={styles.noResultsMessage}>
              {searchParam.includes("@")
                ? "No student found with this email address"
                : "Please enter a valid email address"}
            </p>
          )}
        </div>
      )}

      {/* Parent's Linked Students Section */}
      <div className={styles.yourStudentsSection}>
        {linkedStudents.length > 0 ? (
          <div className={styles.studentsTable}>
            <div>
              <h4 className={styles.studentsTitle}>Your Students</h4>
              <p className={styles.studentsSubtitle}>
                Select a student to view their progress
              </p>
            </div>
            <div className={styles.tableHeader}>
              <span>Name</span>
              <span>Email</span>
            </div>
            {linkedStudents.map((student) => (
              <div
                key={student.id}
                className={styles.studentRow}
                onClick={() => handleStudentSelect(student.id)}
              >
                <span>{`${student.firstName} ${student.lastName}`}</span>
                <span>{student.email}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className={styles.noStudentsMessage}>
            You have no students at the moment
          </p>
        )}
      </div>
      {renderError()}
    </div>
  );
};

export default Students;
