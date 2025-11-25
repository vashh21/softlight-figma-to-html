export interface ILayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ITextStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  lineHeightPx?: number;
  letterSpacing?: number;
  textAlignHorizontal?: string;
  textAlignVertical?: string;
  color?: string;
}

export interface IFillStop {
  position: number;
  color: string;
}

export interface IFillStyle {
  type: "SOLID" | "GRADIENT_LINEAR" | string;
  color?: string;
  gradientStops?: IFillStop[];
  gradientAngleDeg?: number; 
}

export interface INode {
  id: string;
  type: "frame" | "group" | "rect" | "text" | "vector" | "image";
  name: string;
  layout: ILayout;
  children: INode[];
  textContent?: string;
  textStyle?: ITextStyle;
  fills?: IFillStyle[];
  strokeColor?: string;
  strokeWidth?: number;
  cornerRadius?: number | [number, number, number, number];
  effects?: any[];
  visible?: boolean;
  clipsContent?: boolean;
}
