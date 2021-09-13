import styled from "styled-components/macro";

const StylesNav = styled.nav`
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 40px;
  text-shadow: 0px 2px 5px #000;
  text-align: center;
`;

const StylesLogo = styled.svg`
  vertical-align: middle;
  margin-top: -3px;
  .logo {
    fill: var(--teal);
  }
`;
export default function AppHeader() {
  return (
    <StylesNav>
      <StylesLogo
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
        width="50"
        height="50"
      >
        <g className="logo" fillRule="nonzero">
          <path d="M23 23v65h65V23H23zm-1-1h67v67H22V22zM10 10v8h8v-8h-8zM9 9h10v10H9V9z"></path>
          <path d="M9.146 9.854a.5.5 0 1 1 .708-.708l9 9a.5.5 0 0 1-.708.708l-9-9zM33 22h1v66.168h-1zM66 22h1v66.168h-1zM44 22h1v66.168h-1zM77 22h1v66.168h-1zM55 22h1v66.168h-1z"></path>
          <path d="M88.584 34.084v-1H22.416v1zM88.584 78.084v-1H22.416v1zM88.584 56.084v-1H22.416v1zM88.584 45.084v-1H22.416v1zM89.084 67.084v-1H22.916v1zM13 18.5h1V89h-1zM18 14v-1h71v1z"></path>
          <path d="M88 9h1v9h-1zM9 89v-1h9v1z"></path>
        </g>
      </StylesLogo>
      CSS Grid Generator
    </StylesNav>
  );
}
