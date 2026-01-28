// Flow Simulation Engine - Frontend-only workflow simulator
import { Node, Edge } from "@xyflow/react";

export interface SimulationMessage {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
  buttons?: Array<{ id: string; text: string }>;
  listItems?: Array<{ id: string; title: string; description?: string }>;
  mediaUrl?: string;
  mediaType?: "image" | "video" | "document";
}

export interface SimulationState {
  currentNodeId: string | null;
  messages: SimulationMessage[];
  attributes: Record<string, any>;
  isWaitingForInput: boolean;
  isComplete: boolean;
}

export class FlowSimulator {
  private nodes: Node[];
  private edges: Edge[];
  private state: SimulationState;
  private messageIdCounter: number = 0;

  constructor(nodes: Node[], edges: Edge[]) {
    this.nodes = nodes;
    this.edges = edges;
    this.state = {
      currentNodeId: null,
      messages: [],
      attributes: {},
      isWaitingForInput: false,
      isComplete: false,
    };
  }

  /**
   * Start the flow simulation
   */
  start(triggerKeyword?: string): SimulationState {
    const startNode = this.nodes.find((n) => n.type === "flowStart");
    if (!startNode) {
      throw new Error("No Flow Start node found");
    }

    // Add user trigger message if provided
    if (triggerKeyword) {
      this.addMessage({
        type: "user",
        content: triggerKeyword,
      });
    }

    // Execute the start node
    this.state.currentNodeId = startNode.id;
    this.executeNode(startNode.id);

    return this.getState();
  }

  /**
   * Handle user input (text, button click, list selection)
   */
  handleUserInput(
    input: string,
    inputType: "text" | "button" | "list" = "text"
  ): SimulationState {
    if (!this.state.isWaitingForInput) {
      return this.state;
    }

    // Add user message
    this.addMessage({
      type: "user",
      content: input,
    });

    const currentNode = this.nodes.find(
      (n) => n.id === this.state.currentNodeId
    );
    if (!currentNode) {
      return this.state;
    }

    // Handle different node types
    switch (currentNode.type) {
      case "askQuestion":
        // Store the answer in attributes
        const attributeName = currentNode.data.attributeName as string;
        if (attributeName) {
          this.state.attributes[attributeName] = input;
        }
        this.moveToNextNode();
        break;

      case "message":
      case "mediaButtons":
        // Handle button click
        if (inputType === "button") {
          const buttons = currentNode.data.buttons as
            | Array<{ id: string; text: string }>
            | undefined;
          const button = buttons?.find((b) => b.text === input);
          if (button) {
            this.moveToNextNode();
          }
        } else {
          this.moveToNextNode();
        }
        break;

      case "list":
        // Handle list selection
        if (inputType === "list") {
          const items = currentNode.data.items as
            | Array<{ id: string; title: string }>
            | undefined;
          const item = items?.find((i) => i.title === input);
          if (item) {
            this.moveToNextNode();
          }
        }
        break;

      default:
        this.moveToNextNode();
    }

    return this.getState();
  }

  /**
   * Execute a specific node
   */
  private executeNode(nodeId: string): void {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (!node) {
      this.state.isComplete = true;
      return;
    }

    this.state.currentNodeId = nodeId;
    this.state.isWaitingForInput = false;

    switch (node.type) {
      case "flowStart":
        // Flow start just moves to next node
        this.moveToNextNode();
        break;

      case "message":
        this.executeMessageNode(node);
        break;

      case "mediaButtons":
        this.executeMediaButtonsNode(node);
        break;

      case "template":
        this.executeTemplateNode(node);
        break;

      case "list":
        this.executeListNode(node);
        break;

      case "askQuestion":
        this.executeAskQuestionNode(node);
        break;

      case "setAttribute":
        this.executeSetAttributeNode(node);
        break;

      case "addTag":
        this.executeAddTagNode(node);
        break;

      case "apiRequest":
        this.executeApiRequestNode(node);
        break;

      default:
        this.moveToNextNode();
    }
  }

  private executeMessageNode(node: Node): void {
    const text = this.replaceVariables((node.data.text as string) || "");
    const buttons =
      (node.data.buttons as Array<{ id: string; text: string }>) || [];

    this.addMessage({
      type: "bot",
      content: text,
      buttons: buttons.length > 0 ? buttons : undefined,
    });

    if (buttons.length > 0) {
      this.state.isWaitingForInput = true;
    } else {
      this.moveToNextNode();
    }
  }

