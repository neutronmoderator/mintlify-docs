import { cloneElement } from "react";

export const StripRustCodeComments = ({ children }) => {
  const hasHashPrefix = (node) => {
    if (typeof node === "string") {
      return node.startsWith("# ");
    }

    if (Array.isArray(node)) {
      return node.some((child) => hasHashPrefix(child));
    }

    if (node && typeof node === "object" && "props" in node) {
      return hasHashPrefix(node.props.children);
    }

    return false;
  };

  const shouldKeepLine = (node) => {
    if (node && typeof node === "object" && "props" in node) {
      if (node.props.className?.includes("line")) {
        return !hasHashPrefix(node.props.children);
      }
    }

    return true;
  };

  const processNode = (node, index) => {
    if (Array.isArray(node)) {
      return node.filter((child) => shouldKeepLine(child)).map((child, i) => processNode(child, i));
    }

    if (node && typeof node === "object" && "props" in node) {
      return cloneElement(node, { ...node.props, key: index }, processNode(node.props.children, index));
    }

    return node;
  };

  return processNode(children, 0);
};