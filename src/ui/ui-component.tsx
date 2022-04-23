import React from 'react';
// import styles from './ui-component.module.scss';
import {Header} from './header/header';

type OwnProps = {}

export const UiComponent: React.FC<OwnProps> = () => {
  return (
      <div className={'container'}>
          <Header/>
      </div>
  )
}