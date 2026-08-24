"use client";

import React, { useEffect, useState } from 'react';
import styles from './Experience.module.scss';
import Item from "@/components/Blocks/Experience/Item/Item";
import Title from "@/components/UI/Elements/Title/Title";
import initialCompanies from '@/database/Companies.json';
import Blobs from "@/components/UI/Elements/Blobs/Blobs";

export default function ExperienceBlock() {
    const [companyList, setCompanyList] = useState(initialCompanies);

    useEffect(() => {
        async function fetchCompanies() {
            try {
                const res = await fetch('/api/companies');
                const data = await res.json();
                if (Array.isArray(data) && data.length > 0) {
                    setCompanyList(data);
                }
            } catch (err) {
                console.error('Failed to fetch companies:', err);
            }
        }
        fetchCompanies();
    }, []);

    return (
        <section className={styles.section} id={'experience'}>
            <Blobs type={'v2'} classVariable={`${styles.blob}`}/>
            <header className={styles.header}>
                <Title color={'white'}><span>Experience</span> <br/>History</Title>
            </header>
            {companyList.map((item, index) => {
                return (
                    <Item index={index}
                          company={item.company}
                          position={item.position}
                          duration={item.duration}
                          location={item.location}
                          image={item.image}
                          url={item.url}
                          responsibilities={item.responsibilities}
                          color={item.color}
                          key={index}/>
                );
            })}
        </section>
    );
}