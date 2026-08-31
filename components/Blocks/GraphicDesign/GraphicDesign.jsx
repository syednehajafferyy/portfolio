"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './GraphicDesign.module.css';

import Container from '@/components/UI/Layout/Layout';
import Title from '@/components/UI/Elements/Title/Title';
import Blobs from '@/components/UI/Elements/Blobs/Blobs';
import FadeIn from '@/components/UI/FadeIn/FadeIn';

import initialPosts from '@/database/GraphicDesign.json';

export default function GraphicDesign() {
    const [posts, setPosts] = useState(initialPosts);
    const [selectedImage, setSelectedImage] = useState(null);

    useEffect(() => {
        async function fetchGraphicDesignPosts() {
            try {
                const res = await fetch('/api/graphic-design');
                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setPosts(data);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch graphic design posts:', err);
            }
        }
        fetchGraphicDesignPosts();
    }, []);

    // Filter only active posts
    const activePosts = posts.filter(post => post.status !== false);

    return (
        <section className={styles.section} id="graphic-design">
            <Blobs type="v2" classVariable={styles.blob} />
            <Container>
                <header className={styles.header}>
                    <div className={styles.headerText}>
                        <Title color="white">
                            <span>Graphic</span> Design
                        </Title>
                        <p className={styles.description}>
                            A collection of visual identity concepts, branding artworks, digital illustrations, and graphic poster designs.
                        </p>
                    </div>
                </header>

                <div className={styles.grid}>
                    {activePosts.map((item, index) => {
                        const tagList = item.tags
                            ? (Array.isArray(item.tags) ? item.tags : item.tags.split(',').map(t => t.trim()))
                            : [];

                        return (
                            <FadeIn key={item.id || index} y={30} delay={index * 0.1}>
                                <article className={styles.card}>
                                    <div 
                                        className={styles.imageWrapper} 
                                        onClick={() => setSelectedImage(item)}
                                    >
                                        {item.category && (
                                            <span className={styles.categoryBadge}>{item.category}</span>
                                        )}
                                        <Image
                                            src={item.image || '/reference/sample.jpg'}
                                            alt={item.title || 'Graphic Design Work'}
                                            width={800}
                                            height={600}
                                            className={styles.image}
                                            loading="lazy"
                                        />
                                    </div>
                                    <div className={styles.cardContent}>
                                        <div className={styles.cardHeader}>
                                            <h3 className={styles.cardTitle}>{item.title}</h3>
                                            {item.date && <span className={styles.cardDate}>{item.date}</span>}
                                        </div>
                                        {item.description && (
                                            <p className={styles.cardDescription}>{item.description}</p>
                                        )}
                                        <div className={styles.cardFooter}>
                                            <div className={styles.tags}>
                                                {tagList.map((tag, tIdx) => (
                                                    <span key={tIdx} className={styles.tag}>#{tag}</span>
                                                ))}
                                            </div>
                                            {item.url ? (
                                                <a 
                                                    href={item.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className={styles.viewBtn}
                                                >
                                                    View Project ↗
                                                </a>
                                            ) : (
                                                <button 
                                                    onClick={() => setSelectedImage(item)} 
                                                    className={styles.viewBtn}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                                                >
                                                    Expand ↗
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            </FadeIn>
                        );
                    })}
                </div>
            </Container>

            {/* Image Modal Preview */}
            {selectedImage && (
                <div className={styles.modalOverlay} onClick={() => setSelectedImage(null)}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setSelectedImage(null)}>×</button>
                        <Image
                            src={selectedImage.image || '/reference/sample.jpg'}
                            alt={selectedImage.title}
                            width={1200}
                            height={900}
                            className={styles.modalImage}
                        />
                        <h4 className={styles.modalTitle}>{selectedImage.title}</h4>
                    </div>
                </div>
            )}
        </section>
    );
}
