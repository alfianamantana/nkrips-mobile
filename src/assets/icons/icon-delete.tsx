import React from "react";
import Svg, { Path } from "react-native-svg";

const IconDelete = ({ width = 20, height = 20, color = "#d32f2f", style }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" style={style} fill="none">
    <Path d="M6 19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill={color} />
  </Svg>
);

export default IconDelete;