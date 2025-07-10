import styled from "styled-components";

const StyledHeader = styled.div`
  padding: 15px;
  background: ${({ theme }) => theme.palette.background.paper};
  border-bottom: 1px solid ${({ theme }) => theme.palette.divider};
`;

export { StyledHeader };
