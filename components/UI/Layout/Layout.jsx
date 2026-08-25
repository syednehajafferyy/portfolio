import React from "react";

import styles from './Layout.module.css';
export default function Container({children, className=''}) {

    return (
        <div className={`${styles.container} ${className}`}>
            {children}
        </div>
    );
}