  private executeMediaButtonsNode(node: Node): void {
    const text = this.replaceVariables((node.data.text as string) || "");
    const mediaUrl = (node.data.mediaUrl as string) || "";
    const mediaType =
      (node.data.mediaType as "image" | "video" | "document") || "image";
    const buttons =
      (node.data.buttons as Array<{ id: string; text: string }>) || [];

    this.addMessage({
      type: "bot",
      content: text,
      mediaUrl,
      mediaType,
      buttons: buttons.length > 0 ? buttons : undefined,
    });

    if (buttons.length > 0) {
      this.state.isWaitingForInput = true;
    } else {
      this.moveToNextNode();
    }
  }

  private executeTemplateNode(node: Node): void {
    // Simulate template message
    const templateName =
      (node.data.templateName as string) || "Template Message";
    const text = `📋 ${templateName}\n\n${this.replaceVariables(
      (node.data.text as string) || "Template content here"
    )}`;
    const buttons =
      (node.data.buttons as Array<{ id: string; text: string }>) || [];

    this.addMessage({
      type: "bot",
      content: text,
      buttons: buttons.length > 0 ? buttons : undefined,
    });

    if (buttons && buttons.length > 0) {
      this.state.isWaitingForInput = true;
    } else {
      this.moveToNextNode();
    }
  }

  private executeListNode(node: Node): void {
    const text = this.replaceVariables(
      (node.data.text as string) || "Please select an option:"
    );
    const items =
      (node.data.items as Array<{
        id: string;
        title: string;
        description?: string;
      }>) || [];

    this.addMessage({
      type: "bot",
      content: text,
      listItems: items,
    });

    if (items.length > 0) {
      this.state.isWaitingForInput = true;
    } else {
      this.moveToNextNode();
    }
  }

  private executeAskQuestionNode(node: Node): void {
    const question = this.replaceVariables(
      (node.data.question as string) || ""
    );

    this.addMessage({
      type: "bot",
      content: question,
    });

    this.state.isWaitingForInput = true;
  }

  private executeSetAttributeNode(node: Node): void {
    const attributeName = node.data.attributeName as string;
    const attributeValue = this.replaceVariables(
      (node.data.attributeValue as string) || ""
    );

    if (attributeName) {
      this.state.attributes[attributeName] = attributeValue;
    }

    this.moveToNextNode();
  }

  private executeAddTagNode(node: Node): void {
    // Simulate adding a tag
    const tagName = node.data.tagName || "Unknown Tag";
    if (!this.state.attributes.tags) {
      this.state.attributes.tags = [];
    }
    this.state.attributes.tags.push(tagName);

    this.moveToNextNode();
  }

  private executeApiRequestNode(node: Node): void {
    // Simulate API request
    const url = (node.data.url as string) || "";
    const method = (node.data.method as string) || "GET";

    // Mock API response
    const mockResponse = {
      status: 200,
      data: {
        message: "API call successful",
        timestamp: new Date().toISOString(),
      },
    };

    // Store response in attributes
    const responseAttribute =
      (node.data.responseAttribute as string) || "api_response";
    this.state.attributes[responseAttribute] = mockResponse.data;

    this.moveToNextNode();
  }

  /**
   * Move to the next node in the flow
   */
  private moveToNextNode(): void {
    if (!this.state.currentNodeId) {
      this.state.isComplete = true;
      return;
    }

    // Find outgoing edges
    const outgoingEdges = this.edges.filter(
      (e) => e.source === this.state.currentNodeId
    );

    if (outgoingEdges.length === 0) {
      this.state.isComplete = true;
      return;
    }

    // Take the first edge
    const nextEdge = outgoingEdges[0];
    this.executeNode(nextEdge.target);
  }

  /**
   * Replace variables in text with actual values
   */
  private replaceVariables(text: string): string {
    let result = text;

    // Replace {{attributeName}} with actual values
    Object.keys(this.state.attributes).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, "g");
      result = result.replace(regex, this.state.attributes[key]);
    });

    // Replace {{1}}, {{2}}, etc. with placeholder values
    result = result.replace(/{{(\d+)}}/g, (match, num) => {
      return `[Param ${num}]`;
    });

    return result;
  }

  /**
   * Add a message to the simulation
   */
  private addMessage(
    message: Omit<SimulationMessage, "id" | "timestamp">
  ): void {
    this.state.messages.push({
      ...message,
      id: `msg-${this.messageIdCounter++}`,
      timestamp: new Date(),
    });
  }

  /**
   * Get current simulation state
   */
  getState(): SimulationState {
    return { ...this.state };
  }

  /**
   * Reset simulation
   */
  reset(): void {
    this.state = {
      currentNodeId: null,
      messages: [],
      attributes: {},
      isWaitingForInput: false,
      isComplete: false,
    };
    this.messageIdCounter = 0;
  }
}
