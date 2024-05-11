interface Transform {
    k: number;
    x: number;
    y: number;
}

interface Link {
    source: string;
    target: string;
    weight: number;
    events: string;
}

interface MousePosition {
    top: number;
    left: number;
}

interface State {
    isOpen: boolean;
    selectedNode: number;
    mousePositionClick: MousePosition;
    menuPosition: MousePosition;
    currentFloor: number;
    data: { nodes: Node[] }[];
}

interface Node {
    id: number;
    name: string;
    mac: string;
    isDistinct: boolean;
    isPhantom: boolean;
    x: number;
    y: number;
    events: string;
    broadcast: string;
}

interface Offset {
    x: number;
    y: number;
}

interface Plan {
    url: string;
    offset: Offset;
}

interface AppSettings {
    defaultPhantomId: number;
}

interface Settings {
    nodeHighlightBehavior: boolean;
    staticGraphWithDragAndDrop: boolean;
    directed: boolean;
    height: string;
    width: string;
    node: {
        color: string;
        size: number;
        highlightStrokeColor: string;
        renderLabel: boolean;
    };
    link: {
        highlightColor: string;
        strokeWidth: number;
    };
}

export interface JsonData {
    transform: Transform;
    name: string;
    links: Link[];
    state: State;
    plans: Plan[];
    phantomCount: number;
    isCtrlPressed: boolean;
    isShiftPressed: boolean;
    isFloorSwitched: boolean;
    isPlanOpen: boolean;
    isSettingsOpen: boolean;
    appSettings: AppSettings;
    settings: Settings;
}

export interface newNode {
    id: number,
    name: string,
    coordinate_x: number,
    coordinate_y: number,
    text: string,
    beacon: {
        id: number,
        mac: string,
        name: string,
    }
    text_broadcast: string,
    is_destination: boolean,
    is_phantom: boolean,
    is_turns_verbose: boolean
}

interface NewEdge {
    start: number,
    stop: number,
    weight: number,
    text: string
}

export interface newJsonData {
    id: number,
    name: string,
    text: null | string,
    nodes: newNode[],
    edges: NewEdge[],
    is_old_turns: boolean,
    azimut: null
}

export interface AllNodes extends newNode {
    location: number
}