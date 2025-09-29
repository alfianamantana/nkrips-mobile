import React from "react";
import Svg, { Path } from "react-native-svg";

const IconEdit = ({ width = 20, height = 20, color = "#232B36", style }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" style={style} fill="none">
    <Path d="M3 17.25V21h3.75l11.06-11.06-3.75-3.75L3 17.25zm17.71-10.04a1.003 1.003 0 0 0 0-1.42l-2.5-2.5a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill={color} />
  </Svg>
);

export default IconEdit;