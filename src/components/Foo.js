import React from "react";
import FooStyle from "./Foo.module.css";

const MinecraftNamespace = "minecraft"

const BackgroundColor = {
  margin: '8px',
  'outline-style': 'solid',
  'outline-width': 'px',
  'outline-color': 'rgba(46, 77, 77, 0.8)',
  'outline-offset': '-1px'
}

const Flex = {
  display: 'flex'
}

const Padding = {
  width: '16px',
  height: '16px'
}

const VerticalPadding = {
  'flex-direction': 'column'
}

const IconOffset = {
  width: '8px',
  height: '20px'
}

const SmallPadding = {
  width: '4px',
  height: '4px'
}

export default props => (
  <div style={BackgroundColor}>
    <div style={Flex}>
      <div style={Padding}></div>
      <div style={VerticalPadding}>
        <div style={IconOffset}></div>
        <i className={`icon-minecraft icon-minecraft-${props.aux.namespace_id.replace("_", "-")}`}></i>
      </div>
      <div style={Padding}></div>
      <h2 className={FooStyle.ItemText}>{MinecraftNamespace}:{props.aux.namespace_id}</h2>
    </div>
  </div>
);
