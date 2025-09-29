import React from "react";
import Svg, { Path } from "react-native-svg";

const IconCopy = ({ width = 20, height = 20, color = "#232B36", style }) => (
  <Svg width={width} height={height} viewBox="0 0 24 24" style={style} fill="none">
    <Path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 18H8V7h11v16z" fill={color}/>
  </Svg>
);

export default IconCopy;