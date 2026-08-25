import React from "react";
import Hero from '@/components/Blocks/Hero/Hero';
import ExperienceBlock from "@/components/Blocks/Experience/Experience";
import Resume from "@/components/Blocks/Resume/Resume";
import SkillSet from "@/components/Blocks/SkillSet/SkillSet";
import BoldTitle from "@/components/UI/Cards/BoldTitle/BoldTitle";
import Gallery from "@/components/Blocks/Gallery/Gallery";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function Home() {
    return (
        <>
            <Hero/>
            <SkillSet/>
            <ExperienceBlock/>
            <BoldTitle/>
            <Resume/>
            <Gallery/>
        </>
    )
}
