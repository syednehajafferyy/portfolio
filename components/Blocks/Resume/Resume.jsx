'use client';

import React, { useRef } from 'react';
import gsap from "gsap";
import {useGSAP} from "@gsap/react";
import {ScrollTrigger} from "gsap/ScrollTrigger";
import styles from './Resume.module.scss';

import Image from "next/image";
import Container from "@/components/UI/Layout/Layout";
import FancyButton from "@/components/UI/Elements/Button/Button";
import commonConfig from "@/database/config/metadata.json";
import Link from "next/link";
import { useEffect, useState } from 'react';

export default function Resume() {
    const container = useRef();
    const cardGroup = useRef();
    const [config, setConfig] = useState(commonConfig);

    useEffect(() => {
        async function fetchMeta() {
            try {
                const res = await fetch('/api/metadata');
                const data = await res.json();
                if (data && data.personal) setConfig(data);
            } catch (err) {
                console.error('Failed to fetch metadata in Resume:', err);
            }
        }
        fetchMeta();
    }, []);

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);

        // CV Card
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: cardGroup.current,
                start: 'top 75%',
                end: 'top top',
                scrub: true,
                toggleActions: 'play none none reverse',
            }
        });
        tl.to(`.${styles.cardV1}`, {
            rotate: '-6deg',
            scale: 1.05,
        }, 0);
        tl.to(`.${styles.cardV2}`, {
            rotate: '6deg',
            scale: 1.05,
            x: '5%'
        }, 0);

    }, { scope: container })


    return (
        <section className={styles.section} ref={container} id={'resume'}>
            <Container>
                <div className={styles.content}>
                    <div className={styles.cardGroup} ref={cardGroup}>
                        <div className={`${styles.card} ${styles.cardV1}`}>
                            <div className={styles.cardInner}>
                                <div className={styles.cardTitle}>{`${config.personal?.name || ''} ${config.personal?.surname || ''}`.toUpperCase()}</div>
                                <div className={styles.cardDesc}>{config.personal?.role}</div>
                                <hr/>
                                <p>{config.metadata?.description || `I am ${config.personal?.name}, a ${config.personal?.role} with over ${config.personal?.experience} years of experience.`}
                                </p>
                                <div>
                                    <Link href={`mailto:${config.personal?.email || ''}`} target={'_blank'}>
                                        {config.personal?.email}
                                    </Link>
                                    <span>{config.personal?.city}{config.personal?.country ? `, ${config.personal?.country}` : ''}</span>
                                </div>
                                <hr/>
                                <div className={styles.cardSectionTitle}>EXPERIENCE</div>
                                <p>
                                    {config.personal?.role} | {config.personal?.city || 'Remote'}
                                </p>
                            </div>
                            <figure className={styles.figure}>
                                <Image src="/yasin-genc-photo.jpeg" alt={config.personal?.name || 'Photo'} width={150} height={150}/>
                            </figure>
                        </div>
                        <div className={`${styles.card} ${styles.cardV2}`}>
                            <div className={styles.cardInner}>
                                <Image src="/code-snippet.svg" alt="Code Snippet" width={330} height={480}/>
                            </div>
                        </div>
                    </div>

                    <div className={styles.cta}>
                        <FancyButton theme='button-1' target={'_blank'} link={config.personal?.resumeURL || '#'}>View
                            Resume</FancyButton>
                    </div>
                    <div className={styles.links}>
                        {config.social?.linkedin && <Link href={config.social.linkedin} target={'_blank'}>LinkedIn</Link>}
                        {config.social?.github && <Link href={config.social.github} target={'_blank'}>GitHub</Link>}
                        {config.social?.codepen && <Link href={config.social.codepen} target={'_blank'}>CodePen</Link>}
                    </div>
                </div>
            </Container>
        </section>
    )
}