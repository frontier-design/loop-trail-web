import styled from "styled-components";

export const CardTitle = styled.h3`
  font-size: 4rem;
  line-height: 1.1;
  max-width: 500px;
  letter-spacing: -0.025em;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 2.75rem;
  }
`;

export const CardParagraph = styled.div`
  font-size: 1.25rem;
  line-height: 1.55;
  white-space: pre-line;
  margin: 0;

  /* Keep rich-text blocks (p, etc.) same size and leading as the card body */
  & p,
  & li {
    font-size: inherit;
    line-height: inherit;
    margin: 0;
  }
  & p + p {
    margin-top: 1em;
  }
  & p:last-child,
  & > *:last-child {
    margin-bottom: 0;
  }
  & p:empty {
    display: none;
  }
`;

export const CardLinkList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 0;
`;

export const CardLink = styled.a`
  font-size: 1.1rem;
  font-weight: 700;
  color: currentColor;
  text-decoration: underline;
  text-underline-offset: 4px;
  text-decoration-thickness: 1.5px;
  align-self: flex-start;

  @media (min-width: 769px) {
    font-size: 1.25rem;
  }
`;
