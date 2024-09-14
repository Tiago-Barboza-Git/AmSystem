import "@fontsource/mukta";
import "@fontsource-variable/playfair-display";
import "@fontsource/roboto";

import { styled } from "styled-components";

export const H1 = styled.h1`
  font-family: "Playfair Display Variable", serif;
  font-weight: 700;
  font-size: 2rem;
  line-height: 1.2;
  margin-bottom: 1rem;
  text-align: center;
  letter-spacing: -0.5px;
  transition: color 0.3s ease;
`;

export const H2 = styled.h2`
  font-family: "Mukta", serif;
  font-weight: 500;
  font-size: 1.75rem;
  line-height: 1.2;
  margin-bottom: 1rem;
  text-align: center;
  letter-spacing: -0.5px;
  transition: color 0.3s ease;
`;

export const H3 = styled.h3`
  font-family: "Mukta", serif;
  font-weight: 300;
  font-size: 1.5rem;
  line-height: 1.2;
  margin-bottom: 1rem;
  text-align: center;
  letter-spacing: -0.5px;
  transition: color 0.3s ease;
`;

export const Label = styled.span`
  font-family: "Roboto", sans-serif;
  font-weight: 300;
  font-size: clamp(1rem, 5vw, 0.5rem);
`;
