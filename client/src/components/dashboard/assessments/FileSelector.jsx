import styles from "../css/Assessments.module.css";

export const FileSelector = ({ selector }) => {
  return (
    <div>
      {/* Add an input for taking in files */}
      <input
        type="file"
        multiple
        className={styles.fileHidden}
        ref={selector.inputRef}
        onChange={selector.onChange}
      />

      {/* display selected files */}
      <div
        className={`${styles.selectedFiles} ${
          selector.files.length < 1 && styles.filesEmpty
        }`}
      >
        {selector.files.length > 0 && <p>Selected Files: </p>}
        {selector.files.map((file, index) => {
          return (
            <p className={styles.chosenFile} key={index}>
              {file.name}
            </p>
          );
        })}
      </div>
    </div>
  );
};
