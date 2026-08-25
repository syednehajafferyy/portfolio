import styles from './Logo.module.css';
import Link from 'next/link';
import commonConfig from '@/database/config/metadata.json';

export default function Logo({classVariable}) {
    return (
        <Link href="/" className={classVariable} aria-label={commonConfig.metadata.title}>
            <svg className={styles.logo} width="120" height="120" viewBox="0 0 120 120" fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <g className={styles.outer}>
                    <g className={styles.spin}>
                        <path id="spinCirclePath" d="M 60,60 m -44,0 a 44,44 0 1,1 88,0 a 44,44 0 1,1 -88,0" fill="none" />
                        <text fill="var(--spin-text, #FFD600)" fontSize="11" fontWeight="700" fontFamily="var(--font-primary), sans-serif" letterSpacing="4.2">
                            <textPath href="#spinCirclePath" startOffset="0%">
                                NEHA ZEHRA • NEHA ZEHRA •
                            </textPath>
                        </text>
                    </g>
                </g>
                <g className={styles.inner}>
                    <circle cx="60" cy="60" r="25" stroke="black" fill="none"/>
                    <text x="60" y="66" textAnchor="middle" fill="black" fontSize="16" fontWeight="800" fontFamily="var(--font-primary), sans-serif">
                        NZ
                    </text>
                </g>
            </svg>
        </Link>
    )
}