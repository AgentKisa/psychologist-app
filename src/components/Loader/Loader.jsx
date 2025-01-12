import { ClipLoader } from "react-spinners";
import styles from "./Loader.module.css";

const Loader = () => {
  return (
    <div className={styles.loaderContainer}>
      <ClipLoader color="#4fa94d" loading={true} size={150} />
    </div>
  );
};

export default Loader;
