import styled from "styled-components";

export const CardTitle = styled.h3`
  font-size: 4rem;
  line-height: 1.1;
  max-width: 500px;
  letter-spacing: -0.025em;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const CardParagraph = styled.div`
  font-size: 1.25rem;
  line-height: 1.55;
  white-space: pre-line;

  /* Keep rich-text blocks (p, etc.) same size and leading as the card body */
  & p,
  & li {
    font-size: inherit;
    line-height: inherit;
    margin-bottom: 0.75em;
  }
  & p:last-child,
  & li:last-child {
    margin-bottom: 0;
  }
`;

export const CardLinkList = styled.ul`
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 0.5rem;
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
