import React from "react";
import classnames from 'classnames';
import styles from "./custom-subtitles.scss";

const Subtitle = ({ label, subtitleType, customSubtitleStyles }) => {
  const cn = classnames(styles["custom-subtitle"], styles[subtitleType], styles[customSubtitleStyles ? customSubtitleStyles : '']);
  return (
    <h4 className={cn}>{label}</h4>
  )
}

export default Subtitle;
