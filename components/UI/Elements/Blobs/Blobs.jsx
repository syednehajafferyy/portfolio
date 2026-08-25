import styles from './Blobs.module.css';

export default function Blobs({classVariable, type}) {
    const blobType = type ? type : 'v1';
    return (
        <div className={`${styles.blob} ${styles[blobType]} ${classVariable}`}></div>
    )
}