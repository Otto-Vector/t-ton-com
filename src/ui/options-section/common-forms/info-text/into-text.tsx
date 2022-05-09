import React from 'react';
import styles from './info-text.module.scss';


export const InfoText: React.FC = () => {
    const infoText = 'Проверьте правильность внесенных данных, перед сохранением.'
    return <div className={styles.infoText}>
        <span>{infoText}</span>
    </div>
}