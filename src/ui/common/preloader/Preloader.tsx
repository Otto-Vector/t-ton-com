import React from "react";
import styles from "./Preloader.module.css"
import preLoader from "./svg/Spinner.svg"

export const Preloader: React.FC = () => {

    return (
      <div className={styles.preloader}>
        <img className={styles.image} src={preLoader} alt='preload' />
      </div>
    )
}