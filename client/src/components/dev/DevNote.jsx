import styles from './DevNote.module.css';

function DevNote({ bootPhase, bootProgress }) {
  return (
    <aside className={styles.devNote} aria-live="polite">
      <p className={styles.line}>Scaffold mode</p>
      <p className={styles.line}>Boot: {bootPhase}</p>
      <p className={styles.line}>Progress: {Math.round(bootProgress * 100)}%</p>
    </aside>
  );
}

export default DevNote;
