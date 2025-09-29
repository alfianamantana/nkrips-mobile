import React from "react";
import Svg, { Path } from "react-native-svg";

const IconUnpin = ({ width = 20, height = 20, color = "#232B36", style }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" style={style} fill="none">
    <Path d="M17 3l4 4-7 7v5h-2v-5l-7-7 4-4 3 3 3-3z" fill={color} />
    <Path d="M2 21h20v2H2z" fill={color} />
  </Svg>
);

export default IconUnpin;