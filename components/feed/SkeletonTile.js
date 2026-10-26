import styles from "./Skeleton.module.css";

export default function SkeletonTile({ ratio }) {
  return <div aria-hidden="true" className={styles.tile} style={{ aspectRatio: ratio.replace(":", " / ") }} />;
}
