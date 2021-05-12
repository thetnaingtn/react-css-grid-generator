import React from 'react';

import { Container, GridCode, ButtonCopy, ButtonToggle, CName, CProps, CKey, Sp } from './styles/code';

export default function Code({ children, ...restProps }) {
	return (
		<Container {...restProps}>
			{children}
		</Container>
	)
}

Code.Title = function CodeTitle({ children, ...restProps }) {
	return <h3 {...restProps}>{children}</h3>
}

Code.Button = function CodeButton({ children, ...restProps }) {
	return <button {...restProps}>{children}</button>
}

Code.GridCode = function CodeGrid({ children, ...restProps }) {
	return <GridCode {...restProps}>{children}</GridCode>
}

Code.ButtonCopy = function CodeButtonCopy({ children, ...restProps }) {
	return <ButtonCopy {...restProps}>{children}</ButtonCopy>
}

Code.ButtonToggle = function CodeButtonToggle({ children, ...restProps }) {
	return <ButtonToggle {...restProps}>{children}</ButtonToggle>
}

Code.CName = function CodeCName({ children, ...restProps }) {
	return <CName {...restProps}>{children}</CName>
}

Code.CProps = function CodeCProps({ children, ...restProps }) {
	return <CProps {...restProps}>{children}</CProps>
}

Code.CKey = function CodeCKey({ children, ...restProps }) {
	return <CKey {...restProps}>{children}</CKey>
}

Code.Sp = function CodeSp({ children, ...restProps }) {
	return <Sp {...restProps}>{children}</Sp>
}