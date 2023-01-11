import React, { ButtonHTMLAttributes, PropsWithChildren } from "react";

import {
  Container,
  GridCode,
  ButtonCopy,
  ButtonToggle,
  CName,
  CProps,
  CKey,
  Sp,
} from "./styles/code";

export default function Code({
  children,
  ...restProps
}: PropsWithChildren<{}>) {
  return <Container {...restProps}>{children}</Container>;
}

Code.Title = function CodeTitle({
  children,
  ...restProps
}: PropsWithChildren<{}>) {
  return <h3 {...restProps}>{children}</h3>;
};

Code.GridCode = function CodeGrid({
  children,
  ...restProps
}: PropsWithChildren<{}>) {
  return <GridCode {...restProps}>{children}</GridCode>;
};

Code.ButtonCopy = function CodeButtonCopy({
  children,
  ...restProps
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return <ButtonCopy {...restProps}>{children}</ButtonCopy>;
};

Code.ButtonToggle = function CodeButtonToggle({
  children,
  ...restProps
}: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return <ButtonToggle {...restProps}>{children}</ButtonToggle>;
};

Code.CName = function CodeCName({
  children,
  ...restProps
}: PropsWithChildren<{}>) {
  return <CName {...restProps}>{children}</CName>;
};

Code.CProps = function CodeCProps({
  children,
  ...restProps
}: PropsWithChildren<{}>) {
  return <CProps {...restProps}>{children}</CProps>;
};

Code.CKey = function CodeCKey({
  children,
  ...restProps
}: PropsWithChildren<{}>) {
  return <CKey {...restProps}>{children}</CKey>;
};

Code.Sp = function CodeSp({ children, ...restProps }: PropsWithChildren<{}>) {
  return <Sp {...restProps}>{children}</Sp>;
};
