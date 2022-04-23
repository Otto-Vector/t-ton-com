import React from 'react';
import styles from './header.module.scss';
import {Logo} from './logo/logo';

type OwnProps = {}

export const Header: React.FC<OwnProps> = () => {
  return (
      <header className={styles.header}>
          <Logo></Logo>
      </header>
  )
}