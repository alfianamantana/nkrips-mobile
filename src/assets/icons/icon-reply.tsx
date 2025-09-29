import React from "react";
import Svg, { Path } from "react-native-svg";

const IconReply = ({ width = 20, height = 20, color = "#232B36", style }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" style={style} fill="none">
    <Path d="M10 9V5l-7 7 7 7v-4.1c5.05 0 8.13 1.67 10 5.1-1.5-5-5-10-10-10z" fill={color} />
  </Svg>
);

export default IconReply;