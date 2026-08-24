"use client";

import React, { useRef, useEffect, useState } from "react";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode } from 'swiper/modules';

import Image from "next/image";
import Link from "next/link";

import styles from './Gallery.module.scss';

import 'swiper/scss';
import 'swiper/scss/pagination';
import 'swiper/scss/free-mode';

import Title from "@/components/UI/Elements/Title/Title";
import ImageTip from "@/components/UI/Elements/ImageTip/ImageTip";
import FancyButton from "@/components/UI/Elements/Button/Button";

import commonConfig from '@/database/config/metadata.json';
import initialWorks from '@/database/Works.json';
import Container from "@/components/UI/Layout/Layout";
import FadeIn from "@/components/UI/FadeIn/FadeIn";
import Blobs from "@/components/UI/Elements/Blobs/Blobs";

export default function Gallery() {
    const swiperRef = useRef();
    const container = useRef();
    const [projects, setProjects] = useState(initialWorks);
    const [config, setConfig] = useState(commonConfig);
    const { contextSafe } = useGSAP({scope: container});

    useEffect(() => {
        async function fetchData() {
            try {
                const [pRes, mRes] = await Promise.all([
                    fetch('/api/works'),
                    fetch('/api/metadata')
                ]);
                const pData = await pRes.json();
                const mData = await mRes.json();
                if (Array.isArray(pData) && pData.length > 0) setProjects(pData);
                if (mData && mData.personal) setConfig(mData);
            } catch (err) {
                console.error('Failed to fetch projects for gallery:', err);
            }
        }
        fetchData();
    }, []);

    const onEnterAnim = contextSafe((e) => {
        let imageElement = e.currentTarget.querySelector(`.${styles.image}`);
        if (!imageElement) return;

        let rect = e.target.getBoundingClientRect();
        let mouse = {x: 0, y: 0, moved: false};

        mouse.moved = true;
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;

        gsap.to(imageElement, {
            duration: 0.5,
            x: (mouse.x - rect.width / 2) / rect.width * -100,
            y: (mouse.y - rect.height / 2) / rect.height * -100
        });
    });

    const onLeaveAnim = contextSafe((e) => {
        let imageElement = e.currentTarget.querySelector(`.${styles.image}`);
        if (!imageElement) return;
        gsap.to(imageElement, {
            x: 0,
            y: 0,
            duration: 0.5,
        });
    });

    useGSAP(() => {
        gsap.registerPlugin(ScrollTrigger);
    }, {scope: container});

    return (
        <section className={styles.section} ref={container} id="projects">
            <Blobs type={'v2'} classVariable={`${styles.blob}`}/>
            <Container>
                <header className={styles.header}>
                    <Title color={'white'}><span>My</span> Projects</Title>
                    <FancyButton theme='button-1' target="_blank" link={config.social?.github || "https://github.com/"}>
                        View GitHub
                    </FancyButton>
                </header>
            </Container>

            <Swiper
                slidesPerView={1.2}
                spaceBetween={30}
                slidesOffsetAfter={30}
                slidesOffsetBefore={30}
                freeMode={true}
                modules={[FreeMode]}
                breakpoints={{
                    768: {
                        slidesPerView: 1.8,
                        spaceBetween: 60,
                        slidesOffsetAfter: 60,
                        slidesOffsetBefore: 60,
                    },
                    992: {
                        slidesPerView: 2.5,
                        spaceBetween: 60,
                        slidesOffsetAfter: 60,
                        slidesOffsetBefore: 60,
                    },
                    1600: {
                        slidesPerView: 'auto',
                        spaceBetween: 90,
                        slidesOffsetAfter: 90,
                        slidesOffsetBefore: 90,
                    },
                }}
                touchEventsTarget={'container'}
                className={`${styles.slider} gallerySlider`}
                onBeforeInit={(swiper) => {
                    swiperRef.current = swiper;
                }}
            >
                {projects.map((item, index) => (
                    <SwiperSlide key={index} className={`${styles.sliderItem}`}>
                        <a href={item.url || config.social?.github || "#"} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none' }}>
                            <figure
                                className={styles.figure}
                                onPointerMove={onEnterAnim}
                                onPointerLeave={onLeaveAnim}>
                                <FadeIn y={50} duration={1.6} autoAlpha={1}>
                                    <Image
                                        src={item.image || "/reference/sample.jpg"}
                                        quality={90}
                                        alt={item.title || "Project Image"}
                                        width={1400}
                                        height={1600}
                                        loading={"lazy"}
                                        className={`${styles.image} ${styles[item.direction || 'vertical']}`}
                                    />
                                </FadeIn>
                                <ImageTip date={item.date || "2026"}>{item.title}</ImageTip>
                            </figure>
                        </a>
                    </SwiperSlide>
                ))}
                <button onClick={() => swiperRef.current?.slidePrev()} className={styles.buttonPrev}>
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.96046e-08 32C5.96046e-08 14.3269 14.3269 0 32 0C49.6731 0 64 14.3269 64 32C64 49.6731 49.6731 64 32 64C14.3269 64 5.96046e-08 49.6731 5.96046e-08 32Z" fill="white"/>
                        <path d="M48 31C48.5523 31 49 31.4477 49 32C49 32.5523 48.5523 33 48 33V31ZM17.2929 32.7071C16.9024 32.3166 16.9024 31.6834 17.2929 31.2929L23.6569 24.9289C24.0474 24.5384 24.6805 24.5384 25.0711 24.9289C25.4616 25.3195 25.4616 25.9526 25.0711 26.3431L19.4142 32L25.0711 37.6569C25.4616 38.0474 25.4616 38.6805 25.0711 39.0711C24.6805 39.4616 24.0474 39.4616 23.6569 39.0711L17.2929 32.7071ZM48 33H18V31H48V33Z" fill="black"/>
                    </svg>
                </button>
                <button onClick={() => swiperRef.current?.slideNext()} className={styles.buttonNext}>
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M64 32C64 14.3269 49.6731 0 32 0C14.3269 0 0 14.3269 0 32C0 49.6731 14.3269 64 32 64C49.6731 64 64 49.6731 64 32Z" fill="white"/>
                        <path d="M16 31C15.4477 31 15 31.4477 15 32C15 32.5523 15.4477 33 16 33V31ZM46.7071 32.7071C47.0976 32.3166 47.0976 31.6834 46.7071 31.2929L40.3431 24.9289C39.9526 24.5384 39.3195 24.5384 38.9289 24.9289C38.5384 25.3195 38.5384 25.9526 38.9289 26.3431L44.5858 32L38.9289 37.6569C38.5384 38.0474 38.5384 38.6805 38.9289 39.0711C39.3195 39.4616 39.9526 39.4616 40.3431 39.0711L46.7071 32.7071ZM16 33H46V31H16V33Z" fill="black"/>
                    </svg>
                </button>
            </Swiper>
        </section>
    );
}