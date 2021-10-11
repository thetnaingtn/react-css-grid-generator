import React, { HTMLAttributes, PropsWithChildren } from "react";

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
}: PropsWithChildren<HTMLAttributes<{}>>) {
  return <Container {...restProps}>{children}</Container>;
}

Code.Title = function CodeTitle({
  children,
  ...restProps
}: PropsWithChildren<HTMLAttributes<{}>>) {
  return <h3 {...restProps}>{children}</h3>;
};

Code.Button = function CodeButton({
  children,
  ...restProps
}: PropsWithChildren<HTMLAttributes<{}>>) {
  return <button {...restProps}>{children}</button>;
};

Code.GridCode = function CodeGrid({
  children,
  ...restProps
}: PropsWithChildren<HTMLAttributes<{}>>) {
  return <GridCode {...restProps}>{children}</GridCode>;
};

Code.ButtonCopy = function CodeButtonCopy({
  children,
  ...restProps
}: PropsWithChildren<HTMLAttributes<{}>>) {
  return <ButtonCopy {...restProps}>{children}</ButtonCopy>;
};

Code.ButtonToggle = function CodeButtonToggle({
  children,
  ...restProps
}: PropsWithChildren<HTMLAttributes<{}>>) {
  return <ButtonToggle {...restProps}>{children}</ButtonToggle>;
};

Code.CName = function CodeCName({
  children,
  ...restProps
}: PropsWithChildren<HTMLAttributes<{}>>) {
  return <CName {...restProps}>{children}</CName>;
};

Code.CProps = function CodeCProps({
  children,
  ...restProps
}: PropsWithChildren<HTMLAttributes<{}>>) {
  return <CProps {...restProps}>{children}</CProps>;
};

Code.CKey = function CodeCKey({
  children,
  ...restProps
}: PropsWithChildren<HTMLAttributes<{}>>) {
  return <CKey {...restProps}>{children}</CKey>;
};

Code.Sp = function CodeSp({
  children,
  ...restProps
}: PropsWithChildren<HTMLAttributes<{}>>) {
  return <Sp {...restProps}>{children}</Sp>;
};
