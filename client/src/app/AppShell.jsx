import StoryLayout from '../layouts/StoryLayout';
import StoryRoot from '../sections/StoryRoot';
import LoadingScreen from '../components/loading/LoadingScreen';
import { BOOT_PHASE } from '../stores/useAppStore';
import { useAppStore } from '../stores/useAppStore';
import styles from './AppShell.module.css';

function AppShell() {
  const bootPhase = useAppStore((state) => state.bootPhase);
  const bootProgress = useAppStore((state) => state.bootProgress);
  const isLoadingActive = bootPhase === BOOT_PHASE.IDLE || bootPhase === BOOT_PHASE.PRELOADING;
  const isBootReady = bootPhase === BOOT_PHASE.READY;

  return (
    <div className={styles.appShell} data-boot-phase={bootPhase}>
      <StoryLayout>
        <StoryRoot isBootReady={isBootReady} />
      </StoryLayout>
      <LoadingScreen isActive={isLoadingActive} />
      
    </div>
  );
}

export default AppShell;
