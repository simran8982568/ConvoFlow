import React from "react";
import { NodeProps } from "@xyflow/react";
import FlowStartNode from "./nodes/FlowStartNode";
import MessageNode from "./nodes/MessageNode";
import MediaButtonsNode from "./nodes/MediaButtonsNode";
import TemplateNode from "./nodes/TemplateNode";
import ListNode from "./nodes/ListNode";
import AskQuestionNode from "./nodes/AskQuestionNode";
import SetAttributeNode from "./nodes/SetAttributeNode";
import AddTagNode from "./nodes/AddTagNode";
import ApiRequestNode from "./nodes/ApiRequestNode";

// Wrapper components to pass the id and data props to all nodes
export const FlowStartNodeWrapper: React.FC<NodeProps> = (props) => (
  <FlowStartNode {...props} id={props.id} data={props.data} />
);

export const MessageNodeWrapper: React.FC<NodeProps> = (props) => (
  <MessageNode {...props} id={props.id} data={props.data} />
);

export const MediaButtonsNodeWrapper: React.FC<NodeProps> = (props) => (
  <MediaButtonsNode {...props} id={props.id} data={props.data} />
);

export const TemplateNodeWrapper: React.FC<NodeProps> = (props) => (
  <TemplateNode {...props} id={props.id} data={props.data} />
);

export const ListNodeWrapper: React.FC<NodeProps> = (props) => (
  <ListNode {...props} id={props.id} data={props.data} />
);

export const AskQuestionNodeWrapper: React.FC<NodeProps> = (props) => (
  <AskQuestionNode {...props} id={props.id} data={props.data} />
);

export const SetAttributeNodeWrapper: React.FC<NodeProps> = (props) => (
  <SetAttributeNode {...props} id={props.id} data={props.data} />
);

export const AddTagNodeWrapper: React.FC<NodeProps> = (props) => (
  <AddTagNode {...props} id={props.id} data={props.data} />
);

export const ApiRequestNodeWrapper: React.FC<NodeProps> = (props) => (
  <ApiRequestNode {...props} id={props.id} data={props.data} />
);
