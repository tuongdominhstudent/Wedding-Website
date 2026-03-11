import CanvasStage from '../three/CanvasStage';
import styles from './StoryLayout.module.css';

function StoryLayout({ children }) {
  return (
    <div className={styles.layout}>
      <div className={styles.canvasLayer} aria-hidden="true">
        <CanvasStage />
      </div>
      <main id="story-layout" className={styles.storyLayer}>
        {children}
      </main>
    </div>
  );
}

export default StoryLayout;
